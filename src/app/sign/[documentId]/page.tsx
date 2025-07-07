'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Document as AppDocument, SignatureField } from '@/types';
import SignatureDialog from '@/components/signature/SignatureDialog';
import PostSignatureModal from '@/components/signature/PostSignatureModal';
import { updateSignatureField } from '@/lib/api';

const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), { 
    ssr: false,
    loading: () => <p>Loading PDF Viewer...</p>
});

async function getPublicDocument(documentId: string, token: string): Promise<AppDocument | null> {
    const response = await fetch(`/api/public/documents/${documentId}?token=${token}`);
    if (!response.ok) {
        return null;
    }
    return response.json();
}

export default function PublicSignPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const documentId = params.documentId as string;
  const token = searchParams.get('token');

  const [document, setDocument] = useState<AppDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (documentId && token) {
      getPublicDocument(documentId, token)
        .then(doc => {
          if (doc) {
            setDocument(doc);
          } else {
            setError('Could not retrieve document. The link may be invalid or expired.');
          }
        })
        .catch(() => setError('An unexpected error occurred.'))
        .finally(() => setIsLoading(false));
    } else {
        setError('Missing document ID or token.');
        setIsLoading(false);
    }
  }, [documentId, token]);

  const signatory = useMemo(() => {
    if (!document || !token) return null;
    return document.signatories.find(s => s.id === token);
  }, [document, token]);
  
  const handleSignClick = (field: SignatureField) => {
    if (signatory && field.signatoryId === signatory.id) {
        setFieldToSign(field);
    } else {
        alert("You are not authorized to sign this field.");
    }
  };

  const handleConfirmSignature = async (signatureDataUrl: string) => {
    if (!document || !fieldToSign) return;

    const updatedField = await updateSignatureField(document.id, fieldToSign.id, { value: signatureDataUrl });
    
    if (updatedField) {
        setDocument(prevDoc => {
            if (!prevDoc) return null;
            return {
                ...prevDoc,
                fields: prevDoc.fields.map(f => f.id === updatedField.id ? updatedField : f),
            };
        });
        setFieldToSign(null); // Close the signature dialog
        setShowConfirmation(true); // Show the confirmation modal
    } else {
        alert("Failed to save signature.");
        setFieldToSign(null);
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!document) {
    return <div className="p-8 text-center">Document not found.</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-100">
       <PDFViewer
            fileUrl={document.fileUrl}
            document={document}
            onSignClick={handleSignClick}
            activeSignatoryId={token}
        />
        {fieldToSign && signatory && (
            <SignatureDialog
                open={!!fieldToSign}
                onOpenChange={(open) => !open && setFieldToSign(null)}
                onConfirm={handleConfirmSignature}
                signatoryName={signatory.name}
            />
        )}
        <PostSignatureModal 
            open={showConfirmation}
            onOpenChange={setShowConfirmation}
        />
    </div>
  );
} 