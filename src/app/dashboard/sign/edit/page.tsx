"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSignature } from "@/contexts/SignatureContext";
import { useRouter } from "next/navigation";
import SignatoryPanel from "@/components/signature/SignatoryPanel";
import SignatureDialog from "@/components/signature/SignatureDialog";

const PDFViewerWithNoSSR = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
});

export default function EditSignaturePage() {
  const { currentDocument, updateField, addField } = useSignature();
  const router = useRouter();
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(
    null,
  );
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

  const handlePageClick = (pageNumber: number, position: { x: number; y: number }) => {
    if (!selectedSignatoryId) {
      alert("Please select a signatory first");
      return;
    }

    // Add the signature field using the normalized position
    addField({
      type: "signature" as const,
      page: pageNumber,
      x: position.x,
      y: position.y,
      width: 90,
      height: 56.25,
      signatoryId: selectedSignatoryId,
      value: undefined,
      signatureType: "simple", // Ajout de la valeur par défaut
    });
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
        />
      </div>
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <PDFViewerWithNoSSR
          fileUrl={fileUrl}
          document={currentDocument}
          activeSignatoryId={selectedSignatoryId}
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
