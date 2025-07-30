import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { authenticator } from "otplib";

// Stockage temporaire des codes (même Map que dans l'API email)
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
    const { emailCode, authenticatorCode, reason } = await request.json();

    if (!emailCode || !authenticatorCode) {
      return NextResponse.json(
        { error: "Email code and authenticator code are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Récupérer l'utilisateur avec sa configuration 2FA
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérifier que le compte n'est pas déjà en cours de suppression
    if (user.accountStatus !== "active") {
      return NextResponse.json(
        { error: "Account deletion already in progress" },
        { status: 400 }
      );
    }

    // Vérifier que 2FA email et authenticator sont activés
    if (!user.emailVerified || !user.authenticatorEnabled) {
      return NextResponse.json(
        { error: "Email and authenticator 2FA must be enabled for account deletion" },
        { status: 400 }
      );
    }

    // Nettoyer les codes expirés
    cleanupExpiredCodes();

    // Vérifier le code email
    const storedEmailData = tempCodes.get(userEmail);
    if (!storedEmailData) {
      return NextResponse.json(
        { error: "No email verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    if (storedEmailData.expiresAt < Date.now()) {
      tempCodes.delete(userEmail);
      return NextResponse.json(
        { error: "Email verification code expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (storedEmailData.code !== emailCode) {
      return NextResponse.json(
        { error: "Invalid email verification code" },
        { status: 400 }
      );
    }

    // Vérifier le code authenticator
    if (!user.authenticatorSecret) {
      return NextResponse.json(
        { error: "Authenticator not configured" },
        { status: 400 }
      );
    }

    const isValidAuthenticator = authenticator.verify({
      token: authenticatorCode,
      secret: user.authenticatorSecret
    });

    if (!isValidAuthenticator) {
      return NextResponse.json(
        { error: "Invalid authenticator code" },
        { status: 400 }
      );
    }

    // Calculer la date de suppression (15 jours)
    const deletionScheduledAt = new Date();
    deletionScheduledAt.setDate(deletionScheduledAt.getDate() + 15);

    // Marquer le compte pour suppression
    await prisma.user.update({
      where: { id: userId },
      data: {
        accountStatus: "pending_deletion",
        deletionRequestedAt: new Date(),
        deletionScheduledAt: deletionScheduledAt,
        deletionReason: reason || "User requested account deletion"
      }
    });

    // Supprimer le code email après utilisation
    tempCodes.delete(userEmail);

    // Supprimer toutes les sessions de l'utilisateur
    await prisma.session.deleteMany({
      where: { userId: userId }
    });

    console.log(`Account deletion scheduled for user ${userId} (${userEmail}) - scheduled for ${deletionScheduledAt}`);

    return NextResponse.json({
      success: true,
      message: "Account deletion scheduled successfully",
      deletionScheduledAt: deletionScheduledAt
    });

  } catch (error) {
    console.error("Error scheduling account deletion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 