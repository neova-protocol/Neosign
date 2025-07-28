import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { documentId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { documentId } = await params;
    const body = await req.json();

    console.log(`📥 Received field creation request:`, {
      documentId,
      body,
      bodyKeys: Object.keys(body),
    });

    const { type, page, x, y, width, height, signatoryId } = body;

    console.log(`🔍 Extracted values:`, {
      type,
      page,
      x,
      y,
      width,
      height,
      signatoryId,
      typeOfX: typeof x,
      typeOfY: typeof y,
      typeOfWidth: typeof width,
      typeOfHeight: typeof height,
    });

    // Validation plus stricte
    if (
      !type ||
      typeof page !== "number" ||
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number"
    ) {
      console.error(`❌ Invalid field data:`, {
        type: { value: type, valid: !!type },
        page: { value: page, valid: typeof page === "number" },
        x: { value: x, valid: typeof x === "number" },
        y: { value: y, valid: typeof y === "number" },
        width: { value: width, valid: typeof width === "number" },
        height: { value: height, valid: typeof height === "number" },
      });

      return NextResponse.json(
        {
          error: "Invalid field properties",
          details: { type, page, x, y, width, height },
        },
        { status: 400 },
      );
    }

    // Vérifier que le document existe
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const data: any = {
      documentId,
      type,
      page: parseInt(page.toString()),
      x: parseFloat(x.toString()),
      y: parseFloat(y.toString()),
      width: parseFloat(width.toString()),
      height: parseFloat(height.toString()),
    };

    if (signatoryId) {
      data.signatoryId = signatoryId;
    }

    console.log(`💾 Creating field with data:`, data);

    const newField = await prisma.signatureField.create({
      data,
    });

    console.log(`✅ Field created successfully:`, newField);

    return NextResponse.json(newField, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("💥 Failed to create field:", errorMessage, error);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 },
    );
  }
}
