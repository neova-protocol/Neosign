import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest, 
    { params: { documentId } }: { params: { documentId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                signatories: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                fields: true,
                events: {
                    orderBy: {
                        date: 'asc'
                    }
                }
            },
        });

        if (!document) {
            return NextResponse.json({ message: 'Document not found' }, { status: 404 });
        }

        const userId = session.user.id;
        const isCreator = document.creatorId === userId;
        const isSignatory = document.signatories.some((s: {userId: string | null}) => s.userId === userId);

        if (!isCreator && !isSignatory) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error('Failed to fetch document:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest, 
    { params: { documentId } }: { params: { documentId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                creatorId: userId,
            },
        });

        if (!document) {
            return NextResponse.json({ message: 'Document not found or you do not have permission to delete it' }, { status: 404 });
        }

        if (document.status.toLowerCase() !== 'draft') {
            return NextResponse.json({ message: 'Only draft documents can be deleted' }, { status: 400 });
        }

        if (document.fileUrl) {
            const filePath = path.join(process.cwd(), 'public', document.fileUrl);
            try {
                await fs.unlink(filePath);
            } catch (fileError: any) {
                console.error(`Failed to delete file ${filePath}:`, fileError.message);
            }
        }
        
        await prisma.document.delete({
            where: {
                id: documentId,
            },
        });

        return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Failed to delete document:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 