"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDocumentById } from '@/lib/api';
import { Document, DocumentEvent, Signatory } from '@/contexts/SignatureContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Edit, Eye, MousePointerClick, Send, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const eventIcons = {
    created: <Edit className="h-5 w-5 text-gray-700" />,
    sent: <Send className="h-5 w-5 text-gray-700" />,
    consulted: <Eye className="h-5 w-5 text-gray-700" />,
    signed: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
    reminder: <Clock className="h-5 w-5 text-gray-700" />,
};

const getEventDescription = (event: DocumentEvent) => {
    switch (event.type) {
        case 'created': return 'Invitation created';
        case 'sent': return 'Invitation sent';
        case 'consulted': return 'Document consulted';
        case 'signed': return 'Document signed';
        case 'reminder': return 'Automatic reminder sent';
        default: return 'Event occurred';
    }
}

const TimelineEvent: React.FC<{ event: DocumentEvent, isLast: boolean }> = ({ event, isLast }) => (
    <div className="flex-1 flex flex-col items-center relative">
        <p className="text-xs text-gray-500 mb-3">{new Date(event.date).toLocaleDateString()}</p>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white ring-1 ring-gray-300 z-10">
            {eventIcons[event.type]}
        </div>
        <p className="text-sm font-medium text-gray-800 mt-2 text-center w-28">{getEventDescription(event)}</p>
        <p className="text-xs text-gray-500 mt-1">{event.userName}</p>
        {!isLast && <div className="absolute top-8 left-1/2 w-full h-px bg-gray-300"></div>}
    </div>
);


const SignatoryStatus: React.FC<{ signatory: Signatory, isFirst: boolean }> = ({ signatory, isFirst }) => {
    const isSigned = signatory.status === 'signed';
    return (
        <div className={`pt-3 ${isSigned && !isFirst ? 'border-t-2 border-green-500' : ''} ${!isSigned && !isFirst ? 'border-t' : ''}`}>
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-gray-800">{signatory.name}</p>
                    <p className="text-sm text-gray-500">{signatory.email}</p>
                    {isSigned && <p className="text-sm text-gray-500">Valid proof of identity</p>}
                </div>
                {isSigned ? (
                     <div className="flex items-center space-x-2 text-green-600">
                        <span className="font-semibold">Signed</span>
                        <MoreHorizontal className="text-gray-400" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-yellow-600">
                        <span className="font-semibold">Pending</span>
                         <MoreHorizontal className="text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    );
};


export default function DocumentStatusPage() {
  const { documentId } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (typeof documentId === 'string') {
      getDocumentById(documentId).then(doc => {
        if (!doc) router.push('/dashboard/sign');
        else setDocument(doc);
      });
    }
  }, [documentId, router]);

  if (!document) return <div className="flex items-center justify-center h-screen bg-gray-50">Loading document...</div>;
  
  const creationEvent = (document.events || []).find(e => e.type === 'created');
  const senderName = creationEvent?.userName || 'Unknown';
  const timeAgo = creationEvent ? formatDistanceToNow(new Date(creationEvent.date)) : '';
  const isCompleted = document.status === 'completed';

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8">
            {/* Top Section */}
            <div className="flex justify-between items-start pb-8">
                <div className="flex items-center space-x-6">
                    <div className="w-28 h-40 bg-gray-100 border rounded-md flex flex-col items-center justify-center p-2">
                         <div className="flex-grow w-full bg-white border flex items-center justify-center">
                            <p className="text-xs text-gray-400">Preview</p>
                         </div>
                         <Button size="sm" className="mt-2 w-full" onClick={() => router.push(`/dashboard/sign/document/${documentId}`)}>See</Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{document.name}</h1>
                        <p className="text-gray-600">Sent by {senderName} as Neova</p>
                        <div className="flex items-center space-x-2 text-gray-500 mt-2">
                            <Send className="h-4 w-4 transform -rotate-45" />
                            <span>{timeAgo} ago</span>
                        </div>
                        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">Download the document</Button>
                    </div>
                </div>
                
                <div className="w-full max-w-md">
                    <div className="flex items-center space-x-2 text-green-600 font-semibold mb-3">
                        <CheckCircle />
                        <span>{isCompleted ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <div className="space-y-2">
                         {document.signatories.map((s, index) => <SignatoryStatus key={s.id} signatory={s} isFirst={index===0} />)}
                    </div>
                </div>
            </div>

             {/* Dotted Separator */}
            <div className="my-8 h-px bg-repeat-x bg-center" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23E5E7EB' stroke-width='4' stroke-dasharray='1%2c 8' stroke-linecap='round'/%3e%3c/svg%3e\")" }}></div>


            {/* Timeline Section */}
            <div className="flex pt-4">
                {(document.events || []).map((event, index) => (
                    <TimelineEvent key={event.id} event={event} isLast={index === (document.events || []).length - 1} />
                ))}
            </div>
        </div>
    </div>
  );
} 