"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocumentsForUser } from '@/lib/api';
import { Document, Signatory } from '@/contexts/SignatureContext';
import { FileText, Clock, CheckCircle, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DocumentStatus: React.FC<{ document: Document; currentUserId: string }> = ({ document, currentUserId }) => {
  const userSignatory = document.signatories.find(s => s.id === currentUserId);

  if (document.status === 'completed') {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>Completed</span>
      </div>
    );
  }

  if (userSignatory?.status === 'signed') {
    return (
      <div className="flex items-center space-x-2 text-sm text-blue-600">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Waiting for others</span>
      </div>
    );
  }

  if (userSignatory?.status === 'pending') {
    return (
      <div className="flex items-center space-x-2 text-sm text-yellow-600">
        <Clock className="h-4 w-4" />
        <span>Awaiting your signature</span>
      </div>
    );
  }
  
  return null; // Should not happen in this view
};

const DocumentList: React.FC = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      const userDocs = await getDocumentsForUser(currentUser.id);
      setDocuments(userDocs);
      setIsLoading(false);
    };
    fetchDocuments();
  }, [currentUser]);

  const handleDocumentClick = (doc: Document) => {
    const userSignatory = doc.signatories.find(s => s.id === currentUser.id);

    if(userSignatory?.status === 'pending') {
      router.push(`/dashboard/sign/document/${doc.id}`);
    } else {
      router.push(`/dashboard/sign/status/${doc.id}`);
    }
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No documents to sign or track</h3>
        <p className="text-gray-500">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Documents</h2>
      <div className="bg-white rounded-lg border">
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleDocumentClick(doc)}
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-500">
                  Sent on {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <DocumentStatus document={doc} currentUserId={currentUser.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList; 