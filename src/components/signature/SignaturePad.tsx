import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import SignaturePadLib from 'signature_pad';
import { Button } from '@/components/ui/button';
import { Eraser, RotateCcw, Download } from 'lucide-react';

interface SignaturePadProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
  onSignatureChange?: (signature: string) => void;
  className?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, encoderOptions?: number) => string;
  fromDataURL: (dataURL: string) => void;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({
  width = 400,
  height = 200,
  backgroundColor = '#ffffff',
  penColor = '#000000',
  onSignatureChange,
  className = ''
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePadLib | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
        backgroundColor,
        penColor,
        throttle: 16,
        minWidth: 0.5,
        maxWidth: 2.5,
      });

      const handleChange = () => {
        const empty = signaturePadRef.current?.isEmpty() || false;
        setIsEmpty(empty);
        
        if (onSignatureChange && !empty) {
          const dataURL = signaturePadRef.current?.toDataURL() || '';
          onSignatureChange(dataURL);
        }
      };

      signaturePadRef.current.addEventListener('endStroke', handleChange);

      return () => {
        if (signaturePadRef.current) {
          signaturePadRef.current.off();
        }
      };
    }
  }, [backgroundColor, penColor, onSignatureChange]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      signaturePadRef.current?.clear();
      setIsEmpty(true);
    },
    isEmpty: () => signaturePadRef.current?.isEmpty() || true,
    toDataURL: (type?: string, encoderOptions?: number) => 
      signaturePadRef.current?.toDataURL(type, encoderOptions) || '',
    fromDataURL: (dataURL: string) => {
      signaturePadRef.current?.fromDataURL(dataURL);
      setIsEmpty(false);
    }
  }));

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleDownload = () => {
    if (!signaturePadRef.current?.isEmpty()) {
      const dataURL = signaturePadRef.current?.toDataURL();
      if (dataURL) {
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataURL;
        link.click();
      }
    }
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isEmpty}
            className="flex items-center space-x-1"
          >
            <Eraser className="h-4 w-4" />
            <span>Clear</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isEmpty}
            className="flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {isEmpty ? 'Sign above' : 'Signature captured'}
        </div>
      </div>
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad; 