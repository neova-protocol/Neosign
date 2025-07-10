"use client"
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    getDocumentById,
    getDocumentsForUser,
    createDocument as apiCreateDocument,
    deleteSignatureField,
    addSignatureField as apiAddSignatureField,
    updateSignatureField,
    addSignatory as apiAddSignatory,
    updateFieldPosition
} from '@/lib/api';
import { Document, Signatory, SignatureField, DocumentEvent } from '@/types';

type SignatureContextType = {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  currentDocument: Document | null;
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document | null>>;
  refreshDocument: (documentId: string) => Promise<void>;
  addSignatory: (signatory: Omit<Signatory, 'id' | 'status' | 'userId'>) => Promise<Signatory | null>;
  removeSignatory: (signatoryId: string) => void;
  addField: (field: Omit<SignatureField, 'id'>) => Promise<void>;
  updateField: (id: string, updates: Partial<SignatureField>) => Promise<void>;
  removeField: (id: string) => Promise<void>;
  updateFieldPosition: (fieldId: string, position: { x: number, y: number }) => Promise<void>;
  viewVersion: number;
};

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const SignatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewVersion, setViewVersion] = useState(0);

  const refreshDocument = useCallback(async (documentId: string) => {
    const freshDocument = await getDocumentById(documentId);
    if (freshDocument) {
      setCurrentDocument(freshDocument);
    }
  }, []);

  const addSignatory = useCallback(async (signatory: Omit<Signatory, 'id' | 'status' | 'userId'>) => {
    if (!currentDocument) return;

    try {
      // Call the API first to get the real database ID
      const newSignatory = await apiAddSignatory(currentDocument.id, signatory);
      
      if (newSignatory) {
        // Update the local state with the signatory that has the correct database ID
        setCurrentDocument(prev => {
          if (!prev) return null;
          return {
            ...prev,
            signatories: [...prev.signatories, newSignatory]
          };
        });
      }
      
      return newSignatory;
    } catch (error) {
      console.error("Failed to add signatory", error);
      return null;
    }
  }, [currentDocument]);

  const addField = useCallback(async (field: Omit<SignatureField, 'id'>) => {
    if (!currentDocument) return;

    console.log("🔥 addField called in context with:", field);
    console.log("🔍 Field coordinates check:", {
      x: { value: field.x, type: typeof field.x, isValid: typeof field.x === 'number' },
      y: { value: field.y, type: typeof field.y, isValid: typeof field.y === 'number' },
      width: { value: field.width, type: typeof field.width, isValid: typeof field.width === 'number' },
      height: { value: field.height, type: typeof field.height, isValid: typeof field.height === 'number' }
    });

    const newField = await apiAddSignatureField(currentDocument.id, field);

    if (newField) {
        console.log("✅ Field created successfully, updating state");
        setCurrentDocument(prev => {
            if (!prev) return null;
            return {
                ...prev,
                fields: [...prev.fields, newField]
            };
        });
    } else {
        console.error("❌ Failed to create field");
    }
  }, [currentDocument]);

  const updateField = useCallback(async (id: string, updates: Partial<SignatureField>) => {
    if (!currentDocument) return;

    const originalFields = currentDocument.fields;
    
    // Optimistic update
    setCurrentDocument(prev => {
        if (!prev) return null;
        return {
            ...prev,
            fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
        };
    });
    setViewVersion(v => v + 1);

    try {
        await updateSignatureField(currentDocument.id, id, updates);
    } catch (error) {
        console.error("Failed to update field, rolling back:", error);
        // Rollback on failure
        setCurrentDocument(prev => {
            if (!prev) return null;
            return { ...prev, fields: originalFields };
        });
        setViewVersion(v => v + 1);
        alert("Failed to save signature. Please try again.");
    }
  }, [currentDocument]);

  const updateFieldPositionInContext = async (fieldId: string, position: { x: number, y: number }) => {
    if (!currentDocument) return;
    
    console.log("🔄 updateFieldPositionInContext called with:", {
      fieldId,
      position,
      positionType: typeof position,
      xType: typeof position?.x,
      yType: typeof position?.y
    });
    
    // Validation des coordonnées avant envoi à l'API
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' || 
        !isFinite(position.x) || !isFinite(position.y)) {
      console.error("❌ Invalid position data:", position);
      return;
    }
    
    try {
      const updatedField = await updateFieldPosition(currentDocument.id, fieldId, position);
      if (updatedField) {
        console.log("✅ Field position updated, updating local state");
        setCurrentDocument(prev => {
            if (!prev) return null;
            return {
                ...prev,
                fields: prev.fields.map(f => f.id === fieldId ? { ...f, x: position.x, y: position.y } : f)
            };
        });
      } else {
        console.error("❌ Failed to update field position");
      }
    } catch (error) {
      console.error("💥 Error updating field position:", error);
    }
  };

  const removeField = useCallback(async (id: string) => {
    if (!currentDocument) return;
    await deleteSignatureField(currentDocument.id, id);
    setCurrentDocument(prev => {
        if (!prev) return null;
        return {
            ...prev,
            fields: prev.fields.filter(f => f.id !== id)
        };
    });
  }, [currentDocument]);

  const removeSignatory = useCallback((signatoryId: string) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        signatories: prev.signatories.filter(s => s.id !== signatoryId)
      };
    });
  }, []);

  const value = {
    documents,
    setDocuments,
    currentDocument,
    setCurrentDocument,
    refreshDocument,
    addSignatory,
    removeSignatory,
    addField,
    updateField,
    removeField,
    updateFieldPosition: updateFieldPositionInContext,
    viewVersion,
  };

  return (
    <SignatureContext.Provider value={value}>
      {children}
    </SignatureContext.Provider>
  );
};

export const useSignature = () => {
  const context = useContext(SignatureContext);
  if (context === undefined) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }
  return context;
};

export default SignatureProvider; 