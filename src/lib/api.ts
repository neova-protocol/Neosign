import type { Document as AppDocument } from '@/contexts/SignatureContext';
import { SignatureField } from '@/contexts/SignatureContext';

/**
 * Creates a new document in the database by calling the backend API.
 * @param name The name of the document.
 * @param fileUrl The URL of the uploaded PDF file.
 * @returns The newly created document, or null if an error occurred.
 */
export async function createDocument(name: string, fileUrl: string): Promise<AppDocument | null> {
    try {
        const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fileUrl }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to create document:', response.status, errorBody);
            return null;
        }

        // The API returns the full document object, which should match the AppDocument type
        const newDocument: AppDocument = await response.json();
        return newDocument;
    } catch (error) {
        console.error('An error occurred while creating the document:', error);
        return null;
    }
}

/**
 * Fetches all documents associated with the current user.
 * @returns An array of documents.
 */
export async function getDocumentsForUser(): Promise<AppDocument[]> {
    try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to fetch documents:', response.status, errorBody);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('An error occurred while fetching documents:', error);
        return [];
    }
}

/**
 * Fetches a single document by its ID.
 * @param documentId The ID of the document to fetch.
 * @returns The document, or null if not found or an error occurred.
 */
export async function getDocumentById(documentId: string): Promise<AppDocument | null> {
    if (!documentId) return null;
    try {
        const response = await fetch(`/api/documents/${documentId}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`Document ${documentId} not found.`);
            } else {
                const errorBody = await response.text();
                console.error(`Failed to fetch document ${documentId}:`, response.status, errorBody);
            }
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`An error occurred while fetching document ${documentId}:`, error);
        return null;
    }
}

/**
 * Deletes a signature field from a document.
 * @param documentId The ID of the document.
 * @param fieldId The ID of the field to delete.
 * @returns True if successful, false otherwise.
 */
export async function deleteSignatureField(documentId: string, fieldId: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/documents/${documentId}/fields/${fieldId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to delete field ${fieldId}:`, response.status, errorBody);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`An error occurred while deleting field ${fieldId}:`, error);
        return false;
    }
}

/**
 * Adds a new signature field to a document.
 * @param documentId The ID of the document.
 * @param fieldData The data for the new field.
 * @returns The newly created field object from the database, or null if an error occurred.
 */
export async function addSignatureField(documentId: string, fieldData: Omit<SignatureField, 'id'>): Promise<SignatureField | null> {
    try {
        const response = await fetch(`/api/documents/${documentId}/fields`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fieldData),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to add field:`, response.status, errorBody);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`An error occurred while adding a field:`, error);
        return null;
    }
}

/**
 * Sends a document for signature.
 * @param documentId The ID of the document to send.
 * @returns The updated document if successful, null otherwise.
 */
export async function sendDocumentForSignature(documentId: string): Promise<AppDocument | null> {
    try {
        const response = await fetch(`/api/send-document`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to send document ${documentId}:`, response.status, errorBody);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`An error occurred while sending document ${documentId}:`, error);
        return null;
    }
}

/**
 * Updates a signature field's properties.
 * @param documentId The ID of the document.
 * @param fieldId The ID of the field to update.
 * @param updates The properties to update.
 * @returns The updated field object, or null if an error occurred.
 */
export async function updateSignatureField(documentId: string, fieldId: string, updates: Partial<SignatureField>): Promise<SignatureField | null> {
    try {
        const response = await fetch(`/api/documents/${documentId}/fields/${fieldId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Failed to update field ${fieldId}:`, response.status, errorBody);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`An error occurred while updating field ${fieldId}:`, error);
        return null;
    }
}
