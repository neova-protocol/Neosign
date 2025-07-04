"use client"
import React, { useState } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Save, Send, Loader2, Trash2, UserPlus } from 'lucide-react';
import { Signatory } from '@/contexts/SignatureContext';
import { saveDocument, sendDocumentForSignature } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface SignatoryPanelProps {
  selectedSignatoryId: string | null;
  onSelectSignatory: (id: string | null) => void;
}

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6"];

const SignatoryPanel: React.FC<SignatoryPanelProps> = ({ selectedSignatoryId, onSelectSignatory }) => {
  const { currentUser } = useAuth();
  const { currentDocument, addSignatory, removeSignatory } = useSignature();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleAddMyself = () => {
    if (currentUser && currentDocument) {
      if (currentDocument.signatories.some(s => s.id === currentUser.id)) {
        return; // Already in the list
      }
      const nextColor = colors[currentDocument.signatories.length % colors.length];
      addSignatory({
        id: currentUser.id, // Use the stable user ID
        name: currentUser.name,
        email: currentUser.email,
        role: 'Sender',
        color: nextColor,
      });
    }
  };

  const handleAddSignatory = () => {
    if (name && email && currentDocument) {
      const nextColor = colors[currentDocument.signatories.length % colors.length];
      addSignatory({
        id: `sig-${Date.now()}`, // Keep this for external signatories
        name,
        email,
        role: 'Signatory',
        color: nextColor,
      });
      setName('');
      setEmail('');
    }
  };
  
  const handleSend = async () => {
    if (!currentDocument) return;
    setIsSending(true);
    try {
      const result = await sendDocumentForSignature(currentDocument, currentUser);
      if (result.success) {
        router.push("/dashboard/sign");
      } else {
        console.error("Failed to send document");
      }
    } catch (error) {
      console.error("Error sending document:", error);
    } finally {
      setIsSending(false);
    }
  };

  const isCurrentUserSignatory = currentDocument?.signatories.some(s => s.id === currentUser.id) ?? false;

  if (!currentDocument) return null;

  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Signatories</h2>

      <div className="space-y-2 mb-4">
        <Button onClick={handleAddMyself} variant="outline" className="w-full" disabled={isCurrentUserSignatory}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Myself
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
        <Button onClick={handleAddSignatory} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Signatory
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {currentDocument.signatories.map((signatory) => (
          <div
            key={signatory.id}
            onClick={() => onSelectSignatory(signatory.id)}
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
                onClick={(e) => {
                    e.stopPropagation();
                    removeSignatory(signatory.id);
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