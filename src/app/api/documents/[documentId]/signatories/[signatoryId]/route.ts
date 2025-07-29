import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string; signatoryId: string } },
) {
  console.log("DELETE /api/documents/[documentId]/signatories/[signatoryId] called");
  try {
    const { signatoryId } = params;

    // Optional: You could add extra validation here to ensure the user
    // has permission to delete this signatory from this document.

    await prisma.signatory.delete({
      where: {
        id: signatoryId,
      },
    });

    return NextResponse.json(
      { message: "Signatory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete signatory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
