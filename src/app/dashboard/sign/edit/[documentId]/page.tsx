"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSignature } from '@/contexts/SignatureContext';
import { getDocumentById, sendDocumentForSignature } from '@/lib/api';
import dynamic from 'next/dynamic';

import SignatoryPanel from '@/components/signature/SignatoryPanel';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center"><p>Loading PDF Viewer...</p></div>
});

export default function EditDocumentPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.documentId as string;
    const { data: session } = useSession();
    const { currentDocument, setCurrentDocument } = useSignature();
    const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

    useEffect(() => {
        if (documentId && (!currentDocument || currentDocument.id !== documentId)) {
            getDocumentById(documentId).then(doc => {
                if (doc) {
                    // Note: The 'file' object is not stored in the DB.
                    // The user journey should ensure the file is handled correctly in the session state
                    // after upload, but if the user lands here directly, 'file' will be null.
                    // PDFViewer is now capable of fetching from fileUrl.
                    setCurrentDocument(doc);
                }
            });
        }
    }, [documentId, currentDocument, setCurrentDocument]);

    const handleSendForSignature = async () => {
        if (!currentDocument) return;

        const updatedDocument = await sendDocumentForSignature(currentDocument.id);

        if (updatedDocument) {
            setCurrentDocument(updatedDocument);
            alert("Document sent successfully!");
            router.push('/dashboard');
        } else {
            alert("Failed to send the document.");
        }
    };

    if (!currentDocument || !currentDocument.fileUrl) {
        return <div>Loading document...</div>;
    }

    // Security check: Only the creator can edit the document.
    if (session?.user?.id !== currentDocument.creatorId) {
        return <div>You do not have permission to edit this document.</div>;
    }
    
    // Do not allow editing if the document is no longer a draft.
    if (currentDocument.status !== 'draft') {
        return <div>This document has already been sent and can no longer be edited.</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{currentDocument.name}</h1>
                    <Button onClick={handleSendForSignature}>
                        <Send className="mr-2 h-4 w-4" />
                        Send for Signature
                    </Button>
                </header>
                <main className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <PDFViewer 
                            fileUrl={currentDocument.fileUrl}
                            document={currentDocument} 
                            activeSignatoryId={selectedSignatoryId}
                        />
                    </div>
                    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4">
                        <SignatoryPanel 
                            selectedSignatoryId={selectedSignatoryId}
                            onSelectSignatory={setSelectedSignatoryId}
                        />
                    </aside>
                </main>
            </div>
        </div>
    );
} 