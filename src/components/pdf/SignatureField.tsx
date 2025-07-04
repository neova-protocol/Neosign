"use client";
import React, { useState, MouseEvent, useEffect } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { Signatory, SignatureField as SignatureFieldType } from '@/contexts/SignatureContext';

interface SignatureFieldProps {
  field: SignatureFieldType;
  onUpdate: (id: string, updates: Partial<SignatureFieldType>) => void;
  onRemove: (id: string) => void;
  pageNumber: number;
}

const SignatureField: React.FC<SignatureFieldProps> = ({
  field,
  onUpdate,
  onRemove,
}) => {
  const { currentDocument } = useSignature();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const signatories = currentDocument?.signatories || [];
  const signatory = field.signatoryId ? signatories.find(s => s.id === field.signatoryId) : null;

  const handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDragStart({ x: e.clientX - field.x, y: e.clientY - field.y });
    setIsDragging(true);
  };

  const handleFieldClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdate(field.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onUpdate, field.id]);
  
  const fieldColor = signatory ? signatory.color : '#A0A0A0';

  return (
    <div
      className="absolute cursor-move"
      style={{
        left: field.x,
        top: field.y,
        zIndex: isDragging ? 1000 : 100,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleFieldClick}
    >
      {signatory && (
        <div 
          className="text-sm font-semibold text-gray-800"
          style={{ paddingBottom: '4px' }}
        >
          {signatory.name}
        </div>
      )}
      <div
        className="relative border-2 rounded-md flex items-center justify-center"
        style={{
          width: field.width,
          height: field.height,
          backgroundColor: `${fieldColor}20`,
          borderColor: fieldColor,
        }}
      >
        <span className="text-lg italic text-gray-500">
          Sign here
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(field.id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
          aria-label="Remove field"
        >
          X
        </button>
      </div>
    </div>
  );
};

export const SignatureFieldComponent = React.memo(SignatureField); 