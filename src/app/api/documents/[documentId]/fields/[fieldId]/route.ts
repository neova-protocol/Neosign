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
  console.log("PUT /api/documents/[documentId]/fields/[fieldId] called");
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
        select: { 
          signatory: { select: { id: true, userId: true } },
          type: true 
        },
      });
      
      // Pour les paraphes, permettre la mise à jour sans vérifier le signatory
      if (field?.type === "paraphe") {
        // Les paraphes peuvent être mis à jour par n'importe quel utilisateur connecté
        signatoryId = undefined;
      } else if (
        !field ||
        !field.signatory ||
        field.signatory.userId !== session.user.id
      ) {
        return NextResponse.json(
          { error: "Forbidden: You cannot sign this field" },
          { status: 403 },
        );
      } else {
        signatoryId = field.signatory.id;
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!signatoryId) {
      // Vérifier si c'est un paraphe - dans ce cas, c'est normal de ne pas avoir de signatory
      const field = await prisma.signatureField.findUnique({
        where: { id: fieldId },
        select: { type: true }
      });
      
      if (field?.type !== "paraphe") {
        return NextResponse.json(
          { error: "Could not determine signatory" },
          { status: 400 },
        );
      }
      // Pour les paraphes, continuer sans signatory
    }

    const updatedField = await prisma.$transaction(async (tx) => {
      const fieldUpdate = await tx.signatureField.update({
        where: { id: fieldId },
        data: { value },
      });

      // Ne mettre à jour le signatory que pour les signatures, pas pour les paraphes
      if (signatoryId) {
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
