"use client";
import React, { useState } from "react";
import { useSignature } from "@/contexts/SignatureContext";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Send, UserPlus, Users, Shield, PenTool, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignatureType } from "./SignatureTypeSelector";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SignatoryPanelProps {
  selectedSignatoryId: string | null;
  onSelectSignatory: (signatoryId: string | null) => void;
}

const SignatoryPanel: React.FC<SignatoryPanelProps> = ({
  selectedSignatoryId,
  onSelectSignatory,
}) => {
  const {
    currentDocument,
    addSignatory,
    removeSignatory,
  } = useSignature();
  const { data: session } = useSession();
  const router = useRouter();

  const [newSignatoryName, setNewSignatoryName] = useState("");
  const [newSignatoryEmail, setNewSignatoryEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedSignatureType, setSelectedSignatureType] = useState<SignatureType>('simple');

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const currentUser = session?.user;

  const handleAddSignatory = async () => {
    if (!newSignatoryName.trim() || !newSignatoryEmail.trim()) {
      alert("Please fill in both name and email");
      return;
    }

    setIsAdding(true);
    try {
      // Créer un objet signatory complet
      const signatoryData = {
        name: newSignatoryName.trim(),
        email: newSignatoryEmail.trim(),
        role: "Signatory",
        color: "#FF5733", // Couleur par défaut
        documentId: currentDocument!.id,
        token: "",
      };

      const newSignatory = await addSignatory(signatoryData);

      if (newSignatory) {
        setNewSignatoryName("");
        setNewSignatoryEmail("");
        onSelectSignatory(newSignatory.id);
      }
    } catch (error) {
      console.error("Failed to add signatory:", error);
      alert("Failed to add signatory");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddMyself = async () => {
    if (!currentUser) return;

    setIsAdding(true);
    try {
      // Créer un objet signatory complet
      const signatoryData = {
        name: currentUser.name || "Myself",
        email: currentUser.email || "",
        role: "Signatory",
        color: "#33FF57", // Couleur par défaut
        documentId: currentDocument!.id,
        token: "",
      };

      const newSignatory = await addSignatory(signatoryData);

      if (newSignatory) {
        onSelectSignatory(newSignatory.id);
      }
    } catch (error) {
      console.error("Failed to add myself:", error);
      alert("Failed to add yourself as signatory");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSignatory = (signatoryId: string) => {
    removeSignatory(signatoryId);
    if (selectedSignatoryId === signatoryId) {
      onSelectSignatory(null);
    }
  };

  const handleSend = async () => {
    if (!currentDocument || !currentUser) return;
    
    console.log("Sending document with signature type:", selectedSignatureType);
    
    // Toujours envoyer le document, les signatures se feront plus tard
    setIsSending(true);
    try {
      const res = await fetch(`/api/send-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          documentId: currentDocument!.id,
          signatureType: selectedSignatureType
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to send document: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending document:", error);
      alert("An error occurred while sending the document.");
    } finally {
      setIsSending(false);
    }
  };





  const getSignatureTypeLabel = (type: SignatureType) => {
    switch (type) {
      case 'simple':
        return 'Signature Simple';
      case 'ses':
        return 'SES - Simple Electronic Signature';
      case 'aes':
        return 'AES - Advanced Electronic Signature';
      case 'qes':
        return 'QES - Qualified Electronic Signature';
      default:
        return 'Signature Simple';
    }
  };



  const isCurrentUserSignatory =
    currentDocument?.signatories.some((s) => s.id === currentUser?.id) ?? false;

  if (!currentDocument) return null;

  return (
    <div className="h-full flex flex-col">
            {/* Sélecteur de type de signature */}
      <div className="mb-4 p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-sm font-medium">Type de Signature</Label>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 p-1 h-auto"
            onClick={() => setShowInfoDialog(true)}
          >
            <Info className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-2">
          <Button
            variant={selectedSignatureType === 'simple' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
            onClick={() => setSelectedSignatureType('simple')}
          >
            <PenTool className="mr-2 h-4 w-4" />
            Signature Simple
          </Button>
          <Button
            variant={selectedSignatureType === 'ses' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
            onClick={() => setSelectedSignatureType('ses')}
          >
            <Shield className="mr-2 h-4 w-4" />
            SES - Simple Electronic Signature
          </Button>
                      <Button
              variant={selectedSignatureType === 'aes' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedSignatureType('aes')}
            >
              <Shield className="mr-2 h-4 w-4" />
              AES - Advanced Electronic Signature
            </Button>
          <Button
            variant={selectedSignatureType === 'qes' ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
            disabled
          >
            <Shield className="mr-2 h-4 w-4" />
            QES - Qualified Electronic Signature
            <span className="ml-auto text-xs text-gray-500">(Bientôt)</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Signatories</h2>
      </div>

      <div className="space-y-4 flex-1">
        {/* Add signatory buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleAddMyself}
            disabled={isAdding || isCurrentUserSignatory}
            className="w-full"
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Myself
          </Button>
          <Button className="w-full" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Add from Contacts
          </Button>
        </div>

        {/* Add new signatory form */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={newSignatoryName}
            onChange={(e) => setNewSignatoryName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={newSignatoryEmail}
            onChange={(e) => setNewSignatoryEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <Button
          onClick={handleAddSignatory}
          disabled={isAdding || !newSignatoryName.trim() || !newSignatoryEmail.trim()}
          className="w-full"
        >
          {isAdding ? "Adding..." : "Add Signatory"}
        </Button>

        {/* Signatories list */}
        <div className="space-y-2">
          {currentDocument.signatories.map((signatory) => (
            <div
              key={signatory.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedSignatoryId === signatory.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onSelectSignatory(signatory.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{signatory.name}</p>
                  <p className="text-sm text-gray-600">{signatory.email}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSignatory(signatory.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button
          className="w-full"
          onClick={handleSend}
          disabled={
            !currentDocument ||
            currentDocument.signatories.length < 1 ||
            isSending
          }
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : `Send for ${getSignatureTypeLabel(selectedSignatureType)}`}
        </Button>
        <div className="text-xs text-gray-500 mt-1">
          Type sélectionné: {getSignatureTypeLabel(selectedSignatureType)}
        </div>
      </div>



      {/* Modale d'information sur les types de signature */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Guide Complet des Signatures Électroniques eIDAS
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              <p>Les signatures électroniques sont classées selon le standard européen eIDAS (Electronic Identification, Authentication and Trust Services). Chaque niveau offre différents degrés de sécurité et de valeur légale.</p>
            </div>

            <div className="space-y-4">
              {/* Signature Simple */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold flex items-center gap-2 text-lg">
                  <PenTool className="h-5 w-5" />
                  Signature Simple
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Signature basique sans validation eIDAS. Idéale pour les documents internes et les workflows simples.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-500">
                    <strong>Valeur légale :</strong> Basique | <strong>Conformité :</strong> N/A
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Validation :</strong> Aucune validation requise
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Usage recommandé :</strong> Documents internes, notes, brouillons
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Avantages :</strong> Rapide, simple, pas de configuration
                  </div>
                </div>
              </div>

              {/* SES */}
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h4 className="font-semibold flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  SES - Simple Electronic Signature
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Signature électronique simple conforme eIDAS avec validation par email/SMS et horodatage sécurisé.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-500">
                    <strong>Valeur légale :</strong> Basique | <strong>Conformité :</strong> eIDAS Niveau 1
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Validation :</strong> Email/SMS/Password + Horodatage RFC 3161
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Usage recommandé :</strong> Documents officiels, contrats, factures
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Avantages :</strong> Conforme eIDAS, validation simple, valeur légale reconnue
                  </div>
                  <div className="text-xs text-blue-600">
                    <strong>Processus :</strong> Signature → Validation → Horodatage → Certificat de conformité
                  </div>
                </div>
              </div>

              {/* AES */}
              <div className="p-4 border rounded-lg bg-gray-50 opacity-75">
                <h4 className="font-semibold flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  AES - Advanced Electronic Signature
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Signature électronique avancée avec certificats qualifiés, authentification forte et intégrité garantie.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-500">
                    <strong>Valeur légale :</strong> Avancée | <strong>Conformité :</strong> eIDAS Niveau 2
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Validation :</strong> Certificats qualifiés + 2FA + PKI
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Usage recommandé :</strong> Documents sensibles, contrats importants
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Avantages :</strong> Sécurité maximale, intégrité garantie, valeur légale avancée
                  </div>
                  <div className="text-xs text-blue-600">
                    <strong>Processus :</strong> Certificat → Authentification → Signature → Horodatage → Validation PKI
                  </div>
                  <div className="mt-1 text-xs text-blue-600 font-semibold">(Bientôt disponible)</div>
                </div>
              </div>

              {/* QES */}
              <div className="p-4 border rounded-lg bg-gray-50 opacity-75">
                <h4 className="font-semibold flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  QES - Qualified Electronic Signature
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Signature électronique qualifiée, équivalente à une signature manuscrite selon la loi européenne.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-500">
                    <strong>Valeur légale :</strong> Qualifiée | <strong>Conformité :</strong> eIDAS Niveau 3
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Validation :</strong> Certificats qualifiés + QSCD + PKI
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Usage recommandé :</strong> Documents légaux, contrats critiques
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Avantages :</strong> Équivalent signature manuscrite, valeur légale maximale
                  </div>
                  <div className="text-xs text-blue-600">
                    <strong>Processus :</strong> QSCD → Certificat qualifié → Signature → Horodatage → Validation légale
                  </div>
                  <div className="mt-1 text-xs text-blue-600 font-semibold">(Bientôt disponible)</div>
                </div>
              </div>
            </div>

            {/* Tableau comparatif */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Comparaison des Types de Signature</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">Validation</th>
                      <th className="border p-2 text-left">Valeur Légale</th>
                      <th className="border p-2 text-left">Conformité</th>
                      <th className="border p-2 text-left">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Simple</td>
                      <td className="border p-2">Aucune</td>
                      <td className="border p-2">Basique</td>
                      <td className="border p-2">N/A</td>
                      <td className="border p-2">Interne</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border p-2">SES</td>
                      <td className="border p-2">Email/SMS</td>
                      <td className="border p-2">Basique</td>
                      <td className="border p-2">eIDAS N1</td>
                      <td className="border p-2">Officiel</td>
                    </tr>
                    <tr className="opacity-60">
                      <td className="border p-2">AES</td>
                      <td className="border p-2">Certificats</td>
                      <td className="border p-2">Avancée</td>
                      <td className="border p-2">eIDAS N2</td>
                      <td className="border p-2">Sensible</td>
                    </tr>
                    <tr className="opacity-60">
                      <td className="border p-2">QES</td>
                      <td className="border p-2">QSCD</td>
                      <td className="border p-2">Qualifiée</td>
                      <td className="border p-2">eIDAS N3</td>
                      <td className="border p-2">Légal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
              <strong>Note importante :</strong> Le choix du type de signature dépend de vos besoins légaux et de la sensibilité du document. Pour les documents officiels, nous recommandons au minimum le niveau SES.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatoryPanel;
