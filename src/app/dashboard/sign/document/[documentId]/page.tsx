"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSignature } from "@/contexts/SignatureContext";
import { getDocumentById } from "@/lib/api";
import { ParapheAutoFillService } from "@/services/paraphe/ParapheAutoFillService";
import dynamic from "next/dynamic";
import { SignatureField } from "@/types";
import { Button } from "@/components/ui/button";
import SESSignatureDialog from "@/components/signature/SESSignatureDialog";
import { AESSignatureDialog } from "@/components/signature/AESSignatureDialog";
import { QESSignatureDialog } from "@/components/signature/QESSignatureDialog";
import ParapheSelectionDialog from "@/components/signature/ParapheSelectionDialog";
import { Paraphe } from "@/types/paraphe";

// Dynamically import heavy components
const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
});
const SignatureModal = dynamic(
  () => import("@/components/signature/SignatureModal"),
  { ssr: false },
);

export default function SignDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { data: session } = useSession();
  const { currentDocument, setCurrentDocument, updateField, refreshDocument } =
    useSignature();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);
  const [showSESSignature, setShowSESSignature] = useState(false);
  const [showAESSignature, setShowAESSignature] = useState(false);
  const [showQESSignature, setShowQESSignature] = useState(false);
  const [showParapheDialog, setShowParapheDialog] = useState(false);

  // Service pour l'auto-remplissage des paraphes
  const parapheAutoFillService = ParapheAutoFillService.getInstance();

  // Fonction pour appliquer un paraphe à un champ
  const applyParapheToField = async (fieldId: string, paraphe: Paraphe) => {
    try {
      console.log("🔄 Applying paraphe to field:", fieldId);
      const parapheValue = parapheAutoFillService.convertParapheToFieldValue(paraphe);
      
      // Appeler l'API - si ça échoue, l'erreur sera attrapée par le catch
      await updateField(fieldId, { value: parapheValue });
      
      // Si on arrive ici, l'API a réussi
      await refreshDocument(documentId);
      console.log("✅ Paraphe applied successfully");
    } catch (error) {
      console.error("❌ Error applying paraphe:", error);
      // Ne pas appeler refreshDocument en cas d'erreur pour éviter que le paraphe disparaisse
      throw error; // Re-lancer l'erreur pour que le composant parent puisse la gérer
    }
  };

  // Fonction pour gérer la sélection de paraphe
  const handleParapheSelect = async (paraphe: Paraphe) => {
    if (fieldToSign) {
      try {
        await applyParapheToField(fieldToSign.id, paraphe);
        // Fermer le dialog seulement si ça a réussi
        setShowParapheDialog(false);
      } catch (error) {
        console.error("❌ Failed to apply paraphe:", error);
        // Afficher un message d'erreur à l'utilisateur
        alert("Erreur lors de l'application du paraphe. Veuillez réessayer.");
      }
    }
  };



  useEffect(() => {
    if (documentId) {
      getDocumentById(documentId).then((doc) => {
        if (doc) {
          console.log(`📄 Dashboard document loaded:`, doc);
          console.log(`📋 Document fields:`, doc.fields);
          if (doc.fields && doc.fields.length > 0) {
            console.log(`🔍 First field signatureType:`, doc.fields[0].signatureType);
          }
          setCurrentDocument(doc);
        }
      });
    }
  }, [documentId, setCurrentDocument]);

  const handleSignClick = async (field: SignatureField) => {
    // Log pour debug
    console.log(`🔍 === DÉBUT handleSignClick ===`);
    console.log(`📋 Field reçu:`, field);
    console.log(`📋 Field.type:`, field.type);
    console.log(`📋 Field.signatureType:`, field.signatureType);
    
    // Vérifier si c'est un champ paraphe
    if (field.type === "paraphe") {
      console.log("🔄 Paraphe field clicked - opening paraphe dialog");
      setFieldToSign(field);
      setShowParapheDialog(true);
      return;
    }
    
    // Pour les champs signature, continuer avec la logique normale
    const signatureType = field.signatureType || 'simple';
    console.log(`🎯 Signature field clicked - Signature type detected: ${signatureType}`);
    console.log(`🔍 === FIN handleSignClick ===`);
    
    switch (signatureType) {
      case 'simple':
        console.log(`📝 Opening simple signature dialog`);
        setFieldToSign(field);
        setIsModalOpen(true);
        break;
      case 'ses':
        console.log(`🛡️ Opening SES signature dialog`);
        setFieldToSign(field);
        setShowSESSignature(true);
        break;
      case 'aes':
        console.log(`🔒 Opening AES signature dialog`);
        setFieldToSign(field);
        setShowAESSignature(true);
        break;
      case 'qes':
        console.log(`🏆 Opening QES signature dialog`);
        setFieldToSign(field);
        setShowQESSignature(true);
        break;
      default:
        console.log(`❓ Unknown signature type: ${signatureType}, using simple`);
        setFieldToSign(field);
        setIsModalOpen(true);
        break;
    }
  };

  const handleSaveSignature = async (signatureDataUrl: string) => {
    console.log("Saving signature for field:", fieldToSign);
    if (!fieldToSign) return;

    await updateField(fieldToSign.id, { value: signatureDataUrl });
    await refreshDocument(documentId);

    setIsModalOpen(false);
    setShowSESSignature(false);
    setShowAESSignature(false);
    setFieldToSign(null);
  };

  const handleSESSignatureComplete = async (signature: { signatureData: string }) => {
    console.log("Saving SES signature for field:", fieldToSign);
    if (!fieldToSign) return;

    await updateField(fieldToSign.id, { value: signature.signatureData });
    await refreshDocument(documentId);

    setShowSESSignature(false);
    setFieldToSign(null);
  };

  const handleAESSignatureComplete = async (signatureData: { signatureData: string }) => {
    console.log("Saving AES signature for field:", fieldToSign);
    if (!fieldToSign) return;

    await updateField(fieldToSign.id, { value: signatureData.signatureData });
    await refreshDocument(documentId);

    setShowAESSignature(false);
    setFieldToSign(null);
  };

  const handleQESSignatureComplete = async (signatureData: { signatureData: string }) => {
    console.log("Saving QES signature for field:", fieldToSign);
    if (!fieldToSign) return;

    await updateField(fieldToSign.id, { value: signatureData.signatureData });
    await refreshDocument(documentId);

    setShowQESSignature(false);
    setFieldToSign(null);
  };

  if (!currentDocument || !currentDocument.fileUrl) {
    return <div className="p-8 text-center">Loading document...</div>;
  }

  const selfAsSignatory = session?.user
    ? currentDocument.signatories.find((s) => s.userId === session.user.id)
    : null;

  if (!selfAsSignatory) {
    // This case should ideally not be reached if navigation is correct
    // but it's good practice to handle it.
    // We render the viewer in a "read-only" mode for non-signatories.
    return (
      <div className="w-full h-screen bg-gray-100">
        <PDFViewer
          fileUrl={currentDocument.fileUrl}
          onSignClick={() => {}} // No action
          activeSignatoryId={null} // No active signatory
        />
      </div>
    );
  }

  const myFields = currentDocument.fields.filter(
    (f) => f.signatoryId === selfAsSignatory.id || f.type === "paraphe",
  );
  const signedFields = myFields.filter((f) => !!f.value);
  const allMyFieldsSigned =
    myFields.length > 0 && myFields.every((f) => !!f.value);
  const signingProgress =
    myFields.length > 0 ? `${signedFields.length}/${myFields.length}` : "0/0";

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">{currentDocument.name}</h1>
          <p className="text-sm text-gray-600">
            Signatures: {signingProgress}{" "}
            {allMyFieldsSigned ? "✅ Complete" : "⏳ In Progress"}
          </p>
        </div>
        <div className="flex gap-2">
          {allMyFieldsSigned ? (
            <Button
              onClick={() => router.push(`/dashboard/documents/${documentId}`)}
              variant="default"
            >
              Finish & Close
            </Button>
          ) : (
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Save & Exit
            </Button>
          )}
          <Button
            onClick={() => router.push(`/dashboard/documents/${documentId}`)}
            variant="ghost"
          >
            View Details
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {isModalOpen && fieldToSign && !showSESSignature && !showAESSignature && !showQESSignature && (
          <SignatureModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveSignature}
          />
        )}
        
        {fieldToSign && showSESSignature && (
          <SESSignatureDialog
            open={showSESSignature}
            onOpenChange={setShowSESSignature}
            onConfirm={handleSESSignatureComplete}
            signatoryName={selfAsSignatory?.name || ''}
            signatoryId={selfAsSignatory?.id || ''}
            documentId={currentDocument.id}
            validationMethod="email"
            userEmail={selfAsSignatory?.email || ''}
          />
        )}
        
        {fieldToSign && showAESSignature && (
          <AESSignatureDialog
            open={showAESSignature}
            onOpenChange={setShowAESSignature}
            onConfirm={handleAESSignatureComplete}
            signatoryName={selfAsSignatory?.name || ''}
            signatoryId={selfAsSignatory?.id || ''}
            documentId={currentDocument.id}
          />
        )}
        
        {fieldToSign && showQESSignature && (
          <QESSignatureDialog
            open={showQESSignature}
            onOpenChange={setShowQESSignature}
            onConfirm={handleQESSignatureComplete}
            signatoryName={selfAsSignatory?.name || ''}
            documentId={currentDocument.id}
          />
        )}
        
        {fieldToSign && showParapheDialog && (
          <ParapheSelectionDialog
            open={showParapheDialog}
            onOpenChange={setShowParapheDialog}
            onParapheSelect={handleParapheSelect}
          />
        )}
        
        <PDFViewer
          key={currentDocument.id} // Add key to force re-render
          fileUrl={currentDocument.fileUrl}
          activeSignatoryId={selfAsSignatory?.id}
          onSignClick={handleSignClick}
        />
      </main>
    </div>
  );
}
