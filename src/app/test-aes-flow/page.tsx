"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone, 
  Mail, 
  Key,
  Clock,
  User,
  Lock
} from "lucide-react";
import AESAuthFlow from "@/components/signature/AESAuthFlow";

export default function TestAESFlowPage() {
  const { data: session, status } = useSession();
  const [showAESAuth, setShowAESAuth] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [user2FAConfig, setUser2FAConfig] = useState<any>(null);

  const checkUser2FAConfig = async () => {
    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const config = await response.json();
        setUser2FAConfig(config);
      }
    } catch (error) {
      console.error('Error loading 2FA config:', error);
    }
  };

  const handleAESAuthSuccess = (sessionToken: string) => {
    setAuthResult({
      success: true,
      sessionToken,
      message: "Authentification AES réussie !"
    });
  };

  const handleAESAuthCancel = () => {
    setShowAESAuth(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Test Flux AES</CardTitle>
            <CardDescription>
              Vous devez être connecté pour tester le flux AES
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/login"}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Flux d'Authentification AES
          </h1>
          <p className="text-gray-600">
            Testez le flux complet d'authentification pour signature AES conforme eIDAS
          </p>
        </div>

        {/* Configuration Utilisateur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Configuration Utilisateur</span>
            </CardTitle>
            <CardDescription>
              Vérifiez votre configuration 2FA pour AES
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-gray-600">{session?.user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Configuration 2FA:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={checkUser2FAConfig}
                >
                  Vérifier
                </Button>
              </div>

              {user2FAConfig && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Méthodes 2FA Configurées:</h4>
                  <div className="space-y-2">
                    {JSON.parse(user2FAConfig.twoFactorMethods || '[]').map((method: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-blue-800">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exigences eIDAS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Exigences eIDAS pour AES</span>
            </CardTitle>
            <CardDescription>
              Conditions requises pour signature avancée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Authentification</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Au moins 2 méthodes 2FA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">SMS + Email ou Authenticator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Validation en temps réel</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Sécurité</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Certificat qualifié</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Horodatage RFC 3161</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Non-répudiation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test AES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-600" />
              <span>Test Authentification AES</span>
            </CardTitle>
            <CardDescription>
              Lancez le test d&apos;authentification AES complète
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Important</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Pour tester AES, vous devez avoir configuré au moins 2 méthodes d&apos;authentification 
                  (SMS, Email, ou Authenticator). Le test enverra des codes de validation.
                </p>
              </div>

              <Button 
                onClick={() => setShowAESAuth(true)}
                className="w-full"
                size="lg"
              >
                Lancer le Test AES
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {authResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {authResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Résultat du Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  authResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`font-semibold ${
                    authResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {authResult.message}
                  </p>
                </div>

                {authResult.success && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Niveau eIDAS:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        AES
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Valeur légale:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Advanced
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Session Token:</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {authResult.sessionToken.substring(0, 16)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
            <CardDescription>
              Comment tester le flux AES
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Vérifier la configuration 2FA</h3>
                  <p className="text-sm text-gray-600">
                    Assurez-vous d&apos;avoir configuré au moins 2 méthodes d&apos;authentification 
                    (SMS, Email, ou Authenticator).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Lancer le test AES</h3>
                  <p className="text-sm text-gray-600">
                    Cliquez sur &quot;Lancer le Test AES&quot; pour démarrer le processus 
                    d&apos;authentification avancée.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Valider les codes</h3>
                  <p className="text-sm text-gray-600">
                    Entrez les codes de validation reçus par SMS et email pour 
                    compléter l&apos;authentification AES.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Vérifier la compliance</h3>
                  <p className="text-sm text-gray-600">
                    Le système vérifiera automatiquement la conformité eIDAS et 
                    affichera le résultat du test.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composant AES Auth Flow */}
        <AESAuthFlow
          open={showAESAuth}
          onOpenChange={setShowAESAuth}
          onSuccess={handleAESAuthSuccess}
          onCancel={handleAESAuthCancel}
        />
      </div>
    </div>
  );
} 