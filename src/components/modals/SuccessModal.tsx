"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-lg mt-2 mb-6">
          {message}
        </DialogDescription>
        <div className="flex justify-center">
          <Button onClick={onClose} className="w-full max-w-xs">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
