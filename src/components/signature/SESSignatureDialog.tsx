"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SignaturePad from "./SignaturePad";
import { SESSignatureService } from "@/services/signature/SESSignatureService";
import { SESSignature, SignatureCompliance } from "@/types/signature";
import { CheckCircle, AlertCircle, Clock, Shield } from "lucide-react";

interface SESSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signature: SESSignature) => void;
  signatoryName: string;
  signatoryId: string;
  documentId: string;
  validationMethod: 'email' | 'sms' | 'password';
  userEmail?: string;
  userPhone?: string;
}

const SESSignatureDialog: React.FC<SESSignatureDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  signatoryName,
  signatoryId,
  documentId,
  validationMethod,
  userEmail,
  userPhone,
}) => {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [validationCode, setValidationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStep, setValidationStep] = useState<'signature' | 'validation' | 'completed'>('signature');
  const [compliance, setCompliance] = useState<SignatureCompliance | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sesService = SESSignatureService.getInstance();

  const handleSignatureComplete = async () => {
    if (!signatureData) return;

    try {
      setIsValidating(true);
      setError(null);

      // Créer la signature SES
      const signature = await sesService.createSESSignature(
        signatoryId,
        documentId,
        signatureData,
        validationMethod,
        navigator.userAgent,
        '127.0.0.1' // En production, récupérer l'IP réelle
      );

      // Envoyer le code de validation
      const codeSent = await sesService.sendValidationCode(
        signature.id,
        userEmail,
        userPhone
      );

      if (codeSent) {
        setValidationStep('validation');
      } else {
        setError('Failed to send validation code');
      }
    } catch (error) {
      setError('Failed to create signature');
      console.error('Error creating SES signature:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidationSubmit = async () => {
    if (!validationCode) return;

    try {
      setIsValidating(true);
      setError(null);

      // Récupérer la signature créée
      const signature = await sesService.getSignature(signatoryId);
      
      if (!signature) {
        setError('Signature not found');
        return;
      }

      // Valider la signature
      const isValid = await sesService.validateSignature(
        signature.id,
        validationCode,
        navigator.userAgent,
        '127.0.0.1'
      );

      if (isValid) {
        // Vérifier la conformité
        const complianceData = sesService.getSESCompliance(signature);
        setCompliance(complianceData);
        setValidationStep('completed');
        
        // Confirmer la signature
        onConfirm(signature);
      } else {
        setError('Invalid validation code');
      }
    } catch (error) {
      setError('Validation failed');
      console.error('Error validating signature:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setSignatureData(null);
    setError(null);
  };

  const getValidationMethodLabel = () => {
    switch (validationMethod) {
      case 'email':
        return 'Email Validation';
      case 'sms':
        return 'SMS Validation';
      case 'password':
        return 'Password Validation';
      default:
        return 'Validation';
    }
  };

  const getValidationMethodIcon = () => {
    switch (validationMethod) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'password':
        return '🔐';
      default:
        return '✓';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            SES Signature - {signatoryName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Étape 1: Signature */}
          {validationStep === 'signature' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Step 1: Create Signature
                </Badge>
              </div>
              
              <SignaturePad
                onEnd={(data) => setSignatureData(data)}
                onClear={handleClear}
              />

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>This is a Simple Electronic Signature (SES) compliant with eIDAS standards.</p>
                <p className="mt-1">Validation method: {getValidationMethodLabel()}</p>
              </div>
            </div>
          )}

          {/* Étape 2: Validation */}
          {validationStep === 'validation' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getValidationMethodIcon()}
                  Step 2: Validate Signature
                </Badge>
              </div>

              <div className="text-sm text-gray-600">
                <p>A validation code has been sent to your {validationMethod}.</p>
                <p className="mt-1">Please enter the code below to complete the signature.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validationCode">Validation Code</Label>
                <Input
                  id="validationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={validationCode}
                  onChange={(e) => setValidationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Complété */}
          {validationStep === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Signature Completed
                </Badge>
              </div>

              {compliance && (
                <div className="space-y-2 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">eIDAS Compliant</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>Level: {compliance.eIDASLevel}</p>
                    <p>Legal Value: {compliance.legalValue}</p>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p>Your signature has been successfully created and validated.</p>
                <p className="mt-1">This signature is compliant with eIDAS SES standards.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {validationStep === 'signature' && (
            <Button 
              onClick={handleSignatureComplete} 
              disabled={!signatureData || isValidating}
            >
              {isValidating ? 'Creating...' : 'Create Signature'}
            </Button>
          )}
          
          {validationStep === 'validation' && (
            <Button 
              onClick={handleValidationSubmit} 
              disabled={!validationCode || isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate Signature'}
            </Button>
          )}
          
          {validationStep === 'completed' && (
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SESSignatureDialog; 