"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  Cloud, 
  Database, 
  FileText, 
  Calendar,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { useSession } from "next-auth/react";

// Données d'utilisation améliorées
const usageData = [
  { month: "Jan", documents: 12, signatures: 8, storage: 45 },
  { month: "Feb", documents: 15, signatures: 12, storage: 52 },
  { month: "Mar", documents: 8, signatures: 6, storage: 38 },
  { month: "Apr", documents: 22, signatures: 18, storage: 67 },
  { month: "May", documents: 18, signatures: 14, storage: 58 },
  { month: "Jun", documents: 25, signatures: 20, storage: 75 },
  { month: "Jul", documents: 30, signatures: 25, storage: 89 },
  { month: "Aug", documents: 28, signatures: 22, storage: 82 },
  { month: "Sep", documents: 35, signatures: 28, storage: 95 },
  { month: "Oct", documents: 32, signatures: 26, storage: 88 },
  { month: "Nov", documents: 40, signatures: 32, storage: 105 },
  { month: "Dec", documents: 45, signatures: 38, storage: 120 },
];

function EnhancedUsageChart() {
  const maxDocuments = Math.max(...usageData.map(d => d.documents));
  const maxSignatures = Math.max(...usageData.map(d => d.signatures));

  return (
    <div className="space-y-6">
      {/* Graphique des documents */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Documents créés</h4>
        <div className="flex items-end justify-between h-48 px-4 bg-gray-50 rounded-lg p-4">
          {usageData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${(data.documents / maxDocuments) * 100}%`,
                }}
              />
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique des signatures */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Signatures effectuées</h4>
        <div className="flex items-end justify-between h-48 px-4 bg-gray-50 rounded-lg p-4">
          {usageData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-green-500 rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-green-600"
                style={{
                  height: `${(data.signatures / maxSignatures) * 100}%`,
                }}
              />
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques récapitulatives */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Documents</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {usageData.reduce((sum, d) => sum + d.documents, 0)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Total Signatures</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {usageData.reduce((sum, d) => sum + d.signatures, 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Stockage (MB)</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {usageData[usageData.length - 1].storage}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataSettingsPage() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [isNeodriveConnected, setIsNeodriveConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simuler l'export des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer un fichier JSON avec les données
      const exportData = {
        user: {
          id: session?.user?.id,
          email: session?.user?.email,
          name: session?.user?.name,
        },
        usage: usageData,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neosign-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleConnectNeodrive = async () => {
    setIsNeodriveConnected(true);
    // Ici on pourrait ajouter la logique de connexion à Neodrive
  };

  const handleSyncDocuments = async () => {
    setIsSyncing(true);
    try {
      // Simuler la synchronisation
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Ici on pourrait ajouter la logique de synchronisation
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Données et stockage</h1>
          <p className="text-gray-600">
            Gérez vos données, visualisez votre utilisation et synchronisez vos documents
          </p>
        </div>

        {/* Graphique d'utilisation amélioré */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Aperçu de l'utilisation
                </CardTitle>
                <p className="text-gray-600 text-sm mt-1">
                  Suivez votre activité de signature électronique au fil du temps
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Dernière mise à jour: Aujourd'hui
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <EnhancedUsageChart />
          </CardContent>
        </Card>

        {/* Export des données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Export des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Téléchargez toutes vos données personnelles au format JSON. 
              Cela inclut vos documents, signatures, et statistiques d'utilisation.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Export en cours..." : "Exporter mes données"}
              </Button>
              <Badge variant="outline" className="text-xs">
                Format JSON
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stockage des documents signés avec Neodrive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-purple-600" />
              Stockage des documents signés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connexion Neodrive */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Connexion Neodrive</h4>
                  <p className="text-sm text-gray-600">
                    Synchronisez vos documents signés avec Neodrive pour un stockage sécurisé
                  </p>
                </div>
                <Button
                  onClick={handleConnectNeodrive}
                  variant={isNeodriveConnected ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  <Cloud className="h-4 w-4" />
                  {isNeodriveConnected ? "Connecté" : "Se connecter à Neodrive"}
                </Button>
              </div>

              {isNeodriveConnected && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Neodrive connecté
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Vos documents signés sont maintenant synchronisés avec Neodrive.
                  </p>
                </div>
              )}
            </div>

            {/* Options de synchronisation */}
            {isNeodriveConnected && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900">Options de synchronisation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Upload className="h-5 w-5 text-blue-600" />
                        <h5 className="font-medium">Ajouter tous les documents</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Transférer tous vos documents signés vers Neodrive en une seule fois.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={handleSyncDocuments}
                        disabled={isSyncing}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isSyncing ? "Synchronisation..." : "Synchroniser tout"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                                                 <RefreshCw className="h-5 w-5 text-green-600" />
                         <h5 className="font-medium">Synchronisation continue</h5>
                       </div>
                       <p className="text-sm text-gray-600 mb-3">
                         Synchroniser automatiquement les nouveaux documents signés.
                       </p>
                       <Button 
                         variant="outline" 
                         size="sm"
                         className="w-full"
                       >
                         <RefreshCw className="h-4 w-4 mr-2" />
                         Activer l'auto-sync
                       </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Statistiques de synchronisation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Statistiques de synchronisation</h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Documents synchronisés</span>
                      <div className="font-semibold text-gray-900">24</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Espace utilisé</span>
                      <div className="font-semibold text-gray-900">156 MB</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Dernière sync</span>
                      <div className="font-semibold text-gray-900">Il y a 2h</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
