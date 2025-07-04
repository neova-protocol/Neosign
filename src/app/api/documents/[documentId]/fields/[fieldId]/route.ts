import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface Params {
    params: {
        documentId: string;
        fieldId: string;
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { documentId, fieldId } = params;
        const { x, y, value } = await req.json();

        if (x === undefined && y === undefined && value === undefined) {
            return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
        }
        
        const dataToUpdate: { x?: number, y?: number, value?: string } = {};
        if (x !== undefined) dataToUpdate.x = x;
        if (y !== undefined) dataToUpdate.y = y;
        if (value !== undefined) dataToUpdate.value = value;
        
        const updatedField = await prisma.$transaction(async (tx) => {
            const field = await tx.signatureField.update({
                where: { id: fieldId },
                data: dataToUpdate,
            });

            if (value !== undefined && field.signatoryId) {
                await tx.signatory.update({
                    where: { id: field.signatoryId },
                    data: { status: 'signed' }
                });

                await tx.documentEvent.create({
                    data: {
                        documentId: documentId,
                        type: 'signed',
                        userId: session.user.id,
                        userName: session.user.name || 'Signatory',
                    }
                });

                const allSignatories = await tx.signatory.findMany({
                    where: { documentId: documentId },
                });

                const allHaveSigned = allSignatories.every(s => s.status === 'signed');

                if (allHaveSigned) {
                    await tx.document.update({
                        where: { id: documentId },
                        data: { status: 'completed' }
                    });

                     await tx.documentEvent.create({
                        data: {
                           documentId: documentId,
                           type: 'completed',
                           userId: session.user.id,
                           userName: 'System' 
                        }
                    });
                }
            }
            return field;
        });


        return NextResponse.json(updatedField, { status: 200 });

    } catch (error) {
        console.error(`Failed to update field ${params.fieldId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { documentId, fieldId } = params;

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            select: { creatorId: true },
        });

        if (!document || document.creatorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.signatureField.delete({
            where: { id: fieldId },
        });

        return NextResponse.json({ message: 'Field deleted successfully' }, { status: 200 });

    } catch (error) {
        // Log the full error for better debugging on the server
        console.error(`Failed to delete field ${params.fieldId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 