import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { sendEmail } from "@/lib/email";
import { storeCode, cleanupExpiredCodes } from "@/lib/temp-codes-db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await cleanupExpiredCodes();

    // Générer un code de vérification unique
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Stocker le code avec expiration en DB
    await storeCode(email, verificationCode, "2fa", 5);

    // Envoyer l'email
    await sendEmail({
      to: email,
      subject: "Code de vérification 2FA - Neosign",
      html: `
        <h1>Code de vérification 2FA</h1>
        <p>Votre code de vérification pour activer l'authentification à deux facteurs :</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1f2937; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p>Ce code expire dans 5 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      `
    });

    console.log(`Code généré pour ${email}: ${verificationCode} (expire dans 5 minutes)`);
    console.log(`Email sent to ${email}`);

    return NextResponse.json({ 
      message: "Code de vérification envoyé par email", 
      email 
    });
  } catch (error) {
    console.error("Error sending 2FA email:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
} 