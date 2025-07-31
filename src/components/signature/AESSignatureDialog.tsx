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
  onConfirm: (signatureData: {
    signatureData: string;
    compliance: SignatureCompliance;
    twoFactorMethod: string;
    validatedAt: string;
  }) => void;
  signatoryName: string;
  signatoryId: string;
  documentId: string;
}

interface User2FAConfig {
  phoneNumber: string;
  phoneVerified: boolean;
  authenticatorSecret: string;
  authenticatorEnabled: boolean;
  twoFactorMethods: string;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  authenticatorEnabled?: boolean;
  twoFactorMethods?: string;
}

export const AESSignatureDialog: React.FC<AESSignatureDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  signatoryName,
  signatoryId,
  documentId
}) => {
  const [step, setStep] = useState<'signature' | 'certificate' | 'twofactor' | 'completed' | 'error'>('signature');
  const [signatureData, setSignatureData] = useState<string>('');
  const [twoFactorCodes, setTwoFactorCodes] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSentTime, setEmailSentTime] = useState<Date | null>(null);
  const [compliance, setCompliance] = useState<SignatureCompliance | null>(null);
  const [error, setError] = useState<string>('');
  const [user2FAConfig, setUser2FAConfig] = useState<User2FAConfig | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (open) {
      loadUser2FAConfig();
      loadUserProfile();
    }
  }, [open]);

  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    if (emailSent && emailSentTime) {
      const interval = setInterval(() => {
        const remaining = getRemainingTime();
        if (!remaining) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [emailSent, emailSentTime]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
        console.log('User profile loaded:', profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadUser2FAConfig = async () => {
    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const config = await response.json();
        setUser2FAConfig(config);
        
        // Parser les méthodes 2FA disponibles
        const methods = JSON.parse(config.twoFactorMethods || '[]');
        setAvailableMethods(methods);
        
        // Pour AES, sélectionner automatiquement les 2 premières méthodes
        // ou toutes si moins de 2
        const methodsToSelect = methods.length >= 2 ? methods.slice(0, 2) : methods;
        setSelectedMethods(methodsToSelect);
      } else {
        // Pour la signature publique, utiliser email par défaut
        console.log('Using default 2FA method (email) for public signature');
        setAvailableMethods(['email']);
      }
    } catch (error) {
      console.error('Error loading 2FA config:', error);
      // Pour la signature publique, utiliser email par défaut
      console.log('Using default 2FA method (email) for public signature');
      setAvailableMethods(['email']);
    }
  };

  const handleSignatureComplete = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setStep('certificate');
  };

  const handleCertificateConfirm = async () => {
    // Pour AES, on a besoin d'au moins 2 méthodes 2FA
    if (availableMethods.length < 2) {
      setError('Signature AES impossible. Merci de configurer au moins deux méthodes 2FA.');
      setStep('error');
      return;
    }

    setStep('twofactor');
    
    // Pas d'envoi automatique - l'utilisateur doit demander l'envoi
    console.log('AES 2FA step initiated. User must request codes manually.');
    
    // Pas d'envoi automatique - l'utilisateur doit demander l'envoi manuellement
  };

  const handleTwoFactorSubmit = async () => {
    // Vérifier que tous les codes sont entrés pour les méthodes sélectionnées
    const missingCodes = selectedMethods.filter(method => !twoFactorCodes[method]);
    if (missingCodes.length > 0) {
      setError(`Veuillez entrer les codes pour : ${missingCodes.join(', ')}`);
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Valider chaque méthode sélectionnée
      const validationResults = [];
      
      for (const method of selectedMethods) {
        const code = twoFactorCodes[method];
        
        const response = await fetch('/api/user/2fa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            method,
            code,
            email: method === 'email' ? userProfile?.email : undefined,
            phoneNumber: method === 'sms' ? user2FAConfig?.phoneNumber : undefined
          })
        });
        
        if (response.ok) {
          validationResults.push({ method, success: true });
        } else {
          const errorData = await response.json();
          validationResults.push({ method, success: false, error: errorData.error });
        }
      }

      // Vérifier que toutes les validations ont réussi
      const failedValidations = validationResults.filter(result => !result.success);
      if (failedValidations.length > 0) {
        setError(`Échec de validation : ${failedValidations.map(f => `${f.method} (${f.error})`).join(', ')}`);
        return;
      }

      // Créer une signature AES avec les 2 méthodes validées
      const aesService = AESSignatureService.getInstance();
      const signature = await aesService.createAESSignature(
        signatoryId,
        documentId,
        signatureData,
        selectedMethods.join('+') as 'sms' | 'email' | 'authenticator' | 'hardware',
        navigator.userAgent,
        '127.0.0.1'
      );
      
      const compliance = aesService.getAESCompliance(signature);
      setCompliance(compliance);
      setStep('completed');
      
    } catch (error) {
      console.error('Error validating 2FA:', error);
      setError('Erreur lors de la validation des codes 2FA');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSendEmailCode = async () => {
    setIsSendingEmail(true);
    setError('');

    try {
      // Utiliser l'email du profil utilisateur (email 2FA configuré)
      const twoFAEmail = userProfile?.email;
      console.log('Sending email code to 2FA email:', twoFAEmail);
      
      if (!twoFAEmail) {
        setError('Email 2FA non configuré. Veuillez configurer un email dans les paramètres.');
        return;
      }

      const response = await fetch('/api/user/2fa/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: twoFAEmail })
      });

      const responseData = await response.json();
      console.log('Email API response:', responseData);

      if (response.ok) {
        console.log('Email code sent successfully to:', twoFAEmail);
        setEmailSent(true);
        setEmailSentTime(new Date());
        setError(''); // Effacer les erreurs précédentes
      } else {
        console.error('Email API error:', responseData);
        setError(`Erreur envoi email: ${responseData.error}`);
        setEmailSent(false);
        setEmailSentTime(null);
      }
    } catch (error) {
      console.error('Error sending email code:', error);
      setError('Erreur lors de l\'envoi du code email');
      setEmailSent(false);
      setEmailSentTime(null);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendSMSCode = async () => {
    setIsSendingEmail(true); // Réutiliser le même état pour SMS
    setError('');

    try {
      const response = await fetch('/api/user/2fa/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: user2FAConfig?.phoneNumber })
      });

      if (response.ok) {
        console.log('SMS code sent successfully');
      } else {
        const errorData = await response.json();
        setError(`Erreur envoi SMS: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error sending SMS code:', error);
      setError('Erreur lors de l\'envoi du code SMS');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Calculer le temps restant avant que le code expire
  const getRemainingTime = () => {
    if (!emailSentTime) return null;
    
    const now = new Date();
    const timeDiff = now.getTime() - emailSentTime.getTime();
    const remainingMs = 5 * 60 * 1000 - timeDiff; // 5 minutes en millisecondes
    
    if (remainingMs <= 0) {
      setEmailSent(false);
      setEmailSentTime(null);
      return null;
    }
    
    const remainingMinutes = Math.floor(remainingMs / (60 * 1000));
    const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
    
    return { minutes: remainingMinutes, seconds: remainingSeconds };
  };

  const remainingTime = getRemainingTime();
  const isEmailButtonDisabled = emailSent && remainingTime !== null;

  const handleConfirm = () => {
    if (compliance) {
      onConfirm({
        signatureData,
        compliance,
        twoFactorMethod: selectedMethods.join('+'),
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

                {/* Sélection des méthodes pour AES */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p>Sélectionnez 2 méthodes pour AES :</p>
                  </div>
                  <div className="space-y-2">
                    {availableMethods.map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`select-${method}`}
                          checked={selectedMethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedMethods.length < 2) {
                                setSelectedMethods([...selectedMethods, method]);
                              }
                            } else {
                              setSelectedMethods(selectedMethods.filter(m => m !== method));
                            }
                          }}
                          disabled={!selectedMethods.includes(method) && selectedMethods.length >= 2}
                        />
                        <label htmlFor={`select-${method}`} className="flex items-center space-x-2 text-sm">
                          {getTwoFactorMethodIcon(method)}
                          <span>{getTwoFactorMethodLabel(method)}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedMethods.map((method) => (
                    <div key={method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`code-${method}`}>
                          Code {getTwoFactorMethodLabel(method)}
                        </Label>
                        {(method === 'email' || method === 'sms') && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={method === 'email' ? handleSendEmailCode : handleSendSMSCode}
                            disabled={isSendingEmail || (method === 'email' && isEmailButtonDisabled)}
                          >
                            {isSendingEmail ? 'Envoi...' : 
                             method === 'email' && isEmailButtonDisabled ? 
                             `${remainingTime?.minutes}:${remainingTime?.seconds?.toString().padStart(2, '0')}` : 
                             'Envoyer'}
                          </Button>
                        )}
                      </div>
                      <Input
                        id={`code-${method}`}
                        type="text"
                        value={twoFactorCodes[method] || ''}
                        onChange={(e) => setTwoFactorCodes({
                          ...twoFactorCodes,
                          [method]: e.target.value
                        })}
                        placeholder={`Entrez le code ${getTwoFactorMethodLabel(method)}`}
                        className="font-mono"
                      />
                      {method === 'email' && emailSent && remainingTime && (
                        <div className="text-sm text-green-600 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Code envoyé avec succès (expire dans {remainingTime.minutes}:{remainingTime.seconds.toString().padStart(2, '0')})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleTwoFactorSubmit}
                    disabled={selectedMethods.length !== 2 || selectedMethods.some(method => !twoFactorCodes[method]) || isValidating}
                    className="flex-1"
                  >
                    {isValidating ? "Validation..." : "Valider AES"}
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

          {step === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Configuration 2FA insuffisante</span>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">
                  Signature AES impossible
                </h3>
                <p className="text-sm text-red-800 mb-4">
                  Pour signer en AES (Advanced Electronic Signature), vous devez configurer 
                  au moins deux méthodes d&apos;authentification.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-red-700">
                    <strong>Méthodes configurées :</strong> {availableMethods.length}/2
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Méthodes disponibles :</strong> SMS, Email, Authenticator
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.href = '/dashboard/settings/security'}
                  className="flex-1"
                >
                  Configurer 2FA
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