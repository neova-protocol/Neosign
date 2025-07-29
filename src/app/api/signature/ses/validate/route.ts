import { NextRequest, NextResponse } from 'next/server';
import { SESSignature } from '@/types/signature';

// Simuler une base de données en mémoire (en production, utiliser une vraie DB)
const signatures: SESSignature[] = [];

export async function POST(request: NextRequest) {
  try {
    const { signatureId, email, phone, validationCode } = await request.json();
    
    // Rechercher la signature
    const signature = signatures.find(s => s.id === signatureId);
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Signature not found' },
        { status: 404 }
      );
    }

    // Simuler l'envoi du code de validation
    // En production, intégrer avec un service d'email/SMS réel
    console.log('Sending validation code:', {
      signatureId,
      email,
      phone,
      validationCode,
      method: signature.validationMethod
    });

    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: 'Validation code sent successfully',
      method: signature.validationMethod,
      sentTo: email || phone
    });
  } catch (error) {
    console.error('Error sending validation code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 