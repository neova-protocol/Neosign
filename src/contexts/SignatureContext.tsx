"use client"
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
    getDocumentById,
    getDocumentsForUser,
    createDocument,
    deleteSignatureField,
    addSignatureField,
    updateSignatureField
} from '@/lib/api';

export interface DocumentEvent {
  id: string;
  type: 'created' | 'sent' | 'consulted' | 'signed' | 'reminder';
  date: Date;
  userId: string;
  userName: string;
}

export interface Signatory {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  status: 'preparing' | 'pending' | 'signed' | 'declined';
  userId: string | null;
}

export interface Document {
  id: string;
  name: string;
  file: File | null;
  fileUrl?: string;
  fields: SignatureField[];
  signatories: Signatory[];
  status: 'draft' | 'sent' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  events: DocumentEvent[];
}

export interface SignatureField {
  id: string;
  type: 'signature' | 'text' | 'date';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  signatoryId: string | null;
  value?: string;
}

interface SignatureContextType {
  currentDocument: Document | null;
  setCurrentDocument: (document: Document | null) => void;
  createNewDocument: (file: File) => string;
  addSignatory: (signatory: Omit<Signatory, 'status'>) => void;
  updateSignatory: (id: string, updates: Partial<Signatory>) => void;
  removeSignatory: (id: string) => void;
  addField: (field: Omit<SignatureField, 'id'>) => Promise<void>;
  updateField: (id: string, updates: Partial<SignatureField>) => Promise<void>;
  removeField: (id: string) => Promise<void>;
}

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const useSignature = () => {
  const context = useContext(SignatureContext);
  if (context === undefined) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }
  return context;
};

export const SignatureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const createNewDocument = (file: File) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      file,
      fileUrl: URL.createObjectURL(file),
      status: 'draft',
      signatories: [],
      fields: [],
      events: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: '',
    };
    setCurrentDocument(newDoc);
    return newDoc.id;
  };

  const addSignatory = useCallback((signatory: Omit<Signatory, 'status'>) => {
    setCurrentDocument(prev => {
      if (!prev) return null;
      const newSignatory: Signatory = { ...signatory, status: 'preparing' };
      if (prev.signatories.some(s => s.id === newSignatory.id)) {
        return prev;
      }
      return {
        ...prev,
        signatories: [...prev.signatories, newSignatory]
      };
    });
  }, []);

  const updateSignatory = useCallback((id: string, updates: Partial<Signatory>) => {
    setCurrentDocument(prev => prev ? {
      ...prev,
      signatories: prev.signatories.map(s => s.id === id ? { ...s, ...updates } : s)
    } : null);
  }, []);

  const removeSignatory = useCallback((id: string) => {
    setCurrentDocument(prev => prev ? {
      ...prev,
      signatories: prev.signatories.filter(s => s.id !== id),
      fields: prev.fields.filter(f => f.signatoryId !== id)
    } : null);
  }, []);

  const addField = useCallback(async (field: Omit<SignatureField, 'id'>) => {
    if (!currentDocument) return;

    const newField = await addSignatureField(currentDocument.id, field);

    if (newField) {
      setCurrentDocument(prev => prev ? {
        ...prev,
        fields: [...prev.fields, newField]
      } : null);
    } else {
      alert("Failed to add field.");
    }
  }, [currentDocument]);

  const updateField = useCallback(async (id: string, updates: Partial<SignatureField>) => {
    if (!currentDocument) return;

    // Optimistic update: update the UI immediately
    setCurrentDocument(prev => prev ? {
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    } : null);

    // Then, call the API to persist the change
    const updatedField = await updateSignatureField(currentDocument.id, id, updates);

    if (!updatedField) {
      // If the API call fails, revert the change
      alert('Failed to update field. Reverting changes.');
      // This requires fetching the original state or a more complex state management
      // For now, we'll just alert the user. A full solution might involve refetching the document.
      getDocumentById(currentDocument.id).then(doc => {
          if (doc) setCurrentDocument(doc);
      });
    }
  }, [currentDocument]);

  const removeField = useCallback(async (id: string) => {
    if (!currentDocument) return;

    const success = await deleteSignatureField(currentDocument.id, id);

    if (success) {
      setCurrentDocument(prev => prev ? {
        ...prev,
        fields: prev.fields.filter(f => f.id !== id)
      } : null);
    } else {
      alert("Failed to delete field.");
    }
  }, [currentDocument]);

  const value = {
    currentDocument,
    setCurrentDocument,
    createNewDocument,
    addSignatory,
    updateSignatory,
    removeSignatory,
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

export default SignatureProvider; 