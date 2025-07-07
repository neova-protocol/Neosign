"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSignature } from '@/contexts/SignatureContext';
import { getDocumentById } from '@/lib/api';
import dynamic from 'next/dynamic';
import { Document as AppDocument, SignatureField } from '@/types';
import { Button } from '@/components/ui/button';

// Dynamically import heavy components
const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), { ssr: false });
const SignatureModal = dynamic(() => import('@/components/signature/SignatureModal'), { ssr: false });

export default function SignDocumentPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.documentId as string;
    const { data: session } = useSession();
    const { currentDocument, setCurrentDocument, updateField } = useSignature();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);
    const [viewVersion, setViewVersion] = useState(0);

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
        console.log("Saving signature for field:", fieldToSign);
        if (!fieldToSign) return;

        await updateField(fieldToSign.id, { value: signatureDataUrl });

        setIsModalOpen(false);
        setFieldToSign(null);
    };

    if (!currentDocument || !currentDocument.fileUrl) {
        return <div className="p-8 text-center">Loading document...</div>;
    }

    const selfAsSignatory = session?.user ? currentDocument.signatories.find(s => s.userId === session.user.id) : null;

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
                    key={viewVersion}
                    fileUrl={currentDocument.fileUrl}
                    document={currentDocument}
                    activeSignatoryId={selfAsSignatory?.id}
                    onSignClick={handleSignClick}
                />
            </main>
        </div>
    );
} 