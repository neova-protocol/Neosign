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
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const dragStartOffset = React.useRef({ x: 0, y: 0 });

  const signatory = field.signatoryId ? currentDocument?.signatories.find(s => s.id === field.signatoryId) : null;

  // Use coordinates directly as pixels - no conversion needed
  const pixelPos = { x: position.x, y: position.y };

  const calculatePosition = useCallback((clientX: number, clientY: number) => {
    const pageElement = document.querySelector(`[data-page-number="${field.page}"]`);
    if (!pageElement) return { x: 0, y: 0 };

    // Find the relative div container inside the page (same as in creation)
    const relativeContainer = pageElement.querySelector('div[class="relative"]') as HTMLElement;
    if (!relativeContainer) return { x: 0, y: 0 };

    const pageRect = relativeContainer.getBoundingClientRect();
    const x = clientX - pageRect.left;
    const y = clientY - pageRect.top;

    return { x, y };
  }, [field.page]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    setHasBeenDragged(true); // Marquer qu'un drag a commencé
    
    // Calculate offset from mouse position to element position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragStartOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      // Get the container coordinates
      const pageElement = document.querySelector(`[data-page-number="${field.page}"]`);
      const relativeContainer = pageElement?.querySelector('div[class="relative"]') as HTMLElement;
      
      if (!relativeContainer) return;
      
      const containerRect = relativeContainer.getBoundingClientRect();
      
      // Calculate new position: mouse position relative to container minus the offset
      let newX = e.clientX - containerRect.left - dragStartOffset.current.x;
      let newY = e.clientY - containerRect.top - dragStartOffset.current.y;
    
      // Ensure the field stays within the container bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - field.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - field.height));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      e.stopPropagation();
      e.preventDefault();

      setIsDragging(false);
      
      // Ne sauvegarder que si la position a vraiment changé
      const hasPositionChanged = Math.abs(position.x - field.x) > 1 || Math.abs(position.y - field.y) > 1;
      
      if (!hasPositionChanged) {
        console.log(`📍 Position unchanged for field ${field.id}, skipping save`);
        return;
      }
      
      // Get the page element and calculate normalization factor
      const pageElement = document.querySelector(`[data-page-number="${field.page}"]`);
      if (!pageElement) return;

      const newPosition = { x: position.x, y: position.y };

      // Validation finale avant sauvegarde
      if (!isFinite(newPosition.x) || !isFinite(newPosition.y)) {
        console.error(`❌ Invalid coordinates calculated for field ${field.id}:`, {
          newPosition, position
        });
        return;
      }
      
      // Persist the raw pixel position to the backend
      console.log(`💾 Persisting field position for ${field.id}:`, newPosition);
      onUpdate(field.id, { x: newPosition.x, y: newPosition.y });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onUpdate, field.id, position, field.page, field.width, field.height]);
  
  // On initial mount, use the field coordinates directly since they are already normalized
  useEffect(() => {
    setPosition({ x: field.x, y: field.y });
  }, [field.x, field.y]);

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