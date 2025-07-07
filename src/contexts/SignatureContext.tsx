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
};

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const SignatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

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

    const newField = await apiAddSignatureField(currentDocument.id, field);

    if (newField) {
        setCurrentDocument(prev => {
            if (!prev) return null;
            return {
                ...prev,
                fields: [...prev.fields, newField]
            };
        });
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

    try {
        await updateSignatureField(currentDocument.id, id, updates);
    } catch (error) {
        console.error("Failed to update field, rolling back:", error);
        // Rollback on failure
        setCurrentDocument(prev => {
            if (!prev) return null;
            return { ...prev, fields: originalFields };
        });
        alert("Failed to save signature. Please try again.");
    }
  }, [currentDocument]);

  const updateFieldPositionInContext = async (fieldId: string, position: { x: number, y: number }) => {
    if (!currentDocument) return;
    const updatedField = await updateFieldPosition(currentDocument.id, fieldId, position);
    if (updatedField) {
      setCurrentDocument(prev => {
          if (!prev) return null;
          return {
              ...prev,
              fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updatedField } : f)
          };
      });
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