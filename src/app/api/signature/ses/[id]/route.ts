import { NextRequest, NextResponse } from 'next/server';
import { SESSignature } from '@/types/signature';

// Simuler une base de données en mémoire (en production, utiliser une vraie DB)
const signatures: SESSignature[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const signatureId = params.id;
    
    // Rechercher la signature par ID
    const signature = signatures.find(s => s.id === signatureId);
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Signature not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(signature);
  } catch (error) {
    console.error('Error fetching SES signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const signatureId = params.id;
    const updates = await request.json();
    
    // Rechercher la signature par ID
    const signatureIndex = signatures.findIndex(s => s.id === signatureId);
    
    if (signatureIndex === -1) {
      return NextResponse.json(
        { error: 'Signature not found' },
        { status: 404 }
      );
    }

    // Mettre à jour la signature
    signatures[signatureIndex] = {
      ...signatures[signatureIndex],
      ...updates,
      timestamp: new Date()
    };

    return NextResponse.json(signatures[signatureIndex]);
  } catch (error) {
    console.error('Error updating SES signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 