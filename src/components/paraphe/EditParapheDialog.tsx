"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Type, 
  PenTool, 
  Upload
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { Paraphe, UpdateParapheRequest } from "@/types/paraphe";
import { ParapheService } from "@/services/paraphe/ParapheService";

interface EditParapheDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paraphe: Paraphe;
  onConfirm: (data: UpdateParapheRequest) => void;
}

export default function EditParapheDialog({
  open,
  onOpenChange,
  paraphe,
  onConfirm,
}: EditParapheDialogProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'drawing' | 'upload'>(paraphe.type);
  const [name, setName] = useState(paraphe.name);
  const [textContent, setTextContent] = useState(paraphe.type === 'text' ? paraphe.content : "");
  const [selectedFont, setSelectedFont] = useState(paraphe.font || "Dancing Script");
  const [selectedColor, setSelectedColor] = useState(paraphe.color || "#000000");
  const [selectedSize, setSelectedSize] = useState(paraphe.size || 24);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    paraphe.type === 'upload' ? paraphe.content : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parapheService = ParapheService.getInstance();
  const settings = parapheService.getDefaultSettings();

  const handleTabChange = (value: string) => {
    if (value === 'text' || value === 'drawing' || value === 'upload') {
      setActiveTab(value as 'text' | 'drawing' | 'upload');
    }
  };

  useEffect(() => {
    if (open && paraphe) {
      setName(paraphe.name);
      setActiveTab(paraphe.type);
      
      if (paraphe.type === 'text') {
        setTextContent(paraphe.content);
        setSelectedFont(paraphe.font || "Dancing Script");
        setSelectedColor(paraphe.color || "#000000");
        setSelectedSize(paraphe.size || 24);
      } else if (paraphe.type === 'upload') {
        setUploadedImage(paraphe.content);
      }
      // Pour le dessin, on garde le canvas vide car on ne peut pas recharger le dessin
    }
  }, [open, paraphe]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Le nom du paraphe est requis");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let content = paraphe.content; // Garder le contenu original par défaut

      switch (activeTab) {
        case "text":
          if (!textContent.trim()) {
            setError("Le contenu textuel est requis");
            return;
          }
          content = textContent;
          break;

        case "drawing":
          if (sigCanvas.current) {
            content = sigCanvas.current.toDataURL();
          } else {
            setError("Veuillez dessiner votre paraphe");
            return;
          }
          break;

        case "upload":
          if (!uploadedImage) {
            setError("Veuillez sélectionner une image");
            return;
          }
          content = uploadedImage;
          break;

        default:
          setError("Type de paraphe non valide");
          return;
      }

      const updateData: UpdateParapheRequest = {
        name: name.trim(),
        content,
        font: activeTab === "text" ? selectedFont : undefined,
        color: activeTab === "text" ? selectedColor : undefined,
        size: activeTab === "text" ? selectedSize : undefined,
      };

      onConfirm(updateData);
      handleClose();
    } catch (error) {
      setError("Erreur lors de la mise à jour du paraphe");
      console.error("Error updating paraphe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le paraphe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom du paraphe */}
          <div>
            <Label htmlFor="paraphe-name">Nom du paraphe</Label>
            <Input
              id="paraphe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon paraphe"
              className="mt-1"
            />
          </div>

          {/* Type de paraphe */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Texte</span>
              </TabsTrigger>
              <TabsTrigger value="drawing" className="flex items-center space-x-2">
                <PenTool className="h-4 w-4" />
                <span>Dessin</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenu textuel */}
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="text-content">Contenu</Label>
                <Input
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Votre paraphe"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="font-select">Police</Label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.availableFonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color-select">Couleur</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.availableColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded border" 
                              style={{ backgroundColor: color }}
                            />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size-input">Taille</Label>
                  <Input
                    id="size-input"
                    type="number"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(Number(e.target.value))}
                    min="12"
                    max="72"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Preview */}
              {textContent && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <Label className="text-sm text-gray-600">Aperçu</Label>
                  <div 
                    className="mt-2"
                    style={{ 
                      fontFamily: selectedFont,
                      color: selectedColor,
                      fontSize: `${selectedSize}px`
                    }}
                  >
                    {textContent}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Dessin */}
            <TabsContent value="drawing" className="space-y-4">
              <div className="border rounded-md">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-[200px]",
                  }}
                />
              </div>
              <Button variant="outline" onClick={clearCanvas}>
                Effacer
              </Button>
            </TabsContent>

            {/* Upload */}
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Cliquez pour sélectionner une nouvelle image
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Sélectionner une image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadedImage && (
                <div className="border rounded-md p-4">
                  <Label className="text-sm text-gray-600">Aperçu</Label>
                  <img 
                    src={uploadedImage} 
                    alt="Paraphe uploadé" 
                    className="mt-2 max-h-32 object-contain"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 