"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Upload,
  Key,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { ZKSessionManager, ZKAuth, ZKIdentityExport } from "@/lib/zk-auth";

export default function ZKIdentityManager() {
  const [importData, setImportData] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const identity = ZKSessionManager.getIdentity();
      if (!identity) {
        setMessage({
          type: "error",
          text: "Aucune identité ZK trouvée. Créez d'abord une identité ZK.",
        });
        return;
      }

      ZKSessionManager.downloadIdentityBackup(description || undefined);
      setMessage({
        type: "success",
        text: "Identité ZK exportée avec succès !",
      });
      setDescription("");
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: "Erreur lors de l'export de l'identité ZK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      if (!importData.trim()) {
        setMessage({
          type: "error",
          text: "Veuillez entrer les données d'import",
        });
        return;
      }

      const exportData: ZKIdentityExport = JSON.parse(importData);

      // Valider l'identité importée
      const isValid = await ZKAuth.validateImportedIdentity(
        exportData.identity,
      );
      if (!isValid) {
        setMessage({ type: "error", text: "Format d'identité ZK invalide" });
        return;
      }

      // Importer l'identité
      const success = ZKSessionManager.importAndSaveIdentity(exportData);
      if (success) {
        setMessage({
          type: "success",
          text: "Identité ZK importée avec succès !",
        });
        setImportData("");
      } else {
        setMessage({
          type: "error",
          text: "Erreur lors de l'import de l'identité ZK",
        });
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: "Format de fichier invalide ou erreur lors de l'import",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const currentIdentity = ZKSessionManager.getIdentity();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Gestion de l'Identité ZK
        </CardTitle>
        <CardDescription>
          Exportez et importez votre identité ZK pour la récupérer sur d'autres
          appareils
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert
            variant={message.type === "success" ? "default" : "destructive"}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Statut de l'identité actuelle */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Identité ZK Actuelle</span>
          </div>
          {currentIdentity ? (
            <div className="text-sm text-gray-600">
              <p>✅ Identité ZK disponible</p>
              <p className="text-xs mt-1">
                Commitment: {currentIdentity.commitment.substring(0, 16)}...
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>❌ Aucune identité ZK trouvée</p>
              <p className="text-xs mt-1">
                Créez une identité ZK pour pouvoir l'exporter
              </p>
            </div>
          )}
        </div>

        {/* Export d'identité */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Identité ZK pour ordinateur portable"
            />
          </div>

          <Button
            onClick={handleExport}
            disabled={isLoading || !currentIdentity}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Export en cours..." : "Exporter l'identité ZK"}
          </Button>
        </div>

        {/* Import d'identité */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="importData">Données d'import</Label>
            <Textarea
              id="importData"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Collez ici les données d'export ZK ou utilisez le bouton ci-dessous"
              rows={6}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={isLoading || !importData.trim()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Import en cours..." : "Importer l'identité ZK"}
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Instructions :</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <strong>Export :</strong> Sauvegardez votre identité ZK pour
                la récupérer plus tard
              </li>
              <li>
                • <strong>Import :</strong> Récupérez une identité ZK
                sauvegardée
              </li>
              <li>
                • <strong>Sécurité :</strong> Gardez vos fichiers d'export en
                lieu sûr
              </li>
              <li>
                • <strong>Compatibilité :</strong> Fonctionne sur tous les
                navigateurs et appareils
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
