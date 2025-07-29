import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

// GET /api/notifications : liste des notifications de l'utilisateur
export async function GET() {
  console.log("GET /api/notifications called");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/notifications : créer une notification
export async function POST(req: Request) {
  console.log("POST /api/notifications called");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { type, message, documentId } = body;
    if (!type || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        message,
        documentId: documentId || null,
      },
    });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PATCH /api/notifications : marquer comme lue (body: { id })
export async function PATCH(req: Request) {
  console.log("PATCH /api/notifications called");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { message: "Missing notification id" },
        { status: 400 },
      );
    }
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
