"use client";

import React from "react";
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
  Download
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-purple-600" />
            Configurer l'Authenticator
          </DialogTitle>
        </DialogHeader>

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
                  <li>Cliquez sur "Confirmer" pour activer</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Confirmer l'activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog; 