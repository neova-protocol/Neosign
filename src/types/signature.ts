// Types pour les signatures électroniques conformes eIDAS

export interface SignatureCertificate {
  id: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  publicKey: string;
}

export interface SignatureTimestamp {
  timestamp: Date;
  hash: string;
  algorithm: string;
  authority: string;
}

export interface SignatureValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  complianceLevel: 'SES' | 'AES' | 'QES';
}

export interface SESSignature {
  id: string;
  signatoryId: string;
  documentId: string;
  signatureData: string; // Base64 encoded signature
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  validationMethod: 'email' | 'sms' | 'password';
  validationCode?: string;
  isValidated: boolean;
  certificate?: SignatureCertificate;
  timestampData?: SignatureTimestamp;
  validation: SignatureValidation;
}

export interface SignatureCompliance {
  eIDASLevel: 'SES' | 'AES' | 'QES';
  isCompliant: boolean;
  requirements: string[];
  validationSteps: string[];
  legalValue: 'basic' | 'advanced' | 'qualified';
}

export interface SignatureRequest {
  documentId: string;
  signatoryId: string;
  signatureType: 'SES' | 'AES' | 'QES';
  validationMethod: 'email' | 'sms' | 'password';
  expiresAt: Date;
  redirectUrl?: string;
}

export interface SignatureValidationRequest {
  signatureId: string;
  validationCode: string;
  ipAddress: string;
  userAgent: string;
} 