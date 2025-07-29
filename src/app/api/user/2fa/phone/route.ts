import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Générer un code de vérification (en production, utiliser un service SMS)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Simuler l'envoi du SMS
    console.log(`SMS envoyé à ${phoneNumber}: Code de vérification: ${verificationCode}`);

    // En production, intégrer avec un service SMS comme Twilio
    // await twilio.messages.create({
    //   body: `Votre code de vérification Neosign: ${verificationCode}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });

    // Mettre à jour le numéro de téléphone de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber,
        phoneVerified: false, // Sera mis à true après vérification
      }
    });

    // En production, stocker le code temporairement (Redis, base de données, etc.)
    // Pour cette démo, on simule juste l'envoi

    return NextResponse.json({
      message: "Code de vérification envoyé",
      phoneNumber
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 