import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { methods } = body;

    if (!Array.isArray(methods)) {
      return NextResponse.json(
        { error: "Methods must be an array" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorMethods: JSON.stringify(methods),
      },
      select: {
        phoneNumber: true,
        phoneVerified: true,
        authenticatorSecret: true,
        authenticatorEnabled: true,
        twoFactorMethods: true,
      }
    });

    // Calculer emailVerified en fonction des méthodes activées
    let twoFactorMethods = [];
    try {
      twoFactorMethods = JSON.parse(updatedUser.twoFactorMethods || '[]');
    } catch {
      twoFactorMethods = [];
    }

    const emailVerified = twoFactorMethods.includes('email');

    return NextResponse.json({
      ...updatedUser,
      emailVerified
    });
  } catch (error) {
    console.error("Error updating 2FA methods:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 