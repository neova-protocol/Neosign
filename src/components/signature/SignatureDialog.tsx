"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SignaturePad from './SignaturePad';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signatureDataUrl: string) => void;
  signatoryName: string;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  signatoryName,
}) => {
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleConfirm = () => {
    if (signatureData) {
      onConfirm(signatureData);
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    setSignatureData(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign as {signatoryName}</DialogTitle>
        </DialogHeader>
        <SignaturePad
          onEnd={(data) => setSignatureData(data)}
          onClear={handleClear}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!signatureData}>
            Confirm Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog; 