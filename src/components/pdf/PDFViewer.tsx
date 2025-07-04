"use client"
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSignature } from '@/contexts/SignatureContext';
import { SignatureFieldComponent } from './SignatureField';
import { SignatureField } from '@/contexts/SignatureContext';

// Configure PDF.js worker from an official CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  activeSignatoryId: string | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, activeSignatoryId }) => {
  const { currentDocument, updateField, removeField, addField } = useSignature();
  const [numPages, setNumPages] = useState<number | null>(null);
  
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    const pageRef = pageRefs.current.get(pageNumber);
    if (!pageRef) return;

    const rect = pageRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField: Omit<SignatureField, 'id'> = {
      type: 'signature',
      page: pageNumber,
      x: x,
      y: y,
      width: 150,
      height: 40,
      signatoryId: activeSignatoryId,
    };
    addField(newField);
  };

  if (!currentDocument) {
    return <div>Loading document...</div>;
  }

  return (
    <div className="pdf-viewer-container bg-gray-200 p-4">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages || 0), (el, index) => {
          const pageNumber = index + 1;
          return (
            <div
              key={`page_${pageNumber}`}
              ref={(el) => {
                if (el) {
                  pageRefs.current.set(pageNumber, el);
                } else {
                  pageRefs.current.delete(pageNumber);
                }
              }}
              className="relative mb-4 shadow-lg"
              onClick={(e) => handlePageClick(e, pageNumber)}
              style={{ position: 'relative' }} 
            >
              <Page pageNumber={pageNumber} />
              {currentDocument.fields
                .filter(field => field.page === pageNumber)
                .map(field => (
                  <SignatureFieldComponent
                    key={field.id}
                    field={field}
                    onUpdate={updateField}
                    onRemove={removeField}
                    pageNumber={pageNumber}
                  />
                ))}
            </div>
          );
        })}
      </Document>
    </div>
  );
};

export default PDFViewer; 