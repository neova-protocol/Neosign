import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log("POST /api/user/add-zk-auth called");
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { commitment } = await req.json();

    if (!commitment) {
      return NextResponse.json(
        { error: "Commitment ZK requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a un mot de passe (est un utilisateur email)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hashedPassword: true, zkCommitment: true, email: true }
    });

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: "Cette fonctionnalité n'est disponible que pour les utilisateurs avec mot de passe" },
        { status: 403 }
      );
    }

    if (user.zkCommitment) {
      return NextResponse.json(
        { error: "L'authentification ZK est déjà activée pour ce compte" },
        { status: 409 }
      );
    }

    // Vérifier si le commitment est déjà utilisé par un autre utilisateur
    const existingUserWithCommitment = await prisma.user.findFirst({
      where: { zkCommitment: commitment }
    });

    if (existingUserWithCommitment) {
      return NextResponse.json(
        { error: "Cette identité ZK est déjà utilisée par un autre compte" },
        { status: 409 }
      );
    }

    // Ajouter le commitment ZK à l'utilisateur existant
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        zkCommitment: commitment,
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
      message: "Authentification ZK activée avec succès",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        hasEmailPassword: !!updatedUser.hashedPassword,
        hasZK: !!updatedUser.zkCommitment
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'authentification ZK:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 