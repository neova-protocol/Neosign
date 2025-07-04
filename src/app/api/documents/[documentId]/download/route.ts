import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

interface Params {
    params: {
        documentId: string;
    }
}

export async function GET(req: NextRequest, { params }: Params) {
    const { documentId } = await params;

    try {
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { fields: true },
        });

        if (!document || !document.fileUrl) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const filePath = join(process.cwd(), 'public', document.fileUrl);
        const pdfBytes = await readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        for (const field of document.fields) {
            if (field.value) { // The signature image is stored in the 'value' field as a data URL
                const page = pdfDoc.getPage(field.page - 1);
                
                // The signature is a PNG data URL, e.g., "data:image/png;base64,iVBORw0KGgo..."
                // We need to embed it as a PNG image.
                const pngImage = await pdfDoc.embedPng(field.value);

                page.drawImage(pngImage, {
                    x: field.x,
                    y: page.getHeight() - field.y - field.height, // pdf-lib's y-axis is from the bottom
                    width: field.width,
                    height: field.height,
                });
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