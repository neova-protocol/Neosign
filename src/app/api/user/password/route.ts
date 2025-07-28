import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    // Vérifier la session utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // Validation des données
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mot de passe actuel et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec le mot de passe hashé
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hashedPassword: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a un mot de passe (pas un utilisateur ZK uniquement)
    if (!user.hashedPassword) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas de mot de passe configuré. Utilisez l\'authentification ZK ou créez d\'abord un mot de passe.' },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword: hashedNewPassword }
    });

    return NextResponse.json(
      { message: 'Mot de passe mis à jour avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 