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
  Shield, 
  Smartphone, 
  Mail, 
  Key, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";

interface TwoFactorVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: string, code: string) => void;
  method: 'sms' | 'email' | 'authenticator';
  phoneNumber?: string;
  email?: string;
  isLoading?: boolean;
}

const TwoFactorVerificationDialog: React.FC<TwoFactorVerificationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  method,
  phoneNumber,
  email,
  isLoading = false
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Veuillez entrer le code de vérification");
      return;
    }
    setError("");
    onConfirm(method, code.trim());
  };

  const getMethodInfo = () => {
    switch (method) {
      case 'sms':
        return {
          icon: <Smartphone className="h-5 w-5 text-blue-600" />,
          title: "Vérification par SMS",
          description: `Entrez le code envoyé à ${phoneNumber}`,
          placeholder: "123456"
        };
      case 'email':
        return {
          icon: <Mail className="h-5 w-5 text-green-600" />,
          title: "Vérification par Email",
          description: `Entrez le code envoyé à ${email}`,
          placeholder: "123456"
        };
      case 'authenticator':
        return {
          icon: <Key className="h-5 w-5 text-purple-600" />,
          title: "Vérification par Authenticator",
          description: "Entrez le code généré par votre application d'authentification",
          placeholder: "123456"
        };
    }
  };

  const methodInfo = getMethodInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {methodInfo.icon}
            {methodInfo.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">
              {methodInfo.description}
            </Label>
            <Input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={methodInfo.placeholder}
              className="text-center font-mono text-lg tracking-widest"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Code à 6 chiffres requis</span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Vérifier
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorVerificationDialog; 