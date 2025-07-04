"use client"

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSignature } from '@/contexts/SignatureContext';
import { useRouter } from 'next/navigation';
import SignatoryPanel from '@/components/signature/SignatoryPanel';
import SignatureDialog from '@/components/signature/SignatureDialog';

const PDFViewerWithNoSSR = dynamic(
  () => import('@/components/pdf/PDFViewer'),
  { ssr: false }
);

export default function EditSignaturePage() {
  const { currentDocument, updateField } = useSignature();
  const router = useRouter();
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);
  const [fieldToSign, setFieldToSign] = useState<string | null>(null);

  useEffect(() => {
    if (!currentDocument || !currentDocument.file) {
      router.push('/dashboard/sign');
    }
  }, [currentDocument, router]);

  const fileUrl = useMemo(() => {
    if (currentDocument?.file) {
      return URL.createObjectURL(currentDocument.file);
    }
    return null;
  }, [currentDocument?.file]);

  const handleSign = (fieldId: string) => {
    setFieldToSign(fieldId);
  };

  const handleConfirmSignature = (signatureDataUrl: string) => {
    if (fieldToSign) {
      updateField(fieldToSign, { value: signatureDataUrl });
      setFieldToSign(null);
    }
  };

  const signatoryForDialog = useMemo(() => {
    if (!fieldToSign || !currentDocument) return null;
    const field = currentDocument.fields.find(f => f.id === fieldToSign);
    if (!field || !field.signatoryId) return null;
    return currentDocument.signatories.find(s => s.id === field.signatoryId);
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