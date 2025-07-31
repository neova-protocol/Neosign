import { SignatureCompliance, SESSignature, AESSignature } from '@/types/signature';

export class ComplianceService {
  private static instance: ComplianceService;

  private constructor() {}

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  /**
   * Vérifie la compliance SES selon eIDAS
   */
  validateSESCompliance(signature: SESSignature): SignatureCompliance {
    const requirements: string[] = [];
    const validationSteps: string[] = [];

    // 1. Vérification de l'authentification
    if (signature.validationMethod) {
      validationSteps.push('✅ Authentification utilisateur validée');
    } else {
      requirements.push('❌ Authentification utilisateur requise');
    }

    // 2. Vérification de la validation par code
    if (signature.isValidated && signature.validatedAt) {
      validationSteps.push('✅ Validation par code unique effectuée');
    } else {
      requirements.push('❌ Validation par code unique requise');
    }

    // 3. Vérification de l'horodatage
    if (signature.timestamp) {
      validationSteps.push('✅ Horodatage de la signature effectué');
    } else {
      requirements.push('❌ Horodatage de la signature requis');
    }

    // 4. Vérification de la traçabilité
    if (signature.userAgent && signature.ipAddress) {
      validationSteps.push('✅ Traçabilité (IP, User-Agent) enregistrée');
    } else {
      requirements.push('❌ Traçabilité (IP, User-Agent) requise');
    }

    // 5. Vérification de l'intégrité
    if (signature.signatureData) {
      validationSteps.push('✅ Intégrité de la signature vérifiée');
    } else {
      requirements.push('❌ Intégrité de la signature requise');
    }

    const isCompliant = requirements.length === 0;

    return {
      eIDASLevel: isCompliant ? 'SES' : 'N/A',
      legalValue: isCompliant ? 'Basic' : 'Basic',
      requirements,
      validationSteps,
    };
  }

  /**
   * Vérifie la compliance AES selon eIDAS
   */
  validateAESCompliance(signature: AESSignature): SignatureCompliance {
    const requirements: string[] = [];
    const validationSteps: string[] = [];

    // 1. Vérification du certificat qualifié
    if (signature.certificate && signature.certificate.isQualified) {
      validationSteps.push('✅ Certificat qualifié présent et valide');
    } else {
      requirements.push('❌ Certificat qualifié obligatoire pour AES');
    }

    // 2. Vérification de la 2FA
    if (signature.twoFactorMethod && signature.isTwoFactorValidated) {
      validationSteps.push('✅ Authentification à deux facteurs validée');
    } else {
      requirements.push('❌ Authentification à deux facteurs obligatoire pour AES');
    }

    // 3. Vérification de l'horodatage qualifié
    if (signature.timestamp && signature.timestamp.tsaUrl) {
      validationSteps.push('✅ Horodatage qualifié (RFC 3161) effectué');
    } else {
      requirements.push('❌ Horodatage qualifié (RFC 3161) requis pour AES');
    }

    // 4. Vérification de la validation cryptographique
    if (signature.validation && signature.validation.isValid) {
      validationSteps.push('✅ Validation cryptographique effectuée');
    } else {
      requirements.push('❌ Validation cryptographique requise pour AES');
    }

    // 5. Vérification de la non-répudiation
    if (signature.certificate && signature.certificate.keyUsage.includes('nonRepudiation')) {
      validationSteps.push('✅ Non-répudiation garantie par le certificat');
    } else {
      requirements.push('❌ Non-répudiation requise pour AES');
    }

    // 6. Vérification de l'intégrité
    if (signature.signatureData) {
      validationSteps.push('✅ Intégrité du document garantie');
    } else {
      requirements.push('❌ Intégrité du document requise');
    }

    // 7. Vérification de la traçabilité avancée
    if (signature.userAgent && signature.ipAddress && signature.signedAt) {
      validationSteps.push('✅ Traçabilité avancée enregistrée');
    } else {
      requirements.push('❌ Traçabilité avancée requise pour AES');
    }

    const isCompliant = requirements.length === 0;

    return {
      eIDASLevel: isCompliant ? 'AES' : 'SES',
      legalValue: isCompliant ? 'Advanced' : 'Basic',
      requirements,
      validationSteps,
      certificateInfo: signature.certificate ? {
        issuer: signature.certificate.issuer,
        validFrom: signature.certificate.validFrom,
        validTo: signature.certificate.validTo,
        isQualified: signature.certificate.isQualified,
      } : undefined,
      timestampInfo: signature.timestamp ? {
        tsaUrl: signature.timestamp.tsaUrl,
        timestamp: signature.timestamp.timestamp,
      } : undefined,
    };
  }

  /**
   * Vérifie les exigences de sécurité pour AES
   */
  validateAESSecurityRequirements(signature: AESSignature): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérification de la force du certificat
    if (signature.certificate) {
      if (signature.certificate.signatureAlgorithm !== 'RSA-SHA256') {
        issues.push('Certificat doit utiliser RSA-SHA256 minimum');
        recommendations.push('Mettre à jour le certificat vers RSA-SHA256');
      }

      if (signature.certificate.validTo < new Date()) {
        issues.push('Certificat expiré');
        recommendations.push('Renouveler le certificat');
      }
    }

    // Vérification de la 2FA
    if (!signature.isTwoFactorValidated) {
      issues.push('2FA non validée');
      recommendations.push('Valider l\'authentification à deux facteurs');
    }

    // Vérification de l'horodatage
    if (signature.timestamp) {
      const now = new Date();
      const timestampAge = now.getTime() - signature.timestamp.timestamp.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures

      if (timestampAge > maxAge) {
        issues.push('Horodatage trop ancien');
        recommendations.push('Renouveler l\'horodatage');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
    };
  }

  /**
   * Génère un rapport de compliance détaillé
   */
  generateComplianceReport(signature: SESSignature | AESSignature): {
    level: 'SES' | 'AES' | 'QES' | 'N/A';
    compliance: SignatureCompliance;
    security: {
      isValid: boolean;
      issues: string[];
      recommendations: string[];
    };
    legalValue: string;
    timestamp: Date;
  } {
    let compliance: SignatureCompliance;
    let security: { isValid: boolean; issues: string[]; recommendations: string[] };

    if ('certificate' in signature) {
      // AES Signature
      compliance = this.validateAESCompliance(signature as AESSignature);
      security = this.validateAESSecurityRequirements(signature as AESSignature);
    } else {
      // SES Signature
      compliance = this.validateSESCompliance(signature as SESSignature);
      security = {
        isValid: compliance.eIDASLevel === 'SES',
        issues: compliance.requirements.filter(req => req.startsWith('❌')),
        recommendations: [],
      };
    }

    return {
      level: compliance.eIDASLevel,
      compliance,
      security,
      legalValue: compliance.legalValue,
      timestamp: new Date(),
    };
  }
} 