"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, XCircle } from "lucide-react";

interface DeletionStatus {
  accountStatus: string;
  deletionRequestedAt: string;
  deletionScheduledAt: string;
  deletionReason: string;
  isPendingDeletion: boolean;
}

export default function AccountPendingDeletionPage() {
  const { data: session } = useSession();
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadDeletionStatus = async () => {
      try {
        const response = await fetch('/api/user/delete/status');
        if (response.ok) {
          const data = await response.json();
          setDeletionStatus(data);
        }
      } catch (error) {
        console.error('Error loading deletion status:', error);
      }
    };

    if (session?.user) {
      loadDeletionStatus();
    }
  }, [session?.user]);

  const handleCancelDeletion = async () => {
    setIsCancelling(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/delete/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Suppression annulée avec succès. Votre compte est maintenant actif.' });
        // Recharger la page après un délai
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de l\'annulation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsCancelling(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (!deletionStatus) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  const deletionDate = new Date(deletionStatus.deletionScheduledAt);
  const daysLeft = Math.ceil((deletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Compte en attente de suppression
          </CardTitle>
          <CardDescription>
            Votre compte a été marqué pour suppression
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="font-medium text-red-800 mb-2">⚠️ Attention</h4>
            <p className="text-sm text-red-700">
              Votre compte sera définitivement supprimé le {deletionDate.toLocaleDateString('fr-FR')} 
              ({daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}).
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Demande de suppression : {new Date(deletionStatus.deletionRequestedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">
                Suppression prévue : {deletionDate.toLocaleDateString('fr-FR')} à {deletionDate.toLocaleTimeString('fr-FR')}
              </span>
            </div>

            {deletionStatus.deletionReason && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm text-gray-700">
                  <strong>Raison :</strong> {deletionStatus.deletionReason}
                </p>
              </div>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancelDeletion}
              disabled={isCancelling}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isCancelling ? "Annulation..." : "Annuler la suppression"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Une fois supprimé, votre compte et toutes vos données seront définitivement perdus.</p>
            <p>Vous pouvez annuler la suppression à tout moment avant la date prévue.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 