"use client"
import React, { useState } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Save, Send, Loader2, Trash2, UserPlus, BookUser } from 'lucide-react';
import { Signatory } from '@/types';
import { useRouter } from 'next/navigation';
import ContactsModal from './ContactsModal';

interface SignatoryPanelProps {
  selectedSignatoryId: string | null;
  onSelectSignatory: (id: string | null) => void;
}

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6"];

const SignatoryPanel: React.FC<SignatoryPanelProps> = ({ selectedSignatoryId, onSelectSignatory }) => {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const { currentDocument, addSignatory, removeSignatory, addField } = useSignature();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const router = useRouter();

  const handleAddMyself = () => {
    if (currentUser && currentUser.name && currentUser.email) {
      handleAddSignatory(currentUser.name, currentUser.email);
    }
  };

  const handleAddSignatory = async (nameToAdd?: string, emailToAdd?: string) => {
    const finalName = nameToAdd || name;
    const finalEmail = emailToAdd || email;

    if (finalName && finalEmail && currentDocument) {
      const signatoryData = {
        name: finalName,
        email: finalEmail,
        role: 'Signatory',
        color: colors[currentDocument.signatories.length % colors.length],
        documentId: currentDocument.id,
        token: '',
      };
      
      const newSignatory = await addSignatory(signatoryData);
      
      if (newSignatory) {
        if (!nameToAdd) {
          setName('');
          setEmail('');
        }
      } else {
        alert('Failed to add signatory.');
      }
    }
  };
  
  const handleSelectSignatory = (signatoryId: string) => {
    onSelectSignatory(signatoryId);
  };

  const handleSend = async () => {
    if (!currentDocument || !currentUser) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/send-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: currentDocument.id }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to send document: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending document:", error);
      alert("An error occurred while sending the document.");
    } finally {
      setIsSending(false);
    }
  };

  const isCurrentUserSignatory = currentDocument?.signatories.some(s => s.id === currentUser?.id) ?? false;

  if (!currentDocument) return null;

  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Signatories</h2>

      <div className="space-y-2 mb-4">
        <Button onClick={handleAddMyself} variant="outline" className="w-full" disabled={isCurrentUserSignatory}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Myself
        </Button>

        <Button onClick={() => setIsContactsModalOpen(true)} variant="outline" className="w-full">
            <BookUser className="mr-2 h-4 w-4" /> Add from Contacts
        </Button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">Or add others</span>
          </div>
        </div>

        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={() => handleAddSignatory()} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Signatory
        </Button>
      </div>

      <ContactsModal
          isOpen={isContactsModalOpen}
          onClose={() => setIsContactsModalOpen(false)}
          onSelectContact={(contact: Signatory) => {
              handleAddSignatory(contact.name, contact.email);
              setIsContactsModalOpen(false);
          }}
      />

      <div className="flex-1 overflow-y-auto space-y-2">
        {currentDocument.signatories.map((signatory) => (
          <div
            key={signatory.id}
            onClick={() => handleSelectSignatory(signatory.id)}
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
              selectedSignatoryId === signatory.id ? "ring-2 ring-offset-2" : "border"
            }`}
            style={{ '--ring-color': signatory.color, borderColor: signatory.color } as React.CSSProperties}
          >
            <div>
              <p className="font-semibold" style={{ color: signatory.color }}>
                {signatory.name}
              </p>
              <p className="text-sm text-gray-500">{signatory.email}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={async (e) => {
                    e.stopPropagation();
                    if (!currentDocument) return;

                    const res = await fetch(`/api/documents/${currentDocument.id}/signatories/${signatory.id}`, {
                        method: 'DELETE',
                    });

                    if (res.ok) {
                        removeSignatory(signatory.id);
                    } else {
                        alert('Failed to remove signatory.');
                    }
                }}
            >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button 
          className="w-full" 
          onClick={handleSend}
          disabled={!currentDocument || currentDocument.signatories.length < 1 || isSending}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send for Signature"}
        </Button>
      </div>
    </div>
  );
};

export default SignatoryPanel; 