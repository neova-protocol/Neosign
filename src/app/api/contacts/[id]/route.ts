import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { id } = await params;
    const body = await req.json();

    const { firstName, lastName, email, phone, company, position, location } =
      body;

    // Check if the contact exists and belongs to the user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Update the contact
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        position: position || null,
        location: location || null,
      },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { id } = await params;

    // Check if the contact exists and belongs to the user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Delete the contact
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
