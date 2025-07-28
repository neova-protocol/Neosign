"use client";

import { FC, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { AddContactModal } from "./AddContactModal";
import { EditContactModal } from "./EditContactModal";
import { ContactActions } from "./ContactActions";

// Define a unified contact type for the frontend
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  location: string | null;
}

interface ContactsClientPageProps {
  initialContacts: Contact[];
}

export const ContactsClientPage: FC<ContactsClientPageProps> = ({
  initialContacts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleContactAdded = (newContact: Contact) => {
    setContacts(prev => [newContact, ...prev]);
  };

  const handleContactUpdated = (updatedContact: Contact) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const handleContactDeleted = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingContact(null);
    setIsEditModalOpen(false);
  };

  const filteredContacts = contacts.filter((contact) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchTermLower) ||
      contact.lastName.toLowerCase().includes(searchTermLower) ||
      contact.email.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
        <AddContactModal onContactAdded={handleContactAdded} />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Search a contact</p>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, ..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Contacts Count */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900">
          {filteredContacts.length} contacts
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-12 pl-4">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-600 font-medium">First Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Last Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Email</TableHead>
              <TableHead className="text-gray-600 font-medium">Phone Number</TableHead>
              <TableHead className="text-gray-600 font-medium">Company</TableHead>
              <TableHead className="text-gray-600 font-medium">Position</TableHead>
              <TableHead className="text-gray-600 font-medium">Location</TableHead>
              <TableHead className="text-gray-600 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                <TableCell className="pl-4">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium text-gray-900">{contact.firstName}</TableCell>
                <TableCell className="text-gray-900">{contact.lastName}</TableCell>
                <TableCell className="text-gray-600">{contact.email}</TableCell>
                <TableCell className="text-gray-600">{contact.phone || ""}</TableCell>
                <TableCell className="text-gray-600">{contact.company || ""}</TableCell>
                <TableCell className="text-gray-600">{contact.position || ""}</TableCell>
                <TableCell className="text-gray-600">{contact.location || ""}</TableCell>
                <TableCell>
                  <ContactActions
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleContactDeleted}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <EditContactModal
        contact={editingContact}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onContactUpdated={handleContactUpdated}
      />
    </div>
  );
}; 