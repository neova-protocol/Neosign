import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { parapheId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifier que le paraphe appartient à l'utilisateur
    const existingParaphe = await prisma.paraphe.findFirst({
      where: {
        id: params.parapheId,
        userId: session.user.id,
      },
    });

    if (!existingParaphe) {
      return NextResponse.json({ error: "Paraphe not found" }, { status: 404 });
    }

    // Désactiver tous les autres paraphes par défaut
    await prisma.paraphe.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Définir ce paraphe comme défaut
    const updatedParaphe = await prisma.paraphe.update({
      where: {
        id: params.parapheId,
      },
      data: {
        isDefault: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedParaphe);
  } catch (error) {
    console.error("Error setting default paraphe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 