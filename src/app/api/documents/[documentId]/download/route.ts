import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PDFDocument } from 'pdf-lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface Params {
    documentId: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await params;

    try {
        const document = await prisma.document.findFirst({
            where: { 
                id: documentId,
                OR: [
                    { creatorId: session.user.id },
                    { signatories: { some: { userId: session.user.id } } }
                ]
            },
            include: { fields: true },
        });

        if (!document || !document.fileUrl) {
            return NextResponse.json({ error: 'Document not found or user not authorized' }, { status: 404 });
        }
        
        const fileUrl = new URL(document.fileUrl, req.nextUrl.origin).toString();
        const originalPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(originalPdfBytes);

        for (const field of document.fields) {
            if (field.value) { // The signature image is stored in the 'value' field as a data URL
                try {
                    const pngImageBytes = Buffer.from(field.value.split(',')[1], 'base64');
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    
                    const page = pdfDoc.getPage(field.page - 1);
                    if (page) {
                        const { height: pageHeight } = page.getSize();
                        page.drawImage(pngImage, {
                            x: field.x,
                            y: pageHeight - field.y - field.height, // pdf-lib's y-axis is from the bottom
                            width: field.width,
                            height: field.height,
                        });
                    }
                } catch (e) {
                    console.error("Could not embed signature for field " + field.id + ". Maybe it's not a PNG?", e);
                    continue;
                }
            }
        }

        const pdfBytesWithSignatures = await pdfDoc.save();

        return new NextResponse(pdfBytesWithSignatures, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${document.name}"`,
            },
        });

    } catch (error) {
        console.error(`Failed to generate signed PDF for document ${documentId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 