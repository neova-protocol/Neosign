"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Download } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureSettings() {
  const [isTypedModalOpen, setIsTypedModalOpen] = useState(false);
  const [isDrawnModalOpen, setIsDrawnModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [typedSignature, setTypedSignature] = useState("Your Name");
  const [selectedFont, setSelectedFont] = useState("cursive");
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
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
      fetchUser(); // Refresh user data
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
        fetchUser(); // Refresh user data
      } catch (error) {
        console.error("Failed to save drawn signature", error);
      }
    }
  };

  const handleSaveUploadedSignature = async () => {
    if (uploadedSignature) {
      try {
        await fetch('/api/user/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uploadedSignature }),
        });
        setIsUploadModalOpen(false);
        fetchUser(); // Refresh user data
      } catch (error) {
        console.error("Failed to save uploaded signature", error);
      }
    }
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedSignature(result);
        setIsUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };
  
  return (
    <>
      <Card className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Slyrack" />
                <AvatarFallback className="bg-blue-600 text-white text-lg">S</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Slyrack</h2>
                <p className="text-gray-300 text-sm">Member Since: 3 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-gray-600 text-white">
                Basic Plan
              </Badge>
              <Button className="bg-blue-600 hover:bg-blue-700">Upgrade Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Signatures settings</CardTitle>
          <p className="text-gray-600 text-sm">Configure your invitation to sign</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <Label className="text-base font-medium">Default sender</Label>
            <p className="text-sm text-gray-600">Define the default sender for invitations to sign</p>
            <RadioGroup defaultValue="neova" className="flex gap-4">
              <div className="flex items-center space-x-2 border rounded-lg p-3 flex-1">
                <RadioGroupItem value="neova" id="neova" />
                <Label htmlFor="neova" className="flex-1 cursor-pointer">
                  Neova
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 flex-1">
                <RadioGroupItem value="quentin" id="quentin" />
                <Label htmlFor="quentin" className="flex-1 cursor-pointer">
                  Quentin Clement
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Signature style</Label>
            <p className="text-sm text-gray-600">
              Define the signature styles available for your signature invitations
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div 
                className="border rounded-lg p-4 text-center space-y-2 cursor-pointer hover:border-blue-500"
                onClick={() => setIsTypedModalOpen(true)}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className={`text-2xl font-${(user?.typedSignatureFont || selectedFont).toLowerCase()}`}>
                    {user?.typedSignature || typedSignature}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-xs">Default signature</span>
                </div>
              </div>
              <div 
                className="border rounded-lg p-4 text-center space-y-2 cursor-pointer hover:border-blue-500"
                onClick={() => setIsDrawnModalOpen(true)}
              >
                <div className="h-12 flex items-center justify-center">
                  {user?.drawnSignature ? (
                    <img src={user.drawnSignature} alt="Drawn Signature" className="h-12 mx-auto" />
                  ) : (
                    <span className="text-2xl font-script italic transform -rotate-2">Name</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Signature drawn</span>
                </div>
              </div>
              <div 
                className="border rounded-lg p-4 text-center space-y-2 cursor-pointer hover:border-blue-500"
                onClick={handleUploadClick}
              >
                <div className="h-12 flex items-center justify-center">
                  {user?.uploadedSignature ? (
                    <img src={user.uploadedSignature} alt="Uploaded Signature" className="h-12 mx-auto" />
                  ) : (
                    <Download className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Import signature</span>
                </div>
              </div>
            </div>
            <input 
              type="file" 
              ref={uploadInputRef} 
              onChange={handleFileChange}
              className="hidden"
              accept="image/png"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Preferences for signature project expiry</Label>
            <p className="text-sm text-gray-600">
              Define a default validity period during which your recipients can sign
            </p>
            <div className="flex gap-4 items-center">
              <Input type="number" defaultValue="3" className="w-20" />
              <Select defaultValue="months">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Automatic reminders</Label>
            <div className="flex gap-4">
              <Select defaultValue="1-week">
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-day">1 time a day</SelectItem>
                  <SelectItem value="1-week">1 time a week</SelectItem>
                  <SelectItem value="2-weeks">2 times a week</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="3-max">
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-max">1 times maximum</SelectItem>
                  <SelectItem value="2-max">2 times maximum</SelectItem>
                  <SelectItem value="3-max">3 times maximum</SelectItem>
                  <SelectItem value="5-max">5 times maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Signature flows</Label>
            <p className="text-sm text-gray-600">The signer must register on NeoSign to sign</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow signer to refuse to sign</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow signer to terminate document</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Reference settings</Label>
            <p className="text-sm text-gray-600">Confirm reference to use when signing when sending the document</p>

            <RadioGroup defaultValue="agreement" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agreement" id="agreement" />
                <Label htmlFor="agreement" className="text-sm">
                  For agreement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approval" id="approval" />
                <Label htmlFor="approval" className="text-sm">
                  For approval
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto-date" id="auto-date" />
                <Label htmlFor="auto-date" className="text-sm">
                  Signed on [insert date automatically]
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terms" id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  By signing below, I agree to the terms and conditions
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
          </div>
        </CardContent>
      </Card>
      
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
          <div className="my-4 p-8 border bg-gray-50 rounded-md flex justify-center items-center">
            <span className={`text-3xl font-${selectedFont.toLowerCase()}`}>
              {typedSignature || "Your Name"}
            </span>
          </div>
          <Select value={selectedFont} onValueChange={setSelectedFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cursive">Cursive</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="sans-serif">Sans-serif</SelectItem>
              <SelectItem value="Corinthia">Corinthia</SelectItem>
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

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your signature</DialogTitle>
            <DialogDescription>
              Do you want to use this image as your signature?
            </DialogDescription>
          </DialogHeader>
          {uploadedSignature && (
            <div className="flex justify-center my-4">
              <img src={uploadedSignature} alt="Uploaded Signature" className="h-24 border rounded-md" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUploadedSignature}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 