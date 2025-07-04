import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SignatureData } from '@/components/signature/SignatureDialog';

export interface Signatory {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  signatures: SignatureData[];
  status: 'pending' | 'signed' | 'declined';
}

export interface Document {
  id: string;
  name: string;
  file: File | null;
  pages: number;
  fields: SignatureField[];
  signatories: Signatory[];
  status: 'draft' | 'sent' | 'completed';
  createdAt: Date;
  updatedAt: Date;
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
}

interface SignatureContextType {
  currentDocument: Document | null;
  setCurrentDocument: (document: Document | null) => void;
  
  // Document management
  createDocument: (file: File) => Document;
  updateDocument: (document: Document) => void;
  
  // Signatory management
  addSignatory: (signatory: Omit<Signatory, 'id' | 'signatures' | 'status'>) => void;
  updateSignatory: (id: string, updates: Partial<Signatory>) => void;
  removeSignatory: (id: string) => void;
  
  // Field management
  addField: (field: Omit<SignatureField, 'id'>) => void;
  updateField: (id: string, updates: Partial<SignatureField>) => void;
  removeField: (id: string) => void;
  
  // Signature management
  addSignature: (signatoryId: string, signature: SignatureData) => void;
  getSignatoryFields: (signatoryId: string) => SignatureField[];
}

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export const useSignature = () => {
  const context = useContext(SignatureContext);
  if (context === undefined) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }
  return context;
};

interface SignatureProviderProps {
  children: ReactNode;
}

export const SignatureProvider: React.FC<SignatureProviderProps> = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  const createDocument = useCallback((file: File): Document => {
    const document: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      file,
      pages: 1, // Will be updated when PDF loads
      fields: [],
      signatories: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentDocument(document);
    return document;
  }, []);

  const updateDocument = useCallback((document: Document) => {
    setCurrentDocument(document);
  }, []);

  const addSignatory = useCallback((signatoryData: Omit<Signatory, 'id' | 'signatures' | 'status'>) => {
    const newSignatory: Signatory = {
      ...signatoryData,
      id: `sig-${Date.now()}`,
      signatures: [],
      status: 'pending'
    };

    setCurrentDocument(doc => doc ? {
      ...doc,
      signatories: [...doc.signatories, newSignatory],
      updatedAt: new Date()
    } : null);
  }, []);

  const updateSignatory = useCallback((id: string, updates: Partial<Signatory>) => {
    setCurrentDocument(doc => doc ? {
      ...doc,
      signatories: doc.signatories.map(sig =>
        sig.id === id ? { ...sig, ...updates } : sig
      ),
      updatedAt: new Date()
    } : null);
  }, []);

  const removeSignatory = useCallback((id: string) => {
    setCurrentDocument(doc => doc ? {
      ...doc,
      signatories: doc.signatories.filter(sig => sig.id !== id),
      fields: doc.fields.filter(field => field.signatoryId !== id),
      updatedAt: new Date()
    } : null);
  }, []);

  const addField = useCallback((fieldData: Omit<SignatureField, 'id'>) => {
    const newField: SignatureField = {
      ...fieldData,
      id: `field-${Date.now()}`
    };

    setCurrentDocument(doc => doc ? {
      ...doc,
      fields: [...doc.fields, newField],
      updatedAt: new Date()
    } : null);
  }, []);

  const updateField = useCallback((id: string, updates: Partial<SignatureField>) => {
    setCurrentDocument(doc => doc ? {
      ...doc,
      fields: doc.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      ),
      updatedAt: new Date()
    } : null);
  }, []);

  const removeField = useCallback((id: string) => {
    setCurrentDocument(doc => doc ? {
      ...doc,
      fields: doc.fields.filter(field => field.id !== id),
      updatedAt: new Date()
    } : null);
  }, []);

  const addSignature = useCallback((signatoryId: string, signature: SignatureData) => {
    setCurrentDocument(doc => doc ? {
      ...doc,
      signatories: doc.signatories.map(sig =>
        sig.id === signatoryId
          ? { ...sig, signatures: [...sig.signatures, signature] }
          : sig
      ),
      updatedAt: new Date()
    } : null);
  }, []);

  const getSignatoryFields = useCallback((signatoryId: string): SignatureField[] => {
    if (!currentDocument) return [];
    
    return currentDocument.fields.filter(
      field => field.signatoryId === signatoryId
    );
  }, [currentDocument]);

  const value: SignatureContextType = {
    currentDocument,
    setCurrentDocument,
    createDocument,
    updateDocument,
    addSignatory,
    updateSignatory,
    removeSignatory,
    addField,
    updateField,
    removeField,
    addSignature,
    getSignatoryFields
  };

  return (
    <SignatureContext.Provider value={value}>
      {children}
    </SignatureContext.Provider>
  );
};

export default SignatureProvider; 