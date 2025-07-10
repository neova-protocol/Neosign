"use client";

import { useEffect, useState, useMemo } from 'react';
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
    const { data: session, status } = useSession();
    const { currentDocument, setCurrentDocument, updateFieldPosition, addField } = useSignature();
    const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

    console.log("🔐 Session status:", { status, userId: session?.user?.id, sessionExists: !!session });

    useEffect(() => {
        console.log("🔍 EditDocumentPage useEffect:", { documentId, currentDocument: currentDocument?.id, sessionStatus: status });
        
        // Wait for session to be loaded before fetching document
        if (status === "loading") {
            console.log("⏳ Waiting for session to load...");
            return;
        }
        
        if (status === "unauthenticated") {
            console.error("❌ User not authenticated");
            return;
        }
        
        if (documentId && (!currentDocument || currentDocument.id !== documentId)) {
            console.log("📡 Fetching document with ID:", documentId);
            
            getDocumentById(documentId).then(doc => {
                console.log("📄 Document received:", doc);
                
                if (doc) {
                    // Note: The 'file' object is not stored in the DB.
                    // The user journey should ensure the file is handled correctly in the session state
                    // after upload, but if the user lands here directly, 'file' will be null.
                    // PDFViewer is now capable of fetching from fileUrl.
                    setCurrentDocument(doc);
                } else {
                    console.error("❌ Document not found or error occurred");
                }
            }).catch(error => {
                console.error("💥 Error fetching document:", error);
            });
        }
    }, [documentId, currentDocument?.id, setCurrentDocument, status]);

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

    const documentForViewer = useMemo(() => {
        return currentDocument;
    }, [currentDocument]);

    if (status === "loading") {
        return <div>Loading session...</div>;
    }
    
    if (status === "unauthenticated") {
        return <div>You need to be logged in to access this page.</div>;
    }

    if (!currentDocument || !currentDocument.fileUrl) {
        console.log("⏳ Still loading document:", { 
            hasCurrentDocument: !!currentDocument, 
            documentId: currentDocument?.id,
            hasFileUrl: !!currentDocument?.fileUrl,
            fileUrl: currentDocument?.fileUrl
        });
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

    const handlePageClick = (pageNumber: number, position: { x: number, y: number }) => {
        if (!selectedSignatoryId) {
            alert("Please select a signatory first");
            return;
        }
        
        console.log("✅ Received final coordinates for field creation:", { pageNumber, position, selectedSignatoryId });

        addField({
            type: 'signature',
            page: pageNumber,
            x: position.x,
            y: position.y,
            width: 120, // Standard width in pixels
            height: 75, // Standard height in pixels
            signatoryId: selectedSignatoryId,
            value: null
        });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{currentDocument.name}</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleSendForSignature}>
                            <Send className="mr-2 h-4 w-4" />
                            Send for Signature
                        </Button>
                    </div>
                </header>
                <main className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <PDFViewer 
                            key={selectedSignatoryId}
                            fileUrl={currentDocument.fileUrl}
                            activeSignatoryId={selectedSignatoryId}
                            onFieldUpdate={updateFieldPosition}
                            onPageClick={handlePageClick}
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