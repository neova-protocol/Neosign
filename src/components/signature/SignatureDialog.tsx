import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import { Upload, Type, PenTool } from 'lucide-react';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignatureComplete: (signature: SignatureData) => void;
  title?: string;
}

export interface SignatureData {
  type: 'draw' | 'type' | 'upload';
  data: string; // Base64 data URL for draw/upload, text for type
  timestamp: number;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onSignatureComplete,
  title = 'Add Your Signature'
}) => {
  const [activeTab, setActiveTab] = useState<string>('draw');
  const [typedSignature, setTypedSignature] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComplete = () => {
    let signatureData: SignatureData | null = null;

    switch (activeTab) {
      case 'draw':
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
          signatureData = {
            type: 'draw',
            data: signaturePadRef.current.toDataURL(),
            timestamp: Date.now()
          };
        }
        break;
      case 'type':
        if (typedSignature.trim()) {
          // Create a canvas to render text as image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 400;
            canvas.height = 100;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000000';
            ctx.font = '32px Dancing Script, cursive';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
            
            signatureData = {
              type: 'type',
              data: canvas.toDataURL(),
              timestamp: Date.now()
            };
          }
        }
        break;
      case 'upload':
        if (uploadedImage) {
          signatureData = {
            type: 'upload',
            data: uploadedImage,
            timestamp: Date.now()
          };
        }
        break;
    }

    if (signatureData) {
      onSignatureComplete(signatureData);
      handleClose();
    }
  };

  const handleClose = () => {
    setTypedSignature('');
    setUploadedImage('');
    signaturePadRef.current?.clear();
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isComplete = () => {
    switch (activeTab) {
      case 'draw':
        return signaturePadRef.current && !signaturePadRef.current.isEmpty();
      case 'type':
        return typedSignature.trim() !== '';
      case 'upload':
        return uploadedImage !== '';
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Custom tabs implementation */}
        <div className="w-full space-y-4">
          {/* Tab buttons */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'draw' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => setActiveTab('type')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'type' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>Type</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'upload' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Draw your signature in the box below using your mouse or touch screen.
              </div>
              <SignaturePad
                ref={signaturePadRef}
                width={500}
                height={200}
                className="mx-auto"
              />
            </div>
          )}

          {activeTab === 'type' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Type your signature below. It will be styled with a signature font.
              </div>
              <div className="space-y-2">
                <Label htmlFor="typed-signature">Your Signature</Label>
                <Input
                  id="typed-signature"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Enter your name..."
                  className="text-2xl signature-font"
                />
              </div>
              {typedSignature && (
                <div className="border-2 border-gray-300 rounded-lg p-8 bg-white text-center">
                  <div className="text-4xl signature-font">
                    {typedSignature}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Upload an image of your signature (PNG, JPG, or GIF).
              </div>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 border-dashed"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-6 w-6" />
                    <span>Click to upload signature image</span>
                  </div>
                </Button>
                {uploadedImage && (
                  <div className="border-2 border-gray-300 rounded-lg p-4 bg-white text-center">
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-h-32 mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!isComplete()}
          >
            Add Signature
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog; 