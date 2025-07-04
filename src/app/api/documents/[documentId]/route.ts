import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface Params {
    params: {
        documentId: string;
    }
}

export async function GET(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    const { documentId } = params;

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                signatories: true,
                fields: true,
                events: true,
            },
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // Optional: Check if the user is authorized to view this document
        const isCreator = document.creatorId === session.user.id;
        const isSignatory = document.signatories.some(s => s.userId === session.user.id);

        if (!isCreator && !isSignatory) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(document);

    } catch (error) {
        console.error(`Failed to fetch document ${documentId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 