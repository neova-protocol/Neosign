// Types pour les signatures électroniques conformes eIDAS

export interface SignatureCertificate {
  id: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  publicKey: string;
  signatureAlgorithm: string;
  keyUsage: string[];
  isQualified: boolean;
}

export interface SignatureTimestamp {
  timestamp: Date;
  hashAlgorithm: string;
  signatureAlgorithm: string;
  tsaUrl: string;
  serialNumber: string;
}

export interface SignatureValidation {
  isValid: boolean;
  validationDate: Date;
  validationMethod: string;
  certificateStatus: 'valid' | 'expired' | 'revoked' | 'unknown';
  revocationReason?: string;
}

export interface SESSignature {
  id: string;
  signatoryId: string;
  documentId: string;
  signatureData: string;
  validationMethod: 'email' | 'sms' | 'password';
  validationCode: string;
  validationCodeExpiry: Date;
  isValidated: boolean;
  validatedAt?: Date;
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
  certificate?: SignatureCertificate;
  timestampData?: SignatureTimestamp;
  validation?: SignatureValidation;
}

export interface AESSignature {
  id: string;
  signatoryId: string;
  documentId: string;
  signatureData: string;
  certificate: SignatureCertificate;
  timestamp: SignatureTimestamp;
  validation: SignatureValidation;
  twoFactorMethod: 'sms' | 'email' | 'authenticator' | 'hardware';
  twoFactorCode: string;
  isTwoFactorValidated: boolean;
  twoFactorValidatedAt?: Date;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
  signedAt?: Date;
  revocationStatus: 'active' | 'revoked' | 'expired';
  revocationReason?: string;
  revocationDate?: Date;
}

export interface SignatureCompliance {
  eIDASLevel: 'N/A' | 'SES' | 'AES' | 'QES';
  legalValue: 'Basic' | 'Advanced' | 'Qualified';
  requirements: string[];
  validationSteps: string[];
  certificateInfo?: {
    issuer: string;
    validFrom: Date;
    validTo: Date;
    isQualified: boolean;
  };
  timestampInfo?: {
    tsaUrl: string;
    timestamp: Date;
  };
}

export interface SignatureRequest {
  documentId: string;
  signatoryId: string;
  signatureType: 'simple' | 'ses' | 'aes' | 'qes';
  validationMethod?: 'email' | 'sms' | 'password' | 'authenticator' | 'hardware';
  certificateId?: string;
  twoFactorMethod?: 'sms' | 'email' | 'authenticator' | 'hardware';
}

export interface SignatureValidationRequest {
  signatureId: string;
  validationCode: string;
  userAgent: string;
  ipAddress: string;
} 