// Utility functions for PDF handling and error management

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

/**
 * Validate if a file is a proper PDF
 */
export const validatePDFFile = async (file: File): Promise<PDFValidationResult> => {
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return {
      isValid: false,
      error: 'File must be a PDF document',
      suggestion: 'Please select a file with .pdf extension'
    };
  }

  // Check MIME type
  if (file.type !== 'application/pdf' && file.type !== '') {
    return {
      isValid: false,
      error: 'Invalid file type',
      suggestion: 'Please select a valid PDF file'
    };
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File is too large',
      suggestion: 'Please select a PDF smaller than 50MB'
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty',
      suggestion: 'Please select a valid PDF file'
    };
  }

  // Basic PDF header check
  try {
    const arrayBuffer = await file.slice(0, 8).arrayBuffer();
    const header = new Uint8Array(arrayBuffer);
    const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
    
    const hasValidHeader = pdfSignature.every((byte, index) => header[index] === byte);
    
    if (!hasValidHeader) {
      return {
        isValid: false,
        error: 'File does not appear to be a valid PDF',
        suggestion: 'Please select a different PDF file or try converting your document to PDF'
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Could not read file',
      suggestion: 'Please try selecting the file again'
    };
  }

  return { isValid: true };
};

/**
 * Create a safe object URL for PDF files
 */
export const createPDFObjectURL = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating object URL:', error);
    throw new Error('Could not process PDF file');
  }
};

/**
 * Cleanup object URL to prevent memory leaks
 */
export const cleanupPDFObjectURL = (url: string): void => {
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.warn('Could not revoke object URL:', error);
  }
};

/**
 * Get user-friendly error messages for PDF.js errors
 */
export const getPDFErrorMessage = (error: any): { title: string; message: string; suggestion: string } => {
  const errorString = error?.toString?.() || error?.message || 'Unknown error';
  
  // Check for common PDF.js error patterns
  if (errorString.includes('InvalidPDFException')) {
    return {
      title: 'Invalid PDF File',
      message: 'The selected file is not a valid PDF document.',
      suggestion: 'Please try a different PDF file or convert your document to PDF format.'
    };
  }
  
  if (errorString.includes('PasswordException')) {
    return {
      title: 'Password Protected PDF',
      message: 'This PDF requires a password to open.',
      suggestion: 'Please use a PDF without password protection or remove the password first.'
    };
  }
  
  if (errorString.includes('UnexpectedResponseException') || errorString.includes('fetch')) {
    return {
      title: 'Network Error',
      message: 'Could not load the PDF due to a network issue.',
      suggestion: 'Please check your internet connection and try again.'
    };
  }
  
  if (errorString.includes('worker') || errorString.includes('Worker')) {
    return {
      title: 'PDF Processor Error',
      message: 'There was an issue with the PDF processing engine.',
      suggestion: 'Please refresh the page and try again.'
    };
  }
  
  if (errorString.includes('CORS') || errorString.includes('Access-Control')) {
    return {
      title: 'Security Error',
      message: 'Could not access the PDF due to security restrictions.',
      suggestion: 'Please try uploading the PDF file directly instead of using a link.'
    };
  }

  // Generic error
  return {
    title: 'PDF Loading Error',
    message: 'Could not load the PDF document.',
    suggestion: 'Please try a different PDF file or refresh the page.'
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 