/**
 * PDFViewer - Composant d'affichage et d'interaction avec les PDF
 * 
 * SYSTÈME DE POSITIONNEMENT DES SIGNATURES:
 * ========================================
 * 
 * Les coordonnées des signatures sont maintenant TOUJOURS relatives au conteneur PDF global
 * (div.pdf-container) et non plus aux pages individuelles.
 * 
 * CONTRAINTES:
 * - Gauche: minimum = padding gauche du conteneur (32px)
 * - Droite: maximum = largeur totale du contenu scrollable - largeur du champ
 * - Haut: minimum = padding haut du conteneur (32px)
 * - Bas: maximum = hauteur totale du contenu scrollable - hauteur du champ
 * 
 * GESTION DU SCROLL:
 * - Les calculs de position prennent en compte le scroll interne du conteneur PDF
 * - Formule: position = clic - containerRect + scroll du conteneur
 * - Cela corrige les décalages quand l'utilisateur fait défiler le PDF
 * 
 * GESTION MULTI-PAGES:
 * - Utilise scrollHeight/scrollWidth pour obtenir les dimensions totales du contenu
 * - Permet de positionner les signatures sur toutes les pages, pas seulement la première
 * - Les contraintes s'appliquent à l'ensemble du document PDF multi-pages
 * 
 * Cette approche permet aux signatures d'être positionnées n'importe où dans le conteneur PDF,
 * y compris entre les pages si nécessaire.
 */

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

  const onDocumentLoadError = (error: unknown) => {
    console.error("❌ PDF loading error:", error);
    setIsLoading(false);
  };

  const onPageLoadError = (error: unknown) => {
    console.error("❌ Page loading error:", error);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = e.target as HTMLElement;
    if (clickedElement.closest('.signature-field-wrapper')) {
      return;
    }
    
    const pageElement = e.currentTarget;
    const pageNumber = parseInt(pageElement.dataset.pageNumber || '0');

    if (!onPageClick || !activeSignatoryId) return;

    // 🚀 ÉTAPE 1: Obtenir les informations sur le conteneur PDF global
    console.log("🚀 === CALCUL DE POSITION DE SIGNATURE (CONTENEUR PDF) ===");
    console.log("📍 Page cliquée:", pageNumber);
    
    // Trouver le conteneur PDF principal
    const pdfContainer = containerRef.current;
    if (!pdfContainer) {
      console.error("❌ Conteneur PDF non trouvé");
      return;
    }

    // Obtenir les dimensions du conteneur PDF global
    const containerRect = pdfContainer.getBoundingClientRect();
    const pageRect = pageElement.getBoundingClientRect();
    
    // Obtenir la hauteur totale du contenu scrollable (toutes les pages)
    const totalContentHeight = pdfContainer.scrollHeight;
    const totalContentWidth = pdfContainer.scrollWidth;
    
    console.log("📦 Conteneur PDF rect:", {
      x: containerRect.x,
      y: containerRect.y,
      width: containerRect.width,
      height: containerRect.height
    });
    
    console.log("📄 Page rect:", {
      x: pageRect.x,
      y: pageRect.y,
      width: pageRect.width,
      height: pageRect.height
    });
    
    console.log("📏 Contenu total scrollable:", {
      width: totalContentWidth,
      height: totalContentHeight
    });

    // 🚀 ÉTAPE 2: Calculer la position relative au conteneur PDF global
    // Position du clic par rapport au conteneur PDF global (en tenant compte du padding ET du scroll)
    const clickRelativeToContainer = {
      x: e.clientX - containerRect.left + pdfContainer.scrollLeft,
      y: e.clientY - containerRect.top + pdfContainer.scrollTop
    };
    
    console.log("🎯 Clic relatif au conteneur PDF (avec scroll):", clickRelativeToContainer);
    console.log("📜 Scroll du conteneur:", { scrollLeft: pdfContainer.scrollLeft, scrollTop: pdfContainer.scrollTop });

    // 🚀 ÉTAPE 3: Définir les dimensions du champ de signature
    const fieldDimensions = {
      width: 120,
      height: 75
    };
    
    console.log("📏 Dimensions du champ:", fieldDimensions);

    // 🚀 ÉTAPE 4: Positionnement intelligent basé sur l'espace disponible
    let finalX = clickRelativeToContainer.x;
    let finalY = clickRelativeToContainer.y;

    // Prendre en compte le padding du conteneur (pt-8 pl-8 = 2rem = 32px)
    const paddingLeft = 32; // pl-8
    const paddingTop = 32;  // pt-8
    
    console.log("🎯 Padding du conteneur:", { paddingLeft, paddingTop });

    // 🔄 POSITIONNEMENT INTELLIGENT: Décaler la signature si elle sortirait du conteneur
    console.log("🔄 === POSITIONNEMENT INTELLIGENT ===");
    console.log("📍 Position initiale du clic:", { x: finalX, y: finalY });
    
    // Vérifier si placer la signature à cette position (origine haut-gauche) la ferait sortir
    const wouldExceedRight = finalX + fieldDimensions.width > totalContentWidth;
    const wouldExceedBottom = finalY + fieldDimensions.height > totalContentHeight;
    
    console.log("🔍 Vérification des débordements:", {
      wouldExceedRight,
      wouldExceedBottom,
      rightEdge: finalX + fieldDimensions.width,
      bottomEdge: finalY + fieldDimensions.height,
      totalWidth: totalContentWidth,
      totalHeight: totalContentHeight
    });

    // Si le clic + la largeur de la signature dépasse la largeur totale, on décale vers la gauche
    if (wouldExceedRight) {
      const oldX = finalX;
      finalX = clickRelativeToContainer.x - fieldDimensions.width;
      console.log("🔄 Décalage vers la gauche:", { oldX, newX: finalX, décalage: fieldDimensions.width });
    }

    // Si le clic + la hauteur de la signature dépasse la hauteur totale, on décale vers le haut
    if (wouldExceedBottom) {
      const oldY = finalY;
      finalY = clickRelativeToContainer.y - fieldDimensions.height;
      console.log("🔄 Décalage vers le haut:", { oldY, newY: finalY, décalage: fieldDimensions.height });
    }

    console.log("📍 Position après décalage intelligent:", { x: finalX, y: finalY });

    // 🔒 CONTRAINTES FINALES: S'assurer qu'on reste dans les limites
    console.log("🔒 === CONTRAINTES FINALES ===");
    
    // Contrainte gauche (minimum = padding gauche)
    const constrainedX = Math.max(paddingLeft, finalX);
    const constrainedY = Math.max(paddingTop, finalY);
    
    // Contrainte droite et bas (ne pas dépasser les dimensions totales moins le champ)
    finalX = Math.min(constrainedX, totalContentWidth - fieldDimensions.width);
    finalY = Math.min(constrainedY, totalContentHeight - fieldDimensions.height);

    console.log("📍 Position finale contrainte au contenu total:", { x: finalX, y: finalY });
    console.log("📏 Contraintes appliquées:", {
      minX: paddingLeft,
      maxX: totalContentWidth - fieldDimensions.width,
      minY: paddingTop,
      maxY: totalContentHeight - fieldDimensions.height
    });

    // 🚀 ÉTAPE 5: Validation finale
    if (!isFinite(finalX) || !isFinite(finalY)) {
      console.error("❌ Coordonnées finales invalides:", { x: finalX, y: finalY });
      return;
    }

    console.log("✅ Position validée, envoi à onPageClick");
    console.log("🚀 === FIN CALCUL DE POSITION ===");
    
    onPageClick(pageNumber, { x: finalX, y: finalY });
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
          />
        ))}
      </Document>
      
      {/* Rendu des SignatureField positionnés relativement au conteneur PDF global */}
      {fields.map((field: SignatureField) => {
        const signatory = document?.signatories.find((s: Signatory) => s.id === field.signatoryId);
        
        // Use coordinates directly (maintenant relatives au conteneur PDF global)
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
    </div>
  );
} 