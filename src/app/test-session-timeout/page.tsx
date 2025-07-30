"use client";

import { useSession } from "next-auth/react";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import SessionIndicator from "@/components/ui/SessionIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";

export default function TestSessionTimeoutPage() {
  const { data: session, status } = useSession();
  const { showWarning, timeLeft, extendSession, resetActivityTimer } = useSessionTimeout({
    warningTime: 10, // 10 secondes pour le test
    logoutTime: 30, // 30 secondes pour le test
    checkInterval: 1000,
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
            <CardTitle>Session Timeout Test</CardTitle>
            <CardDescription>
              Vous devez être connecté pour tester le session timeout
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
            Test Session Timeout
          </h1>
          <p className="text-gray-600">
            Cette page permet de tester le système de session timeout.
            <br />
            <strong>Configuration de test :</strong> Avertissement à 10s, déconnexion à 30s
          </p>
        </div>

        {/* Header avec indicateur de session */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Session Status</h2>
              <p className="text-sm text-gray-600">
                Connecté en tant que {session?.user?.email}
              </p>
            </div>
            <SessionIndicator />
          </div>
        </div>

        {/* Cartes d'information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timer d'activité
              </CardTitle>
              <CardDescription>
                Le timer se réinitialise à chaque interaction utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={resetActivityTimer} variant="outline">
                Réinitialiser le timer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                État de l'avertissement
              </CardTitle>
              <CardDescription>
                Affiche si l'avertissement de session est actif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                showWarning 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {showWarning ? "⚠️ Avertissement actif" : "✅ Session normale"}
              </div>
              {showWarning && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Temps restant :</p>
                  <div className="text-2xl font-bold text-red-600">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions de test */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de test</CardTitle>
            <CardDescription>
              Comment tester le session timeout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Attendre l'avertissement</h3>
                  <p className="text-sm text-gray-600">
                    Ne touchez pas à la souris ou au clavier pendant 10 secondes pour voir l'avertissement apparaître.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Tester l'extension</h3>
                  <p className="text-sm text-gray-600">
                    Cliquez sur "Rester connecté" dans la modal pour étendre votre session.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Test de déconnexion</h3>
                  <p className="text-sm text-gray-600">
                    Attendez 30 secondes sans activité pour voir la déconnexion automatique.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <Button onClick={extendSession} disabled={!showWarning}>
            Étendre la session manuellement
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/dashboard"}
          >
            Retour au dashboard
          </Button>
        </div>
      </div>
    </div>
  );
} 