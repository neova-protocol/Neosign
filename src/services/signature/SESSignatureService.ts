import { SESSignature, SignatureValidation, SignatureCompliance } from '@/types/signature';
import { v4 as uuidv4 } from 'uuid';

export class SESSignatureService {
  private static instance: SESSignatureService;

  private constructor() {}

  public static getInstance(): SESSignatureService {
    if (!SESSignatureService.instance) {
      SESSignatureService.instance = new SESSignatureService();
    }
    return SESSignatureService.instance;
  }

  /**
   * Crée une signature SES conforme eIDAS
   */
  async createSESSignature(
    signatoryId: string,
    documentId: string,
    signatureData: string,
    validationMethod: 'email' | 'sms' | 'password',
    userAgent: string,
    ipAddress: string
  ): Promise<SESSignature> {
    const signature: SESSignature = {
      id: uuidv4(),
      signatoryId,
      documentId,
      signatureData,
      timestamp: new Date(),
      ipAddress,
      userAgent,
      validationMethod,
      validationCode: this.generateValidationCode(),
      isValidated: false,
      validation: this.validateSESSignature(signatureData, validationMethod)
    };

    // Sauvegarder en base de données
    await this.saveSignature(signature);

    return signature;
  }

  /**
   * Valide une signature SES selon les critères eIDAS
   */
  private validateSESSignature(
    signatureData: string,
    validationMethod: 'email' | 'sms' | 'password'
  ): SignatureValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de base pour SES
    if (!signatureData || signatureData.length < 10) {
      errors.push('Signature data is too short or empty');
    }

    // Vérification du format de signature
    if (!signatureData.startsWith('data:image/')) {
      errors.push('Invalid signature format');
    }

    // Validation selon la méthode choisie
    switch (validationMethod) {
      case 'email':
        warnings.push('Email validation provides basic security level');
        break;
      case 'sms':
        warnings.push('SMS validation provides enhanced security level');
        break;
      case 'password':
        warnings.push('Password validation provides basic security level');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      complianceLevel: 'SES'
    };
  }

  /**
   * Génère un code de validation sécurisé
   */
  private generateValidationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Valide une signature avec le code de validation
   */
  async validateSignature(
    signatureId: string,
    validationCode: string,
    ipAddress: string,
    userAgent: string
  ): Promise<boolean> {
    try {
      const signature = await this.getSignature(signatureId);
      
      if (!signature) {
        throw new Error('Signature not found');
      }

      if (signature.validationCode !== validationCode) {
        throw new Error('Invalid validation code');
      }

      // Mettre à jour la signature comme validée avec les nouvelles informations
      signature.isValidated = true;
      signature.timestamp = new Date();
      signature.ipAddress = ipAddress;
      signature.userAgent = userAgent;
      
      await this.saveSignature(signature);
      
      return true;
    } catch (error) {
      console.error('Signature validation failed:', error);
      return false;
    }
  }

  /**
   * Vérifie la conformité eIDAS d'une signature SES
   */
  getSESCompliance(signature: SESSignature): SignatureCompliance {
    const requirements = [
      'Signature data integrity',
      'Timestamp validation',
      'Signatory identification',
      'Validation method verification'
    ];

    const validationSteps = [
      'Signature format validation',
      'Timestamp verification',
      'Signatory authentication',
      'Validation method check'
    ];

    const isCompliant = signature.validation.isValid && 
                       signature.isValidated &&
                       signature.timestampData !== undefined;

    return {
      eIDASLevel: 'SES',
      isCompliant,
      requirements,
      validationSteps,
      legalValue: 'basic'
    };
  }

  /**
   * Sauvegarde une signature en base de données
   */
  private async saveSignature(signature: SESSignature): Promise<void> {
    try {
      const response = await fetch('/api/signature/ses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signature),
      });

      if (!response.ok) {
        throw new Error('Failed to save signature');
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      throw error;
    }
  }

  /**
   * Récupère une signature par son ID
   */
  public async getSignature(signatureId: string): Promise<SESSignature | null> {
    try {
      const response = await fetch(`/api/signature/ses/${signatureId}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching signature:', error);
      return null;
    }
  }

  /**
   * Envoie le code de validation par email/SMS
   */
  async sendValidationCode(
    signatureId: string,
    email?: string,
    phone?: string
  ): Promise<boolean> {
    try {
      const signature = await this.getSignature(signatureId);
      
      if (!signature) {
        throw new Error('Signature not found');
      }

      const response = await fetch('/api/signature/ses/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureId,
          email,
          phone,
          validationCode: signature.validationCode
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending validation code:', error);
      return false;
    }
  }
} 