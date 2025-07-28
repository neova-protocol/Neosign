"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ZKLoginForm from "@/components/auth/ZKLoginForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ZKLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const handleZKSuccess = async (user: any) => {
    try {
      console.log("Tentative de connexion avec NextAuth pour l'utilisateur:", user);
      
      // Créer une session NextAuth avec les données ZK
      const result = await signIn("zk-credentials", {
        redirect: false,
        zkUser: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          commitment: user.commitment || user.zkCommitment, // S'assurer que le commitment est inclus
        }),
      });

      console.log("Résultat de signIn:", result);

      if (result?.error) {
        console.error("Erreur NextAuth:", result.error);
        setError("Erreur lors de la connexion: " + result.error);
      } else {
        console.log("Connexion réussie, redirection vers le dashboard");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setError("Erreur lors de la connexion");
    }
  };

  const handleZKError = (error: string) => {
    setError(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion classique
          </Link>

          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentification ZK
          </h1>
          <p className="text-gray-600">
            Connectez-vous de manière sécurisée avec Zero Knowledge
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Sécurité Avancée</CardTitle>
            <CardDescription>
              Votre identité reste privée grâce à la cryptographie Zero
              Knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <ZKLoginForm onSuccess={handleZKSuccess} onError={handleZKError} />

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Avantages de l'authentification ZK
                </h3>
                <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-green-500" />
                    <span>Aucun mot de passe stocké</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    <span>Identité cryptographiquement sécurisée</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-green-500" />
                    <span>Protection contre les attaques par force brute</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
