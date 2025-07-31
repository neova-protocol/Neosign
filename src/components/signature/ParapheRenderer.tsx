"use client";

import React from "react";
import { Paraphe } from "@/types/paraphe";

interface ParapheRendererProps {
  paraphe: Paraphe;
  width?: number;
  height?: number;
  className?: string;
}

export default function ParapheRenderer({
  paraphe,
  width = 200,
  height = 100,
  className = ""
}: ParapheRendererProps) {
  const renderParaphe = () => {
    switch (paraphe.type) {
      case 'text':
        return (
          <div
            className={`flex items-center justify-center ${className}`}
            style={{
              width,
              height,
              fontFamily: paraphe.font || 'Dancing Script, cursive',
              fontSize: paraphe.size || 24,
              color: paraphe.color || '#000000',
            }}
          >
            {paraphe.content}
          </div>
        );

      case 'drawing':
        return (
          <div className={`flex items-center justify-center ${className}`}>
            <img
              src={paraphe.content}
              alt={`Paraphe ${paraphe.name}`}
              style={{
                width,
                height,
                objectFit: 'contain',
              }}
            />
          </div>
        );

      case 'upload':
        return (
          <div className={`flex items-center justify-center ${className}`}>
            <img
              src={paraphe.content}
              alt={`Paraphe ${paraphe.name}`}
              style={{
                width,
                height,
                objectFit: 'contain',
              }}
            />
          </div>
        );

      default:
        return (
          <div className={`flex items-center justify-center text-gray-500 ${className}`}>
            Type de paraphe non supporté
          </div>
        );
    }
  };

  return (
    <div className="paraphe-renderer">
      {renderParaphe()}
    </div>
  );
} 