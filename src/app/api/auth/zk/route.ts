import { NextRequest, NextResponse } from 'next/server';
import { ZKProvider } from '@/lib/zk-provider';
import { prisma } from '@/lib/db';
import { ZKAuth } from '@/lib/zk-auth';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case 'generate_challenge':
        const challenge = await ZKProvider.generateChallenge();
        return NextResponse.json({ challenge });

      case 'verify_proof':
        const { commitment, proof, challenge: challengeData } = data;
        
        // Vérifier la preuve ZK
        const isValid = await ZKProvider.verifyCredentials({
          commitment,
          proof,
          challenge: challengeData
        });

        if (!isValid) {
          return NextResponse.json({ error: 'Invalid ZK proof' }, { status: 401 });
        }

        // Chercher l'utilisateur par commitment
        const user = await prisma.user.findFirst({
          where: { zkCommitment: commitment }
        });

        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });

      case 'register':
        const { name, email, commitment: newCommitment } = data;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Créer un nouvel utilisateur avec le commitment ZK
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            zkCommitment: newCommitment
          }
        });

        return NextResponse.json({
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur dans l\'API ZK:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 