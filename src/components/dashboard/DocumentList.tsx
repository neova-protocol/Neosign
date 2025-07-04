"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getDocuments, deleteDocument } from '@/lib/api';
import { Document } from '@prisma/client';
import { FileText, Clock, CheckCircle, AlertTriangle, Edit, MoreVertical, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type DocumentWithSignatories = Document & {
  signatories: { id: string; userId: string | null; status: string }[];
};

const getStatus = (doc: DocumentWithSignatories, userId: string) => {
  switch (doc.status.toLowerCase()) {
    case 'draft':
      return { text: 'Draft', color: 'gray', Icon: Edit };
    case 'completed':
      return { text: 'Completed', color: 'green', Icon: CheckCircle };
    case 'cancelled':
      return { text: 'Cancelled', color: 'red', Icon: XCircle };
    case 'sent':
      const userSignatory = doc.signatories.find(s => s.userId === userId);
      if (userSignatory && userSignatory.status.toLowerCase() === 'pending') {
        return { text: 'Signature Required', color: 'orange', Icon: AlertTriangle };
      }
      return { text: 'Waiting for Others', color: 'blue', Icon: Clock };
    default:
      return { text: 'Unknown', color: 'gray', Icon: AlertTriangle };
  }
};

const DocumentStatus: React.FC<{ doc: DocumentWithSignatories, userId: string }> = ({ doc, userId }) => {
    const status = getStatus(doc, userId);
    const colorVariants: { [key: string]: string } = {
        gray: 'text-gray-500 bg-gray-100',
        green: 'text-green-600 bg-green-100',
        orange: 'text-orange-600 bg-orange-100',
        blue: 'text-blue-600 bg-blue-100',
        red: 'text-red-600 bg-red-100',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorVariants[status.color]}`}>
            <status.Icon className="w-4 h-4 mr-1.5" />
            {status.text}
        </span>
    );
};

const DocumentList: React.FC = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<DocumentWithSignatories[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (session) {
      try {
        setLoading(true);
        const docs = await getDocuments();
        // sort documents by updatedAt date
        docs.sort((a: DocumentWithSignatories, b: DocumentWithSignatories) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (openMenuId && !(event.target as HTMLElement).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [openMenuId]);


  const handleDelete = async (docId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await deleteDocument(docId);
        setDocuments(prevDocs => prevDocs.filter(d => d.id !== docId));
        setOpenMenuId(null);
      } catch (error) {
        console.error('Failed to delete document:', error);
        alert('Failed to delete document. See console for details.');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading documents...</div>;
  }

  if (!session) {
    return <div className="text-center p-10">Please log in to see your documents.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">My Documents</h2>
      </div>
      <div>
        {documents.length > 0 ? (
          documents.map(doc => (
            <Link 
              key={doc.id} 
              href={`/dashboard/documents/${doc.id}`} 
              className="group block"
            >
              <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-500" />
                  <div>
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Last updated: {format(new Date(doc.updatedAt), 'PPpp')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="group-hover:hidden">
                    <DocumentStatus doc={doc} userId={session.user.id!} />
                  </div>
                  <div className="hidden group-hover:block relative menu-container">
                    <button
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {openMenuId === doc.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <ul className="py-1">
                              <li>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => alert('Reminders sent!')}>
                                      Relancer les signataires
                                  </button>
                              </li>
                              <li>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => alert('Workflow cancelled!')}>
                                      Annuler les signatures
                                  </button>
                              </li>
                              {doc.status.toLowerCase() === 'draft' && (
                                  <>
                                    <div className="border-t my-1"></div>
                                    <li>
                                        <button 
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(doc.id);
                                            }}
                                        >
                                            Supprimer
                                        </button>
                                    </li>
                                  </>
                              )}
                          </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center p-10">
            <p>You have no documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList; 