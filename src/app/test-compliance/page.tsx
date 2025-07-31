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
  FileText,
  Lock,
  Clock,
  User,
  Smartphone,
  Mail,
  Key
} from "lucide-react";

interface ComplianceReport {
  success: boolean;
  signatureType: string;
  compliance: {
    eIDASLevel: string;
    legalValue: string;
    requirements: string[];
    validationSteps: string[];
  };
  eIDASLevel: string;
  legalValue: string;
  isCompliant: boolean;
}

interface EIDASRequirements {
  SES: {
    level: string;
    requirements: string[];
    legalValue: string;
    recognition: string;
  };
  AES: {
    level: string;
    requirements: string[];
    legalValue: string;
    recognition: string;
  };
  QES: {
    level: string;
    requirements: string[];
    legalValue: string;
    recognition: string;
  };
}

export default function TestCompliancePage() {
  const { data: session, status } = useSession();
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [eidasRequirements, setEidasRequirements] = useState<EIDASRequirements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (status === "authenticated") {
      loadEIDASRequirements();
    }
  }, [status]);

  const loadEIDASRequirements = async () => {
    try {
      const response = await fetch('/api/signature/compliance');
      if (response.ok) {
        const data = await response.json();
        setEidasRequirements(data.eIDASRequirements);
      }
    } catch (error) {
      console.error('Error loading EIDAS requirements:', error);
    }
  };

  const testSESCompliance = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signature/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType: 'ses',
          signatureId: 'test-ses-signature'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceReport(data);
      } else {
        setError('Erreur lors du test de compliance SES');
      }
    } catch (error) {
      setError('Erreur lors du test de compliance SES');
      console.error('SES compliance test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testAESCompliance = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signature/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureType: 'aes',
          signatureId: 'test-aes-signature'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceReport(data);
      } else {
        setError('Erreur lors du test de compliance AES');
      }
    } catch (error) {
      setError('Erreur lors du test de compliance AES');
      console.error('AES compliance test error:', error);
    } finally {
      setIsLoading(false);
    }
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
            <CardTitle>Test de Compliance eIDAS</CardTitle>
            <CardDescription>
              Vous devez être connecté pour tester la compliance
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test de Compliance eIDAS
          </h1>
          <p className="text-gray-600">
            Vérifiez la conformité de vos signatures aux standards eIDAS
          </p>
        </div>

        {/* Exigences eIDAS */}
        {eidasRequirements && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>SES</span>
                </CardTitle>
                <CardDescription>
                  Simple Electronic Signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Basic
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valeur légale:</span>
                    <span className="text-sm text-gray-600">
                      {eidasRequirements.SES.recognition}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Exigences:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {eidasRequirements.SES.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>AES</span>
                </CardTitle>
                <CardDescription>
                  Advanced Electronic Signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Advanced
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valeur légale:</span>
                    <span className="text-sm text-gray-600">
                      {eidasRequirements.AES.recognition}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Exigences:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {eidasRequirements.AES.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>QES</span>
                </CardTitle>
                <CardDescription>
                  Qualified Electronic Signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau:</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Qualified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Valeur légale:</span>
                    <span className="text-sm text-gray-600">
                      {eidasRequirements.QES.recognition}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Exigences:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {eidasRequirements.QES.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tests de Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Test SES</span>
              </CardTitle>
              <CardDescription>
                Test de compliance pour signature simple
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testSESCompliance}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Test en cours...' : 'Tester SES'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>Test AES</span>
              </CardTitle>
              <CardDescription>
                Test de compliance pour signature avancée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testAESCompliance}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Test en cours...' : 'Tester AES'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Rapport de Compliance */}
        {complianceReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {complianceReport.isCompliant ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Rapport de Compliance {complianceReport.signatureType}</span>
              </CardTitle>
              <CardDescription>
                Résultats du test de compliance eIDAS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Niveau eIDAS:</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 ${
                        complianceReport.eIDASLevel === 'AES' 
                          ? 'bg-blue-100 text-blue-800'
                          : complianceReport.eIDASLevel === 'SES'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {complianceReport.eIDASLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Valeur légale:</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 ${
                        complianceReport.legalValue === 'Advanced'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {complianceReport.legalValue}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Validations réussies:</h4>
                  <ul className="space-y-1">
                    {complianceReport.compliance.validationSteps.map((step, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {complianceReport.compliance.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Exigences manquantes:</h4>
                    <ul className="space-y-1">
                      {complianceReport.compliance.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 