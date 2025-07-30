import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// Stockage temporaire des codes (en production, utiliser Redis ou une base de données)
const tempCodes = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Générer un code de vérification unique
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculer l'expiration (5 minutes)
    const expiresAt = Date.now() + (5 * 60 * 1000);
    
    // Stocker le code temporairement avec l'email comme clé
    tempCodes.set(email, {
      code: verificationCode,
      expiresAt: expiresAt
    });

    console.log(`Code généré pour ${email}: ${verificationCode} (expire dans 5 minutes)`);

    // Envoyer l'email avec le code
    try {
      await sendEmail({
        to: email,
        subject: "Code de vérification 2FA - Neosign",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Code de vérification 2FA</h2>
            <p>Votre code de vérification pour activer l'authentification à deux facteurs :</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 32px; color: #2563eb; margin: 0; font-family: monospace;">${verificationCode}</h1>
            </div>
            <p>Ce code expire dans 5 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Supprimer le code en cas d'erreur d'envoi
      tempCodes.delete(email);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    // Mettre à jour l'email de l'utilisateur si différent
    if (email !== session.user.email) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { email }
      });
    }

    return NextResponse.json({
      message: "Code de vérification envoyé par email",
      email
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 