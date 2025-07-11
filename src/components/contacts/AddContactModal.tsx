"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "./ContactsClientPage";

interface AddContactModalProps {
  onContactAdded: (contact: Contact) => void;
}

export function AddContactModal({ onContactAdded }: AddContactModalProps) {
  const [open, setOpen] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newContact = await response.json();
        onContactAdded(newContact);
        setOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          position: "",
          location: "",
        });
      } else {
        console.error('Failed to create contact');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Add a contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add a contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal informations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Personal informations</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@neova.io"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33) 06 07 08 09 00"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Professional informations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Professional informations</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company name
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Neova"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                  Position
                </Label>
                <Input
                  id="position"
                  type="text"
                  placeholder="Sales..."
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="United States..."
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-6"
          >
            {isLoading ? "Creating..." : "Create a contact"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 