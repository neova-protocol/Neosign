"use client";

import { useState, useEffect } from "react";
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
  RefreshCw,
  User,
  Settings
} from "lucide-react";

interface User2FAConfig {
  phoneNumber: string;
  phoneVerified: boolean;
  authenticatorSecret: string;
  authenticatorEnabled: boolean;
  twoFactorMethods: string;
  emailVerified?: boolean;
}

export default function Test2FAConfigPage() {
  const { data: session, status } = useSession();
  const [config, setConfig] = useState<User2FAConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  const load2FAConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/2fa');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        
        // Parser les méthodes 2FA disponibles
        const methods = JSON.parse(data.twoFactorMethods || '[]');
        setAvailableMethods(methods);
        
        console.log('2FA Config loaded:', data);
        console.log('Available methods:', methods);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement de la configuration 2FA');
      }
    } catch (error) {
      console.error('Error loading 2FA config:', error);
      setError('Erreur réseau lors du chargement de la configuration 2FA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      load2FAConfig();
    }
  }, [session]);

  const getMethodStatus = (method: string) => {
    if (!config) return { enabled: false, verified: false };

    switch (method) {
      case 'email':
        return { 
          enabled: availableMethods.includes('email'), 
          verified: config.emailVerified || false 
        };
      case 'sms':
        return { 
          enabled: availableMethods.includes('sms'), 
          verified: config.phoneVerified || false 
        };
      case 'authenticator':
        return { 
          enabled: availableMethods.includes('authenticator'), 
          verified: config.authenticatorEnabled || false 
        };
      default:
        return { enabled: false, verified: false };
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'authenticator': return <Key className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'authenticator': return 'Authenticator';
      default: return method;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de la session...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Test Configuration 2FA</CardTitle>
            <CardDescription>
              Vous devez être connecté pour tester la configuration 2FA
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
            Test Configuration 2FA
          </h1>
          <p className="text-gray-600">
            Vérifiez la configuration 2FA de l&apos;utilisateur et son impact sur AES
          </p>
        </div>

        {/* Informations Utilisateur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Informations Utilisateur</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-gray-600">{session?.user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID Utilisateur:</span>
                <span className="text-sm text-gray-600">{session?.user?.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nom:</span>
                <span className="text-sm text-gray-600">{session?.user?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration 2FA */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Configuration 2FA</span>
            </CardTitle>
            <CardDescription>
              État actuel de la configuration 2FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chargement de la configuration...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              ) : config ? (
                <>
                  {/* Méthodes Configurées */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Méthodes Configurées</h3>
                    <div className="space-y-2">
                      {['email', 'sms', 'authenticator'].map(method => {
                        const status = getMethodStatus(method);
                        return (
                          <div key={method} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(method)}
                              <span className="font-medium">{getMethodName(method)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {status.enabled ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Configuré
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  Non configuré
                                </Badge>
                              )}
                              {status.verified && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Détails de Configuration */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Détails de Configuration</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Numéro de téléphone:</span>
                        <span className="text-gray-600">{config.phoneNumber || 'Non configuré'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Téléphone vérifié:</span>
                        <Badge variant={config.phoneVerified ? "secondary" : "outline"}>
                          {config.phoneVerified ? 'Oui' : 'Non'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Authenticator activé:</span>
                        <Badge variant={config.authenticatorEnabled ? "secondary" : "outline"}>
                          {config.authenticatorEnabled ? 'Oui' : 'Non'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email vérifié:</span>
                        <Badge variant={config.emailVerified ? "secondary" : "outline"}>
                          {config.emailVerified ? 'Oui' : 'Non'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Méthodes Disponibles */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Méthodes Disponibles pour AES</h3>
                    <div className="space-y-2">
                      {availableMethods.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {availableMethods.map(method => (
                            <Badge key={method} variant="secondary" className="flex items-center gap-1">
                              {getMethodIcon(method)}
                              {getMethodName(method)}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Aucune méthode configurée</p>
                      )}
                    </div>
                  </div>

                  {/* Statut AES */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Statut AES</h3>
                    <div className={`p-4 rounded-lg border ${
                      availableMethods.length >= 2 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {availableMethods.length >= 2 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          availableMethods.length >= 2 ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {availableMethods.length >= 2 
                            ? 'AES disponible' 
                            : 'AES non disponible'
                          }
                        </span>
                      </div>
                      <p className={`text-sm mt-2 ${
                        availableMethods.length >= 2 ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {availableMethods.length >= 2 
                          ? `Vous avez configuré ${availableMethods.length} méthodes 2FA. AES est disponible.`
                          : `Vous avez configuré ${availableMethods.length}/2 méthodes 2FA. AES nécessite au moins 2 méthodes.`
                        }
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">Aucune configuration trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Actions disponibles pour tester et configurer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={load2FAConfig} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  'Actualiser'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard/settings/security'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurer 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 