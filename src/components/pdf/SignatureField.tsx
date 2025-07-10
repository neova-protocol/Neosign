/**
 * SignatureField - Composant de champ de signature déplaçable
 * 
 * SYSTÈME DE DRAG & DROP:
 * =======================
 * 
 * Le drag & drop utilise maintenant la fonction utilitaire calculateSignaturePosition() 
 * de @/lib/utils pour assurer une cohérence avec le système de positionnement.
 * 
 * POSITIONNEMENT PENDANT LE DRAG:
 * - Utilise calculateSignaturePosition() avec useSmartPositioning: false
 * - Applique uniquement les contraintes sans décalage automatique
 * - Empêche les signatures de sortir du conteneur PDF global
 * 
 * CONTRAINTES AUTOMATIQUES:
 * - Gauche: minimum = padding gauche du conteneur (32px)
 * - Droite: maximum = largeur totale du contenu scrollable - largeur du champ
 * - Haut: minimum = padding haut du conteneur (32px)
 * - Bas: maximum = hauteur totale du contenu scrollable - hauteur du champ
 * 
 * GESTION DU SCROLL:
 * - Les calculs de position prennent en compte le scroll interne du conteneur PDF
 * - Formule: position = souris - containerRect - dragOffset + scroll du conteneur
 * - Cela corrige les décalages quand l'utilisateur fait défiler le PDF pendant le drag
 * 
 * GESTION MULTI-PAGES:
 * - Utilise scrollHeight/scrollWidth pour obtenir les dimensions totales du contenu
 * - Permet de déplacer les signatures sur toutes les pages, pas seulement la première
 * - Les contraintes s'appliquent à l'ensemble du document PDF multi-pages
 * 
 * Les coordonnées sont sauvegardées seulement si la position a réellement changé.
 */

"use client";
import React, { useState, MouseEvent, useEffect, useCallback } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { SignatureField as SignatureFieldType } from '@/types';
import { calculateSignaturePosition, convertStoredToDisplayPosition } from '@/lib/utils';

interface SignatureFieldProps {
  field: SignatureFieldType;
  onUpdate: (id: string, updates: { x: number; y: number; }) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export const SignatureFieldComponent: React.FC<SignatureFieldProps> = ({
  field,
  onUpdate,
  onRemove,
}) => {
  const { currentDocument } = useSignature();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: field.x, y: field.y });
  const dragStartOffset = React.useRef({ x: 0, y: 0 });

  const signatory = field.signatoryId ? currentDocument?.signatories.find(s => s.id === field.signatoryId) : null;

  // 🚀 CALCUL DE LA POSITION D'AFFICHAGE AVEC CONVERSION
  // Utiliser la fonction de conversion pour l'affichage, mais garder l'état local pour le drag
  const containerElement = document.querySelector('.pdf-container') as HTMLElement;
  let pixelPos = { x: position.x, y: position.y };
  
  if (containerElement && !isDragging) {
    // Pendant le drag, utiliser la position d'état local
    // Sinon, convertir les coordonnées stockées pour l'affichage
    const displayPosition = convertStoredToDisplayPosition({
      storedPosition: { x: field.x, y: field.y },
      fieldPage: field.page,
      containerElement
    });
    
    if (displayPosition) {
      pixelPos = displayPosition;
      console.log("🎯 Position d'affichage SignatureField:", {
        fieldId: field.id,
        page: field.page,
        storedPosition: { x: field.x, y: field.y },
        displayPosition,
        isDragging
      });
    }
  }

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log("🚀 === DÉBUT DE DRAG ===");
    console.log("🎯 Field ID:", field.id);
    console.log("📍 Position initiale:", { x: position.x, y: position.y });
    
    setIsDragging(true);
    
    // 🚀 ÉTAPE 1: Calculer l'offset du drag
    // Cet offset permet de maintenir la position relative de la souris dans le champ
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    dragStartOffset.current = offset;
    console.log("🎯 Offset de drag calculé:", offset);
    console.log("🎯 Position de la souris:", { clientX: e.clientX, clientY: e.clientY });
    console.log("🎯 Rect du champ:", { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
  }, [field.id, position.x, position.y]);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      console.log("🚀 === DRAG SUR CANVAS PDF SPÉCIFIQUE ===");
      
      // 🚀 ÉTAPE 1: Identifier le canvas sur lequel se trouve la signature
      const pdfContainer = document.querySelector('.pdf-container') as HTMLElement;
      if (!pdfContainer) {
        console.error("❌ Conteneur PDF non trouvé");
        return;
      }
      
      // Trouver le canvas spécifique correspondant au champ de signature
      const targetCanvas = pdfContainer.querySelector(`[data-page-number="${field.page}"] .react-pdf__Page__canvas`) as HTMLElement;
      if (!targetCanvas) {
        console.error(`❌ Canvas de la page ${field.page} non trouvé`);
        return;
      }
      
      console.log("🎨 Canvas cible trouvé:", field.page);
      
      // 🚀 ÉTAPE 2: Obtenir les dimensions de ce canvas spécifique
      const canvasRect = targetCanvas.getBoundingClientRect();
      const containerRect = pdfContainer.getBoundingClientRect();
      
      console.log("🎨 Canvas rect:", {
        x: canvasRect.x,
        y: canvasRect.y,
        width: canvasRect.width,
        height: canvasRect.height
      });
      
      console.log("📦 Container rect:", {
        x: containerRect.x,
        y: containerRect.y,
        width: containerRect.width,
        height: containerRect.height
      });

      // 🚀 ÉTAPE 3: Calculer la position relative à ce canvas spécifique
      const desiredPositionRelativeToCanvas = {
        x: e.clientX - canvasRect.left - dragStartOffset.current.x,
        y: e.clientY - canvasRect.top - dragStartOffset.current.y
      };
      
      console.log("🎯 Position désirée relative au canvas:", desiredPositionRelativeToCanvas);
      console.log("🎯 Mouse position:", { clientX: e.clientX, clientY: e.clientY });
      console.log("🎯 Drag offset:", dragStartOffset.current);
      
      // 🚀 ÉTAPE 4: Utiliser la fonction utilitaire avec les contraintes du canvas spécifique
      const finalPositionRelativeToCanvas = calculateSignaturePosition({
        desiredPosition: desiredPositionRelativeToCanvas,
        fieldDimensions: {
          width: field.width,
          height: field.height
        },
        containerDimensions: {
          width: canvasRect.width, // Largeur du canvas spécifique
          height: canvasRect.height // Hauteur du canvas spécifique
        },
        containerPadding: {
          left: 0, // Pas de padding car on est relatif au canvas
          top: 0
        },
        pdfOffset: { left: 0, top: 0 }, // Pas de décalage car on est relatif au canvas
        useSmartPositioning: false, // Pas de positionnement intelligent pour le drag, juste les contraintes
        context: "DRAG_CANVAS_SPECIFIC"
      });
      
      console.log("✅ Position calculée relative au canvas:", finalPositionRelativeToCanvas);
      
      // 🚀 ÉTAPE 5: Convertir en position absolue dans le conteneur global
      const absolutePosition = {
        x: finalPositionRelativeToCanvas.x + (canvasRect.left - containerRect.left) + pdfContainer.scrollLeft,
        y: finalPositionRelativeToCanvas.y + (canvasRect.top - containerRect.top) + pdfContainer.scrollTop
      };
      
      console.log("📜 Scroll du conteneur:", { 
        scrollLeft: pdfContainer.scrollLeft, 
        scrollTop: pdfContainer.scrollTop 
      });
      console.log("📍 Position absolue dans le conteneur global (avec scroll canvas):", absolutePosition);
      setPosition(absolutePosition);
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      e.stopPropagation();
      e.preventDefault();

      console.log("🚀 === FIN DE DRAG SUR CANVAS SPÉCIFIQUE ===");
      setIsDragging(false);
      
      // 🚀 ÉTAPE 4: Vérifier si la position a changé
      const hasPositionChanged = Math.abs(position.x - field.x) > 1 || Math.abs(position.y - field.y) > 1;
      
      console.log("📊 Comparaison des positions:");
      console.log("  Position actuelle:", { x: position.x, y: position.y });
      console.log("  Position originale:", { x: field.x, y: field.y });
      console.log("  Position changée:", hasPositionChanged);
      
      if (!hasPositionChanged) {
        console.log("📍 Position inchangée, pas de sauvegarde nécessaire");
        return;
      }
      
      // 🚀 ÉTAPE 5: Validation finale et sauvegarde
      if (!isFinite(position.x) || !isFinite(position.y)) {
        console.error("❌ Coordonnées invalides:", { x: position.x, y: position.y });
        return;
      }
      
      console.log("💾 Sauvegarde de la nouvelle position:", { x: position.x, y: position.y });
      onUpdate(field.id, { x: position.x, y: position.y });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onUpdate, field.id, position, field.page, field.width, field.height, field.x, field.y]);
  
  // On initial mount, use the field coordinates directly since they are already normalized
  useEffect(() => {
    console.log("🚀 === INITIALISATION DU CHAMP ===");
    console.log("🎯 Field ID:", field.id);
    console.log("📍 Position du field:", { x: field.x, y: field.y });
    console.log("📏 Dimensions du field:", { width: field.width, height: field.height });
    console.log("📄 Page du field:", field.page);
    
    setPosition({ x: field.x, y: field.y });
    console.log("✅ Position initialisée");
  }, [field.x, field.y, field.id, field.width, field.height, field.page]);

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onRemove(field.id);
  };

  const fieldColor = signatory ? signatory.color : '#A0A0A0';

  return (
    <div
      className="absolute cursor-move group signature-field-wrapper"
      style={{
        left: pixelPos.x,
        top: pixelPos.y,
        zIndex: isDragging ? 1000 : 100,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="relative border-2 rounded-md flex items-center justify-center transition-all"
        style={{
          width: field.width,
          height: field.height,
          backgroundColor: `${fieldColor}20`,
          borderColor: fieldColor,
        }}
      >
        <div className="text-center select-none">
            <p className="text-sm font-bold" style={{color: fieldColor}}>{signatory ? signatory.name : 'Unassigned'}</p>
            <p className="text-xs text-gray-500">Signature</p>
        </div>
        <button
          onClick={handleDeleteClick}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove field"
        >
          X
        </button>
      </div>
    </div>
  );
}; 