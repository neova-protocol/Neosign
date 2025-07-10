"use client"
import React, { useState, useRef, useEffect } from 'react';
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
  onFieldUpdate?: (fieldId: string, position: { x: number, y: number }) => Promise<void>;
  onPageClick?: (pageNumber: number, event: React.MouseEvent) => void;
}

export default function PDFViewer({ fileUrl, document: docFromProp, onSignClick, activeSignatoryId, onFieldUpdate, onPageClick }: PDFViewerProps) {
  const { currentDocument: docFromContext, addField, removeField, viewVersion } = useSignature();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const document = docFromProp || docFromContext;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("📄 PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onPageRenderSuccess = (page: { pageNumber: number, originalWidth: number }) => {
    console.log(`📄 Page ${page.pageNumber} rendered with original width:`, page.originalWidth);
    const pageElement = containerRef.current?.querySelector(`[data-page-number="${page.pageNumber}"]`);
    if (pageElement) {
      pageElement.setAttribute('data-original-width', page.originalWidth.toString());
      console.log(`✅ Original width set for page ${page.pageNumber}:`, page.originalWidth);
    }
  };

  const onDocumentLoadError = (error: any) => {
    console.error("❌ PDF loading error:", error);
    setIsLoading(false);
  };

  const onPageLoadError = (error: any) => {
    console.error("❌ Page loading error:", error);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("application/reactflow");
    if (!fieldType || !activeSignatoryId) return;

    // Use the page element (the drop target) as the reference for coordinates
    const pageElement = (e.target as HTMLElement).closest('.react-pdf__Page');
    if (!pageElement) return;
    
    const bounds = pageElement.getBoundingClientRect();

    // Calculate pixel coordinates directly
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const pageNumber = (pageElement as HTMLElement).dataset.pageNumber ? parseInt((pageElement as HTMLElement).dataset.pageNumber!) : 0;

    const fieldData = {
      type: 'signature' as const,
      page: pageNumber,
      x: x,
      y: y,
      width: 90,
      height: 56.25,
      signatoryId: activeSignatoryId,
      value: undefined,
    };
    addField(fieldData);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Stop propagation to prevent side effects, like closing a modal.
    e.stopPropagation();
    
    // Don't create new fields if clicking on existing signature fields
    const clickedElement = e.target as HTMLElement;
    if (clickedElement.closest('.signature-field-wrapper')) {
      return;
    }
    
    if (!onPageClick || !activeSignatoryId) return;

    const pageElement = e.currentTarget;
    const pageNumber = parseInt(pageElement.dataset.pageNumber || '0');
    
    // Pass the raw event and page number up to the parent.
    onPageClick(pageNumber, e);
  };

  const fields = document?.fields || [];
  const isSigningMode = !!onSignClick;

  return (
    <div ref={containerRef} className="pdf-container w-full h-full overflow-auto relative" style={{ minHeight: '600px' }}>
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
        className={`flex flex-col items-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {numPages && Array.from(new Array(numPages), (_el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="flex justify-center mb-4"
            onRenderSuccess={onPageRenderSuccess}
            onClick={handlePageClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onLoadError={onPageLoadError}
            data-page-number={index + 1}
            width={typeof window !== 'undefined' ? Math.min(800, window.innerWidth * 0.6) : 800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          >
            <div className="relative">
              {fields
                .filter((field: SignatureField) => field.page === index + 1)
                .map((field: SignatureField) => {
                  const signatory = document?.signatories.find((s: Signatory) => s.id === field.signatoryId);
                  
                  // Get the page element to calculate scale factor
                  const pageElement = containerRef.current?.querySelector(`[data-page-number="${index + 1}"]`);
                  const originalWidth = pageElement?.getAttribute('data-original-width');
                  const relativeContainer = pageElement?.querySelector('div[class="relative"]') as HTMLElement;
                  
                  let displayX = field.x;
                  let displayY = field.y;
                  let displayWidth = field.width;
                  let displayHeight = field.height;
                  
                  // Convert normalized coordinates to display coordinates
                  if (originalWidth && relativeContainer) {
                    const pageOriginalWidth = parseFloat(originalWidth);
                    const displayWidth_container = relativeContainer.getBoundingClientRect().width;
                    const scaleFactor = displayWidth_container / pageOriginalWidth;
                    
                    displayX = field.x * scaleFactor;
                    displayY = field.y * scaleFactor;
                    displayWidth = field.width * scaleFactor;
                    displayHeight = field.height * scaleFactor;
                  }
                  
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
                    return <SignatureFieldComponent key={field.id} field={{...field, x: displayX, y: displayY, width: displayWidth, height: displayHeight}} onUpdate={onFieldUpdate} onRemove={removeField} />;
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