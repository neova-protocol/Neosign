import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Signatory } from '@/types';

interface ContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectContact: (contact: Signatory) => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose, onSelectContact }) => {
    const [contacts, setContacts] = useState<Signatory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchContacts = async () => {
                const response = await fetch('/api/contacts');
                const data = await response.json();
                setContacts(data);
            };
            fetchContacts();
        }
    }, [isOpen]);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add from Contacts</DialogTitle>
                    <DialogDescription>Select a contact to add as a signatory.</DialogDescription>
                </DialogHeader>
                <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="my-4"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                            onClick={() => onSelectContact(contact)}
                        >
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.email}</p>
                            </div>
                            <Button variant="ghost" size="sm">Add</Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactsModal; 