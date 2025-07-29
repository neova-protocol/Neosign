import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { authenticator } from "otplib";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { method, code, phoneNumber } = await request.json();

    if (!method || !code) {
      return NextResponse.json(
        { error: "Method and code are required" },
        { status: 400 }
      );
    }

    let isValid = false;
    let updatedMethods: string[] = [];

    switch (method) {
      case 'sms':
        // En production, vérifier le code stocké temporairement
        // Pour cette démo, on accepte n'importe quel code à 6 chiffres
        isValid = /^\d{6}$/.test(code);
        if (isValid && phoneNumber) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              phoneNumber,
              phoneVerified: true,
            }
          });
        }
        break;

      case 'email':
        // En production, vérifier le code stocké temporairement
        // Pour cette démo, on accepte n'importe quel code à 6 chiffres
        isValid = /^\d{6}$/.test(code);
        break;

      case 'authenticator':
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { authenticatorSecret: true }
        });

        if (user?.authenticatorSecret) {
          isValid = authenticator.verify({
            token: code,
            secret: user.authenticatorSecret
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid method" },
          { status: 400 }
        );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Mettre à jour les méthodes 2FA activées
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorMethods: true }
    });

    if (currentUser) {
      try {
        const currentMethods = JSON.parse(currentUser.twoFactorMethods || '[]');
        if (!currentMethods.includes(method)) {
          updatedMethods = [...currentMethods, method];
        } else {
          updatedMethods = currentMethods;
        }
      } catch {
        updatedMethods = [method];
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorMethods: JSON.stringify(updatedMethods),
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `${method.toUpperCase()} 2FA activated successfully`,
      methods: updatedMethods
    });

  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 