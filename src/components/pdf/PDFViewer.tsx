"use client";
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
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
  onFieldUpdate?: (fieldId: string, updates: { x: number; y: number; }) => Promise<void>;
  onPageClick?: (pageNumber: number, position: { x: number, y: number }) => void;
}

export default function PDFViewer({ fileUrl, document: docFromProp, onSignClick, activeSignatoryId, onFieldUpdate, onPageClick }: PDFViewerProps) {
  const { currentDocument: docFromContext, removeField, viewVersion } = useSignature();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const document = docFromProp || docFromContext;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("📄 PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: any) => {
    console.error("❌ PDF loading error:", error);
    setIsLoading(false);
  };

  const onPageLoadError = (error: any) => {
    console.error("❌ Page loading error:", error);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = e.target as HTMLElement;
    if (clickedElement.closest('.signature-field-wrapper')) {
      return;
    }
    
    const pageElement = e.currentTarget;
    console.log("pageElement", pageElement);
    const pageNumber = parseInt(pageElement.dataset.pageNumber || '0');

    if (!onPageClick || !activeSignatoryId) return;

    const pageRect = pageElement.getBoundingClientRect();
    
    // The click position relative to the top-left of the PDF page element
    const clickX = e.clientX
    const clickY = e.clientY

    const fieldWidth = 120; // Standard width in pixels
    const fieldHeight = 75; // Standard height in pixels

    // The top-left of the field starts at the click position
    let x = clickX;
    let y = clickY;

    // Constrain the position to keep the entire field inside the page
    // if (x + fieldWidth > pageRect.width) {
    //   x = pageRect.width - fieldWidth;
    // }
    // if (y + fieldHeight > pageRect.height) {
    //   y = pageRect.height - fieldHeight;
    // }
    
    // Ensure position is not negative
    x = Math.max(0, x);
    y = Math.max(0, y);

    console.log("x", x);
    console.log("clickX", clickX);
    console.log("y", y);
    console.log("clickY", clickY);
    console.log("pageRect", pageRect);

    if (!isFinite(x) || !isFinite(y)) {
        console.error("❌ Invalid coordinates calculated, ignoring.");
        return;
    }
    
    console.log(`✅ Click constrained within PDF page: {x: ${x}, y: ${y}}`);
    onPageClick(pageNumber, { x, y });
  };

  const fields = document?.fields || [];
  const isSigningMode = !!onSignClick;

  return (
    <div ref={containerRef} className="pdf-container w-full h-full overflow-auto relative pt-8 pl-8" style={{ minHeight: '600px' }}>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement du PDF...</p>
          </div>
        </div>
      )}
      <Document 
        file={fileUrl} 
        onLoadSuccess={onDocumentLoadSuccess} 
        onLoadError={onDocumentLoadError} 
        key={viewVersion}
        className={`flex flex-col ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {numPages && Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="mb-4 relative"
            onClick={handlePageClick}
            onLoadError={onPageLoadError}
            data-page-number={index + 1}
            width={typeof window !== 'undefined' ? Math.min(800, window.innerWidth * 0.6) : 800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          >
            {fields
              .filter((field: SignatureField) => field.page === index + 1)
              .map((field: SignatureField) => {
                const signatory = document?.signatories.find((s: Signatory) => s.id === field.signatoryId);
                
                // Use coordinates directly
                const displayX = field.x;
                const displayY = field.y;
                const displayWidth = field.width;
                const displayHeight = field.height;
                
                // Always render the signature if it exists
                if (field.value) {
                  return <img 
                    key={field.id} 
                    src={field.value} 
                    alt="Signature" 
                    style={{ 
                      position: 'absolute', 
                      left: displayX, 
                      top: displayY, 
                      width: displayWidth, 
                      height: displayHeight, 
                      zIndex: 10 
                    }} 
                  />;
                }

                // Logic for signing mode
                if (isSigningMode) {
                  if (field.signatoryId === activeSignatoryId) {
                    return (
                      <div key={field.id} style={{ position: 'absolute', left: displayX, top: displayY, zIndex: 10 }}>
                        <button onClick={(e) => { if(onSignClick) { e.stopPropagation(); onSignClick(field); } }} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">Sign Here</button>
                      </div>
                    );
                  }
                  // Show a placeholder for other signatories' pending signatures
                  return (
                    <div key={field.id} style={{ position: 'absolute', left: displayX, top: displayY, width: displayWidth, height: displayHeight, border: `2px dashed ${signatory?.color || '#ccc'}`, backgroundColor: `${signatory?.color || '#ccc'}20` }}>
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
          </Page>
        ))}
      </Document>
    </div>
  );
} 