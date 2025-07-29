"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SignatureTypeSelector, { SignatureType } from "./SignatureTypeSelector";
import SignatureDialog from "./SignatureDialog";
import SESSignatureButton from "./SESSignatureButton";
import { SESSignature } from "@/types/signature";
import { Shield, PenTool } from "lucide-react";

interface UniversalSignatureButtonProps {
  signatoryName: string;
  signatoryId: string;
  documentId: string;
  onSignatureComplete: (signatureData: string | SESSignature, type: SignatureType) => void;
  className?: string;
}

const UniversalSignatureButton: React.FC<UniversalSignatureButtonProps> = ({
  signatoryName,
  signatoryId,
  documentId,
  onSignatureComplete,
  className,
}) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedType, setSelectedType] = useState<SignatureType | null>(null);
  const [showSimpleSignature, setShowSimpleSignature] = useState(false);

  const handleSelectType = (type: SignatureType) => {
    setSelectedType(type);
    
    if (type === 'simple') {
      setShowSimpleSignature(true);
    }
    // Pour SES, AES, QES, on utilise les composants spécifiques
  };

  const handleSimpleSignatureComplete = (signatureData: string) => {
    onSignatureComplete(signatureData, 'simple');
    setShowSimpleSignature(false);
    setSelectedType(null);
  };

  const handleSESSignatureComplete = (signature: SESSignature) => {
    onSignatureComplete(signature, 'ses');
    setSelectedType(null);
  };

  const handleAESSignatureComplete = (signature: string) => {
    onSignatureComplete(signature, 'aes');
    setSelectedType(null);
  };

  const handleQESSignatureComplete = (signature: string) => {
    onSignatureComplete(signature, 'qes');
    setSelectedType(null);
  };

  const getButtonIcon = () => {
    switch (selectedType) {
      case 'ses':
        return <Shield className="h-4 w-4" />;
      case 'aes':
        return <Shield className="h-4 w-4" />;
      case 'qes':
        return <Shield className="h-4 w-4" />;
      default:
        return <PenTool className="h-4 w-4" />;
    }
  };

  const getButtonText = () => {
    switch (selectedType) {
      case 'simple':
        return 'Sign Simple';
      case 'ses':
        return 'Sign with SES';
      case 'aes':
        return 'Sign with AES';
      case 'qes':
        return 'Sign with QES';
      default:
        return 'Sign Document';
    }
  };

  return (
    <>
      {/* Bouton principal */}
      <Button
        onClick={() => setShowTypeSelector(true)}
        className={`flex items-center gap-2 ${className}`}
        variant="default"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {/* Sélecteur de type de signature */}
      <SignatureTypeSelector
        open={showTypeSelector}
        onOpenChange={setShowTypeSelector}
        onSelectType={handleSelectType}
        signatoryName={signatoryName}
      />

      {/* Signature simple (ancien système) */}
      <SignatureDialog
        open={showSimpleSignature}
        onOpenChange={setShowSimpleSignature}
        onConfirm={handleSimpleSignatureComplete}
        signatoryName={signatoryName}
      />

      {/* Signature SES */}
      {selectedType === 'ses' && (
        <SESSignatureButton
          signatoryName={signatoryName}
          signatoryId={signatoryId}
          documentId={documentId}
          onSignatureComplete={handleSESSignatureComplete}
          className="hidden" // Caché car géré par le bouton principal
        />
      )}

      {/* Signature AES (à implémenter) */}
      {selectedType === 'aes' && (
        <div className="hidden">
          {/* TODO: Implémenter AES */}
          <Button onClick={() => handleAESSignatureComplete("aes-signature-placeholder")}>
            AES Signature (Coming Soon)
          </Button>
        </div>
      )}

      {/* Signature QES (à implémenter) */}
      {selectedType === 'qes' && (
        <div className="hidden">
          {/* TODO: Implémenter QES */}
          <Button onClick={() => handleQESSignatureComplete("qes-signature-placeholder")}>
            QES Signature (Coming Soon)
          </Button>
        </div>
      )}
    </>
  );
};

export default UniversalSignatureButton; 