import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface Params {
  documentId: string;
  fieldId: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { documentId, fieldId } = await params;
  const { value } = await req.json();

  try {
    const session = await getServerSession(authOptions);
    const token = req.nextUrl.searchParams.get("token");
    let signatoryId: string | undefined;

    if (token) {
      const signatory = await prisma.signatory.findFirst({
        where: { token, documentId },
      });
      if (!signatory)
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
      signatoryId = signatory.id;
    } else if (session?.user?.id) {
      const field = await prisma.signatureField.findUnique({
        where: { id: fieldId },
        select: { signatory: { select: { id: true, userId: true } } },
      });
      if (
        !field ||
        !field.signatory ||
        field.signatory.userId !== session.user.id
      ) {
        return NextResponse.json(
          { error: "Forbidden: You cannot sign this field" },
          { status: 403 },
        );
      }
      signatoryId = field.signatory.id;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!signatoryId) {
      return NextResponse.json(
        { error: "Could not determine signatory" },
        { status: 400 },
      );
    }

    const updatedField = await prisma.$transaction(async (tx) => {
      const fieldUpdate = await tx.signatureField.update({
        where: { id: fieldId },
        data: { value },
      });

      await tx.signatory.update({
        where: { id: signatoryId },
        data: { status: "signed", signedAt: new Date() },
      });

      const signatoryDetails = await tx.signatory.findUnique({
        where: { id: signatoryId },
      });

      await tx.documentEvent.create({
        data: {
          documentId: documentId,
          type: "signed",
          userName: signatoryDetails?.name ?? "Unknown",
        },
      });

      const remainingSignatories = await tx.signatory.count({
        where: { documentId, status: { not: "signed" } },
      });

      if (remainingSignatories === 0) {
        await tx.document.update({
          where: { id: documentId },
          data: { status: "completed" },
        });
        await tx.documentEvent.create({
          data: {
            documentId: documentId,
            type: "completed",
            userName: "System",
          },
        });
      }

      return fieldUpdate;
    });

    revalidatePath(`/api/documents/${documentId}`);
    revalidatePath(`/dashboard/documents/${documentId}`);
    revalidatePath(`/dashboard/sign/document/${documentId}`);

    return NextResponse.json(updatedField, { status: 200 });
  } catch (error) {
    console.error(`Failed to update field ${fieldId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { documentId, fieldId } = await params;

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { creatorId: true },
    });

    if (!document || document.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.signatureField.delete({
      where: { id: fieldId },
    });

    return NextResponse.json(
      { message: "Field deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to delete field:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
