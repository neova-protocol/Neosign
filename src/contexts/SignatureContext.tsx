import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
  signatures: string[];
  status: 'preparing' | 'pending' | 'signed' | 'declined';
}

export interface Document {
  id: string;
  name: string;
  file: File | null;
  fileUrl?: string;
  pages: number;
  fields: SignatureField[];
  signatories: Signatory[];
  status: 'draft' | 'sent' | 'completed';
  createdAt: Date;
  updatedAt: Date;
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
  
  // Document management
  createDocument: (file: File) => Promise<Document>;
  updateDocument: (document: Document) => void;
  
  // Signatory management
  addSignatory: (signatory: Partial<Signatory> & Omit<Signatory, 'signatures' | 'status'>) => void;
  updateSignatory: (id: string, updates: Partial<Signatory>) => void;
  removeSignatory: (id: string) => void;
  
  // Field management
  addField: (field: Omit<SignatureField, 'id'>) => void;
  updateField: (id: string, updates: Partial<SignatureField>) => void;
  removeField: (id: string) => void;
  
  // Signature management
  addSignature: (signatoryId: string, signature: string) => void;
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
  const { currentUser } = useAuth();

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const createDocument = useCallback(async (file: File): Promise<Document> => {
    const fileUrl = await fileToDataUrl(file);
    const document: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      file,
      fileUrl,
      pages: 1, // Will be updated when PDF loads
      fields: [],
      signatories: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [
        {
          id: `evt-${Date.now()}`,
          type: 'created',
          date: new Date(),
          userId: currentUser.id,
          userName: currentUser.name,
        },
      ],
    };
    
    setCurrentDocument(document);
    return document;
  }, [currentUser]);

  const updateDocument = useCallback((document: Document) => {
    setCurrentDocument(document);
  }, []);

  const addSignatory = useCallback((signatoryData: Partial<Signatory> & Omit<Signatory, 'signatures' | 'status'>) => {
    const newSignatory: Signatory = {
      id: signatoryData.id || `sig-${Date.now()}`,
      name: signatoryData.name,
      email: signatoryData.email,
      role: signatoryData.role,
      color: signatoryData.color,
      signatures: [],
      status: 'preparing',
    };

    setCurrentDocument(doc => {
      if (!doc) return null;
      // Prevent adding duplicates
      if (doc.signatories.some(s => s.id === newSignatory.id)) {
        return doc;
      }
      return {
        ...doc,
        signatories: [...doc.signatories, newSignatory],
        updatedAt: new Date()
      };
    });
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

  const addSignature = useCallback((signatoryId: string, signature: string) => {
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