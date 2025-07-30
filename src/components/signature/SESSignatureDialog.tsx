"use client";
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SESSignature, SignatureCompliance } from '@/types/signature';
import { SESSignatureService } from '@/services/signature/SESSignatureService';
import SignatureCanvas from "react-signature-canvas";
import { ShieldCheck, Mail, Smartphone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import SESComplianceBadge from './SESComplianceBadge';

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
  const [validationCode, setValidationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStep, setValidationStep] = useState<'signature' | 'validation' | 'completed'>('signature');
  const [compliance, setCompliance] = useState<SignatureCompliance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSignature, setCurrentSignature] = useState<SESSignature | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleSignatureComplete = async () => {
    if (!sigCanvas.current) return;

    try {
      setIsValidating(true);
      setError(null);

      // Get signature as base64 data URL
      const signatureDataUrl = sigCanvas.current.toDataURL("image/png");

      // Créer la signature SES avec les nouvelles méthodes statiques
      const signature = SESSignatureService.createSignature(
        documentId,
        signatoryId,
        signatureDataUrl,
        validationMethod,
        '127.0.0.1', // En production, récupérer l'IP réelle
        navigator.userAgent
      );

      setCurrentSignature(signature);
      setValidationStep('validation');
      
      // Simuler l'envoi du code de validation
      console.log(`Code de validation envoyé: ${signature.validationCode}`);
      
    } catch (error) {
      setError('Failed to create signature');
      console.error('Error creating SES signature:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidationSubmit = async () => {
    if (!validationCode || !currentSignature) return;

    try {
      setIsValidating(true);
      setError(null);

      // Valider la signature avec les nouvelles méthodes statiques
      const result = SESSignatureService.validateSignature(
        currentSignature,
        validationCode,
        '127.0.0.1',
        navigator.userAgent
      );

      if (result.isValid) {
        // Vérifier la conformité
        const complianceData = SESSignatureService.getCompliance(currentSignature);
        setCompliance(complianceData);
        setValidationStep('completed');
        
        // Confirmer la signature
        onConfirm(currentSignature);
      } else {
        setError(result.message || 'Invalid validation code');
      }
    } catch (error) {
      setError('Validation failed');
      console.error('Error validating signature:', error);
    } finally {
      setIsValidating(false);
    }
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
        return <Mail className="h-5 w-5" />;
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      case 'password':
        return <Lock className="h-5 w-5" />;
      default:
        return <ShieldCheck className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Signature Électronique Simple (SES)
          </DialogTitle>
          <DialogDescription>
            Signature électronique avec validation par {getValidationMethodLabel().toLowerCase()}.
            Ce niveau offre une sécurité de base conforme aux standards eIDAS.
          </DialogDescription>
        </DialogHeader>

        {validationStep === 'signature' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="signature">Signature de {signatoryName}</Label>
              <div className="border rounded-md mt-1">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-[200px]",
                    // @ts-expect-error - willreadfrequently is a valid canvas property
                    willreadfrequently: "true",
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleSignatureComplete}
                disabled={!sigCanvas.current || isValidating}
              >
                {isValidating ? 'Création...' : 'Continuer'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {validationStep === 'validation' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              {getValidationMethodIcon()}
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Code de validation envoyé
                </p>
                <p className="text-xs text-blue-600">
                  {validationMethod === 'email' && userEmail && `Envoyé à ${userEmail}`}
                  {validationMethod === 'sms' && userPhone && `Envoyé au ${userPhone}`}
                  {validationMethod === 'password' && 'Vérifiez votre mot de passe'}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="validationCode">Code de validation</Label>
              <Input
                id="validationCode"
                type="text"
                placeholder="Entrez le code reçu"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                className="mt-1"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setValidationStep('signature')}>
                Retour
              </Button>
              <Button 
                onClick={handleValidationSubmit}
                disabled={!validationCode || isValidating}
              >
                {isValidating ? 'Validation...' : 'Valider'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {validationStep === 'completed' && compliance && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Signature validée avec succès
                </p>
                <p className="text-xs text-green-600">
                  La signature SES a été créée et validée
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Conformité eIDAS</h4>
              <SESComplianceBadge compliance={compliance} />
              
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Niveau:</strong> {compliance.eIDASLevel}</p>
                <p><strong>Valeur légale:</strong> {compliance.legalValue}</p>
                <p><strong>Méthode de validation:</strong> {validationMethod}</p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                Terminer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SESSignatureDialog; 