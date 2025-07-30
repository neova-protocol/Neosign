import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        phoneNumber: true,
        phoneVerified: true,
        authenticatorSecret: true,
        authenticatorEnabled: true,
        twoFactorMethods: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching 2FA config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phoneNumber, authenticatorSecret, authenticatorEnabled, twoFactorMethods } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber,
        authenticatorSecret,
        authenticatorEnabled,
        twoFactorMethods,
      },
      select: {
        phoneNumber: true,
        phoneVerified: true,
        authenticatorSecret: true,
        authenticatorEnabled: true,
        twoFactorMethods: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating 2FA config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 