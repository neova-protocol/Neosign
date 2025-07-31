import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { UpdateParapheRequest } from "@/types/paraphe";

export async function GET(
  request: NextRequest,
  { params }: { params: { parapheId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paraphe = await prisma.paraphe.findFirst({
      where: {
        id: params.parapheId,
        userId: session.user.id,
      },
    });

    if (!paraphe) {
      return NextResponse.json({ error: "Paraphe not found" }, { status: 404 });
    }

    return NextResponse.json(paraphe);
  } catch (error) {
    console.error("Error fetching paraphe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { parapheId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateParapheRequest = await request.json();

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

    // Si on définit ce paraphe comme défaut, désactiver les autres
    if (body.isDefault) {
      await prisma.paraphe.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: params.parapheId },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedParaphe = await prisma.paraphe.update({
      where: {
        id: params.parapheId,
      },
      data: {
        name: body.name,
        content: body.content,
        font: body.font,
        color: body.color,
        size: body.size,
        isDefault: body.isDefault,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedParaphe);
  } catch (error) {
    console.error("Error updating paraphe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.paraphe.delete({
      where: {
        id: params.parapheId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting paraphe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 