
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Smartphone } from 'lucide-react';

interface QESSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signatureData: { signatureData: string }) => void;
  signatoryName: string;
  documentId: string;
}

export const QESSignatureDialog: React.FC<QESSignatureDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  signatoryName,
  documentId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulation d'une interaction avec un fournisseur de services de confiance (QTSP)
    // et une validation sur un appareil mobile.
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // La signature QES est un processus complexe, ici nous simulons la réception
    // d'une preuve cryptographique.
    const mockSignatureData = `qes_signature_placeholder_for_${documentId}_by_${signatoryName}_at_${new Date().toISOString()}`;
    
    onConfirm({ signatureData: mockSignatureData });
    setIsLoading(false);
    setIsConfirmed(true);

    // Fermer le dialogue après un court instant
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            Signature Électronique Qualifiée (QES)
          </DialogTitle>
          <DialogDescription>
            Ceci est le plus haut niveau de sécurité, équivalent à une signature manuscrite.
            Une validation sur votre appareil de confiance est requise.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Connexion au service de confiance en cours...<br/>
                Veuillez valider sur votre appareil.
              </p>
            </div>
          ) : isConfirmed ? (
             <div className="flex flex-col items-center gap-4 text-green-600">
              <ShieldCheck className="h-12 w-12" />
              <p className="font-semibold">Signature Qualifiée Appliquée</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Smartphone className="h-12 w-12 text-primary" />
              <p className="font-semibold">Confirmez la signature sur votre appareil</p>
              <p className="text-sm text-muted-foreground">
                Une notification a été envoyée sur votre appareil enregistré pour compléter la signature du document.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || isConfirmed}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En attente de validation...
              </>
            ) : isConfirmed ? 'Confirmé' : 'Démarrer la signature'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 