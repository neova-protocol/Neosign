"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Lock
} from "lucide-react";
import SignaturePad from "./SignaturePad";
import { AESSignatureService } from "@/services/signature/AESSignatureService";
import AESComplianceBadge from "./AESComplianceBadge";
import { SignatureCompliance } from "@/types/signature";

interface AESSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signatureData: any) => void;
  signatoryName: string;
  signatoryId: string;
  documentId: string;
  twoFactorMethod: string;
  userEmail: string;
  userPhone: string;
}

interface User2FAConfig {
  phoneNumber: string;
  phoneVerified: boolean;
  authenticatorSecret: string;
  authenticatorEnabled: boolean;
  twoFactorMethods: string;
}

export const AESSignatureDialog: React.FC<AESSignatureDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  signatoryName,
  signatoryId,
  documentId,
  twoFactorMethod,
  userEmail,
  userPhone
}) => {
  const [step, setStep] = useState<'signature' | 'certificate' | 'twofactor' | 'completed'>('signature');
  const [signatureData, setSignatureData] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [compliance, setCompliance] = useState<SignatureCompliance | null>(null);
  const [error, setError] = useState<string>('');
  const [user2FAConfig, setUser2FAConfig] = useState<User2FAConfig | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadUser2FAConfig();
    }
  }, [open]);

  const loadUser2FAConfig = async () => {
    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const config = await response.json();
        setUser2FAConfig(config);
        
        // Parser les méthodes 2FA disponibles
        const methods = JSON.parse(config.twoFactorMethods || '[]');
        setAvailableMethods(methods);
      }
    } catch (error) {
      console.error('Error loading 2FA config:', error);
    }
  };

  const handleSignatureComplete = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setStep('certificate');
  };

  const handleCertificateConfirm = async () => {
    if (availableMethods.length === 0) {
      setError('Aucune méthode 2FA configurée. Veuillez configurer au moins une méthode dans votre profil.');
      return;
    }

    setStep('twofactor');
    
    // Envoyer le code 2FA selon la méthode disponible
    const aesService = AESSignatureService.getInstance();
    const success = await aesService.sendTwoFactorCode(signatoryId, userEmail, user2FAConfig?.phoneNumber);
    
    if (!success) {
      setError('Erreur lors de l\'envoi du code 2FA');
    }
  };

  const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode) {
      setError('Veuillez entrer le code 2FA');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const aesService = AESSignatureService.getInstance();
      const isValid = await aesService.validateAESSignature(
        signatoryId, 
        twoFactorCode,
        navigator.userAgent,
        '127.0.0.1' // En production, récupérer l'IP réelle
      );
      
      if (isValid) {
        const compliance = aesService.getAESCompliance(
          aesService.getSignatureBySignatory(signatoryId)!
        );
        setCompliance(compliance);
        setStep('completed');
      } else {
        setError('Code 2FA incorrect');
      }
    } catch (error) {
      setError('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirm = () => {
    if (compliance) {
      onConfirm({
        signatureData,
        compliance,
        twoFactorMethod: availableMethods[0] || 'sms',
        validatedAt: new Date().toISOString()
      });
    }
  };

  const getTwoFactorMethodIcon = (method: string) => {
    switch (method) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'authenticator': return <Key className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTwoFactorMethodLabel = (method: string) => {
    switch (method) {
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'authenticator': return 'Authenticator';
      default: return method.toUpperCase();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-600" />
            {signatoryName} - AES - Advanced Electronic Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'signature' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Créez votre signature manuscrite pour cette signature AES.</p>
              </div>
              <SignaturePad onEnd={handleSignatureComplete} onClear={() => {}} />
            </div>
          )}

          {step === 'certificate' && (
            <div className="space-y-4">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    Certificat qualifié sélectionné pour votre signature AES :
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Certificat Qualifié</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Émetteur :</strong> Certification Authority Europe</p>
                    <p><strong>Sujet :</strong> CN=Advanced Signature Certificate, O=Neosign, C=EU</p>
                    <p><strong>Numéro de série :</strong> CAE-2024-001</p>
                    <p><strong>Valide du :</strong> 01/01/2024</p>
                    <p><strong>Valide jusqu&apos;au :</strong> 31/12/2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Qualifié eIDAS
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      RSA-SHA256
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Button onClick={handleCertificateConfirm} className="w-full">
                Continuer avec 2FA
              </Button>
            </div>
          )}

          {step === 'twofactor' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Authentification 2FA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p>Méthodes 2FA disponibles :</p>
                  </div>
                  <div className="flex gap-2">
                    {availableMethods.map(method => (
                      <Badge key={method} variant="outline" className="flex items-center gap-1">
                        {getTwoFactorMethodIcon(method)}
                        {getTwoFactorMethodLabel(method)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode">Code de vérification</Label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="Entrez le code 2FA"
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTwoFactorSubmit}
                    disabled={!twoFactorCode || isValidating}
                    className="flex-1"
                  >
                    {isValidating ? "Validation..." : "Valider"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('certificate')}
                    disabled={isValidating}
                  >
                    Retour
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'completed' && compliance && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Signature AES validée avec succès !</span>
              </div>
              
              <AESComplianceBadge compliance={compliance} />
              
              <div className="flex gap-2">
                <Button onClick={handleConfirm} className="flex-1">
                  Confirmer la signature
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 