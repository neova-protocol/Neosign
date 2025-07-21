import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route';
import { Resend } from 'resend';
import { SignatureRequestEmail } from '@/components/emails/SignatureRequestEmail';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Neosign <onboarding@resend.dev>';

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
      include: { signatories: true, creator: true },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.creatorId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Send email to each signatory
    for (const signatory of document.signatories) {
      // Vérifie et lie le signataire à un userId si besoin
      let userId = signatory.userId;
      if (!userId) {
        const user = await prisma.user.findUnique({ where: { email: signatory.email } });
        if (user) {
          await prisma.signatory.update({ where: { id: signatory.id }, data: { userId: user.id } });
          userId = user.id;
        }
      }
      const signingUrl = `${baseUrl}/sign/${document.id}?token=${signatory.token}`;
      try {
        await resend.emails.send({
          from: fromEmail,
          to: [signatory.email],
          subject: `Signature Request: ${document.name}`,
          react: SignatureRequestEmail({
            documentName: document.name,
            senderName: document.creator.name || 'Someone',
            actionUrl: signingUrl,
          }) as React.ReactElement,
        });
        // Génération notification si le signataire est un utilisateur
        if (userId) {
          await prisma.notification.create({
            data: {
              userId,
              type: 'signature_request',
              message: `You have been requested to sign the document: ${document.name}`,
              documentId: document.id,
            }
          });
        }
      } catch (emailError) {
        console.error(`Failed to send email to ${signatory.email}:`, emailError);
        // We might want to decide if a single failed email should stop the whole process.
        // For now, we'll just log it and continue.
      }
    }

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