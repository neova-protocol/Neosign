import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

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
    const { newEmail } = await request.json();

    if (!newEmail) {
      return NextResponse.json(
        { error: "New email is required" },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const currentEmail = session.user.email;

    if (!currentEmail) {
      return NextResponse.json({ error: "Current email not found" }, { status: 400 });
    }

    // Vérifier que le nouvel email est différent
    if (newEmail === currentEmail) {
      return NextResponse.json(
        { error: "New email must be different from current email" },
        { status: 400 }
      );
    }

    // Vérifier que le nouvel email n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use by another account" },
        { status: 400 }
      );
    }

    // Nettoyer les codes expirés
    cleanupExpiredCodes();

    // Générer un code de vérification unique
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculer l'expiration (10 minutes)
    const expiresAt = Date.now() + (10 * 60 * 1000);
    
    // Stocker le code temporairement avec le nouvel email comme clé
    tempCodes.set(newEmail, {
      code: verificationCode,
      expiresAt: expiresAt
    });

    console.log(`Email change code generated for ${newEmail}: ${verificationCode} (expires in 10 minutes)`);

    // Envoyer l'email avec le code
    try {
      await sendEmail({
        to: newEmail,
        subject: "Confirmation de changement d'email - Neosign",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Confirmation de changement d'email</h2>
            <p>Vous avez demandé à changer votre adresse email pour : <strong>${newEmail}</strong></p>
            <p>Votre code de vérification :</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 32px; color: #2563eb; margin: 0; font-family: monospace;">${verificationCode}</h1>
            </div>
            <p>Ce code expire dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Supprimer le code en cas d'erreur d'envoi
      tempCodes.delete(newEmail);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Verification code sent to new email address",
      newEmail
    });

  } catch (error) {
    console.error("Error requesting email change:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 