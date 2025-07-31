"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff,
  Type,
  PenTool,
  Upload
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Paraphe, CreateParapheRequest, UpdateParapheRequest } from "@/types/paraphe";
import { ParapheService } from "@/services/paraphe/ParapheService";
import CreateParapheDialog from "./CreateParapheDialog";
import EditParapheDialog from "./EditParapheDialog";

export default function ParapheManager() {
  const [paraphes, setParaphes] = useState<Paraphe[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParaphe, setSelectedParaphe] = useState<Paraphe | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parapheToDelete, setParapheToDelete] = useState<Paraphe | null>(null);

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
      }
    } catch {
      // Handle error silently for now
    }
  };

  const handleEditParaphe = async (data: UpdateParapheRequest) => {
    if (!selectedParaphe) return;
    
    try {
      const updatedParaphe = await parapheService.updateParaphe(selectedParaphe.id, data);
      if (updatedParaphe) {
        setParaphes(prev => prev.map(p => p.id === selectedParaphe.id ? updatedParaphe : p));
        setEditDialogOpen(false);
        setSelectedParaphe(null);
      }
    } catch {
      // Handle error silently for now
    }
  };

  const handleDeleteParaphe = async () => {
    if (!parapheToDelete) return;
    
    try {
      const success = await parapheService.deleteParaphe(parapheToDelete.id);
      if (success) {
        setParaphes(prev => prev.filter(p => p.id !== parapheToDelete.id));
      }
    } catch {
      // Handle error silently for now
    } finally {
      setDeleteDialogOpen(false);
      setParapheToDelete(null);
    }
  };

  const handleSetDefault = async (parapheId: string) => {
    try {
      const success = await parapheService.setDefaultParaphe(parapheId);
      if (success) {
        setParaphes(prev => prev.map(p => ({
          ...p,
          isDefault: p.id === parapheId
        })));
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des paraphes</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos paraphes personnalisés
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau paraphe
        </Button>
      </div>

      {paraphes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paraphes.map((paraphe) => (
            <Card key={paraphe.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {paraphe.name}
                      {paraphe.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Par défaut
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getTypeIcon(paraphe.type)}
                      <span className="text-sm text-muted-foreground">
                        {getTypeLabel(paraphe.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedParaphe(paraphe);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setParapheToDelete(paraphe);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {paraphe.type === 'text' && (
                    <div className="text-sm text-muted-foreground">
                      <p>Police: {paraphe.font || 'Par défaut'}</p>
                      <p>Taille: {paraphe.size || 'Par défaut'}</p>
                      <p>Couleur: {paraphe.color || 'Noir'}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {!paraphe.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(paraphe.id)}
                        className="flex-1"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Définir par défaut
                      </Button>
                    )}
                    {paraphe.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex-1"
                      >
                        <StarOff className="w-4 h-4 mr-2" />
                        Par défaut
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateParapheDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onConfirm={handleCreateParaphe}
      />

      {selectedParaphe && (
        <EditParapheDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          paraphe={selectedParaphe}
          onConfirm={handleEditParaphe}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le paraphe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le paraphe &quot;{parapheToDelete?.name}&quot; ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteParaphe}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 