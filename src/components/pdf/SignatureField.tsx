/**
 * SignatureField - Composant de champ de signature déplaçable
 * 
 * SYSTÈME DE DRAG & DROP:
 * =======================
 * 
 * Le drag & drop utilise maintenant les contraintes du conteneur PDF global
 * (.pdf-container) au lieu des pages individuelles.
 * 
 * CONTRAINTES PENDANT LE DRAG:
 * - Gauche: minimum = padding gauche du conteneur (32px)
 * - Droite: maximum = largeur du conteneur - largeur du champ
 * - Haut: minimum = padding haut du conteneur (32px)
 * - Bas: maximum = hauteur du conteneur - hauteur du champ
 * 
 * GESTION DU SCROLL:
 * - Les calculs de position prennent en compte le scroll interne du conteneur PDF
 * - Formule: position = souris - containerRect - dragOffset + scroll du conteneur
 * - Cela corrige les décalages quand l'utilisateur fait défiler le PDF pendant le drag
 * 
 * Les coordonnées sont sauvegardées seulement si la position a réellement changé.
 */

"use client";
import React, { useState, MouseEvent, useEffect, useCallback } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { SignatureField as SignatureFieldType } from '@/types';

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

  // Use coordinates directly as pixels - no conversion needed
  const pixelPos = { x: position.x, y: position.y };

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

      console.log("🚀 === DRAG EN COURS (CONTENEUR PDF) ===");
      
      // 🚀 ÉTAPE 1: Obtenir les informations sur le conteneur PDF global
      const pdfContainer = document.querySelector('.pdf-container') as HTMLElement;
      if (!pdfContainer) {
        console.error("❌ Conteneur PDF non trouvé");
        return;
      }
      
      const containerRect = pdfContainer.getBoundingClientRect();
      console.log("📦 Conteneur PDF rect:", {
        x: containerRect.x,
        y: containerRect.y,
        width: containerRect.width,
        height: containerRect.height
      });

      // Obtenir la hauteur totale du contenu scrollable (toutes les pages)
      const totalContentHeight = pdfContainer.scrollHeight;
      const totalContentWidth = pdfContainer.scrollWidth;
      
      console.log("📏 Contenu total scrollable:", {
        width: totalContentWidth,
        height: totalContentHeight
      });

      // 🚀 ÉTAPE 2: Calculer la nouvelle position relative au conteneur PDF global
      // Position de la souris par rapport au conteneur PDF global (en enlevant l'offset du drag ET en tenant compte du scroll)
      let newX = e.clientX - containerRect.left - dragStartOffset.current.x + pdfContainer.scrollLeft;
      let newY = e.clientY - containerRect.top - dragStartOffset.current.y + pdfContainer.scrollTop;
      
      console.log("🎯 Position brute calculée (avec scroll):", { x: newX, y: newY });
      console.log("🎯 Mouse position:", { clientX: e.clientX, clientY: e.clientY });
      console.log("🎯 Drag offset:", dragStartOffset.current);
      console.log("📜 Scroll du conteneur:", { scrollLeft: pdfContainer.scrollLeft, scrollTop: pdfContainer.scrollTop });
      
      // 🚀 ÉTAPE 3: Appliquer les contraintes du conteneur PDF global
      // Prendre en compte le padding du conteneur (pt-8 pl-8 = 2rem = 32px)
      const paddingLeft = 32; // pl-8
      const paddingTop = 32;  // pt-8
      
      console.log("🎯 Padding du conteneur:", { paddingLeft, paddingTop });
      
      // Contrainte gauche (minimum = padding gauche)
      newX = Math.max(paddingLeft, newX);
      
      // Contrainte droite (ne pas dépasser la largeur du conteneur moins le champ)
      newX = Math.min(newX, containerRect.width - field.width);
      
      // Contrainte haut (minimum = padding haut)
      newY = Math.max(paddingTop, newY);
      
      // Contrainte bas (ne pas dépasser la hauteur du conteneur moins le champ)
      newY = Math.min(newY, totalContentHeight - field.height);
      
      console.log("📍 Position finale contrainte au conteneur PDF:", { x: newX, y: newY });
      console.log("📏 Field dimensions:", { width: field.width, height: field.height });
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      e.stopPropagation();
      e.preventDefault();

      console.log("🚀 === FIN DE DRAG (CONTENEUR PDF) ===");
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