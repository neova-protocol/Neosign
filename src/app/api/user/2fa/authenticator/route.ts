import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// Fonction pour convertir en base32
function toBase32(bytes: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Générer un secret pour l'authenticator (base32)
    const randomBytes = crypto.randomBytes(20);
    const secret = toBase32(randomBytes);
    
    // Créer l'URL pour le QR code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpauthUrl = `otpauth://totp/Neosign:${user.email}?secret=${secret}&issuer=Neosign&algorithm=SHA1&digits=6&period=30`;

    // Récupérer les méthodes 2FA actuelles
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorMethods: true }
    });

    let twoFactorMethods = [];
    try {
      twoFactorMethods = JSON.parse(currentUser?.twoFactorMethods || '[]');
    } catch {
      twoFactorMethods = [];
    }

    // Ajouter 'authenticator' s'il n'est pas déjà présent
    if (!twoFactorMethods.includes('authenticator')) {
      twoFactorMethods.push('authenticator');
    }

    // Mettre à jour l'utilisateur avec le secret et les méthodes
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        authenticatorSecret: secret,
        authenticatorEnabled: true,
        twoFactorMethods: JSON.stringify(twoFactorMethods),
      }
    });

    return NextResponse.json({
      secret,
      otpauthUrl,
      qrCodeData: otpauthUrl, // Pour générer le QR code côté client
      message: "Authenticator configuré avec succès"
    });
  } catch (error) {
    console.error("Error configuring authenticator:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 