'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogIn, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PostSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostSignatureModal({ open, onOpenChange }: PostSignatureModalProps) {
    const router = useRouter();

    const handleCreateAccount = () => {
        router.push('/signup');
    };

    const handleFinish = () => {
        window.close();
        onOpenChange(false);
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Signature Submitted!</DialogTitle>
          <DialogDescription className="text-center">
            Thank you for signing the document. What would you like to do next?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 space-y-2 mt-4">
            <Button onClick={handleCreateAccount}>
                <LogIn className="mr-2 h-4 w-4" />
                Create an account to track your documents
            </Button>
            <Button variant="outline" onClick={handleFinish}>
                <X className="mr-2 h-4 w-4" />
                Finish & Close Window
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 