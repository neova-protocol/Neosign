import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Vérifier que le compte est en attente de suppression
    if (user.accountStatus !== "pending_deletion") {
      return NextResponse.json(
        { error: "No deletion request found for this account" },
        { status: 400 }
      );
    }

    // Annuler la suppression
    await prisma.user.update({
      where: { id: userId },
      data: {
        accountStatus: "active",
        deletionRequestedAt: null,
        deletionScheduledAt: null,
        deletionReason: null
      }
    });

    console.log(`Account deletion cancelled for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Account deletion cancelled successfully"
    });

  } catch (error) {
    console.error("Error cancelling account deletion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 