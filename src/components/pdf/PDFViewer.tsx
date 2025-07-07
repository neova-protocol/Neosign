"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSignature } from '@/contexts/SignatureContext';
import { SignatureFieldComponent } from './SignatureField';
import { SignatureField, Signatory, Document as AppDocument } from '@/types';

// Configure PDF.js worker from a local path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  document?: AppDocument | null;
  onSignClick?: (field: SignatureField) => void;
  activeSignatoryId?: string | null;
  onFieldUpdate?: (fieldId: string, position: { x: number, y: number }) => Promise<void>;
}

export default function PDFViewer({ fileUrl, document: docFromProp, onSignClick, activeSignatoryId, onFieldUpdate }: PDFViewerProps) {
  const { currentDocument: docFromContext, addField, removeField, viewVersion } = useSignature();
  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const document = docFromProp || docFromContext;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("application/reactflow");
    if (!fieldType || !containerRef.current || !activeSignatoryId) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const page = e.currentTarget.dataset.pageNumber ? parseInt(e.currentTarget.dataset.pageNumber) : 0;

    const fieldData = {
      type: 'signature' as const,
      page: page,
      x: x,
      y: y,
      width: 150,
      height: 75,
      signatoryId: activeSignatoryId,
      value: undefined,
    };
    addField(fieldData);
  };

  const fields = document?.fields || [];
  const isSigningMode = !!onSignClick;

  return (
    <div ref={containerRef} className="pdf-container w-full h-full overflow-auto relative">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} key={viewVersion}>
        {Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="flex justify-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            data-page-number={index + 1}
          >
            <div className="relative">
              {fields
                .filter((field: SignatureField) => field.page === index + 1)
                .map((field: SignatureField) => {
                  const signatory = document?.signatories.find((s: Signatory) => s.id === field.signatoryId);
                  
                  // Always render the signature if it exists
                  if (field.value) {
                    return <img className='!min-w-[90px] !min-h-[56.25px] !w-[90px] !h-[56.25px]' key={field.id} src={field.value} alt="Signature" style={{ position: 'absolute', left: field.x, top: field.y, width: field.width, height: field.height, zIndex: 10 }} />;
                  }

                  // Logic for signing mode
                  if (isSigningMode) {
                    if (field.signatoryId === activeSignatoryId) {
                      return (
                        <div key={field.id} style={{ position: 'absolute', left: field.x, top: field.y, zIndex: 10 }}>
                          <button onClick={(e) => { if(onSignClick) { e.stopPropagation(); onSignClick(field); } }} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">Sign Here</button>
                        </div>
                      );
                    }
                    // Show a placeholder for other signatories' pending signatures
                    return (
                      <div key={field.id} style={{ position: 'absolute', left: field.x, top: field.y, width: field.width, height: field.height, border: `2px dashed ${signatory?.color || '#ccc'}`, backgroundColor: `${signatory?.color || '#ccc'}20` }}>
                        <p className="text-xs p-1">{signatory?.name}</p>
                      </div>
                    );
                  }

                  // Logic for edit/setup mode (drag and drop)
                  if (onFieldUpdate) {
                    return <SignatureFieldComponent key={field.id} field={field} onUpdate={onFieldUpdate} onRemove={removeField} />;
                  }

                  return null; // Should not happen in normal flow
                })}
            </div>
          </Page>
        ))}
      </Document>
    </div>
  );
} 