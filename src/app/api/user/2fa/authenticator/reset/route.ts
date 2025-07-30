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

    // Réinitialiser l'authenticator
    await prisma.user.update({
      where: { id: userId },
      data: {
        authenticatorSecret: null,
        authenticatorEnabled: false,
        // Retirer l'authenticator des méthodes 2FA
        twoFactorMethods: "[]"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Authenticator réinitialisé avec succès"
    });
  } catch (error) {
    console.error("Error resetting authenticator:", error);
    return NextResponse.json(
      { error: "Failed to reset authenticator" },
      { status: 500 }
    );
  }
} 