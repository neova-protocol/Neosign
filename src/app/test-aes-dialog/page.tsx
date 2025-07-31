"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle,
  User,
  AlertTriangle
} from "lucide-react";
import { AESSignatureDialog } from "@/components/signature/AESSignatureDialog";
import { useSession } from "next-auth/react";
import { SignatureCompliance } from "@/types/signature";

export default function TestAESDialogPage() {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState<{
    signatureData: string;
    compliance: SignatureCompliance;
    twoFactorMethod: string;
    validatedAt: string;
  } | null>(null);

  const signatoryName = session?.user?.name || "Test User";
  const signatoryId = session?.user?.id || "test-user";
  const documentId = "test-document";

  const handleConfirm = (signatureData: {
    signatureData: string;
    compliance: SignatureCompliance;
    twoFactorMethod: string;
    validatedAt: string;
  }) => {
    setResult(signatureData);
    setShowDialog(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Button asChild>
            <a href="/auth/signin">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Dialog AES
          </h1>
          <p className="text-gray-600">
            Testez le dialog AES avec différents scénarios de configuration 2FA
          </p>
        </div>

        {/* Informations Utilisateur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Informations Utilisateur</span>
            </CardTitle>
            <CardDescription>
              Configuration actuelle de l&apos;utilisateur
            </CardDescription>
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

        {/* Test Dialog AES */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Test Dialog AES</span>
            </CardTitle>
            <CardDescription>
              Lancez le dialog AES pour tester le comportement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Scénarios de Test</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Sans 2FA :</strong> Dialog d&apos;erreur avec lien vers settings</p>
                  <p>• <strong>Avec 1 méthode :</strong> Dialog d&apos;erreur (AES nécessite 2 méthodes)</p>
                  <p>• <strong>Avec 2+ méthodes :</strong> Flux normal d&apos;authentification</p>
                </div>
              </div>

              <Button 
                onClick={() => setShowDialog(true)}
                className="w-full"
                size="lg"
              >
                Lancer le Dialog AES
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Résultat du Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800">
                    Signature AES réussie !
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Méthode 2FA:</span>
                    <Badge variant="secondary">
                      {result.twoFactorMethod}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Validé le:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(result.validatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Niveau eIDAS:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {result.compliance.eIDASLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
            <CardDescription>
              Comment tester les différents scénarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Sans 2FA configuré</h3>
                  <p className="text-sm text-gray-600">
                    Si vous n&apos;avez pas configuré de 2FA, le dialog affichera une erreur 
                    avec un lien vers la page de configuration.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Avec 1 méthode 2FA</h3>
                  <p className="text-sm text-gray-600">
                    Si vous avez configuré seulement 1 méthode, le dialog affichera une erreur 
                    car AES nécessite au moins 2 méthodes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Avec 2+ méthodes 2FA</h3>
                  <p className="text-sm text-gray-600">
                    Si vous avez configuré 2 méthodes ou plus, le dialog fonctionnera normalement 
                    et vous pourrez signer en AES.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog AES */}
        <AESSignatureDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onConfirm={handleConfirm}
          signatoryName={signatoryName}
          signatoryId={signatoryId}
          documentId={documentId}
        />
      </div>
    </div>
  );
} 