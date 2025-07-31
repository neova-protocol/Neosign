import { AESSignature, SignatureCertificate, SignatureTimestamp, SignatureValidation, SignatureCompliance } from '@/types/signature';

export class AESSignatureService {
  private static instance: AESSignatureService;
  private signatures: AESSignature[] = [];
  private certificates: SignatureCertificate[] = [];

  private constructor() {
    this.initializeCertificates();
    this.initializeTestSignatures();
  }

  public static getInstance(): AESSignatureService {
    if (!AESSignatureService.instance) {
      AESSignatureService.instance = new AESSignatureService();
    }
    return AESSignatureService.instance;
  }

  private initializeCertificates() {
    // Simuler des certificats qualifiés pour AES
    this.certificates = [
      {
        id: 'cert-001',
        issuer: 'Certification Authority Europe',
        subject: 'CN=Advanced Signature Certificate, O=Neosign, C=EU',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-12-31'),
        serialNumber: 'CAE-2024-001',
        publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----',
        signatureAlgorithm: 'RSA-SHA256',
        keyUsage: ['digitalSignature', 'nonRepudiation'],
        isQualified: true
      },
      {
        id: 'cert-002',
        issuer: 'European Trust Services Provider',
        subject: 'CN=Advanced Electronic Signature, O=ETSP, C=EU',
        validFrom: new Date('2024-06-01'),
        validTo: new Date('2026-05-31'),
        serialNumber: 'ETSP-2024-002',
        publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----',
        signatureAlgorithm: 'RSA-SHA256',
        keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
        isQualified: true
      }
    ];
  }

  /**
   * Crée une signature AES avec certificat qualifié
   */
  async createAESSignature(
    signatoryId: string,
    documentId: string,
    signatureData: string,
    twoFactorMethod: 'sms' | 'email' | 'authenticator' | 'hardware',
    userAgent: string,
    ipAddress: string
  ): Promise<AESSignature> {
    // Sélectionner un certificat qualifié
    const certificate = this.certificates[0]; // En production, sélectionner selon les critères

    // Créer l'horodatage RFC 3161
    const timestamp: SignatureTimestamp = {
      timestamp: new Date(),
      hashAlgorithm: 'SHA-256',
      signatureAlgorithm: 'RSA-SHA256',
      tsaUrl: 'https://tsa.european-trust-services.eu',
      serialNumber: `TS-${Date.now()}`
    };

    // Créer la validation
    const validation: SignatureValidation = {
      isValid: true,
      validationDate: new Date(),
      validationMethod: 'certificate-validation',
      certificateStatus: 'valid'
    };

    // Générer le code 2FA
    const twoFactorCode = this.generateTwoFactorCode();

    const signature: AESSignature = {
      id: `aes-${Date.now()}`,
      signatoryId,
      documentId,
      signatureData,
      certificate,
      timestamp,
      validation,
      twoFactorMethod,
      twoFactorCode,
      isTwoFactorValidated: false,
      userAgent,
      ipAddress,
      createdAt: new Date(),
      revocationStatus: 'active'
    };

    this.signatures.push(signature);
    return signature;
  }

  /**
   * Valide la signature AES avec le code 2FA
   */
  async validateAESSignature(
    signatureId: string,
    twoFactorCode: string,
    userAgent: string,
    ipAddress: string
  ): Promise<boolean> {
    // Enregistrer les informations de validation
    console.log('Validating AES signature:', { signatureId, userAgent, ipAddress });
    const signature = this.signatures.find(s => s.id === signatureId);
    
    if (!signature) {
      throw new Error('Signature not found');
    }

    // Vérifier le code 2FA
    if (signature.twoFactorCode !== twoFactorCode) {
      return false;
    }

    // Valider le certificat
    const isCertificateValid = this.validateCertificate(signature.certificate);
    
    if (!isCertificateValid) {
      signature.validation.certificateStatus = 'expired';
      signature.validation.isValid = false;
      return false;
    }

    // Marquer comme validé
    signature.isTwoFactorValidated = true;
    signature.twoFactorValidatedAt = new Date();
    signature.signedAt = new Date();
    signature.validation.isValid = true;

    return true;
  }

  /**
   * Génère un code 2FA
   */
  private generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Valide un certificat
   */
  private validateCertificate(certificate: SignatureCertificate): boolean {
    const now = new Date();
    return certificate.validFrom <= now && certificate.validTo >= now;
  }

  /**
   * Récupère une signature AES
   */
  public getSignature(signatureId: string): AESSignature | undefined {
    return this.signatures.find(s => s.id === signatureId);
  }

  /**
   * Récupère une signature par signataire
   */
  public getSignatureBySignatory(signatoryId: string): AESSignature | undefined {
    return this.signatures.find(s => s.signatoryId === signatoryId);
  }

  /**
   * Envoie le code 2FA
   */
  async sendTwoFactorCode(
    signatoryId: string,
    email?: string,
    phone?: string
  ): Promise<boolean> {
    try {
      const signature = this.getSignatureBySignatory(signatoryId);
      
      if (!signature) {
        throw new Error('Signature not found');
      }

      // Simuler l'envoi du code 2FA
      console.log('Sending 2FA code:', {
        signatureId: signature.id,
        twoFactorCode: signature.twoFactorCode,
        method: signature.twoFactorMethod,
        email,
        phone
      });

      // En production, intégrer avec un service 2FA réel
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      return false;
    }
  }

  /**
   * Récupère la conformité AES
   */
  getAESCompliance(signature: AESSignature): SignatureCompliance {
    return {
      eIDASLevel: 'AES',
      legalValue: 'Advanced',
      requirements: [
        'Certificat qualifié requis',
        'Authentification forte (2FA)',
        'Horodatage RFC 3161',
        'Intégrité garantie',
        'Non-répudiation'
      ],
      validationSteps: [
        'Vérification du certificat qualifié',
        'Validation de l\'authentification forte',
        'Vérification de l\'horodatage',
        'Contrôle de l\'intégrité',
        'Validation de la non-répudiation'
      ],
      certificateInfo: {
        issuer: signature.certificate.issuer,
        validFrom: signature.certificate.validFrom,
        validTo: signature.certificate.validTo,
        isQualified: signature.certificate.isQualified
      },
      timestampInfo: {
        tsaUrl: signature.timestamp.tsaUrl,
        timestamp: signature.timestamp.timestamp
      }
    };
  }

  /**
   * Sauvegarde une signature AES
   */
  async saveSignature(signature: AESSignature): Promise<void> {
    // En production, sauvegarder en base de données
    const existingIndex = this.signatures.findIndex(s => s.id === signature.id);
    if (existingIndex >= 0) {
      this.signatures[existingIndex] = signature;
    } else {
      this.signatures.push(signature);
    }
  }

  /**
   * Récupère tous les certificats disponibles
   */
  getAvailableCertificates(): SignatureCertificate[] {
    return this.certificates.filter(cert => {
      const now = new Date();
      return cert.validFrom <= now && cert.validTo >= now;
    });
  }

  /**
   * Initialise des signatures de test pour la démonstration
   */
  private initializeTestSignatures(): void {
    const testSignature: AESSignature = {
      id: 'test-aes-signature',
      signatoryId: 'test-user',
      documentId: 'test-document',
      signatureData: 'test-signature-data',
      certificate: this.certificates[0],
      timestamp: {
        timestamp: new Date(),
        hashAlgorithm: 'SHA-256',
        signatureAlgorithm: 'RSA-SHA256',
        tsaUrl: 'https://tsa.european-trust-services.eu',
        serialNumber: 'TS-TEST-001'
      },
      validation: {
        isValid: true,
        validationDate: new Date(),
        validationMethod: 'certificate-validation',
        certificateStatus: 'valid'
      },
      twoFactorMethod: 'sms',
      twoFactorCode: '123456',
      isTwoFactorValidated: true,
      twoFactorValidatedAt: new Date(),
      userAgent: 'Mozilla/5.0 (Test Browser)',
      ipAddress: '127.0.0.1',
      createdAt: new Date(),
      signedAt: new Date(),
      revocationStatus: 'active'
    };

    this.signatures.push(testSignature);
  }
} 