import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fonction utilitaire pour le positionnement intelligent des signatures
 * 
 * @param desiredPosition - Position désirée (x, y)
 * @param fieldDimensions - Dimensions du champ de signature
 * @param containerDimensions - Dimensions totales du conteneur scrollable
 * @param containerPadding - Padding du conteneur
 * @param useSmartPositioning - Active le positionnement intelligent (décalage automatique)
 * @param context - Contexte pour les logs (ex: "CLICK" ou "DRAG")
 * 
 * @returns Position calculée avec contraintes appliquées
 */
export function calculateSignaturePosition({
  desiredPosition,
  fieldDimensions,
  containerDimensions,
  containerPadding = { left: 32, top: 32 },
  pdfOffset = { left: 0, top: 0 },
  useSmartPositioning = false,
  context = "POSITIONING"
}: {
  desiredPosition: { x: number; y: number };
  fieldDimensions: { width: number; height: number };
  containerDimensions: { width: number; height: number };
  containerPadding?: { left: number; top: number };
  pdfOffset?: { left: number; top: number };
  useSmartPositioning?: boolean;
  context?: string;
}): { x: number; y: number } {
  
  console.log(`🔧 === ${context} - CALCUL DE POSITION ===`);
  console.log("📍 Position désirée:", desiredPosition);
  console.log("📏 Dimensions du champ:", fieldDimensions);
  console.log("📦 Dimensions du conteneur:", containerDimensions);
  console.log("🎯 Padding du conteneur:", containerPadding);
  console.log("🎯 Décalage du PDF:", pdfOffset);
  console.log("🔄 Positionnement intelligent:", useSmartPositioning);

  let finalX = desiredPosition.x;
  let finalY = desiredPosition.y;

  // 🔄 POSITIONNEMENT INTELLIGENT: Décaler si nécessaire
  if (useSmartPositioning) {
    console.log("🔄 === POSITIONNEMENT INTELLIGENT ===");
    
    // Vérifier si placer la signature à cette position (origine haut-gauche) la ferait sortir
    const wouldExceedRight = finalX + fieldDimensions.width > containerDimensions.width;
    const wouldExceedBottom = finalY + fieldDimensions.height > containerDimensions.height;
    
    console.log("🔍 Vérification des débordements:", {
      wouldExceedRight,
      wouldExceedBottom,
      rightEdge: finalX + fieldDimensions.width,
      bottomEdge: finalY + fieldDimensions.height,
      containerWidth: containerDimensions.width,
      containerHeight: containerDimensions.height
    });

    // Si le champ + sa largeur dépasse la largeur totale, on décale vers la gauche
    if (wouldExceedRight) {
      const oldX = finalX;
      finalX = desiredPosition.x - fieldDimensions.width;
      console.log("🔄 Décalage vers la gauche:", { oldX, newX: finalX, décalage: fieldDimensions.width });
    }

    // Si le champ + sa hauteur dépasse la hauteur totale, on décale vers le haut
    if (wouldExceedBottom) {
      const oldY = finalY;
      finalY = desiredPosition.y - fieldDimensions.height;
      console.log("🔄 Décalage vers le haut:", { oldY, newY: finalY, décalage: fieldDimensions.height });
    }

    console.log("📍 Position après décalage intelligent:", { x: finalX, y: finalY });
  }

  // 🔒 CONTRAINTES FINALES: S'assurer qu'on reste dans les limites du PDF
  console.log("🔒 === CONTRAINTES FINALES ===");
  
  // Contraintes minimum (padding)
  const minX = containerPadding.left;
  const minY = containerPadding.top;
  
  // Contraintes maximum (dimensions PDF - taille du champ)
  const maxX = containerDimensions.width - fieldDimensions.width - containerPadding.left;
  const maxY = containerDimensions.height - fieldDimensions.height - containerPadding.top;
  
  console.log("📏 Contraintes calculées:", {
    minX,
    maxX,
    minY,
    maxY,
    pdfWidth: containerDimensions.width,
    pdfHeight: containerDimensions.height
  });
  
  // Appliquer les contraintes
  const constrainedX = Math.max(minX, finalX);
  const constrainedY = Math.max(minY, finalY);
  
  finalX = Math.min(constrainedX, maxX);
  finalY = Math.min(constrainedY, maxY);

  console.log("📍 Position finale contrainte:", { x: finalX, y: finalY });

  // Validation finale
  if (!isFinite(finalX) || !isFinite(finalY)) {
    console.error("❌ Coordonnées finales invalides:", { x: finalX, y: finalY });
    return desiredPosition; // Retourner la position originale en cas d'erreur
  }

  console.log(`✅ ${context} - Position calculée avec succès:`, { x: finalX, y: finalY });
  console.log(`🔧 === FIN ${context} ===`);
  
  return { x: finalX, y: finalY };
}
