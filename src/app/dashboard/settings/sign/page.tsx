"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import SignatureCanvas from 'react-signature-canvas';

const settingsMenuItems = [
  { name: "Profile", active: false, href: "/dashboard/settings" },
  { name: "Security", active: false, href: "/dashboard/settings/security" },
  { name: "Signatures", active: true, href: "/dashboard/settings/sign" },
  { name: "Notifications", active: false, href: "/dashboard/settings/notifications" },
  { name: "Contact", active: false, href: "/dashboard/settings/contact" },
  { name: "Advanced", active: false, href: "/dashboard/settings/advanced" },
  { name: "Billing", active: false, href: "/dashboard/settings/billing" },
]

export default function SignaturesPage() {
  const [isTypedModalOpen, setIsTypedModalOpen] = useState(false);
  const [isDrawnModalOpen, setIsDrawnModalOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [typedSignature, setTypedSignature] = useState("Your Name");
  const [selectedFont, setSelectedFont] = useState("cursive");
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/user/me');
      const userData = await response.json();
      if (userData) {
        setUser(userData);
        if (userData.typedSignature) {
          setTypedSignature(userData.typedSignature);
        }
        if (userData.typedSignatureFont) {
          setSelectedFont(userData.typedSignatureFont);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSaveSignature = async () => {
    try {
      await fetch('/api/user/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: typedSignature, font: selectedFont }),
      });
      setIsTypedModalOpen(false);
    } catch (error) {
      console.error("Failed to save signature", error);
    }
  };

  const handleSaveDrawnSignature = async () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL();
      try {
        await fetch('/api/user/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ drawnSignature: signature }),
        });
        setIsDrawnModalOpen(false);
      } catch (error) {
        console.error("Failed to save drawn signature", error);
      }
    }
  };

  const clearCanvas = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Settings Content */}
      <div className="flex-1 p-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-2xl">S</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Slyrack</h1>
                <p className="text-gray-300 text-sm">Member Since: 3 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-white font-medium">Basic Plan</span>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Signatures Settings</h2>
          <p className="text-gray-600 mb-6">Configure your Signatures settings here.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature style</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="border rounded-lg p-4 text-center cursor-pointer border-blue-500"
                  onClick={() => setIsTypedModalOpen(true)}
                >
                  <p className="font-bold text-lg" style={{ fontFamily: selectedFont }}>{typedSignature}</p>
                  <p className="text-sm text-gray-500 mt-2">Typed signature</p>
                </div>
                <div 
                  className="border rounded-lg p-4 text-center cursor-pointer"
                  onClick={() => setIsDrawnModalOpen(true)}
                >
                  {user?.drawnSignature ? (
                    <img src={user.drawnSignature} alt="Drawn Signature" className="h-12 mx-auto" />
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">Signature drawn</p>
                  )}
                </div>
                <div className="border rounded-lg p-4 text-center cursor-pointer">
                  {/* ... Icône pour importer signature ... */}
                  <p className="text-sm text-gray-500 mt-2">Import signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isTypedModalOpen} onOpenChange={setIsTypedModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your typed signature</DialogTitle>
            <DialogDescription>
              Type your name and choose a font style.
            </DialogDescription>
          </DialogHeader>
          <Input 
            value={typedSignature}
            onChange={(e) => setTypedSignature(e.target.value)}
            className="my-4"
          />
          <Select value={selectedFont} onValueChange={setSelectedFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cursive">Cursive</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleSaveSignature}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDrawnModalOpen} onOpenChange={setIsDrawnModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draw your signature</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor='black'
              canvasProps={{className: 'w-full h-48'}} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearCanvas}>Clear</Button>
            <Button onClick={handleSaveDrawnSignature}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Menu */}
      <div className="w-64 bg-white border-l border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
        <nav className="space-y-2">
          {settingsMenuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
