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
        console.log("📄 Loading PDF from:", fileUrl);
        
        const originalPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const embeddingErrors: string[] = [];

        console.log("📝 Fields data received for PDF generation:", JSON.stringify(document.fields, null, 2));
        console.log("📖 PDF has", pdfDoc.getPageCount(), "pages");

        for (const field of document.fields) {
            console.log(`🔍 Processing field ${field.id}:`, {
                type: field.type,
                page: field.page,
                x: field.x,
                y: field.y,
                width: field.width,
                height: field.height,
                hasValue: !!field.value,
                valueLength: field.value?.length || 0
            });

            if (field.value && field.value.startsWith('data:image/png;base64,')) {
                try {
                    console.log(`🖼️ Embedding signature for field ${field.id}`);
                    
                    // Extract and decode base64 image
                    const base64Data = field.value.split(',')[1];
                    if (!base64Data) {
                        throw new Error('Invalid base64 data - no data after comma');
                    }
                    
                    const pngImageBytes = Buffer.from(base64Data, 'base64');
                    console.log(`📊 Base64 decoded to ${pngImageBytes.length} bytes`);
                    
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    console.log(`✅ PNG embedded successfully`);
                    
                    const page = pdfDoc.getPage(field.page - 1);
                    if (page) {
                        const { width: pageWidth, height: pageHeight } = page.getSize();
                        console.log(`📐 Page ${field.page} size: ${pageWidth} x ${pageHeight}`);
                        
                        // Calculate position - pdf-lib uses bottom-left origin
                        const finalX = field.x;
                        const finalY = pageHeight - field.y - field.height;
                        
                        console.log(`📍 Drawing at position: x=${finalX}, y=${finalY}, w=${field.width}, h=${field.height}`);
                        
                        page.drawImage(pngImage, {
                            x: finalX,
                            y: finalY,
                            width: field.width,
                            height: field.height,
                        });
                        
                        console.log(`✅ Signature successfully drawn on page ${field.page}`);
                    } else {
                        throw new Error(`Page ${field.page} not found in document`);
                    }
                } catch (e: any) {
                    const errorMessage = `❌ Could not embed signature for field ${field.id}: ${e.message}`;
                    console.error(errorMessage, e);
                    embeddingErrors.push(errorMessage);
                }
            } else if (field.value) {
                console.log(`⚠️ Field ${field.id} has non-PNG value:`, field.value.substring(0, 50) + '...');
            } else {
                console.log(`⚠️ Field ${field.id} has no value to embed`);
            }
        }

        if (embeddingErrors.length > 0) {
            console.error("❌ Embedding errors:", embeddingErrors);
            return NextResponse.json({ error: 'Failed to embed some signatures.', details: embeddingErrors }, { status: 500 });
        }

        console.log("💾 Saving PDF with signatures...");
        const pdfBytesWithSignatures = await pdfDoc.save();
        console.log("✅ PDF saved successfully, size:", pdfBytesWithSignatures.length, "bytes");

        return new NextResponse(pdfBytesWithSignatures, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${document.name}"`,
            },
        });

    } catch (error) {
        console.error(`💥 Failed to generate signed PDF for document ${documentId}:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 