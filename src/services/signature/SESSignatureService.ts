import { SESSignature, SignatureValidation, SignatureCompliance } from '@/types/signature';
import { v4 as uuidv4 } from 'uuid';

export class SESSignatureService {
  /**
   * Crée une nouvelle signature SES avec un code de validation
   */
  public static createSignature(
    documentId: string,
    signatoryId: string,
    signatureData: string,
    validationMethod: 'email' | 'sms' | 'password',
    ipAddress: string,
    userAgent: string
  ): SESSignature {
    const signatureId = uuidv4();
    const validationCode = this.generateValidationCode();

    // Simuler une validation initiale côté serveur
    const validation: SignatureValidation = {
      isValid: false, // La signature n'est pas encore validée par l'utilisateur
      validationDate: new Date(),
      validationMethod: 'otp',
      certificateStatus: 'unknown',
    };

    const signature: SESSignature = {
      id: signatureId,
      signatoryId,
      documentId,
      signatureData,
      timestamp: new Date(),
      ipAddress,
      userAgent,
      validationMethod,
      validationCode,
      validationCodeExpiry: new Date(Date.now() + 5 * 60 * 1000), // Correction 1: Ajout de l'expiration
      isValidated: false,
      validation,
    };

    return signature;
  }

  /**
   * Valide une signature SES avec un code fourni
   */
  public static validateSignature(
    signature: SESSignature,
    providedCode: string,
    ipAddress: string,
    userAgent: string
  ): { isValid: boolean; message: string } {
    if (signature.isValidated) {
      return { isValid: true, message: 'Signature already validated.' };
    }

    if (new Date() > signature.validationCodeExpiry) {
      return { isValid: false, message: 'Validation code has expired.' };
    }

    if (signature.validationCode !== providedCode) {
      return { isValid: false, message: 'Invalid validation code.' };
    }

    // Mettre à jour la signature comme validée avec les nouvelles informations
    const validation: SignatureValidation = { // Correction 2: Pas de propriété 'errors'
      isValid: true,
      validationDate: new Date(),
      validationMethod: 'otp',
      certificateStatus: 'valid',
    };

    signature.isValidated = true;
    signature.validatedAt = new Date();
    signature.validation = validation;
    signature.ipAddress = ipAddress;
    signature.userAgent = userAgent;

    return { isValid: true, message: 'Signature validated successfully.' };
  }

  /**
   * Génère un code de validation simple
   */
  private static generateValidationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Vérifie la conformité eIDAS d'une signature SES
   */
  public static getCompliance(signature: SESSignature): SignatureCompliance {
    // Correction 3: Vérification de l'existence de signature.validation
    const isCompliant = signature.validation?.isValid && signature.isValidated;

    const requirements = [
      'Lien de la signature au signataire (via email/téléphone)',
      'Intégrité du document assurée après la signature',
    ];

    if (isCompliant) {
      return {
        eIDASLevel: 'SES',
        legalValue: 'Basic', // Correction 4: Casse correcte
        requirements,
        validationSteps: [
          'Vérification du code OTP (email/SMS)',
          'Horodatage de la signature',
          'Validation du certificat serveur',
        ],
      };
    } else {
      return {
        eIDASLevel: 'N/A',
        legalValue: 'Basic', // Correction 4: Casse correcte
        requirements,
        validationSteps: ['La validation de la signature a échoué'],
      };
    }
  }
} 