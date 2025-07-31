"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Type, 
  PenTool, 
  Upload,
  Star,
  CheckCircle
} from "lucide-react";
import { useParapheSignature } from "@/hooks/useParapheSignature";
import { Paraphe } from "@/types/paraphe";
import ParapheRenderer from "./ParapheRenderer";
import SignatureDialog from "./SignatureDialog";

export default function ParapheSignatureExample() {
  const {
    paraphes,
    defaultParaphe,
    loading,
    error,
    selectParaphe,
    createSignatureWithParaphe,
    setDefaultParapheAsync,
    refreshParaphes,
  } = useParapheSignature();

  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(null);
  const [signatureResult, setSignatureResult] = useState<string | null>(null);

  const handleParapheSelect = (paraphe: Paraphe) => {
    setSelectedParaphe(paraphe);
    selectParaphe(paraphe);
  };

  const handleSetDefault = async (parapheId: string) => {
    const success = await setDefaultParapheAsync(parapheId);
    if (success) {
      console.log("Paraphe par défaut mis à jour");
    }
  };

  const handleSignatureComplete = (signatureData: string) => {
    setSignatureResult(signatureData);
    setShowSignatureDialog(false);
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refreshParaphes}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Démonstration - Système de Paraphe</h2>
        <p className="text-muted-foreground">
          Testez l&apos;intégration des paraphes dans le système de signature
        </p>
      </div>

      {/* Paraphe par défaut */}
      {defaultParaphe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Paraphe par défaut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(defaultParaphe.type)}
                <span className="font-medium">{defaultParaphe.name}</span>
                <Badge variant="secondary">
                  {getTypeLabel(defaultParaphe.type)}
                </Badge>
              </div>
              <Button 
                size="sm"
                onClick={() => setSelectedParaphe(defaultParaphe)}
              >
                Utiliser
              </Button>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <ParapheRenderer 
                paraphe={defaultParaphe}
                width={300}
                height={100}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des paraphes */}
      <Card>
        <CardHeader>
          <CardTitle>Paraphes disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {paraphes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucun paraphe disponible
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paraphes.map((paraphe) => (
                <Card key={paraphe.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(paraphe.type)}
                        <span className="font-medium">{paraphe.name}</span>
                        {paraphe.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Par défaut
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3 p-3 border rounded bg-gray-50">
                      <ParapheRenderer 
                        paraphe={paraphe}
                        width={200}
                        height={80}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleParapheSelect(paraphe)}
                        className="flex-1"
                      >
                        Sélectionner
                      </Button>
                      {!paraphe.isDefault && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSetDefault(paraphe.id)}
                        >
                          <Star className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test de signature */}
      <Card>
        <CardHeader>
          <CardTitle>Test de signature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowSignatureDialog(true)}>
                Tester la signature manuelle
              </Button>
              {selectedParaphe && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    const signatureData = createSignatureWithParaphe(
                      selectedParaphe,
                      "John Doe",
                      "doc-123"
                    );
                    console.log("Signature avec paraphe:", signatureData);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tester avec paraphe sélectionné
                </Button>
              )}
            </div>

            {selectedParaphe && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm font-medium mb-2">
                  Paraphe sélectionné: {selectedParaphe.name}
                </p>
                <div className="p-3 border rounded bg-white">
                  <ParapheRenderer 
                    paraphe={selectedParaphe}
                    width={250}
                    height={100}
                  />
                </div>
              </div>
            )}

            {signatureResult && (
              <div className="p-4 border rounded-lg bg-green-50">
                <p className="text-sm font-medium mb-2">
                  Signature créée avec succès !
                </p>
                <div className="p-3 border rounded bg-white">
                  <img 
                    src={signatureResult} 
                    alt="Signature" 
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onConfirm={handleSignatureComplete}
        signatoryName="John Doe"
      />
    </div>
  );
} 