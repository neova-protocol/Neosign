import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// We are keeping Nodemailer commented out for now to focus on core functionality.
// You can uncomment this section and configure it with a real email provider later.
/*
import nodemailer from 'nodemailer';
*/

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentId } = await req.json();

  if (!documentId) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { signatories: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.creatorId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // TODO: Implement and uncomment email sending logic
    /*
    const transporter = nodemailer.createTransport({ ... });
    for (const signatory of document.signatories) {
        // ... mail sending logic
    }
    */

    const updatedDocument = await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id: documentId },
        data: { status: 'sent', updatedAt: new Date() },
      });

      await tx.signatory.updateMany({
        where: { documentId: documentId, status: 'preparing' },
        data: { status: 'pending' },
      });

      await tx.documentEvent.create({
        data: {
          documentId: documentId,
          type: 'sent',
          userId: session.user.id,
          userName: session.user.name || 'System',
        }
      });
      
      return tx.document.findUnique({
          where: { id: documentId },
          include: { signatories: true, fields: true, events: true }
      });
    });

    return NextResponse.json(updatedDocument, { status: 200 });

  } catch (error) {
    console.error('Failed to send document:', error);
    return NextResponse.json({ error: 'Failed to send document' }, { status: 500 });
  }
} 