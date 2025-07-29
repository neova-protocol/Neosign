import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  console.log("GET /api/contacts called");
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const contactsFromDb = await prisma.contact.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    const contacts = contactsFromDb.map((contact) => ({
      ...contact,
      name: `${contact.firstName} ${contact.lastName}`,
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  console.log("POST /api/contacts called");
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, company, position, location } =
      body;

    // Validation basique
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newContact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        position: position || null,
        location: location || null,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
