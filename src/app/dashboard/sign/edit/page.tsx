"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSignature } from "@/contexts/SignatureContext";
import { useRouter } from "next/navigation";
import { 
  PenTool, 
  Type,
  User
} from "lucide-react";
import SignatoryPanel from "@/components/signature/SignatoryPanel";
import SignatureDialog from "@/components/signature/SignatureDialog";

const PDFViewerWithNoSSR = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
});

type FieldType = "signature" | "paraphe";

export default function EditSignaturePage() {
  const { currentDocument, updateField, addField } = useSignature();
  const router = useRouter();
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);
  const [fieldTypeBySignatory, setFieldTypeBySignatory] = useState<{ [signatoryId: string]: FieldType }>({});
  const [fieldToSign, setFieldToSign] = useState<string | null>(null);

  useEffect(() => {
    if (!currentDocument || !currentDocument.fileUrl) {
      router.push("/dashboard/sign");
    }
  }, [currentDocument, router]);

  const fileUrl = useMemo(() => {
    if (currentDocument?.fileUrl) {
      return currentDocument.fileUrl;
    }
    return null;
  }, [currentDocument?.fileUrl]);

  // Obtenir le type de champ pour le signataire sélectionné
  const currentFieldType = selectedSignatoryId 
    ? fieldTypeBySignatory[selectedSignatoryId] || "signature" 
    : "signature";

  const handleFieldTypeChange = (fieldType: "signature" | "paraphe") => {
    console.log("🔄 Field type changed for signatory:", selectedSignatoryId, "to:", fieldType);
    if (selectedSignatoryId) {
      setFieldTypeBySignatory(prev => ({
        ...prev,
        [selectedSignatoryId]: fieldType
      }));
    }
  };

  const handlePageClick = (pageNumber: number, position: { x: number; y: number }) => {
    console.log("🎯 Page clicked with field type:", currentFieldType);
    
    if (currentFieldType === "signature" && !selectedSignatoryId) {
      alert("Please select a signatory first for signature fields");
      return;
    }

    // Add the field using the normalized position
    if (currentFieldType === "signature") {
      console.log("➕ Adding signature field for signatory:", selectedSignatoryId);
      addField({
        type: "signature" as const,
        page: pageNumber,
        x: position.x,
        y: position.y,
        width: 90,
        height: 56.25,
        signatoryId: selectedSignatoryId || null,
        value: undefined,
        signatureType: "simple",
      });
    } else {
      console.log("➕ Adding paraphe field");
      addField({
        type: "paraphe" as const,
        page: pageNumber,
        x: position.x,
        y: position.y,
        width: 120,
        height: 40,
        signatoryId: null,
        value: undefined,
        signatureType: "simple",
      });
    }
  };

  const handleConfirmSignature = (signatureDataUrl: string) => {
    if (fieldToSign) {
      updateField(fieldToSign, { value: signatureDataUrl });
      setFieldToSign(null);
    }
  };

  const signatoryForDialog = useMemo(() => {
    if (!fieldToSign || !currentDocument) return null;
    const field = currentDocument.fields.find((f) => f.id === fieldToSign);
    if (!field || !field.signatoryId) return null;
    return currentDocument.signatories.find((s) => s.id === field.signatoryId);
  }, [fieldToSign, currentDocument]);

  if (!currentDocument || !fileUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <SignatoryPanel
          selectedSignatoryId={selectedSignatoryId}
          onSelectSignatory={setSelectedSignatoryId}
          selectedFieldType={currentFieldType}
          onFieldTypeChange={handleFieldTypeChange}
        />
      </div>

      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {currentFieldType === "signature" ? (
                <>
                  <PenTool className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Mode Signature</span>
                </>
              ) : (
                <>
                  <Type className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Mode Paraphe</span>
                </>
              )}
            </div>
            {currentFieldType === "signature" && selectedSignatoryId && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Signataire sélectionné
                </span>
              </div>
            )}
          </div>
        </div>
        
        <PDFViewerWithNoSSR
          fileUrl={fileUrl}
          document={currentDocument}
          activeSignatoryId={currentFieldType === "signature" ? selectedSignatoryId : null}
          onPageClick={handlePageClick}
        />
      </div>

      {fieldToSign && signatoryForDialog && (
        <SignatureDialog
          open={!!fieldToSign}
          onOpenChange={(open) => !open && setFieldToSign(null)}
          onConfirm={handleConfirmSignature}
          signatoryName={signatoryForDialog?.name}
        />
      )}
    </div>
  );
}
