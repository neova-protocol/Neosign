/**
 * PDFViewer - Composant d'affichage et d'interaction avec les PDF
 *
 * SYSTÈME DE POSITIONNEMENT DES SIGNATURES:
 * ========================================
 *
 * Les coordonnées des signatures sont maintenant TOUJOURS relatives au conteneur PDF global
 * (div.pdf-container) et non plus aux pages individuelles.
 *
 * POSITIONNEMENT INTELLIGENT:
 * - Utilise la fonction utilitaire calculateSignaturePosition() de @/lib/utils
 * - Décalage automatique quand l'utilisateur clique près des bords (useSmartPositioning: true)
 * - Clic près du bord droit → signature décalée vers la gauche
 * - Clic près du bord bas → signature décalée vers le haut
 * - Clic dans le coin → décalage dans les deux directions
 *
 * CONTRAINTES AUTOMATIQUES:
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
 * y compris entre les pages si nécessaire, tout en restant toujours visibles.
 */

"use client";
import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSignature } from "@/contexts/SignatureContext";
import { SignatureFieldComponent } from "./SignatureField";
import { SignatureField, Signatory, Document as AppDocument } from "@/types";
import { calculateSignaturePosition } from "@/lib/utils";

// Configure PDF.js worker from a local path
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  document?: AppDocument | null;
  onSignClick?: (field: SignatureField) => void;
  activeSignatoryId?: string | null;
  onFieldUpdate?: (
    fieldId: string,
    updates: { x: number; y: number },
  ) => Promise<void>;
  onPageClick?: (
    pageNumber: number,
    position: { x: number; y: number },
  ) => void;
}

export default function PDFViewer({
  fileUrl,
  document: docFromProp,
  onSignClick,
  activeSignatoryId,
  onFieldUpdate,
  onPageClick,
}: PDFViewerProps) {
  const {
    currentDocument: docFromContext,
    removeField,
    viewVersion,
  } = useSignature();
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
    if (clickedElement.closest(".signature-field-wrapper")) {
      return;
    }

    const pageElement = e.currentTarget;
    const pageNumber = parseInt(pageElement.dataset.pageNumber || "0");

    if (!onPageClick || !activeSignatoryId) return;

    // 🚀 POSITIONNEMENT PAR RAPPORT À LA PAGE PDF SPÉCIFIQUE
    console.log("🚀 === CALCUL DE POSITION SUR PAGE PDF SPÉCIFIQUE ===");
    console.log("📍 Page cliquée:", pageNumber);

    // Obtenir les dimensions de la page PDF cliquée spécifiquement
    const pageRect = pageElement.getBoundingClientRect();

    console.log("📄 Page rect (page spécifique):", {
      x: pageRect.x,
      y: pageRect.y,
      width: pageRect.width,
      height: pageRect.height,
    });

    // 🚀 ÉTAPE 1: Calculer la position relative à cette page spécifique
    const clickRelativeToPage = {
      x: e.clientX - pageRect.left,
      y: e.clientY - pageRect.top,
    };

    console.log("🎯 Clic relatif à la page spécifique:", clickRelativeToPage);

    // 🚀 ÉTAPE 2: Définir les dimensions du champ de signature
    const fieldDimensions = {
      width: 120,
      height: 75,
    };

    console.log("📏 Dimensions du champ:", fieldDimensions);

    // 🚀 ÉTAPE 3: Utiliser les dimensions réelles de la page pour les contraintes
    const pageDimensions = {
      width: pageRect.width,
      height: pageRect.height,
    };

    console.log("📐 Dimensions de la page:", pageDimensions);

    // 🚀 ÉTAPE 4: Utiliser la fonction utilitaire avec les contraintes de la page spécifique
    const finalPosition = calculateSignaturePosition({
      desiredPosition: clickRelativeToPage,
      fieldDimensions,
      containerDimensions: pageDimensions, // Contraintes basées sur la page spécifique
      containerPadding: {
        left: 0, // Pas de padding car on est relatif à la page
        top: 0,
      },
      pdfOffset: { left: 0, top: 0 }, // Pas de décalage car on est relatif à la page
      useSmartPositioning: true, // Activer le positionnement intelligent pour les clics
      context: "CLICK_PAGE_SPECIFIC",
    });

    console.log("✅ Position calculée pour la page spécifique:", finalPosition);
    console.log("🚀 === FIN CALCUL PAGE SPÉCIFIQUE ===");

    // 🚀 ÉTAPE 5: Convertir la position relative à la page en position absolue pour le stockage
    // La position finale sera relative au début de cette page dans le conteneur global
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect || !containerRef.current) {
      console.error("❌ Conteneur PDF non trouvé");
      return;
    }

    // Calculer la position absolue dans le conteneur global en prenant en compte le scroll
    const absolutePosition = {
      x:
        finalPosition.x +
        (pageRect.left - containerRect.left) +
        containerRef.current.scrollLeft,
      y:
        finalPosition.y +
        (pageRect.top - containerRect.top) +
        containerRef.current.scrollTop,
    };

    console.log("📜 Scroll du conteneur:", {
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    });
    console.log(
      "📍 Position absolue dans le conteneur global (avec scroll):",
      absolutePosition,
    );

    onPageClick(pageNumber, absolutePosition);
  };

  const fields = document?.fields || [];
  const isSigningMode = !!onSignClick;

  return (
    <div
      ref={containerRef}
      className="pdf-container w-full h-full overflow-auto relative pt-8 pl-8"
      style={{ minHeight: "600px" }}
    >
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
        className={`flex flex-col ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        {numPages &&
          Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="mb-4 relative"
              onClick={handlePageClick}
              onLoadError={onPageLoadError}
              data-page-number={index + 1}
              width={
                typeof window !== "undefined"
                  ? Math.min(800, window.innerWidth * 0.6)
                  : 800
              }
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>

      {/* Rendu des SignatureField positionnés relativement au conteneur PDF global */}
      {fields.map((field: SignatureField) => {
        const signatory = document?.signatories.find(
          (s: Signatory) => s.id === field.signatoryId,
        );

        // 🚀 AFFICHAGE DES SIGNATURES MANUELLES (DESSINÉES)
        // Always render the signature if it exists
        if (field.value) {
          console.log("🖼️ Affichage signature manuelle:", {
            fieldId: field.id,
            page: field.page,
            directPosition: { x: field.x, y: field.y },
            dimensions: { width: field.width, height: field.height },
          });

          return (
            <img
              key={field.id}
              src={field.value}
              alt="Signature"
              style={{
                position: "absolute",
                left: field.x,
                top: field.y,
                width: field.width,
                height: field.height,
                zIndex: 10,
              }}
            />
          );
        }

        // Use coordinates directly for other field types (placeholders, buttons)
        const displayX = field.x;
        const displayY = field.y;
        const displayWidth = field.width;
        const displayHeight = field.height;

        // Logic for signing mode
        if (isSigningMode) {
          if (field.signatoryId === activeSignatoryId) {
            return (
              <div
                key={field.id}
                style={{
                  position: "absolute",
                  left: displayX,
                  top: displayY,
                  width: displayWidth,
                  height: displayHeight,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={(e) => {
                    if (onSignClick) {
                      e.stopPropagation();
                      onSignClick(field);
                    }
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded text-sm"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                >
                  {field.signatureType === 'aes' ? 'Sign AES' : 
                   field.signatureType === 'ses' ? 'Sign SES' :
                   field.signatureType === 'qes' ? 'Sign QES' :
                   'Sign Here'}
                </button>
              </div>
            );
          }
          // Show a placeholder for other signatories' pending signatures
          return (
            <div
              key={field.id}
              style={{
                position: "absolute",
                left: displayX,
                top: displayY,
                width: displayWidth,
                height: displayHeight,
                border: `2px dashed ${signatory?.color || "#ccc"}`,
                backgroundColor: `${signatory?.color || "#ccc"}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                className="text-xs p-1 text-center"
                style={{ color: signatory?.color || "#666" }}
              >
                {signatory?.name}
              </p>
            </div>
          );
        }

        // Logic for edit/setup mode (drag and drop)
        if (onFieldUpdate) {
          return (
            <SignatureFieldComponent
              key={field.id}
              field={field}
              onUpdate={onFieldUpdate}
              onRemove={removeField}
            />
          );
        }

        return null; // Should not happen in normal flow
      })}
    </div>
  );
}
