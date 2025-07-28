"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "./ContactsClientPage";

interface EditContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onContactUpdated: (updatedContact: Contact) => void;
}

export function EditContactModal({
  contact,
  isOpen,
  onClose,
  onContactUpdated,
}: EditContactModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    location: "",
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || "",
        company: contact.company || "",
        position: contact.position || "",
        location: contact.location || "",
      });
    }
  }, [contact]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedContact = await response.json();
        onContactUpdated(updatedContact);
        onClose();
      } else {
        console.error("Failed to update contact");
        alert("Erreur lors de la mise à jour du contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Erreur lors de la mise à jour du contact");
    } finally {
      setIsLoading(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Modifier le contact
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal informations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Professional informations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Informations professionnelles
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700"
                >
                  Entreprise
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700"
                >
                  Poste
                </Label>
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Localisation
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
