"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { getDocumentById, saveDocument } from '@/lib/api';
import { Document, SignatureField } from '@/contexts/SignatureContext';
import SignatureDialog from '@/components/signature/SignatureDialog';
import { Button } from '@/components/ui/button';

const PDFViewerWithNoSSR = dynamic(
  () => import('@/components/pdf/PDFViewer'),
  { ssr: false }
);

export default function SignDocumentPage() {
  const { documentId } = useParams();
  const { currentUser } = useAuth();
  const router = useRouter();

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (typeof documentId !== 'string') return;
      try {
        setIsLoading(true);
        const doc = await getDocumentById(documentId as string);
        if (!doc) {
          router.push('/dashboard/sign');
          return;
        }
        setDocument(doc);
      } catch (error) {
        console.error("Failed to fetch document", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [documentId, router]);

  const handleSignClick = (field: SignatureField) => {
    if (field.signatoryId === currentUser.id) {
      setFieldToSign(field);
    }
  };

  const handleConfirmSignature = async (signatureDataUrl: string) => {
    if (!fieldToSign || !document) return;

    const updatedFields = document.fields.map(f =>
      f.id === fieldToSign.id ? { ...f, value: signatureDataUrl } : f
    );
    
    let updatedDocument = { ...document, fields: updatedFields };
    setDocument(updatedDocument);
    setFieldToSign(null);

    const allMyFieldsSigned = updatedDocument.fields
      .filter(f => f.signatoryId === currentUser.id)
      .every(f => !!f.value);

    if (allMyFieldsSigned) {
        const updatedSignatories = updatedDocument.signatories.map(s => 
            s.id === currentUser.id ? { ...s, status: 'signed' as const } : s
        );
        updatedDocument = { ...updatedDocument, signatories: updatedSignatories };
    }

    const allFieldsSigned = updatedDocument.fields.every(f => !!f.value);
    if (allFieldsSigned) {
        updatedDocument.status = 'completed';
    }

    await saveDocument(updatedDocument);
    setDocument(updatedDocument);
  };

  const signatoryForDialog = useMemo(() => {
    if (!fieldToSign || !document) return null;
    return document.signatories.find((s: any) => s.id === fieldToSign.signatoryId);
  }, [fieldToSign, document]);

  const handleFinishSigning = () => {
      router.push('/dashboard/sign');
  }

  if (isLoading || !document) {
    return <div>Loading document...</div>;
  }

  const allCurrentUserFieldsSigned = document.fields
    .filter(f => f.signatoryId === currentUser.id)
    .every(f => !!f.value);


  return (
    <div className="flex flex-col h-screen bg-gray-100">
        <header className="flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-xl font-semibold">{document.name}</h1>
            <Button onClick={handleFinishSigning} disabled={!allCurrentUserFieldsSigned}>
                Finish & Close
            </Button>
        </header>
      <div className="flex-1 overflow-y-auto">
        <PDFViewerWithNoSSR
          fileUrl={document.fileUrl!}
          document={document}
          onSignClick={handleSignClick}
        />
      </div>

      {fieldToSign && signatoryForDialog && (
        <SignatureDialog
          open={!!fieldToSign}
          onOpenChange={(open) => !open && setFieldToSign(null)}
          onConfirm={handleConfirmSignature}
          signatoryName={signatoryForDialog.name}
        />
      )}
    </div>
  );
} 