"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Type, 
  PenTool, 
  Upload,
  Star,
  Check,
  X
} from "lucide-react";
import { Paraphe } from "@/types/paraphe";
import { ParapheService } from "@/services/paraphe/ParapheService";

interface ParapheFieldProps {
  onParapheSelect: (paraphe: Paraphe) => void;
  onCancel: () => void;
  signatoryName: string;
  className?: string;
}

export default function ParapheField({
  onParapheSelect,
  onCancel,
  signatoryName,
  className = ""
}: ParapheFieldProps) {
  const [paraphes, setParaphes] = useState<Paraphe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(null);
  const [showAllParaphes, setShowAllParaphes] = useState(false);

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
    onParapheSelect(paraphe);
  };

  const defaultParaphe = paraphes.find(p => p.isDefault);
  const otherParaphes = paraphes.filter(p => !p.isDefault);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (paraphes.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">
          Aucun paraphe disponible
        </p>
        <Button variant="outline" size="sm" onClick={onCancel} className="mt-2">
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-sm font-medium">
        Paraphe pour {signatoryName}
      </div>

      {/* Paraphe par défaut */}
      {defaultParaphe && (
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleParapheSelect(defaultParaphe)}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(defaultParaphe.type)}
                <span className="font-medium">{defaultParaphe.name}</span>
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Par défaut
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {getTypeLabel(defaultParaphe.type)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Autres paraphes */}
      {otherParaphes.length > 0 && (
        <>
          {!showAllParaphes && otherParaphes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllParaphes(true)}
              className="w-full"
            >
              Voir tous les paraphes ({otherParaphes.length})
            </Button>
          )}

          {showAllParaphes && (
            <div className="space-y-2">
              {otherParaphes.map((paraphe) => (
                <Card 
                  key={paraphe.id} 
                  className="cursor-pointer hover:shadow-md transition-all" 
                  onClick={() => handleParapheSelect(paraphe)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(paraphe.type)}
                        <span className="font-medium">{paraphe.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getTypeLabel(paraphe.type)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        {selectedParaphe && (
          <Button size="sm" onClick={() => handleParapheSelect(selectedParaphe)} className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Utiliser
          </Button>
        )}
      </div>
    </div>
  );
} 