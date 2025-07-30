import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { authenticator } from "otplib";
import { getCode, deleteCode, cleanupExpiredCodes } from "@/lib/temp-codes-db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailCode, authenticatorCode, reason } = await request.json();

    console.log("=== DEBUG SUPPRESSION COMPTE ===");
    console.log("Email code:", emailCode);
    console.log("Authenticator code:", authenticatorCode);
    console.log("User ID:", session.user.id);
    console.log("Session email:", session.user.email);

    if (!emailCode || !authenticatorCode) {
      console.log("Erreur: Codes manquants");
      return NextResponse.json(
        { error: "Email code and authenticator code are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    if (!userEmail) {
      console.log("Erreur: Email utilisateur non trouvé");
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Récupérer l'utilisateur avec sa configuration 2FA
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("Erreur: Utilisateur non trouvé");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User email:", user.email);
    console.log("Email verified:", user.emailVerified);
    console.log("Authenticator enabled:", user.authenticatorEnabled);
    console.log("Account status:", user.accountStatus);

    // Vérifier que le compte n'est pas déjà en cours de suppression
    if (user.accountStatus !== "active") {
      console.log("Erreur: Suppression déjà en cours");
      return NextResponse.json(
        { error: "Account deletion already in progress" },
        { status: 400 }
      );
    }

    // Vérifier que 2FA email et authenticator sont activés
    if (!user.emailVerified || !user.authenticatorEnabled) {
      console.log("Erreur: 2FA non activé - emailVerified:", user.emailVerified, "authenticatorEnabled:", user.authenticatorEnabled);
      return NextResponse.json(
        { error: "Email and authenticator 2FA must be enabled for account deletion" },
        { status: 400 }
      );
    }

    // Nettoyer les codes expirés
    await cleanupExpiredCodes();

    // Utiliser l'email d'authentification pour chercher le code
    const authenticationEmail = user.email;
    console.log(`Vérification suppression: session email=${userEmail}, auth email=${authenticationEmail}`);

    // Vérifier le code email
    const storedEmailData = await getCode(authenticationEmail, "2fa");
    console.log("Stored email data:", storedEmailData);
    
    if (!storedEmailData) {
      console.log("Erreur: Aucun code email trouvé");
      return NextResponse.json(
        { error: "No email verification code found. Please request a new code." },
        { status: 400 }
      );
    }

    if (storedEmailData.expiresAt < Date.now()) {
      console.log("Erreur: Code email expiré");
      await deleteCode(authenticationEmail, "2fa");
      return NextResponse.json(
        { error: "Email verification code expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (storedEmailData.code !== emailCode) {
      console.log("Erreur: Code email incorrect - attendu:", storedEmailData.code, "reçu:", emailCode);
      return NextResponse.json(
        { error: "Invalid email verification code" },
        { status: 400 }
      );
    }

    console.log("Code email vérifié avec succès");

    // Vérifier le code authenticator
    if (!user.authenticatorSecret) {
      console.log("Erreur: Authenticator non configuré");
      return NextResponse.json(
        { error: "Authenticator not configured" },
        { status: 400 }
      );
    }

    console.log("Vérification code authenticator...");
    const isValidAuthenticator = authenticator.verify({
      token: authenticatorCode,
      secret: user.authenticatorSecret
    });

    console.log("Code authenticator valide:", isValidAuthenticator);

    if (!isValidAuthenticator) {
      console.log("Erreur: Code authenticator incorrect");
      return NextResponse.json(
        { error: "Invalid authenticator code" },
        { status: 400 }
      );
    }

    console.log("Code authenticator vérifié avec succès");

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
    await deleteCode(authenticationEmail, "2fa");

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