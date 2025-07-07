import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ documentId: string, fieldId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { fieldId } = await params;
        const { x, y } = await req.json();

        if (x === undefined || y === undefined) {
            return NextResponse.json({ error: 'Missing position data' }, { status: 400 });
        }

        const field = await prisma.signatureField.findUnique({
            where: { id: fieldId },
            select: { document: { select: { creatorId: true } } }
        });

        if (!field) {
            return NextResponse.json({ error: 'Field not found' }, { status: 404 });
        }
        
        if (field.document.creatorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedField = await prisma.signatureField.update({
            where: { id: fieldId },
            data: { x, y },
        });

        return NextResponse.json(updatedField, { status: 200 });

    } catch (error) {
        console.error(`Failed to update field position:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 