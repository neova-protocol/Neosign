"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Document as AppDocument, SignatureField } from "@/types";
import SignatureModal from "@/components/signature/SignatureModal";
import PostSignatureModal from "@/components/signature/PostSignatureModal";
import SESSignatureDialog from "@/components/signature/SESSignatureDialog";
import { AESSignatureDialog } from "@/components/signature/AESSignatureDialog";
import { updateSignatureField } from "@/lib/api";

const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
  loading: () => <p>Loading PDF Viewer...</p>,
});

async function getPublicDocument(
  documentId: string,
  token: string,
): Promise<AppDocument | null> {
  const response = await fetch(
    `/api/public/documents/${documentId}?token=${token}`,
  );
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default function PublicSignPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const documentId = params.documentId as string;
  const token = searchParams.get("token");

  const [document, setDocument] = useState<AppDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldToSign, setFieldToSign] = useState<SignatureField | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSESSignature, setShowSESSignature] = useState(false);
  const [showAESSignature, setShowAESSignature] = useState(false);

  useEffect(() => {
    if (documentId && token) {
      getPublicDocument(documentId, token)
        .then((doc) => {
          if (doc) {
            setDocument(doc);
          } else {
            setError(
              "Could not retrieve document. The link may be invalid or expired.",
            );
          }
        })
        .catch(() => setError("An unexpected error occurred."))
        .finally(() => setIsLoading(false));
    } else {
      setError("Missing document ID or token.");
      setIsLoading(false);
    }
  }, [documentId, token]);

  const signatory = useMemo(() => {
    if (!document || !token) return null;
    return document.signatories.find((s) => s.token === token);
  }, [document, token]);

  const handleSignClick = (field: SignatureField) => {
    if (signatory && field.signatoryId === signatory.id) {
      const signatureType = field.signatureType || 'simple';
      console.log(`🎯 Field clicked - Signature type detected: ${signatureType}`);
      console.log(`📋 Field data:`, field);
      
      switch (signatureType) {
        case 'simple':
          console.log(`📝 Opening simple signature dialog`);
          setFieldToSign(field);
          break;
        case 'ses':
          console.log(`🛡️ Opening SES signature dialog`);
          setFieldToSign(field);
          setShowSESSignature(true);
          break;
        case 'aes':
          console.log(`🔒 Opening AES signature dialog`);
          setFieldToSign(field);
          setShowAESSignature(true);
          break;
        default:
          console.log(`❓ Unknown signature type: ${signatureType}, using simple`);
          setFieldToSign(field);
          break;
      }
    } else {
      alert("You are not authorized to sign this field.");
    }
  };

  const handleConfirmSignature = async (signatureDataUrl: string) => {
    if (!document || !fieldToSign || !token) return;

    try {
      const updatedField = await updateSignatureField(
        document.id,
        fieldToSign.id,
        { value: signatureDataUrl },
        token,
      );

      if (updatedField) {
        setDocument((prevDoc) => {
          if (!prevDoc) return null;
          return {
            ...prevDoc,
            fields: prevDoc.fields.map((f) =>
              f.id === updatedField.id ? updatedField : f,
            ),
          };
        });
        setFieldToSign(null);
        setShowSESSignature(false);
        setShowAESSignature(false);
        setShowConfirmation(true);
      } else {
        alert("Failed to save signature.");
        setFieldToSign(null);
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("An error occurred while saving the signature. Please try again.");
      setFieldToSign(null);
    }
  };

  const handleSESSignatureComplete = async (signature: { signatureData: string }) => {
    if (!document || !fieldToSign || !token) return;

    try {
      const updatedField = await updateSignatureField(
        document.id,
        fieldToSign.id,
        { value: signature.signatureData },
        token,
      );

      if (updatedField) {
        setDocument((prevDoc) => {
          if (!prevDoc) return null;
          return {
            ...prevDoc,
            fields: prevDoc.fields.map((f) =>
              f.id === updatedField.id ? updatedField : f,
            ),
          };
        });
        setFieldToSign(null);
        setShowSESSignature(false);
        setShowConfirmation(true);
      } else {
        alert("Failed to save signature.");
        setFieldToSign(null);
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("An error occurred while saving the signature. Please try again.");
      setFieldToSign(null);
    }
  };

  const handleAESSignatureComplete = async (signatureData: { signatureData: string }) => {
    if (!document || !fieldToSign || !token) return;

    try {
      const updatedField = await updateSignatureField(
        document.id,
        fieldToSign.id,
        { value: signatureData.signatureData },
        token,
      );

      if (updatedField) {
        setDocument((prevDoc) => {
          if (!prevDoc) return null;
          return {
            ...prevDoc,
            fields: prevDoc.fields.map((f) =>
              f.id === updatedField.id ? updatedField : f,
            ),
          };
        });
        setFieldToSign(null);
        setShowAESSignature(false);
        setShowConfirmation(true);
      } else {
        alert("Failed to save signature.");
        setFieldToSign(null);
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("An error occurred while saving the signature. Please try again.");
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
        activeSignatoryId={signatory?.id}
      />
      {fieldToSign && signatory && !showSESSignature && !showAESSignature && (
        <SignatureModal
          isOpen={!!fieldToSign}
          onClose={() => setFieldToSign(null)}
          onSave={handleConfirmSignature}
        />
      )}
      
      {fieldToSign && signatory && showSESSignature && (
        <SESSignatureDialog
          open={showSESSignature}
          onOpenChange={setShowSESSignature}
          onConfirm={handleSESSignatureComplete}
          signatoryName={signatory.name}
          signatoryId={signatory.id}
          documentId={document.id}
          validationMethod="email"
          userEmail={signatory.email}
        />
      )}
      
      {fieldToSign && signatory && showAESSignature && (
        <AESSignatureDialog
          open={showAESSignature}
          onOpenChange={setShowAESSignature}
          onConfirm={handleAESSignatureComplete}
          signatoryName={signatory.name}
          signatoryId={signatory.id}
          documentId={document.id}
        />
      )}
      
      <PostSignatureModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        signatoryEmail={signatory?.email}
      />
    </div>
  );
}
