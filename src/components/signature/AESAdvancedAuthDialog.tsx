"use client";

import { useState, useEffect } from "react";
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
  Smartphone, 
  Mail, 
  Key,
  AlertTriangle 
} from "lucide-react";
import { AdvancedAuthService, AuthRequirement, AdvancedAuthSession } from "@/services/auth/AdvancedAuthService";

interface AESAdvancedAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (sessionToken: string) => void;
  onCancel: () => void;
  userId: string;
}

export default function AESAdvancedAuthDialog({
  open,
  onOpenChange,
  onSuccess,
  onCancel,
  userId,
}: AESAdvancedAuthDialogProps) {
  const [currentStep, setCurrentStep] = useState<'init' | 'auth' | 'validation' | 'completed'>('init');
  const [authSession, setAuthSession] = useState<AdvancedAuthSession | null>(null);
  const [validationCodes, setValidationCodes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [complianceReport, setComplianceReport] = useState<{
    level: string;
    compliance: {
      eIDASLevel: string;
      legalValue: string;
      requirements: string[];
      validations: string[];
    };
    security: {
      isValid: boolean;
      issues: string[];
      recommendations: string[];
    };
  } | null>(null);

  const authService = AdvancedAuthService.getInstance();

  useEffect(() => {
    if (open && currentStep === 'init') {
      initializeAuthSession();
    }
  }, [open, currentStep]);

  const initializeAuthSession = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Méthodes disponibles selon les données utilisateur
      const availableMethods: ('sms' | 'email' | 'authenticator' | 'hardware')[] = [];
      
      // Pour AES, on a besoin d'au moins 2 méthodes
      availableMethods.push('email', 'authenticator'); // Méthodes par défaut
      
      const requiredMethods = availableMethods.slice(0, 2);
      
      const session = await authService.createAdvancedAuthSession(
        userId,
        '127.0.0.1', // En production, récupérer l'IP réelle
        navigator.userAgent,
        requiredMethods
      );

      setAuthSession(session);
      setCurrentStep('auth');
    } catch (error) {
      setError('Erreur lors de l&apos;initialisation de l&apos;authentification');
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodValidation = async (methodType: string) => {
    setIsLoading(true);
    setError('');

    try {
      const code = validationCodes[methodType];
      if (!code) {
        setError('Veuillez entrer le code de validation');
        return;
      }

      if (!authSession) {
        setError('Session d&apos;authentification non trouvée');
        return;
      }

      const isValid = await authService.validateAuthMethod(
        authSession.id,
        methodType,
        code
      );

      if (isValid) {
        // Marquer la méthode comme validée
        const updatedSession = {
          ...authSession,
          requirements: authSession.requirements.map((req: AuthRequirement) =>
            req.type === methodType ? { ...req, isCompleted: true } : req
          )
        };
        setAuthSession(updatedSession);

        // Vérifier si toutes les méthodes sont validées
        const completedMethods = updatedSession.requirements
          .filter((req: AuthRequirement) => req.isCompleted)
          .map((req: AuthRequirement) => req.type);

        if (completedMethods.length >= 2) {
          await completeAuthSession(completedMethods);
        }
      } else {
        setError('Code de validation incorrect');
      }
    } catch (error) {
      setError('Erreur lors de la validation');
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeAuthSession = async (completedMethods: string[]) => {
    try {
      // Vérifier la compliance eIDAS
      const eidasValidation = authService.validateEIDASRequirements(completedMethods);
      
      if (eidasValidation.isCompliant) {
        setComplianceReport({
          level: 'AES',
          compliance: {
            eIDASLevel: 'AES',
            legalValue: 'Advanced',
            requirements: [],
            validations: eidasValidation.validations,
          },
          security: {
            isValid: true,
            issues: [],
            recommendations: [],
          },
        });

        setCurrentStep('completed');
        if (authSession) {
          onSuccess(authSession.sessionToken);
        }
      } else {
        setError('Exigences eIDAS non remplies pour AES');
      }
    } catch (error) {
      setError('Erreur lors de la finalisation de l&apos;authentification');
      console.error('Auth completion error:', error);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sms': return <Smartphone className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'authenticator': return <Key className="h-5 w-5" />;
      case 'hardware': return <Shield className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'authenticator': return 'Authenticator';
      case 'hardware': return 'Hardware Token';
      default: return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Authentification Avancée AES</span>
          </DialogTitle>
          <DialogDescription>
            Signature électronique avancée conforme eIDAS
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'init' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Initialisation de l'authentification avancée...</p>
            </div>
          </div>
        )}

        {currentStep === 'auth' && authSession && (
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
              {authSession.requirements.map((req: AuthRequirement) => (
                <Card key={req.id} className={req.isCompleted ? 'border-green-200 bg-green-50' : ''}>
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
                        <Button
                          onClick={() => handleMethodValidation(req.type)}
                          disabled={isLoading || !validationCodes[req.type]}
                          className="w-full"
                        >
                          Valider {getMethodName(req.type)}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'completed' && complianceReport && (
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
                <CardTitle className="text-sm">Rapport de Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau eIDAS:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {complianceReport.level}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valeur légale:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {complianceReport.compliance.legalValue}
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
          {currentStep === 'auth' && (
            <>
              <Button variant="outline" onClick={onCancel}>
                Annuler
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