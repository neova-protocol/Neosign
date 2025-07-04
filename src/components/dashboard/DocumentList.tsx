"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getDocumentsForUser } from '@/lib/api';
import { Document } from '@/contexts/SignatureContext';
import { FileText, Clock, CheckCircle, Loader, Edit, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const DocumentStatus: React.FC<{ doc: Document, userId: string }> = ({ doc, userId }) => {
    let statusConfig = {
        text: "Draft",
        Icon: FileText,
        colorClass: "text-gray-500",
    };

    switch (doc.status) {
        case 'completed':
            statusConfig = { text: "Completed", Icon: CheckCircle, colorClass: "text-green-600" };
            break;
        case 'sent':
            const mySignatoryInfo = doc.signatories.find(s => s.userId === userId);
            if (mySignatoryInfo && mySignatoryInfo.status === 'pending') {
                statusConfig = { text: "Signature Required", Icon: Edit, colorClass: "text-orange-500" };
            } else {
                statusConfig = { text: "In Progress", Icon: Clock, colorClass: "text-blue-500" };
            }
            break;
        case 'draft':
            // Already default
            break;
        // case 'cancelled': // For future use
        //     statusConfig = { text: "Cancelled", Icon: AlertCircle, colorClass: "text-red-600" };
        //     break;
    }

    return (
        <span className={`flex items-center text-sm font-semibold ${statusConfig.colorClass}`}>
            <statusConfig.Icon className="w-4 h-4 mr-1" />
            {statusConfig.text}
        </span>
    );
};

const DocumentList: React.FC = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const loadDocuments = async () => {
        setIsLoading(true);
        const userDocs = await getDocumentsForUser();
        setDocuments(userDocs);
        setIsLoading(false);
      };
      loadDocuments();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center p-10">
        <p>Please log in to see your documents.</p>
      </div>
    )
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
              className="block p-4 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
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
                  <DocumentStatus doc={doc} userId={session.user.id!} />
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