"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  CheckCircle, 
  AlertCircle,
  QrCode,
  Copy,
  Lock,
  Settings
} from "lucide-react";
import QRCodeDialog from "@/components/2fa/QRCodeDialog";
import TwoFactorVerificationDialog from "@/components/2fa/TwoFactorVerificationDialog";

interface TwoFactorConfig {
  phoneNumber: string;
  phoneVerified: boolean;
  authenticatorSecret: string;
  authenticatorEnabled: boolean;
  twoFactorMethods: string | string[];
  emailVerified?: boolean;
}

export default function SecuritySettingsPage() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<TwoFactorConfig>({
    phoneNumber: "",
    phoneVerified: false,
    authenticatorSecret: "",
    authenticatorEnabled: false,
    twoFactorMethods: "[]",
    emailVerified: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [authenticatorSecret, setAuthenticatorSecret] = useState("");
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Helper function to parse twoFactorMethods
  const getTwoFactorMethods = (): string[] => {
    if (typeof config.twoFactorMethods === 'string') {
      try {
        return JSON.parse(config.twoFactorMethods);
      } catch {
        return [];
      }
    }
    return Array.isArray(config.twoFactorMethods) ? config.twoFactorMethods : [];
  };

  useEffect(() => {
    if (session?.user) {
      loadUserConfig();
    }
  }, [session]);

  const loadUserConfig = async () => {
    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          ...data,
          emailVerified: data.emailVerified || false
        });
      }
    } catch (error) {
      console.error('Error loading 2FA config:', error);
    }
  };

  const updatePhoneNumber = async () => {
    if (!config.phoneNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/2fa/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: config.phoneNumber })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Code de vérification envoyé par SMS' });
        // En production, ouvrir un dialogue pour entrer le code
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/2fa/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        setConfig(prev => ({ ...prev, phoneVerified: true }));
        setMessage({ type: 'success', text: 'Numéro de téléphone vérifié' });
      } else {
        setMessage({ type: 'error', text: 'Code incorrect' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de vérification' });
    } finally {
      setIsLoading(false);
    }
  };

  const enableAuthenticator = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/2fa/authenticator', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setAuthenticatorSecret(data.secret);
        setQrCodeData(data.otpauthUrl);
        setShowQRDialog(true);
      } else {
        setMessage({ type: 'error', text: 'Erreur de configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRConfirm = () => {
    setConfig(prev => ({ 
      ...prev, 
      authenticatorSecret: authenticatorSecret,
      authenticatorEnabled: true 
    }));
    setShowQRDialog(false);
    setMessage({ type: 'success', text: 'Authenticator configuré avec succès' });
  };

  const handleEmailVerification = async (method: string, code: string) => {
    setIsVerifyingEmail(true);
    try {
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          method: 'email', 
          code: code 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(prev => ({ 
          ...prev, 
          twoFactorMethods: JSON.stringify(data.methods),
          emailVerified: true
        }));
        setShowEmailVerificationDialog(false);
        setMessage({ type: 'success', text: 'Email 2FA activé avec succès' });
        loadUserConfig(); // Recharger la config
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Code incorrect' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const toggleTwoFactorMethod = async (method: string) => {
    const currentMethods = getTwoFactorMethods();
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/2fa/methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methods: newMethods })
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setMessage({ type: 'success', text: 'Méthodes 2FA mises à jour' });
      } else {
        setMessage({ type: 'error', text: 'Erreur de mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-gray-600" />
          <h1 className="text-3xl font-bold">Paramètres de Sécurité</h1>
        </div>
        <p className="text-gray-600">
          Configurez vos méthodes d'authentification forte pour les signatures AES et QES conformes eIDAS.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Authentification par Email
            </CardTitle>
            {config.emailVerified && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Email vérifié</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  className="bg-gray-50"
                />
                <Button 
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const response = await fetch('/api/user/2fa/email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: session?.user?.email })
                      });
                      if (response.ok) {
                        setShowEmailVerificationDialog(true);
                        setMessage({ type: 'success', text: 'Code de vérification envoyé par email' });
                      } else {
                        setMessage({ type: 'error', text: 'Erreur lors de l\'envoi du code' });
                      }
                    } catch (error) {
                      setMessage({ type: 'error', text: 'Erreur de connexion' });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading || config.emailVerified}
                >
                  {isLoading ? "Envoi..." : config.emailVerified ? "Email déjà vérifié" : "Envoyer le code"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Activer pour les signatures AES/QES</span>
              <Switch
                checked={getTwoFactorMethods().includes('email')}
                onCheckedChange={() => toggleTwoFactorMethod('email')}
                disabled={!config.emailVerified}
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Authentification par SMS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <div className="flex gap-2">
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={config.phoneNumber}
                  onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+33 6 12 34 56 78"
                />
                <Button 
                  onClick={updatePhoneNumber}
                  disabled={!config.phoneNumber || isLoading}
                >
                  {isLoading ? "Envoi..." : "Vérifier"}
                </Button>
              </div>
            </div>
            
            {config.phoneVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Numéro vérifié</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Activer pour les signatures AES/QES</span>
              <Switch
                checked={getTwoFactorMethods().includes('sms')}
                onCheckedChange={() => toggleTwoFactorMethod('sms')}
                disabled={!config.phoneVerified}
              />
            </div>
          </CardContent>
        </Card>



        {/* Authenticator App */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              Application Authenticator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!config.authenticatorEnabled ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Configurez une application comme Google Authenticator ou Authy.
                </p>
                <Button 
                  onClick={enableAuthenticator}
                  disabled={isLoading}
                >
                  {isLoading ? "Configuration..." : "Configurer Authenticator"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Authenticator configuré</span>
                </div>
                
                <div className="space-y-2">
                  <Label>Code secret (pour sauvegarde)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={config.authenticatorSecret}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(config.authenticatorSecret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Activer pour les signatures AES/QES</span>
                  <Switch
                    checked={getTwoFactorMethods().includes('authenticator')}
                    onCheckedChange={() => toggleTwoFactorMethod('authenticator')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Méthodes Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {getTwoFactorMethods().length > 0 ? (
                getTwoFactorMethods().map(method => (
                  <Badge key={method} variant="secondary">
                    {method === 'sms' && <Smartphone className="h-3 w-3 mr-1" />}
                    {method === 'email' && <Mail className="h-3 w-3 mr-1" />}
                    {method === 'authenticator' && <Key className="h-3 w-3 mr-1" />}
                    {method.toUpperCase()}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Aucune méthode configurée</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Lock className="h-5 w-5" />
              Informations de Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-2">
            <p>• Les signatures AES et QES nécessitent au moins une méthode d'authentification forte.</p>
            <p>• Les codes 2FA sont temporaires et expirent après 10 minutes.</p>
            <p>• Vos données de sécurité sont chiffrées et stockées de manière sécurisée.</p>
            <p>• Conformité eIDAS : Niveau 2 (AES) et Niveau 3 (QES) pour les signatures qualifiées.</p>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
        qrCodeData={qrCodeData}
        secret={authenticatorSecret}
        userEmail={session?.user?.email || ""}
        onConfirm={handleQRConfirm}
      />

      {/* Email Verification Dialog */}
      <TwoFactorVerificationDialog
        open={showEmailVerificationDialog}
        onOpenChange={setShowEmailVerificationDialog}
        onConfirm={handleEmailVerification}
        method="email"
        email={session?.user?.email || ""}
        isLoading={isVerifyingEmail}
      />
    </div>
  );
}
