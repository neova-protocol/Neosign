import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

// Stockage temporaire des codes (même Map que dans l'API 2FA)
const tempCodes = new Map<string, { code: string; expiresAt: number }>();

// Fonction pour nettoyer les codes expirés
function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [email, data] of tempCodes.entries()) {
    if (data.expiresAt < now) {
      tempCodes.delete(email);
    }
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, newEmail } = await request.json();

    if (!code || !newEmail) {
      return NextResponse.json(
        { error: "Verification code and new email are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Nettoyer les codes expirés
    cleanupExpiredCodes();

    // Récupérer le code stocké pour le nouvel email
    const storedData = tempCodes.get(newEmail);
    
    if (!storedData) {
      return NextResponse.json(
        { error: "No email change request found. Please request a new code." },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    if (storedData.expiresAt < Date.now()) {
      tempCodes.delete(newEmail);
      return NextResponse.json(
        { error: "Verification code expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Vérifier le code
    if (storedData.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Vérifier que le nouvel email n'est toujours pas utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      tempCodes.delete(newEmail);
      return NextResponse.json(
        { error: "Email already in use by another account" },
        { status: 400 }
      );
    }

    // Mettre à jour l'email de l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailVerified: new Date() // Marquer comme vérifié
      }
    });

    // Supprimer le code après utilisation
    tempCodes.delete(newEmail);

    console.log(`Email changed for user ${userId} from ${session.user.email} to ${newEmail}`);

    return NextResponse.json({
      success: true,
      message: "Email changed successfully",
      newEmail: newEmail
    });

  } catch (error) {
    console.error("Error confirming email change:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 