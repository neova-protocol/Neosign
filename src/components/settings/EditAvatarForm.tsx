"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function EditAvatarForm() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Le fichier est trop volumineux. Taille maximum : 5MB");
      return;
    }

    // Créer l'URL de prévisualisation
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Aucun fichier sélectionné");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload");
      }

      await response.json();
      
      // Mettre à jour la session
      await update();
      
      // Nettoyer la prévisualisation
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      // Réinitialiser le file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success("Avatar mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload de l'avatar:", error);
      toast.error("Erreur lors de la mise à jour de l'avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre avatar ?")) {
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/user/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await update();
      toast.success("Avatar supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avatar:", error);
      toast.error("Erreur lors de la suppression de l'avatar");
    } finally {
      setIsUploading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  const currentAvatar = session.user.image;
  const displayAvatar = previewUrl || currentAvatar;
  const hasAvatar = !!currentAvatar;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayAvatar || ""} />
            <AvatarFallback className="text-2xl">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {/* Indicateur de prévisualisation */}
          {previewUrl && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Prévisualisation
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Changer l'avatar
            </Button>

            {hasAvatar && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>

          {previewUrl && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {isUploading ? "Upload en cours..." : "Sauvegarder"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Annuler
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Formats supportés : JPG, PNG, GIF, WebP</p>
        <p>Taille maximum : 5MB</p>
      </div>
    </div>
  );
} 