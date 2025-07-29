import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  console.log("POST /api/user/add-email-password called");
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a un commitment ZK (est un utilisateur ZK)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { zkCommitment: true, email: true, name: true }
    });

    if (!user?.zkCommitment) {
      return NextResponse.json(
        { error: "Cette fonctionnalité n'est disponible que pour les utilisateurs ZK" },
        { status: 403 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== session.user.id) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé par un autre compte" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour l'utilisateur avec le nouvel email et mot de passe
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email,
        hashedPassword,
        name: user.name || `Utilisateur ${email.split('@')[0]}` // Améliorer le nom si nécessaire
      },
      select: {
        id: true,
        name: true,
        email: true,
        zkCommitment: true,
        hashedPassword: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Email et mot de passe ajoutés avec succès",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        hasEmailPassword: !!updatedUser.hashedPassword,
        hasZK: !!updatedUser.zkCommitment
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout d'email/mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 