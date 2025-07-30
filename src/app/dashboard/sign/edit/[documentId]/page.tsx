"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSignature } from "@/contexts/SignatureContext";
import { getDocumentById } from "@/lib/api";
import dynamic from "next/dynamic";

import SignatoryPanel from "@/components/signature/SignatoryPanel";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/modals/SuccessModal";

const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p>Loading PDF Viewer...</p>
    </div>
  ),
});

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    currentDocument,
    setCurrentDocument,
    addField,
    updateFieldPosition,
  } = useSignature();

  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const documentId = params.documentId as string;

  useEffect(() => {
    if (documentId && (!currentDocument || currentDocument.id !== documentId)) {
      getDocumentById(documentId).then((doc) => {
        if (doc) {
          setCurrentDocument(doc);
        }
      });
    }
  }, [documentId, currentDocument?.id, setCurrentDocument, status]);

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    router.push("/dashboard");
  };



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
      fileUrl: currentDocument?.fileUrl,
    });
    return <div>Loading document...</div>;
  }

  // Security check: Only the creator can edit the document.
  if (session?.user?.id !== currentDocument.creatorId) {
    return <div>You do not have permission to edit this document.</div>;
  }

  if (isSuccessModalOpen) {
    return (
      <>
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseModal}
          title="Success!"
          message="Your document has been sent."
        />
      </>
    );
  }

  if (currentDocument.status !== "draft") {
    return (
      <div>
        This document has already been sent and can no longer be edited.
      </div>
    );
  }

  const handlePageClick = (
    pageNumber: number,
    position: { x: number; y: number },
  ) => {
    if (!selectedSignatoryId) {
      alert("Please select a signatory first");
      return;
    }

    console.log("✅ Received final coordinates for field creation:", {
      pageNumber,
      position,
      selectedSignatoryId,
    });

    addField({
      type: "signature",
      page: pageNumber,
      x: position.x,
      y: position.y,
      width: 120, // Standard width in pixels
      height: 75, // Standard height in pixels
      signatoryId: selectedSignatoryId,
      value: null,
      signatureType: "simple", // Ajout de la valeur par défaut
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{currentDocument.name}</h1>
          <div className="flex gap-2">
            {/* Supprimé le bouton "Send for Signature" du header */}
            {/* Le bouton est maintenant uniquement dans le SignatoryPanel */}
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
