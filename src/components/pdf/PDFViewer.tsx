"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useSignature } from '@/contexts/SignatureContext';
import { useSession } from 'next-auth/react';
import { SignatureFieldComponent } from '@/components/pdf/SignatureField';
import { SignatureField, Signatory } from '@/types';

// Configure PDF.js worker from a local path
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  document: any; // Using 'any' to avoid circular dependency issues, can be improved.
  activeSignatoryId?: string | null;
  onSignClick?: (field: SignatureField) => void;
}

export default function PDFViewer({ fileUrl, document, activeSignatoryId, onSignClick }: PDFViewerProps) {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { addField, updateField, removeField } = useSignature();
  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSigningMode = !!onSignClick;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    const target = e.target as HTMLElement;
    if (target.closest('.signature-field-wrapper')) {
      return;
    }

    if (isSigningMode || !activeSignatoryId || !document) return;

    console.log("Creating field for document:", document.id);
    console.log("Current signatories in viewer:", document.signatories);
    console.log("Active signatoryId:", activeSignatoryId);

    const pageElement = e.currentTarget;
    const rect = pageElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const fieldData = {
      type: 'signature' as const,
      page: pageNumber,
      x,
      y,
      width: 150,
      height: 75,
      signatoryId: activeSignatoryId,
      value: undefined,
    };
    
    // Call the context function, which handles the API call
    addField(fieldData);
  };

  const fields = document?.fields || [];

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-auto p-4 bg-gray-200">
      {fileUrl && document ? (
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="mb-4 relative shadow-lg bg-white"
              onClick={(e) => handlePageClick(e, index + 1)}
            >
              <Page pageNumber={index + 1} />
              
              {fields
                .filter((field: SignatureField) => field.page === index + 1)
                .map((field: SignatureField) => {
                  const signatory = document.signatories.find((s: Signatory) => s.id === field.signatoryId);

                  if (isSigningMode) {
                    const isMyFieldToSign = field.signatoryId === activeSignatoryId;

                    // If the field is already signed, display the signature image
                    if (field.value) {
                      return (
                        <div key={field.id} style={{ position: 'absolute', left: field.x, top: field.y, width: field.width, height: field.height, zIndex: 10 }}>
                          <img src={field.value} alt="Signature" className="w-full h-full object-contain" />
                        </div>
                      );
                    }

                    // If it's this user's turn to sign this field, show the "Sign Here" button
                    if (isMyFieldToSign) {
                      return (
                        <div key={field.id} className="signature-field-wrapper" style={{ position: 'absolute', left: field.x, top: field.y, width: field.width, height: field.height, zIndex: 10 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if(onSignClick) onSignClick(field);
                            }}
                            className="w-full h-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-all flex items-center justify-center"
                          >
                            Sign Here
                          </button>
                        </div>
                      );
                    }

                    // For all other unsigned fields, show a placeholder
                    return (
                      <div key={field.id} 
                          className="absolute flex items-center justify-center border-2 border-dashed rounded-md signature-field-wrapper"
                          style={{
                              left: field.x, top: field.y, width: field.width, height: field.height,
                              borderColor: signatory?.color || '#cccccc',
                              backgroundColor: `${signatory?.color || '#cccccc'}20`,
                              zIndex: 10,
                          }}
                      >
                           <div className="text-center">
                              <p className="text-sm font-bold" style={{color: signatory?.color}}>{signatory ? signatory.name : 'Unassigned'}</p>
                              <p className="text-xs text-gray-500">Signature</p>
                          </div>
                      </div>
                    );

                  } else { // Preparation mode
                    return (
                      <SignatureFieldComponent
                        key={field.id}
                        field={field}
                        onUpdate={updateField}
                        onRemove={removeField}
                      />
                    );
                  }
                })}
            </div>
          ))}
        </Document>
      ) : (
        <div className="text-center py-20">
            <p>Loading PDF...</p>
        </div>
      )}
    </div>
  );
} 