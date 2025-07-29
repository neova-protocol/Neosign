import { NextRequest, NextResponse } from 'next/server';
import { SESSignature } from '@/types/signature';

// Simuler une base de données en mémoire (en production, utiliser une vraie DB)
const signatures: SESSignature[] = [];

export async function POST(request: NextRequest) {
  try {
    const signature: SESSignature = await request.json();
    
    // Validation de base
    if (!signature.id || !signature.signatoryId || !signature.documentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Vérifier si la signature existe déjà
    const existingSignature = signatures.find(s => s.id === signature.id);
    if (existingSignature) {
      return NextResponse.json(
        { error: 'Signature already exists' },
        { status: 409 }
      );
    }

    // Ajouter la signature
    signatures.push(signature);

    return NextResponse.json(
      { message: 'Signature created successfully', signature },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating SES signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const signatoryId = searchParams.get('signatoryId');

    let filteredSignatures = signatures;

    if (documentId) {
      filteredSignatures = filteredSignatures.filter(s => s.documentId === documentId);
    }

    if (signatoryId) {
      filteredSignatures = filteredSignatures.filter(s => s.signatoryId === signatoryId);
    }

    return NextResponse.json(filteredSignatures);
  } catch (error) {
    console.error('Error fetching SES signatures:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 