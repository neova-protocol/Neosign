"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Lock
} from "lucide-react";

interface AESAuthFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (sessionToken: string) => void;
  onCancel: () => void;
}

interface AuthRequirement {
  type: string;
  isRequired: boolean;
  isCompleted: boolean;
  expiresAt: Date;
}

interface ValidationResult {
  method: string;
  sent: boolean;
  code: string;
  expiresAt: Date;
}

export default function AESAuthFlow({
  open,
  onOpenChange,
  onSuccess,
  onCancel,
}: AESAuthFlowProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<'init' | 'validation' | 'completed'>('init');
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [requirements, setRequirements] = useState<AuthRequirement[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationCodes, setValidationCodes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [compliance, setCompliance] = useState<any>(null);

  useEffect(() => {
    if (open && currentStep === 'init') {
      initializeAESAuth();
    }
  }, [open, currentStep]);

  const initializeAESAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signature/aes/validate-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiredMethods: ['sms', 'email']
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        setSessionToken(data.sessionToken);
        setRequirements(data.requirements);
        setValidationResults(data.validationResults);
        setCurrentStep('validation');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'initialisation de l\'authentification AES');
      }
    } catch (error) {
      setError('Erreur lors de l\'initialisation de l\'authentification AES');
      console.error('AES auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateCodes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signature/aes/validate-auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          validationCodes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCompliance(data.compliance);
        setCurrentStep('completed');
        onSuccess(sessionToken);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la validation des codes');
      }
    } catch (error) {
      setError('Erreur lors de la validation des codes');
      console.error('AES validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sms': return <Smartphone className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'authenticator': return <Key className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Authentification AES</span>
          </DialogTitle>
          <DialogDescription>
            Signature électronique avancée conforme eIDAS
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'init' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Initialisation de l'authentification AES...</p>
            </div>
          </div>
        )}

        {currentStep === 'validation' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Exigences eIDAS pour AES
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Au moins 2 méthodes d'authentification</li>
                <li>• Certificat qualifié obligatoire</li>
                <li>• Horodatage qualifié (RFC 3161)</li>
                <li>• Non-répudiation garantie</li>
              </ul>
            </div>

            <div className="space-y-3">
              {requirements.map((req, index) => (
                <Card key={index} className={req.isCompleted ? 'border-green-200 bg-green-50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(req.type)}
                        <CardTitle className="text-sm">
                          {getMethodName(req.type)}
                        </CardTitle>
                      </div>
                      {req.isCompleted ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validé
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  {!req.isCompleted && (
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Code reçu par {getMethodName(req.type)}</span>
                          <span>Expire à {formatTime(req.expiresAt)}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Code de validation"
                          className="w-full px-3 py-2 border rounded-md"
                          value={validationCodes[req.type] || ''}
                          onChange={(e) => setValidationCodes({
                            ...validationCodes,
                            [req.type]: e.target.value
                          })}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Codes valides pendant 10 minutes
                </span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'completed' && compliance && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Authentification AES Réussie
              </h3>
              <p className="text-sm text-gray-600">
                Signature conforme aux exigences eIDAS
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Compliance eIDAS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      AES
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valeur légale:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Advanced
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        <DialogFooter>
          {currentStep === 'validation' && (
            <>
              <Button variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button 
                onClick={validateCodes}
                disabled={isLoading || Object.keys(validationCodes).length < 2}
              >
                {isLoading ? 'Validation...' : 'Valider AES'}
              </Button>
            </>
          )}
          {currentStep === 'completed' && (
            <Button onClick={() => onOpenChange(false)}>
              Continuer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 