import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction([
      // Update all signatories of the document to "cancelled"
      prisma.signatory.updateMany({
        where: { documentId: documentId },
        data: { status: "cancelled" },
      }),
      // Update the document status to "cancelled"
      prisma.document.update({
        where: { id: documentId },
        data: { status: "cancelled" },
      }),
      // Add a document event for the cancellation
      prisma.documentEvent.create({
        data: {
          documentId: documentId,
          type: "cancelled",
          userName: session.user.name || "System",
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Signature process cancelled successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to cancel document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 