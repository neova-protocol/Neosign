"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone, 
  Mail, 
  Key,
  RefreshCw,
  User,
  Settings,
  Bug
} from "lucide-react";

export default function Debug2FAPage() {
  const { data: session, status } = useSession();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        console.log('🔍 Debug 2FA Config:', data);
        
        // Parser les méthodes
        const methods = JSON.parse(data.twoFactorMethods || '[]');
        console.log('🔍 Available Methods:', methods);
        console.log('🔍 Methods Count:', methods.length);
        console.log('🔍 Is AES Ready:', methods.length >= 2);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement');
        console.error('❌ Error loading config:', errorData);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadConfig();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
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
            <CardTitle>Debug 2FA</CardTitle>
            <CardDescription>
              Vous devez être connecté pour debugger la 2FA
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Bug className="h-8 w-8 mr-3 text-red-600" />
            Debug Configuration 2FA
          </h1>
          <p className="text-gray-600">
            Debug détaillé de la configuration 2FA pour identifier les problèmes
          </p>
        </div>

        {/* Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Actions Debug</CardTitle>
            <CardDescription>
              Recharger la configuration pour voir les changements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadConfig} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4 mr-2" />
                  Recharger Config
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Configuration Debug */}
        {config && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Configuration 2FA (Debug)</CardTitle>
              <CardDescription>
                Données brutes de la configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Données brutes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Données Brutes</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(config, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Méthodes parsées */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Méthodes Parsées</h3>
                  <div className="space-y-2">
                    {(() => {
                      try {
                        const methods = JSON.parse(config.twoFactorMethods || '[]');
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Méthodes configurées:</span>
                              <Badge variant="secondary">
                                {methods.length} méthode(s)
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {methods.map((method: string, index: number) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{method}</span>
                                  <Badge variant="outline">#{index + 1}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      } catch (error) {
                        return (
                          <div className="text-red-600 text-sm">
                            ❌ Erreur parsing JSON: {config.twoFactorMethods}
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Statut AES */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Statut AES</h3>
                  {(() => {
                    try {
                      const methods = JSON.parse(config.twoFactorMethods || '[]');
                      const isAESReady = methods.length >= 2;
                      
                      return (
                        <div className={`p-4 rounded-lg border ${
                          isAESReady 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {isAESReady ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`font-medium ${
                              isAESReady ? 'text-green-900' : 'text-red-900'
                            }`}>
                              {isAESReady ? 'AES Prêt' : 'AES Non Prêt'}
                            </span>
                          </div>
                          <p className={`text-sm mt-2 ${
                            isAESReady ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {isAESReady 
                              ? `✅ ${methods.length}/2 méthodes configurées - AES disponible`
                              : `❌ ${methods.length}/2 méthodes configurées - AES nécessite 2+ méthodes`
                            }
                          </p>
                        </div>
                      );
                    } catch (error) {
                      return (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-900">Erreur Parsing</span>
                          </div>
                          <p className="text-sm text-red-800 mt-2">
                            Impossible de parser les méthodes 2FA
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Détails par méthode */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Détails par Méthode</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Email:</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.emailVerified ? "secondary" : "outline"}>
                          {config.emailVerified ? 'Vérifié' : 'Non vérifié'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">SMS:</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.phoneVerified ? "secondary" : "outline"}>
                          {config.phoneVerified ? 'Vérifié' : 'Non vérifié'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {config.phoneNumber || 'Non configuré'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Authenticator:</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.authenticatorEnabled ? "secondary" : "outline"}>
                          {config.authenticatorEnabled ? 'Activé' : 'Non activé'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {config.authenticatorSecret ? 'Secret configuré' : 'Secret manquant'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 