"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Contact } from "./ContactsClientPage";

interface ContactActionsProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

export function ContactActions({
  contact,
  onEdit,
  onDelete,
}: ContactActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${contact.firstName} ${contact.lastName} ?`,
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/contacts/${contact.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onDelete(contact.id);
        } else {
          console.error("Failed to delete contact");
          alert("Erreur lors de la suppression du contact");
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Erreur lors de la suppression du contact");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(contact)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Suppression..." : "Supprimer"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
