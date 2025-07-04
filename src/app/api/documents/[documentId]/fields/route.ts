import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
    params: {
        documentId: string;
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { documentId } = params;
        const { type, page, x, y, width, height, signatoryId } = await req.json();

        if (!type || page === undefined || x === undefined || y === undefined || width === undefined || height === undefined || signatoryId === undefined) {
            return NextResponse.json({ error: 'Missing required field properties' }, { status: 400 });
        }

        const newField = await prisma.signatureField.create({
            data: {
                documentId,
                type,
                page,
                x,
                y,
                width,
                height,
                signatoryId,
            },
        });

        return NextResponse.json(newField, { status: 201 });

    } catch (error) {
        console.error('Failed to create field:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 