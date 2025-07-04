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
    addSignatory as apiAddSignatory
} from '@/lib/api';
import { Document, Signatory, SignatureField, DocumentEvent } from '@/types';

type SignatureContextType = {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  currentDocument: Document | null;
  setCurrentDocument: React.Dispatch<React.SetStateAction<Document | null>>;
  addSignatory: (signatory: Omit<Signatory, 'id' | 'status' | 'userId'>) => Promise<void>;
  addField: (field: Omit<SignatureField, 'id'>) => Promise<void>;
  updateField: (id: string, updates: Partial<SignatureField>) => Promise<void>;
  removeField: (id: string) => Promise<void>;
};

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const SignatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  const addSignatory = useCallback(async (signatory: Omit<Signatory, 'id' | 'status' | 'userId'>) => {
    if (!currentDocument) return;

    const newSignatory: Signatory = {
      ...signatory,
      id: uuidv4(),
      status: 'preparing',
      userId: null,
    };

    setCurrentDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        signatories: [...prev.signatories, newSignatory]
      };
    });

    try {
      await apiAddSignatory(currentDocument.id, newSignatory);
    } catch (error) {
      console.error("Failed to add signatory", error);
      // Optionally rollback UI change
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
    const updatedField = await updateSignatureField(currentDocument.id, id, updates);
    setCurrentDocument(prev => {
        if (!prev) return null;
        return {
            ...prev,
            fields: prev.fields.map(f => f.id === id ? { ...f, ...updatedField } : f)
        };
    });
  }, [currentDocument]);

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

  const value = {
    documents,
    setDocuments,
    currentDocument,
    setCurrentDocument,
    addSignatory,
    addField,
    updateField,
    removeField,
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