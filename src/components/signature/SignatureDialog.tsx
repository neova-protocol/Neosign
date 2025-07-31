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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Type,
  Star
} from "lucide-react";
import SignaturePad from "./SignaturePad";
import ParapheSelector from "./ParapheSelector";
import { Paraphe } from "@/types/paraphe";

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
  const [activeTab, setActiveTab] = useState("manual");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(null);

  const handleConfirm = () => {
    if (activeTab === "manual" && signatureData) {
      onConfirm(signatureData);
      onOpenChange(false);
    } else if (activeTab === "paraphe" && selectedParaphe) {
      // Use the paraphe content as signature
      onConfirm(selectedParaphe.content);
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    setSignatureData(null);
  };

  const handleParapheSelect = (paraphe: Paraphe) => {
    setSelectedParaphe(paraphe);
  };

  const isConfirmDisabled = () => {
    if (activeTab === "manual") {
      return !signatureData;
    } else if (activeTab === "paraphe") {
      return !selectedParaphe;
    }
    return true;
  };

  const getConfirmButtonText = () => {
    if (activeTab === "manual") {
      return "Confirmer la signature";
    } else if (activeTab === "paraphe") {
      return `Utiliser "${selectedParaphe?.name}"`;
    }
    return "Confirmer";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Signer en tant que {signatoryName}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Signature manuelle
            </TabsTrigger>
            <TabsTrigger value="paraphe" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Paraphe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Dessinez votre signature manuellement
            </div>
            <SignaturePad
              onEnd={(data) => setSignatureData(data)}
              onClear={handleClear}
            />
          </TabsContent>

          <TabsContent value="paraphe" className="space-y-4">
            <ParapheSelector
              onSelectParaphe={handleParapheSelect}
              onCancel={() => setActiveTab("manual")}
              signatoryName={signatoryName}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isConfirmDisabled()}
            className="flex items-center gap-2"
          >
            {activeTab === "paraphe" && selectedParaphe?.isDefault && (
              <Star className="w-4 h-4" />
            )}
            {getConfirmButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
