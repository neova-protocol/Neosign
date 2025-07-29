"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Edit3 } from "lucide-react";
import { toast } from "sonner";

export default function EditNameForm() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Mettre à jour la session
      await update();
      
      setIsEditing(false);
      toast.success("Nom mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      toast.error("Erreur lors de la mise à jour du nom");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(session?.user?.name || "");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nom complet</Label>
      <div className="flex items-center gap-2">
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
          className="flex-1"
        />
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 