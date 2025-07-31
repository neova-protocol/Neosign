"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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

export default function EditSignaturePage() {
  const { currentDocument, updateField, addField } = useSignature();
  const router = useRouter();
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);
  const [selectedFieldType, setSelectedFieldType] = useState<"signature" | "paraphe">("signature");
  const [fieldToSign, setFieldToSign] = useState<string | null>(null);

  console.log("🔍 EditPage - Initial state - selectedFieldType:", selectedFieldType);

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

  console.log("🔍 EditPage - selectedSignatoryId:", selectedSignatoryId);
  console.log("🔍 EditPage - selectedFieldType:", selectedFieldType);

  const handleFieldTypeChange = useCallback((fieldType: "signature" | "paraphe") => {
    console.log("🔄 handleFieldTypeChange called with:", fieldType);
    setSelectedFieldType(fieldType);
  }, []);

  // Fonction de sécurité pour s'assurer qu'elle est toujours définie
  const safeHandleFieldTypeChange = (fieldType: "signature" | "paraphe") => {
    console.log("🔄 safeHandleFieldTypeChange called with:", fieldType);
    setSelectedFieldType(fieldType);
  };

  const handlePageClick = (pageNumber: number, position: { x: number; y: number }) => {
    console.log("🎯 Page clicked with field type:", selectedFieldType);
    
    if (selectedFieldType === "signature" && !selectedSignatoryId) {
      alert("Please select a signatory first for signature fields");
      return;
    }

    // Add the field using the normalized position
    if (selectedFieldType === "signature") {
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

  console.log("🔍 EditPage - About to render with props:", {
    selectedSignatoryId,
    selectedFieldType,
    handleFieldTypeChangeExists: !!handleFieldTypeChange,
    handleFieldTypeChangeType: typeof handleFieldTypeChange
  });

  console.log("🔍 EditPage - handleFieldTypeChange function:", handleFieldTypeChange);
  console.log("🔍 EditPage - handleFieldTypeChange is function:", typeof handleFieldTypeChange === 'function');

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <SignatoryPanel
          selectedSignatoryId={selectedSignatoryId}
          onSelectSignatory={setSelectedSignatoryId}
          selectedFieldType={selectedFieldType}
          onFieldTypeChange={safeHandleFieldTypeChange}
        />
      </div>

      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {selectedFieldType === "signature" ? (
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
            {selectedFieldType === "signature" && selectedSignatoryId && (
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
          activeSignatoryId={selectedFieldType === "signature" ? selectedSignatoryId : null}
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
