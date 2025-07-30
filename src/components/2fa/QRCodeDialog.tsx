"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  QrCode, 
  Copy, 
  CheckCircle,
  Smartphone,
  Download,
  AlertCircle
} from "lucide-react";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeData: string;
  secret: string;
  userEmail: string;
  onConfirm: () => void;
}

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({
  open,
  onOpenChange,
  qrCodeData,
  secret,
  userEmail,
  onConfirm
}) => {
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
  };

  const handleDownloadQR = () => {
    // En production, générer le QR code côté client
    // Pour cette démo, on utilise un service externe
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'neosign-2fa-qr.png';
    link.click();
  };

  const handleStartVerification = () => {
    setVerificationStep(true);
    setError(null);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'authenticator',
          code: verificationCode
        })
      });

      if (response.ok) {
        onConfirm();
        onOpenChange(false);
        setVerificationStep(false);
        setVerificationCode("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Code incorrect");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setVerificationStep(false);
    setVerificationCode("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-purple-600" />
            {verificationStep ? "Vérifier l'Authenticator" : "Configurer l'Authenticator"}
          </DialogTitle>
        </DialogHeader>

        {!verificationStep ? (
          <>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Scannez ce QR code avec votre application d'authentification :</p>
                <ul className="mt-2 space-y-1">
                  <li>• Google Authenticator</li>
                  <li>• Authy</li>
                  <li>• Microsoft Authenticator</li>
                  <li>• Ou toute autre app TOTP</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`}
                    alt="QR Code pour 2FA"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Code secret (pour sauvegarde)</Label>
                <div className="flex gap-2">
                  <Input
                    value={secret}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadQR}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger QR
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Smartphone className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Instructions :</p>
                    <ol className="mt-1 space-y-1 list-decimal list-inside">
                      <li>Ouvrez votre app d'authentification</li>
                      <li>Scannez le QR code ou entrez le secret manuellement</li>
                      <li>Vérifiez que le code généré correspond</li>
                      <li>Cliquez sur "Vérifier" pour confirmer</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                onClick={handleStartVerification}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Vérifier l'activation
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Entrez le code à 6 chiffres généré par votre application d&apos;authentification :</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Code de vérification</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center font-mono text-lg tracking-widest"
                  maxLength={6}
                  disabled={isVerifying}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVerificationStep(false)}
                disabled={isVerifying}
              >
                Retour
              </Button>
              <Button
                onClick={handleVerifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isVerifying ? "Vérification..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog; 