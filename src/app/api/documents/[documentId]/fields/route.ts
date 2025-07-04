import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { documentId: string }}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { documentId } = await params;
        const body = await req.json();

        const { type, page, x, y, width, height, signatoryId } = body;

        console.log(`Received request to create field for document ${documentId} with signatoryId: ${signatoryId}`);

        if (!type || page === undefined || x === undefined || y === undefined || width === undefined || height === undefined) {
            return NextResponse.json({ error: 'Missing required field properties' }, { status: 400 });
        }

        const data: any = {
            documentId,
            type,
            page,
            x,
            y,
            width,
            height,
        };

        if (signatoryId) {
            data.signatoryId = signatoryId;
        }

        const newField = await prisma.signatureField.create({
            data,
        });

        return NextResponse.json(newField, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to create field:', errorMessage, error);
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
} 