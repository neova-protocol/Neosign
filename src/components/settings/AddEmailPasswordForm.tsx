"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";

interface AddEmailPasswordFormProps {
  hasEmailPassword: boolean;
  currentEmail?: string;
}

export default function AddEmailPasswordForm({ hasEmailPassword, currentEmail }: AddEmailPasswordFormProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/add-email-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Recharger la page pour mettre à jour les informations
        window.location.reload();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'ajout" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasEmailPassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Authentification par Email
          </CardTitle>
          <CardDescription>
            Votre compte dispose déjà d'une authentification par email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Email et mot de passe configurés</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Vous pouvez vous connecter avec votre email et mot de passe, ou continuer à utiliser l'authentification ZK.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Ajouter une Authentification par Email
        </CardTitle>
        <CardDescription>
          Ajoutez un email et un mot de passe pour une double authentification
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
          <Shield className="h-4 w-4 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Authentification ZK active</p>
            <p>Vous pourrez continuer à utiliser l'authentification ZK en plus de l'email</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Ajouter l'authentification par email
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Avantages de l'authentification par email :</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Connexion plus rapide avec email/mot de passe</li>
            <li>• Récupération de compte en cas de perte de l'identité ZK</li>
            <li>• Compatibilité avec tous les navigateurs</li>
            <li>• Double authentification : ZK + Email</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 