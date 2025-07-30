import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;

    // Récupérer les méthodes 2FA actuelles
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorMethods: true }
    });

    let updatedMethods: string[] = [];
    if (currentUser?.twoFactorMethods) {
      try {
        const currentMethods = JSON.parse(currentUser.twoFactorMethods || '[]');
        updatedMethods = currentMethods.filter((method: string) => method !== 'email');
      } catch {
        updatedMethods = [];
      }
    }

    // Réinitialiser l'email 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: null,
        twoFactorMethods: JSON.stringify(updatedMethods)
      }
    });

    return NextResponse.json({
      success: true,
      message: "Authentification par email réinitialisée avec succès"
    });
  } catch (error) {
    console.error("Error resetting email authentication:", error);
    return NextResponse.json(
      { error: "Failed to reset email authentication" },
      { status: 500 }
    );
  }
} 