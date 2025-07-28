"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ZKAuth, ZKSessionManager } from "@/lib/zk-auth";

interface AddZKAuthFormProps {
  hasZKAuth: boolean;
}

export default function AddZKAuthForm({ hasZKAuth }: AddZKAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"identity" | "proof">("identity");
  const [identity, setIdentity] = useState<any>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreateIdentity = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const newIdentity = await ZKAuth.generateIdentity();
      setIdentity(newIdentity);
      ZKSessionManager.saveIdentity(newIdentity);
      setStep("proof");
    } catch (err) {
      setMessage({ type: "error", text: "Erreur lors de la création de l'identité ZK" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadIdentity = () => {
    const savedIdentity = ZKSessionManager.getIdentity();
    if (savedIdentity) {
      setIdentity(savedIdentity);
      setStep("proof");
    } else {
      setMessage({ type: "error", text: "Aucune identité ZK trouvée" });
    }
  };

  const handleGenerateProof = async () => {
    if (!identity) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Générer un challenge depuis le serveur
      const response = await fetch("/api/auth/zk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_challenge" }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du challenge");
      }

      const { challenge: serverChallenge } = await response.json();
      setChallenge(serverChallenge);

      // Générer la preuve ZK
      const proof = await ZKAuth.generateProof(identity, serverChallenge);

      // Ajouter l'authentification ZK au profil
      const addZKResponse = await fetch("/api/user/add-zk-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitment: identity.commitment,
        }),
      });

      if (!addZKResponse.ok) {
        const errorData = await addZKResponse.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout de l'authentification ZK");
      }

      const { user } = await addZKResponse.json();
      setMessage({ type: "success", text: "Authentification ZK activée avec succès !" });
      
      // Recharger la page pour mettre à jour les informations
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'activation de l'authentification ZK";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasZKAuth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentification ZK
          </CardTitle>
          <CardDescription>
            Votre compte dispose déjà d'une authentification ZK
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Authentification ZK active</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Vous pouvez vous connecter avec votre identité ZK ou votre email/mot de passe.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === "identity") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ajouter une Authentification ZK
          </CardTitle>
          <CardDescription>
            Ajoutez une authentification ZK à votre compte pour une double sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-4">
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
            <Key className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Authentification par email active</p>
              <p>Vous pourrez continuer à utiliser l'authentification par email en plus de ZK</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleCreateIdentity}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Key className="mr-2 h-4 w-4" />
              )}
              Créer une nouvelle identité ZK
            </Button>

            <Button
              onClick={handleLoadIdentity}
              variant="outline"
              className="w-full"
            >
              Charger une identité existante
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Avantages de l'authentification ZK :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Aucun mot de passe stocké sur le serveur</li>
              <li>• Identité cryptographiquement sécurisée</li>
              <li>• Protection contre les attaques par force brute</li>
              <li>• Double authentification : Email + ZK</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Identité ZK Active
        </CardTitle>
        <CardDescription>
          Votre identité ZK est prête pour l'activation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-4">
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {identity && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Commitment:</p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {identity.commitment.substring(0, 32)}...
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleGenerateProof}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Activer l'authentification ZK
          </Button>

          <Button
            onClick={() => setStep("identity")}
            variant="ghost"
            className="w-full"
          >
            Retour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 