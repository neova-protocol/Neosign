import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { TwilioService } from "@/lib/twilio";
import { storeSMSCode, getSMSCodeAttempts, cleanupExpiredSMSCodes } from "@/lib/sms-codes-db";

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

    // Nettoyer les codes expirés
    await cleanupExpiredSMSCodes();

    // Vérifier le nombre de tentatives (limite à 5 par heure)
    const attempts = await getSMSCodeAttempts(phoneNumber);
    if (attempts >= 5) {
      return NextResponse.json(
        { error: "Too many SMS attempts. Please wait before requesting another code." },
        { status: 429 }
      );
    }

    // Formater le numéro de téléphone
    const formattedPhoneNumber = TwilioService.formatFrenchPhoneNumber(phoneNumber);

    // Générer un code de vérification à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Stocker le code temporairement
    await storeSMSCode(formattedPhoneNumber, verificationCode, "2fa", 5);

    // Envoyer le SMS via Twilio
    const message = TwilioService.generateVerificationMessage(verificationCode);
    const smsResult = await TwilioService.sendSMS(formattedPhoneNumber, message);

    if (!smsResult.success) {
      console.error("Failed to send SMS:", smsResult.error);
      return NextResponse.json(
        { error: smsResult.error || "Failed to send SMS" },
        { status: 500 }
      );
    }

    // Mettre à jour le numéro de téléphone de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber: formattedPhoneNumber,
        phoneVerified: false, // Sera mis à true après vérification
      }
    });

    console.log(`SMS verification code sent to ${formattedPhoneNumber} (Message ID: ${smsResult.messageId})`);

    return NextResponse.json({
      success: true,
      message: "Code de vérification envoyé par SMS",
      phoneNumber: formattedPhoneNumber,
      messageId: smsResult.messageId
    });
  } catch (error) {
    console.error("Error sending SMS verification code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 