import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { signature, font, drawnSignature, uploadedSignature } = await req.json();

        if (drawnSignature) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { drawnSignature },
            });
        } else if (uploadedSignature) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { uploadedSignature },
            });
        } else {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    typedSignature: signature,
                    typedSignatureFont: font,
                },
            });
        }

        return NextResponse.json({ message: 'Signature saved successfully' });
    } catch (error) {
        console.error("Error saving signature:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 