"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paraphe } from "@/types/paraphe";
import { ParapheService } from "@/services/paraphe/ParapheService";
import ParapheRenderer from "./ParapheRenderer";

interface ParapheSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParapheSelect: (paraphe: Paraphe) => void;
  currentParaphe?: Paraphe | null;
}

export default function ParapheSelectionDialog({
  open,
  onOpenChange,
  onParapheSelect,
  currentParaphe,
}: ParapheSelectionDialogProps) {
  const [paraphes, setParaphes] = useState<Paraphe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(currentParaphe || null);
  
  const parapheService = ParapheService.getInstance();

  useEffect(() => {
    if (open) {
      loadParaphes();
    }
  }, [open]);

  const loadParaphes = async () => {
    try {
      setLoading(true);
      const userParaphes = await parapheService.getUserParaphes();
      setParaphes(userParaphes);
      
      // Sélectionner le paraphe par défaut si aucun n'est sélectionné
      if (!selectedParaphe) {
        const defaultParaphe = userParaphes.find(p => p.isDefault);
        if (defaultParaphe) {
          setSelectedParaphe(defaultParaphe);
        }
      }
    } catch (error) {
      console.error("Error loading paraphes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleParapheSelect = (paraphe: Paraphe) => {
    setSelectedParaphe(paraphe);
  };

  const handleApply = () => {
    if (selectedParaphe) {
      onParapheSelect(selectedParaphe);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner un paraphe</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Liste des paraphes disponibles */}
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {paraphes.map((paraphe) => (
                <div
                  key={paraphe.id}
                  onClick={() => handleParapheSelect(paraphe)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedParaphe?.id === paraphe.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{paraphe.name}</span>
                    {paraphe.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <ParapheRenderer paraphe={paraphe} width={80} height={40} />
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedParaphe}
                className="flex-1"
              >
                Appliquer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 