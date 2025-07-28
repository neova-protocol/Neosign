"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Key } from "lucide-react";
import { ZKAuth, ZKSessionManager } from "@/lib/zk-auth";

interface ZKLoginFormProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

export default function ZKLoginForm({ onSuccess, onError }: ZKLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"identity" | "proof">("identity");
  const [identity, setIdentity] = useState<any>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreateIdentity = async () => {
    setIsLoading(true);
    setError("");

    try {
      const newIdentity = await ZKAuth.generateIdentity();
      setIdentity(newIdentity);
      ZKSessionManager.saveIdentity(newIdentity);
      setStep("proof");
    } catch (err) {
      setError("Erreur lors de la création de l'identité ZK");
      onError("Erreur lors de la création de l'identité ZK");
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
      setError("Aucune identité ZK trouvée");
    }
  };

  const handleGenerateProof = async () => {
    if (!identity) return;

    setIsLoading(true);
    setError("");

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

      // Vérifier la preuve avec le serveur
      const verifyResponse = await fetch("/api/auth/zk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_proof",
          data: {
            commitment: identity.commitment,
            proof: proof.proof,
            challenge: serverChallenge,
          },
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Échec de la vérification");
      }

      const { user } = await verifyResponse.json();
      ZKSessionManager.saveSession(proof);
      onSuccess(user);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'authentification ZK";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!identity) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/zk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          data: {
            name: "Utilisateur ZK",
            email: `zk-${Date.now()}@example.com`,
            commitment: identity.commitment,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'enregistrement");
      }

      const { user } = await response.json();
      onSuccess(user);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement ZK";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "identity") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Authentification ZK
          </CardTitle>
          <CardDescription>
            Connectez-vous de manière sécurisée avec Zero Knowledge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Identité ZK Active</CardTitle>
        <CardDescription>
          Votre identité ZK est prête pour l'authentification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {identity && (
          <div className="p-4 bg-gray-50 rounded-lg">
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
            S'authentifier avec ZK
          </Button>

          <Button onClick={handleRegister} variant="outline" className="w-full">
            S'enregistrer avec cette identité
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
