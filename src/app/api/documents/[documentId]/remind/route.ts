import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { Resend } from "resend";
import { SignatureRequestEmail } from "@/components/emails/SignatureRequestEmail";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Neosign <onboarding@resend.dev>";

export async function POST(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { signatories: true, creator: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check for the last reminder event to prevent spamming
    const lastReminderEvent = await prisma.documentEvent.findFirst({
      where: {
        documentId: documentId,
        type: "reminded",
      },
      orderBy: {
        date: "desc",
      },
    });

    if (lastReminderEvent) {
      const now = new Date();
      const lastReminderDate = new Date(lastReminderEvent.date);
      const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

      if (now.getTime() - lastReminderDate.getTime() < twentyFourHoursInMillis) {
        return NextResponse.json(
          { error: "A reminder has already been sent within the last 24 hours." },
          { status: 429 } // 429 Too Many Requests is appropriate here
        );
      }
    }

    const pendingSignatories = document.signatories.filter(
      (s) => s.status === "pending"
    );

    if (pendingSignatories.length === 0) {
      return NextResponse.json(
        { message: "All signatories have already signed." },
        { status: 200 }
      );
    }

    for (const signatory of pendingSignatories) {
      const signingUrl = `${baseUrl}/sign/${document.id}?token=${signatory.token}`;
      try {
        await resend.emails.send({
          from: fromEmail,
          to: [signatory.email],
          subject: `Reminder: Signature Request for ${document.name}`,
          react: SignatureRequestEmail({
            documentName: document.name,
            senderName: document.creator.name || "Someone",
            actionUrl: signingUrl,
            isReminder: true,
          }) as React.ReactElement,
        });
      } catch (emailError) {
        console.error(
          `Failed to send reminder email to ${signatory.email}:`,
          emailError
        );
      }
    }

    // Add a single event for the reminder action
    await prisma.documentEvent.create({
      data: {
        documentId: documentId,
        type: "reminded",
        userName: document.creator.name || "System",
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Reminders sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send reminders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 