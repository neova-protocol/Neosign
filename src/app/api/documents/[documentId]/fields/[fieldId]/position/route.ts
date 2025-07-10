import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function PUT(
    req: NextRequest, 
    { params }: { params: { documentId: string; fieldId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { documentId, fieldId } = await params;
        const { x, y } = await req.json();

        console.log(`📍 Updating field position:`, {
            documentId,
            fieldId,
            x,
            y,
            userId: session.user.id
        });

        // Validation
        if (typeof x !== 'number' || typeof y !== 'number') {
            return NextResponse.json({ 
                error: 'Invalid coordinates', 
                details: { x, y } 
            }, { status: 400 });
        }

        // Vérifier que le document existe et appartient à l'utilisateur
        const document = await prisma.document.findFirst({
            where: { 
                id: documentId,
                creatorId: session.user.id
            }
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found or unauthorized' }, { status: 404 });
        }

        // Mettre à jour la position du champ
        const updatedField = await prisma.signatureField.update({
            where: { id: fieldId },
            data: { 
                x: parseFloat(x.toString()), 
                y: parseFloat(y.toString()) 
            },
        });

        console.log(`✅ Field position updated successfully:`, updatedField);

        return NextResponse.json(updatedField);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('💥 Failed to update field position:', errorMessage, error);
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
} 