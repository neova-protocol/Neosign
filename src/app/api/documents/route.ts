import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route';


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const documents = await prisma.document.findMany({
            where: {
                OR: [
                    { creatorId: session.user.id },
                    { signatories: { some: { userId: session.user.id } } },
                ],
            },
            include: {
                signatories: true,
                fields: true,
                events: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return NextResponse.json(documents);
    } catch (error) {
        console.error(`Failed to fetch documents for user ${session.user.id}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, fileUrl } = await req.json();

        if (!name || !fileUrl) {
            return NextResponse.json({ error: 'Missing name or fileUrl' }, { status: 400 });
        }

        const newDocument = await prisma.document.create({
            data: {
                name,
                fileUrl,
                creatorId: session.user.id,
                status: 'draft',
            },
            include: {
                signatories: true,
                fields: true,
                events: true,
            },
        });

        return NextResponse.json(newDocument, { status: 201 });

    } catch (error) {
        console.error('Failed to create document:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 