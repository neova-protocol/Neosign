"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import SESSignatureDialog from "./SESSignatureDialog";
import { SESSignature } from "@/types/signature";
import { Shield, Mail, Smartphone, Lock } from "lucide-react";

interface SESSignatureButtonProps {
  signatoryName: string;
  signatoryId: string;
  documentId: string;
  onSignatureComplete: (signature: SESSignature) => void;
  className?: string;
}

const SESSignatureButton: React.FC<SESSignatureButtonProps> = ({
  signatoryName,
  signatoryId,
  documentId,
  onSignatureComplete,
  className,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [validationMethod, setValidationMethod] = useState<'email' | 'sms' | 'password'>('email');
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleStartSignature = () => {
    // Validation selon la méthode choisie
    switch (validationMethod) {
      case 'email':
        if (!userEmail) {
          alert('Please enter your email address');
          return;
        }
        break;
      case 'sms':
        if (!userPhone) {
          alert('Please enter your phone number');
          return;
        }
        break;
      case 'password':
        if (!userPassword) {
          alert('Please enter your password');
          return;
        }
        break;
    }

    setShowOptions(false);
    setShowSignatureDialog(true);
  };

  const handleSignatureComplete = (signature: SESSignature) => {
    onSignatureComplete(signature);
    setShowSignatureDialog(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowOptions(true)}
        className={`flex items-center gap-2 ${className}`}
        variant="default"
      >
        <Shield className="h-4 w-4" />
        Sign with SES
      </Button>

      {/* Dialog des options de validation */}
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              SES Signature Options
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Choose your validation method for the Simple Electronic Signature (SES):</p>
            </div>

            <RadioGroup
              value={validationMethod}
              onValueChange={(value) => setValidationMethod(value as 'email' | 'sms' | 'password')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Email Validation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  SMS Validation
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="password" id="password" />
                <Label htmlFor="password" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="h-4 w-4" />
                  Password Validation
                </Label>
              </div>
            </RadioGroup>

            {/* Champs selon la méthode choisie */}
            {validationMethod === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email Address</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
            )}

            {validationMethod === 'sms' && (
              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone Number</Label>
                <Input
                  id="userPhone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </div>
            )}

            {validationMethod === 'password' && (
              <div className="space-y-2">
                <Label htmlFor="userPassword">Password</Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>This signature will be compliant with eIDAS SES standards.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowOptions(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartSignature}>
              Start Signature
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de signature SES */}
      <SESSignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onConfirm={handleSignatureComplete}
        signatoryName={signatoryName}
        signatoryId={signatoryId}
        documentId={documentId}
        validationMethod={validationMethod}
        userEmail={validationMethod === 'email' ? userEmail : undefined}
        userPhone={validationMethod === 'sms' ? userPhone : undefined}
      />
    </>
  );
};

export default SESSignatureButton; 