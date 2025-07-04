"use client"

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSignature } from '@/contexts/SignatureContext';
import { useRouter } from 'next/navigation';
import SignatoryPanel from '@/components/signature/SignatoryPanel';
import { Signatory, SignatureField } from '@/contexts/SignatureContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Save, Send, Plus, FileText } from 'lucide-react';

const PDFViewerWithNoSSR = dynamic(
  () => import('@/components/pdf/PDFViewer'),
  { ssr: false }
);

export default function EditSignaturePage() {
  const { currentDocument } = useSignature();
  const router = useRouter();
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

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
          activeSignatoryId={selectedSignatoryId}
        />
      </div>
    </div>
  );
}