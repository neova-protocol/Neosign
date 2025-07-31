"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Type, 
  PenTool, 
  Upload,
  Star,
  Plus
} from "lucide-react";
import { Paraphe, CreateParapheRequest } from "@/types/paraphe";
import { ParapheService } from "@/services/paraphe/ParapheService";
import CreateParapheDialog from "@/components/paraphe/CreateParapheDialog";

interface ParapheSelectorProps {
  onSelectParaphe: (paraphe: Paraphe) => void;
  onCancel: () => void;
  signatoryName: string;
}

export default function ParapheSelector({
  onSelectParaphe,
  onCancel,
  signatoryName
}: ParapheSelectorProps) {
  const [paraphes, setParaphes] = useState<Paraphe[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(null);

  const parapheService = ParapheService.getInstance();

  useEffect(() => {
    loadParaphes();
  }, []);

  const loadParaphes = async () => {
    try {
      setLoading(true);
      const data = await parapheService.getUserParaphes();
      setParaphes(data);
    } catch {
      // Handle error silently for now
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParaphe = async (data: CreateParapheRequest) => {
    try {
      const newParaphe = await parapheService.createParaphe(data);
      if (newParaphe) {
        setParaphes(prev => [...prev, newParaphe]);
        setCreateDialogOpen(false);
        // Auto-select the newly created paraphe
        onSelectParaphe(newParaphe);
      }
    } catch {
      // Handle error silently for now
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'drawing':
        return <PenTool className="w-4 h-4" />;
      case 'upload':
        return <Upload className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Texte';
      case 'drawing':
        return 'Dessin';
      case 'upload':
        return 'Image';
      default:
        return 'Inconnu';
    }
  };

  const handleParapheSelect = (paraphe: Paraphe) => {
    setSelectedParaphe(paraphe);
    onSelectParaphe(paraphe);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des paraphes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sélectionner un paraphe</h2>
          <p className="text-sm text-muted-foreground">
            Choisissez un paraphe pour signer en tant que {signatoryName}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau paraphe
        </Button>
      </div>

      {paraphes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun paraphe</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier paraphe pour commencer
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un paraphe
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {paraphes.map((paraphe) => (
            <Card 
              key={paraphe.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedParaphe?.id === paraphe.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : ''
              }`}
              onClick={() => handleParapheSelect(paraphe)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {paraphe.name}
                      {paraphe.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Par défaut
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(paraphe.type)}
                      <span className="text-sm text-muted-foreground">
                        {getTypeLabel(paraphe.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {paraphe.type === 'text' && (
                  <div className="text-sm text-muted-foreground">
                    <p>Police: {paraphe.font || 'Par défaut'}</p>
                    <p>Taille: {paraphe.size || 'Par défaut'}</p>
                    <p>Couleur: {paraphe.color || 'Noir'}</p>
                  </div>
                )}
                {paraphe.type === 'drawing' && (
                  <div className="text-sm text-muted-foreground">
                    <p>Signature dessinée</p>
                  </div>
                )}
                {paraphe.type === 'upload' && (
                  <div className="text-sm text-muted-foreground">
                    <p>Image importée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        {selectedParaphe && (
          <Button onClick={() => onSelectParaphe(selectedParaphe)}>
            Utiliser ce paraphe
          </Button>
        )}
      </div>

      <CreateParapheDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onConfirm={handleCreateParaphe}
      />
    </div>
  );
} 