import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  params: {
    documentId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  console.log("GET /api/public/documents/[documentId] called");
  const { documentId } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const signatory = await prisma.signatory.findFirst({
      where: {
        token: token,
        documentId: documentId,
      },
    });

    if (!signatory) {
      return NextResponse.json(
        { error: "Invalid token or document ID" },
        { status: 403 },
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        signatories: true,
        fields: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error(`Failed to fetch public document ${documentId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
