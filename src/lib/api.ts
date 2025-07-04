import { Document, DocumentEvent } from '@/contexts/SignatureContext';
import { User } from '@/contexts/AuthContext';

const DOCUMENTS_KEY = 'neosign_documents';

const getStoredDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(DOCUMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredDocuments = (documents: Document[]) => {
  if (typeof window === 'undefined') return;
  // Create a serializable version of the documents
  const serializableDocuments = documents.map(doc => {
    const { file, ...rest } = doc; // Destructure to remove the 'file' property
    return rest;
  });
  window.localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(serializableDocuments));
};

/**
 * Simulates saving the document to a backend.
 * In a real application, this would be a POST/PUT request to your API.
 */
export const saveDocument = (document: Document): Promise<{ success: boolean; documentId: string }> => {
  console.log('Saving document...', document);
  return new Promise((resolve) => {
    setTimeout(() => {
      const documents = getStoredDocuments();
      const existingIndex = documents.findIndex(d => d.id === document.id);
      if (existingIndex > -1) {
        documents[existingIndex] = document;
      } else {
        documents.push(document);
      }
      setStoredDocuments(documents);
      console.log('Document saved successfully. ID:', document.id);
      resolve({ success: true, documentId: document.id });
    }, 500);
  });
};

/**
 * Simulates sending the document for signature.
 * This would typically finalize the document, change its status to 'sent',
 * and trigger backend processes (e.g., sending emails to signatories).
 */
export const sendDocumentForSignature = (document: Document, sender: User): Promise<{ success: boolean; message: string }> => {
  console.log('Sending document for signature...', document);
  return new Promise(async (resolve) => {
    try {
      const sentEvent: DocumentEvent = {
        id: `evt-${Date.now()}`,
        type: 'sent',
        date: new Date(),
        userId: sender.id,
        userName: sender.name
      };

      const docWithPendingSignatories = {
        ...document,
        signatories: document.signatories.map(s => ({ 
          ...s, 
          status: s.status === 'preparing' ? 'pending' : s.status 
        })),
        status: 'sent' as const,
        events: [...(document.events || []), sentEvent],
      };

      await saveDocument(docWithPendingSignatories);

      console.log('Document sent to all signatories.');
      resolve({ success: true, message: 'Document sent successfully!' });
    } catch (error) {
      console.error("Failed to send document during save process:", error);
      resolve({ success: false, message: 'Failed to send document.' });
    }
  });
};

export const getDocumentsForUser = (userId: string): Promise<Document[]> => {
  console.log(`Fetching documents for user ${userId}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const allDocuments = getStoredDocuments();
      const userDocuments = allDocuments.filter(doc => 
        doc.status !== 'draft' && doc.signatories.some(sig => sig.id === userId)
      );
      console.log(`Found ${userDocuments.length} documents for user ${userId}.`);
      resolve(userDocuments);
    }, 500);
  });
};

export const getDocumentById = (documentId: string): Promise<Document | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const documents = getStoredDocuments();
            const document = documents.find(doc => doc.id === documentId) || null;
            resolve(document);
        }, 200);
    });
}; 