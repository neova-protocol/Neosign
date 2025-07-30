"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Edit3 } from "lucide-react";

interface EditEmailFormProps {
  currentEmail: string;
  onEmailChanged?: (newEmail: string) => void;
}

export default function EditEmailForm({ currentEmail, onEmailChanged }: EditEmailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewEmail("");
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewEmail("");
    setMessage(null);
  };

  const handleSendCode = async () => {
    if (!newEmail || newEmail === currentEmail) {
      setMessage({ type: 'error', text: 'Veuillez saisir un nouvel email différent.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/email/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail })
      });

      if (response.ok) {
        setShowVerificationDialog(true);
        setMessage({ type: 'success', text: 'Code de vérification envoyé à votre nouvelle adresse email.' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Erreur lors de l&apos;envoi du code.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessage({ type: 'error', text: 'Veuillez saisir le code de vérification.' });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/email/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: verificationCode,
          newEmail: newEmail
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Email modifié avec succès !' });
        setShowVerificationDialog(false);
        setIsEditing(false);
        setNewEmail("");
        setVerificationCode("");
        
        // Appeler le callback si fourni
        if (onEmailChanged) {
          onEmailChanged(data.newEmail);
        }
        
        // Recharger la page après un délai
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Code de vérification incorrect.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion lors de la vérification.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email
      </Label>
      
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            id="email"
            type="email"
            value={currentEmail}
            disabled
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="nouveau@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </div>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <Button
            onClick={handleSendCode}
            disabled={isLoading || !newEmail || newEmail === currentEmail}
            className="w-full"
          >
            {isLoading ? "Envoi..." : "Envoyer le code de vérification"}
          </Button>
        </div>
      )}

      {/* Dialog de vérification */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Vérification du changement d&apos;email
            </DialogTitle>
            <DialogDescription>
              Saisissez le code de vérification envoyé à {newEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center font-mono text-lg"
              />
            </div>
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleVerifyCode}
              disabled={isVerifying || !verificationCode}
            >
              {isVerifying ? "Vérification..." : "Confirmer le changement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 