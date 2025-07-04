"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSignature } from '@/contexts/SignatureContext';
import { getDocumentById } from '@/lib/api';
import { Document as AppDocument } from '@/contexts/SignatureContext';
import { FileText, Download, CheckCircle, Users, Clock, Edit } from 'lucide-react';
import Link from 'next/link';

// This will be a new component we create
const DocumentTimeline = ({ events }: { events: AppDocument['events'] }) => (
    <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Activity</h3>
        <div className="border-l-2 border-gray-300 pl-4">
            {events.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(event => (
                <div key={event.id} className="mb-4 relative">
                    <div className="absolute -left-5 w-4 h-4 bg-gray-300 rounded-full"></div>
                    <p className="font-semibold text-gray-700 capitalize">{event.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">{event.userName}</p>
                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleString()}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function DocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const documentId = params.documentId as string;
    const { currentDocument, setCurrentDocument } = useSignature();
    const [localDocument, setLocalDocument] = useState<AppDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (documentId) {
            getDocumentById(documentId).then(doc => {
                if (doc) {
                    setLocalDocument(doc);
                }
                setIsLoading(false);
            });
        }
    }, [documentId]);

    if (isLoading) {
        return <div className="p-8">Loading document details...</div>;
    }

    if (!localDocument) {
        return <div className="p-8">Document not found.</div>;
    }

    const { name, status, signatories, events } = localDocument;

    const selfAsSignatory = session?.user ? signatories.find(s => s.userId === session.user.id) : null;
    const canSign = selfAsSignatory && selfAsSignatory.status === 'pending';

    const getStatusIcon = (docStatus: string) => {
        switch(docStatus) {
            case 'completed': return <CheckCircle className="text-green-500" />;
            case 'sent': return <Clock className="text-yellow-500" />;
            default: return <Users className="text-gray-500" />;
        }
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                        <div className="flex items-center gap-2 mt-2 capitalize">
                           {getStatusIcon(status)}
                           <span className={`font-semibold ${status === 'completed' ? 'text-green-500' : 'text-gray-600'}`}>
                                {status}
                           </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {canSign && (
                             <Link href={`/dashboard/sign/document/${documentId}`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2">
                                <Edit size={18} /> Sign Document
                            </Link>
                        )}
                        <a href={localDocument.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                            <FileText size={18} /> View
                        </a>
                        <a href={`/api/documents/${documentId}/download`} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2">
                            <Download size={18} /> Download
                        </a>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                         <DocumentTimeline events={events} />
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold mb-4">Signatories</h3>
                         <div className="space-y-4">
                             {signatories.map(s => (
                                 <div key={s.id} className="p-4 border rounded-md">
                                     <p className="font-bold">{s.name}</p>
                                     <p className="text-sm text-gray-600">{s.email}</p>
                                     <p className={`text-sm font-semibold capitalize mt-1 ${s.status === 'signed' ? 'text-green-500' : 'text-yellow-500'}`}>{s.status}</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
} 