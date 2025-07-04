"use client"
import React, { useState } from 'react';
import { useSignature } from '@/contexts/SignatureContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Save, Send } from 'lucide-react';
import { Signatory } from '@/contexts/SignatureContext';

interface SignatoryPanelProps {
  selectedSignatoryId: string | null;
  onSelectSignatory: (id: string | null) => void;
}

const SignatoryPanel: React.FC<SignatoryPanelProps> = ({ selectedSignatoryId, onSelectSignatory }) => {
  const { currentDocument, addSignatory, removeSignatory } = useSignature();
  const [newSignatoryName, setNewSignatoryName] = useState('');
  const [newSignatoryEmail, setNewSignatoryEmail] = useState('');

  const handleAddSignatory = () => {
    if (newSignatoryName.trim() && newSignatoryEmail.trim()) {
      addSignatory({
        name: newSignatoryName,
        email: newSignatoryEmail,
        role: 'Signer',
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      });
      setNewSignatoryName('');
      setNewSignatoryEmail('');
    }
  };
  
  const handleSaveDocument = () => console.log('Saving document...', currentDocument);
  const handleSendDocument = () => console.log('Sending document...', currentDocument);

  if (!currentDocument) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Signatories</h2>
        <div className="space-y-2 mb-4">
          <Input placeholder="Full name" value={newSignatoryName} onChange={(e) => setNewSignatoryName(e.target.value)} />
          <Input placeholder="Email address" type="email" value={newSignatoryEmail} onChange={(e) => setNewSignatoryEmail(e.target.value)} />
          <Button onClick={handleAddSignatory} disabled={!newSignatoryName.trim() || !newSignatoryEmail.trim()} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Signatory
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {currentDocument.signatories.map((signatory) => (
          <div
            key={signatory.id}
            onClick={() => onSelectSignatory(signatory.id === selectedSignatoryId ? null : signatory.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedSignatoryId === signatory.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: signatory.color }} />
                  <span className="font-medium text-gray-900">{signatory.name}</span>
                </div>
                <p className="text-sm text-gray-500">{signatory.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSignatory(signatory.id);
                }} 
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t space-y-2">
        <Button onClick={handleSaveDocument} variant="outline" className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Document
        </Button>
        <Button onClick={handleSendDocument} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Send for Signature
        </Button>
      </div>
    </div>
  );
};

export default SignatoryPanel; 