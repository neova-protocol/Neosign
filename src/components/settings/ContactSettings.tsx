"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function ContactSettings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    object: "",
    location: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Information Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Provide you answers is our priority
              </h1>

              <div className="space-y-4 text-gray-700">
                <p className="text-sm">
                  Before contacting us, we encourage you to check:
                </p>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Our docs: It contains details guides and technical
                      information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Our Q&A: It addresses the most common questions</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Learn more
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Q&A
                </Button>
              </div>

              <div className="mt-8 space-y-2 text-sm text-gray-600">
                <p>
                  If you can't find the answer you're looking for, please fill
                  out the form.
                </p>
                <p>Our team will get back to you as soon as possible.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John..."
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe..."
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@neova.io"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Object and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="object" className="text-sm font-medium">
                    Object
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("object", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select an object" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="United States..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="How can we help ?"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-white min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Submit my message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
