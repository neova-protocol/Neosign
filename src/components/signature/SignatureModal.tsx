"use client";

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave }: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current) {
      // Get signature as a base64 encoded PNG
      const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(signature);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Please provide your signature</DialogTitle>
          <DialogDescription>
            Sign in the box below. This signature will be saved securely.
          </DialogDescription>
        </DialogHeader>
        <div className="border rounded-md">
          <SignatureCanvas
            ref={sigCanvas}
            penColor='black'
            canvasProps={{ 
              className: 'w-full h-[200px]',
              // @ts-ignore
              willreadfrequently: "true"
            }}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={clear}>Clear</Button>
          <Button type="submit" onClick={save}>Save Signature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 