"use client";
import React, { useState } from "react";
import { useSignature } from "@/contexts/SignatureContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Send, UserPlus, Users, Shield, PenTool, Info, ShieldCheck, ShieldEllipsis } from "lucide-react";
import { sendDocumentForSignature } from "@/lib/api";

import { SignatureType } from "./SignatureTypeSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SignatoryPanelProps {
  selectedSignatoryId: string | null;
  onSelectSignatory: (signatoryId: string | null) => void;
  selectedFieldType?: "signature" | "paraphe";
  onFieldTypeChange: (fieldType: "signature" | "paraphe") => void;
}

const SignatoryPanel: React.FC<SignatoryPanelProps> = ({
  selectedSignatoryId,
  onSelectSignatory,
  selectedFieldType,
  onFieldTypeChange,
}: SignatoryPanelProps) => {
  const {
    currentDocument,
    addSignatory,
    removeSignatory,
    setCurrentDocument,
  } = useSignature();
  const { data: session } = useSession();
  const router = useRouter();


  const [newSignatoryName, setNewSignatoryName] = useState("");
  const [newSignatoryEmail, setNewSignatoryEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedSignatureType, setSelectedSignatureType] = useState<SignatureType>('simple');

  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const currentUser = session?.user;
  
  // État local de fallback pour selectedFieldType
  const [localFieldType, setLocalFieldType] = useState<"signature" | "paraphe">("signature");
  
  // Utiliser la prop si disponible, sinon l'état local
  const currentFieldType = selectedFieldType || localFieldType;
  
  // Fonction locale pour gérer le changement de type de champ
  const handleFieldTypeChange = (fieldType: "signature" | "paraphe") => {
    console.log("🔄 SignatoryPanel handleFieldTypeChange called with:", fieldType);
    setLocalFieldType(fieldType);
    if (typeof onFieldTypeChange === 'function') {
      onFieldTypeChange(fieldType);
    } else {
      console.error("❌ onFieldTypeChange is not a function:", onFieldTypeChange);
    }
  };
  
  console.log("🔍 SignatoryPanel - selectedFieldType prop:", selectedFieldType);
  console.log("🔍 SignatoryPanel - localFieldType:", localFieldType);
  console.log("🔍 SignatoryPanel - currentFieldType:", currentFieldType);
  console.log("🔍 SignatoryPanel - onFieldTypeChange exists:", !!onFieldTypeChange);
  console.log("🔍 SignatoryPanel - onFieldTypeChange type:", typeof onFieldTypeChange);
  console.log("🔍 SignatoryPanel - onFieldTypeChange is function:", typeof onFieldTypeChange === 'function');
  console.log("🔍 SignatoryPanel - onFieldTypeChange value:", onFieldTypeChange);
  


  const handleAddSignatory = async () => {
    if (!newSignatoryName.trim() || !newSignatoryEmail.trim()) {
      alert("Please fill in both name and email");
      return;
    }

    setIsAdding(true);
    try {
      // Créer un objet signatory complet
      const signatoryData = {
        name: newSignatoryName.trim(),
        email: newSignatoryEmail.trim(),
        role: "Signatory",
        color: "#FF5733", // Couleur par défaut
        documentId: currentDocument!.id,
        token: "",
      };

      const newSignatory = await addSignatory(signatoryData);

      if (newSignatory) {
        setNewSignatoryName("");
        setNewSignatoryEmail("");
        onSelectSignatory(newSignatory.id);
      }
    } catch (error) {
      console.error("Failed to add signatory:", error);
      alert("Failed to add signatory");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddMyself = async () => {
    if (!currentUser) return;

    setIsAdding(true);
    try {
      // Créer un objet signatory complet
      const signatoryData = {
        name: currentUser.name || "Myself",
        email: currentUser.email || "",
        role: "Signatory",
        color: "#33FF57", // Couleur par défaut
        documentId: currentDocument!.id,
        token: "",
      };

      const newSignatory = await addSignatory(signatoryData);

      if (newSignatory) {
        onSelectSignatory(newSignatory.id);
      }
    } catch (error) {
      console.error("Failed to add myself:", error);
      alert("Failed to add yourself as signatory");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSignatory = (signatoryId: string) => {
    removeSignatory(signatoryId);
    if (selectedSignatoryId === signatoryId) {
      onSelectSignatory(null);
    }
  };

  const handleSend = async () => {
    if (!currentDocument || currentDocument.signatories.length === 0) {
      alert("Please add at least one signatory");
      return;
    }

    setIsSending(true);
    try {
      console.log("Sending document for signature...");
      console.log("Document:", currentDocument);
      console.log("Signatories:", currentDocument.signatories);
      console.log("Fields:", currentDocument.fields);
      
      // Appeler la vraie API d'envoi
      const updatedDocument = await sendDocumentForSignature(currentDocument.id, selectedSignatureType);
      
      if (updatedDocument) {
        // Mettre à jour le document dans le contexte
        setCurrentDocument(updatedDocument);
        setShowSuccessDialog(true);
        console.log("✅ Document sent successfully:", updatedDocument);
      } else {
        throw new Error("Failed to send document");
      }
      
    } catch (error) {
      console.error("Failed to send document:", error);
      alert("Failed to send document");
    } finally {
      setIsSending(false);
    }
  };

  const getSignatureTypeLabel = (type: SignatureType) => {
    switch (type) {
      case 'simple':
        return 'Signature Simple';
      case 'ses':
        return 'SES - Simple Electronic Signature';
      case 'aes':
        return 'AES - Advanced Electronic Signature';
      case 'qes':
        return 'QES - Qualified Electronic Signature';
      default:
        return 'Signature Simple';
    }
  };

  const isCurrentUserSignatory = currentDocument?.signatories.some(
    (s) => s.email === currentUser?.email
  );

  if (!currentDocument) {
    return <div>No document selected</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Type de Signature</h2>
        <button
          onClick={() => setShowInfoDialog(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium">Niveau de signature</Label>
        <RadioGroup
          value={selectedSignatureType}
          onValueChange={(value) => setSelectedSignatureType(value as SignatureType)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simple" id="simple" />
            <Label htmlFor="simple" className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-gray-600" />
              Signature Simple
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ses" id="ses" />
            <Label htmlFor="ses" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              SES - Simple Electronic Signature
            </Label>
          </div>
 
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="aes" id="aes" />
            <Label htmlFor="aes" className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-yellow-500" />
              AES - Advanced Electronic Signature
            </Label>
          </div>
 
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qes" id="qes" />
            <Label htmlFor="qes" className="flex items-center gap-2">
              <ShieldEllipsis className="h-5 w-5 text-green-600" />
              QES - Qualified Electronic Signature
            </Label>
          </div>
 
        </RadioGroup>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Signatories</h2>
      </div>

      {/* Type de champ pour le signataire sélectionné */}
      {selectedSignatoryId && (
        <div className="mb-4 p-3 border rounded-lg bg-blue-50">
          <Label className="text-sm font-medium mb-2 block">
            Type de champ pour ce signataire
          </Label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log("🔄 Switching to signature");
                handleFieldTypeChange("signature");
                console.log("🔄 Calling onFieldTypeChange with signature");
              }}
              className={`flex-1 px-3 py-2 rounded border text-sm ${
                currentFieldType === "signature"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Signature
            </button>
            <button
              onClick={() => {
                console.log("🔄 Switching to paraphe");
                handleFieldTypeChange("paraphe");
                console.log("🔄 Calling onFieldTypeChange with paraphe");
              }}
              className={`flex-1 px-3 py-2 rounded border text-sm ${
                currentFieldType === "paraphe"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Paraphe
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {currentFieldType === "signature" 
              ? "Champ de signature avec validation" 
              : "Champ de paraphe auto-rempli"
            }
          </p>
        </div>
      )}

      <div className="space-y-4 flex-1">
        {/* Add signatory buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleAddMyself}
            disabled={isAdding || isCurrentUserSignatory}
            className="w-full"
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Myself
          </Button>
          <Button className="w-full" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Add from Contacts
          </Button>
        </div>

        {/* Add new signatory form */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={newSignatoryName}
            onChange={(e) => setNewSignatoryName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={newSignatoryEmail}
            onChange={(e) => setNewSignatoryEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <Button
          onClick={handleAddSignatory}
          disabled={isAdding || !newSignatoryName.trim() || !newSignatoryEmail.trim()}
          className="w-full"
        >
          {isAdding ? "Adding..." : "Add Signatory"}
        </Button>

        {/* Signatories list */}
        <div className="space-y-2">
          {currentDocument.signatories.map((signatory) => (
            <div
              key={signatory.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedSignatoryId === signatory.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onSelectSignatory(signatory.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{signatory.name}</p>
                  <p className="text-sm text-gray-600">{signatory.email}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSignatory(signatory.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send button */}
      <div className="mt-6">
        <Button
          onClick={handleSend}
          disabled={isSending || currentDocument.signatories.length === 0}
          className="w-full"
        >
          {isSending ? (
            <>
              <Send className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send for {getSignatureTypeLabel(selectedSignatureType)}
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Type sélectionné: {getSignatureTypeLabel(selectedSignatureType)}
        </p>
      </div>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signature Types Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Signature Simple</h3>
              <p className="text-sm text-gray-600">
                Basic signature for internal documents and drafts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">SES - Simple Electronic Signature</h3>
              <p className="text-sm text-gray-600">
                Standard electronic signature with email/SMS validation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">AES - Advanced Electronic Signature</h3>
              <p className="text-sm text-gray-600">
                Advanced signature with qualified certificates and strong authentication.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">QES - Qualified Electronic Signature</h3>
              <p className="text-sm text-gray-600">
                Highest level signature equivalent to handwritten signature.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Sent Successfully!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Your document has been sent for signature. You can now close this panel.
          </p>
          <Button onClick={() => {
            setShowSuccessDialog(false);
            router.push('/dashboard');
          }} className="w-full mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatoryPanel;
