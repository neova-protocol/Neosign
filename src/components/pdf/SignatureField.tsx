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
import React, { useState, MouseEvent, useEffect, useCallback } from "react";
import { useSignature } from "@/contexts/SignatureContext";
import { SignatureField as SignatureFieldType } from "@/types";
import { calculateSignaturePosition } from "@/lib/utils";
import { 
  Type
} from "lucide-react";
import ParapheField from "./ParapheField";
import { Paraphe } from "@/types/paraphe";

interface SignatureFieldProps {
  field: SignatureFieldType;
  onUpdate: (id: string, updates: { x: number; y: number }) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onParapheSelect?: (fieldId: string, paraphe: Paraphe) => void;
}

export const SignatureFieldComponent: React.FC<SignatureFieldProps> = ({
  field,
  onUpdate,
  onRemove,
  onParapheSelect,
}) => {
  const { currentDocument } = useSignature();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: field.x, y: field.y });
  const [showParapheMenu, setShowParapheMenu] = useState(false);
  const dragStartOffset = React.useRef({ x: 0, y: 0 });

  const signatory = field.signatoryId
    ? currentDocument?.signatories.find((s) => s.id === field.signatoryId)
    : null;

  // Use coordinates directly as pixels - no conversion needed
  const pixelPos = { x: position.x, y: position.y };

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
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
      console.log("🎯 Position de la souris:", {
        clientX: e.clientX,
        clientY: e.clientY,
      });
      console.log("🎯 Rect du champ:", {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    },
    [field.id, position.x, position.y],
  );

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;

      // 🚀 ÉTAPE 2: Obtenir les informations du conteneur
      const container = document.querySelector(".pdf-container") as HTMLElement;
      if (!container) {
        console.error("❌ Conteneur PDF non trouvé");
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerScroll = {
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };

      console.log("🎯 Container rect:", {
        left: containerRect.left,
        top: containerRect.top,
        width: containerRect.width,
        height: containerRect.height,
      });
      console.log("🎯 Container scroll:", containerScroll);

      // 🚀 ÉTAPE 3: Calculer la nouvelle position
      const desiredPosition = {
        x: e.clientX - containerRect.left - dragStartOffset.current.x + containerScroll.scrollLeft,
        y: e.clientY - containerRect.top - dragStartOffset.current.y + containerScroll.scrollTop,
      };

      const newPosition = calculateSignaturePosition({
        desiredPosition,
        fieldDimensions: {
          width: field.width,
          height: field.height,
        },
        containerDimensions: {
          width: container.scrollWidth,
          height: container.scrollHeight,
        },
        containerPadding: { left: 32, top: 32 },
        useSmartPositioning: false, // Pas de décalage automatique pendant le drag
        context: "DRAG",
      });

      console.log("🎯 Nouvelle position calculée:", newPosition);

      // 🚀 ÉTAPE 4: Appliquer les contraintes
      const constrainedPosition = {
        x: Math.max(32, Math.min(newPosition.x, container.scrollWidth - field.width - 32)),
        y: Math.max(32, Math.min(newPosition.y, container.scrollHeight - field.height - 32)),
      };

      console.log("🎯 Position avec contraintes:", constrainedPosition);

      setPosition(constrainedPosition);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      console.log("🚀 === FIN DE DRAG ===");
      setIsDragging(false);

      // Vérifier si la position a réellement changé
      const hasPositionChanged =
        Math.abs(position.x - field.x) > 1 || Math.abs(position.y - field.y) > 1;

      if (!hasPositionChanged) {
        console.log("ℹ️ Position inchangée, pas de sauvegarde");
        return;
      }

      // 🚀 ÉTAPE 5: Validation finale et sauvegarde
      if (!isFinite(position.x) || !isFinite(position.y)) {
        console.error("❌ Coordonnées invalides:", {
          x: position.x,
          y: position.y,
        });
        return;
      }

      console.log("💾 Sauvegarde de la nouvelle position:", {
        x: position.x,
        y: position.y,
      });
      onUpdate(field.id, { x: position.x, y: position.y });
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    onUpdate,
    field.id,
    position,
    field.page,
    field.width,
    field.height,
    field.x,
    field.y,
  ]);

  // On initial mount, use the field coordinates directly since they are already normalized
  useEffect(() => {
    console.log("🚀 === INITIALISATION DU CHAMP ===");
    console.log("🎯 Field ID:", field.id);
    console.log("📍 Position du field:", { x: field.x, y: field.y });
    console.log("📏 Dimensions du field:", {
      width: field.width,
      height: field.height,
    });
    console.log("📄 Page du field:", field.page);

    setPosition({ x: field.x, y: field.y });
    console.log("✅ Position initialisée");
  }, [field.x, field.y, field.id, field.width, field.height, field.page]);

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onRemove(field.id);
  };

  const handleParapheMenuClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowParapheMenu(!showParapheMenu);
  };

  const handleParapheSelect = (paraphe: Paraphe) => {
    if (onParapheSelect) {
      onParapheSelect(field.id, paraphe);
    }
    setShowParapheMenu(false);
  };

  const fieldColor = signatory ? signatory.color : "#A0A0A0";

  // Different styling for paraphe fields
  const isParapheField = field.type === "paraphe";
  const displayColor = isParapheField ? "#10b981" : fieldColor;
  const displayText = isParapheField ? "Paraphe" : (signatory ? signatory.name : "Unassigned");
  const displaySubtext = isParapheField ? "Auto-rempli" : "Signature";

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
          backgroundColor: `${displayColor}20`,
          borderColor: displayColor,
        }}
      >
        <div className="text-center select-none">
          <p className="text-sm font-bold" style={{ color: displayColor }}>
            {displayText}
          </p>
          <p className="text-xs text-gray-500">{displaySubtext}</p>
        </div>
        
        {/* Menu paraphe - only for signature fields */}
        {!isParapheField && (
          <button
            onClick={handleParapheMenuClick}
            className="absolute -top-3 -left-3 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Paraphe options"
          >
            <Type className="w-3 h-3" />
          </button>
        )}

        {/* Bouton supprimer */}
        <button
          onClick={handleDeleteClick}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove field"
        >
          X
        </button>
      </div>

      {/* Menu paraphe - only for signature fields */}
      {!isParapheField && showParapheMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64 z-50">
          <ParapheField
            onParapheSelect={handleParapheSelect}
            onCancel={() => setShowParapheMenu(false)}
            signatoryName={signatory?.name || "Unknown"}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
