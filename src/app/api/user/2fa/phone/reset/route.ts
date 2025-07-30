import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { deleteSMSCode } from "@/lib/sms-codes-db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Récupérer le numéro de téléphone actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phoneNumber: true }
    });

    if (user?.phoneNumber) {
      // Supprimer les codes SMS associés à ce numéro
      await deleteSMSCode(user.phoneNumber, "2fa");
    }

    // Réinitialiser le numéro de téléphone dans la base de données
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber: null,
        phoneVerified: false,
        // Retirer 'sms' des méthodes 2FA activées
        twoFactorMethods: JSON.stringify([])
      }
    });

    console.log(`Numéro de téléphone réinitialisé pour l'utilisateur ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: "Numéro de téléphone réinitialisé avec succès"
    });

  } catch (error) {
    console.error("Error resetting phone number:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 