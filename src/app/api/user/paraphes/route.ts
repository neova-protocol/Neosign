import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { CreateParapheRequest } from "@/types/paraphe";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paraphes = await prisma.paraphe.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paraphes);
  } catch (error) {
    console.error("Error fetching paraphes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateParapheRequest = await request.json();
    
    // Validation
    if (!body.name || !body.type || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Si c'est le premier paraphe ou si isDefault est true, désactiver les autres paraphes par défaut
    if (body.isDefault) {
      await prisma.paraphe.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const paraphe = await prisma.paraphe.create({
      data: {
        userId: session.user.id,
        name: body.name,
        type: body.type,
        content: body.content,
        font: body.font,
        color: body.color,
        size: body.size,
        isDefault: body.isDefault || false,
      },
    });

    return NextResponse.json(paraphe);
  } catch (error) {
    console.error("Error creating paraphe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 