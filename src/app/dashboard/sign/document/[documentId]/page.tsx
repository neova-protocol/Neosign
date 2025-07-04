"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSignature } from '@/contexts/SignatureContext';
import { getDocumentById, updateSignatureField } from '@/lib/api';
import dynamic from 'next/dynamic';
import { Document as AppDocument, SignatureField } from '@/contexts/SignatureContext';
import { Button } from '@/components/ui/button';

// Dynamically import heavy components
const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), { ssr: false });
const SignatureModal = dynamic(() => import('@/components/signature/SignatureModal'), { ssr: false });

export default function SignDocumentPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.documentId as string;
    const { data: session } = useSession();
    const { currentDocument, setCurrentDocument } = useSignature();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);

    useEffect(() => {
        if (documentId && (!currentDocument || currentDocument.id !== documentId)) {
            getDocumentById(documentId).then(doc => {
                if (doc) setCurrentDocument(doc);
            });
        }
    }, [documentId, currentDocument, setCurrentDocument]);

    const handleSignClick = (field: SignatureField) => {
        setFieldToSign(field);
        setIsModalOpen(true);
    };

    const handleSaveSignature = async (signatureDataUrl: string) => {
        if (!currentDocument || !fieldToSign || !session?.user) return;
        
        // Here you would call an API to update the field and signatory status
        console.log("Saving signature for field:", fieldToSign.id);
        
        // For now, let's just optimistically update the UI
        // In a real app, this logic would be much more robust, likely in a context or custom hook
        const updatedField = await updateSignatureField(currentDocument.id, fieldToSign.id, { value: signatureDataUrl });

        if (updatedField) {
            // Refetch document to get all updates (field value, signatory status, events)
            const updatedDoc = await getDocumentById(currentDocument.id);
            if(updatedDoc) setCurrentDocument(updatedDoc);
        } else {
            alert("Failed to save signature.");
        }


        setIsModalOpen(false);
        setFieldToSign(null);
    };

    if (!currentDocument || !currentDocument.fileUrl) {
        return <div className="p-8 text-center">Loading document...</div>;
    }

    const selfAsSignatory = session?.user ? currentDocument.signatories.find(s => s.userId === session.user.id) : null;
    if (!selfAsSignatory) {
        return <div className="p-8 text-center">You are not a signatory on this document.</div>;
    }

    const allMyFieldsSigned = currentDocument.fields
        .filter(f => f.signatoryId === selfAsSignatory.id)
        .every(f => !!f.value);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
                <h1 className="text-xl font-semibold">{currentDocument.name}</h1>
                {allMyFieldsSigned && (
                    <Button onClick={() => router.push(`/dashboard/documents/${documentId}`)} variant="default">
                        Finish & Close
                    </Button>
                )}
            </header>
            <main className="flex-1 overflow-y-auto">
                {isModalOpen && fieldToSign && (
                    <SignatureModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSave={handleSaveSignature} 
                    />
                )}
                <PDFViewer
                    fileUrl={currentDocument.fileUrl}
                    document={currentDocument}
                    activeSignatoryId={session?.user?.id}
                    onSignClick={handleSignClick}
                />
            </main>
        </div>
    );
} 