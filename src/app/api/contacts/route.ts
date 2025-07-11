import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await req.json();
    
    const { firstName, lastName, email, phone, company, position, location } = body;

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Check if contact with this email already exists for this user
    const existingContact = await prisma.contact.findFirst({
      where: {
        ownerId: userId,
        email: email,
      },
    });

    if (existingContact) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 409 }
      );
    }

    // Create the contact
    const newContact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        position: position || null,
        location: location || null,
        ownerId: userId,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 