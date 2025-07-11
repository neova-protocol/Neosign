"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Manually define the types to avoid Prisma client issues
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  location: string | null;
}

interface Signatory {
    id: string;
    name: string;
    email: string;
}

export async function getContacts(): Promise<Contact[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  try {
    const userId = session.user.id;

    const dbContacts = await prisma.contact.findMany({
      where: { ownerId: userId },
    });

    const signatories: Signatory[] = await prisma.signatory.findMany({
      where: {
        document: {
          creatorId: userId,
        },
      },
      distinct: ["email"],
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    const combinedContacts: Contact[] = [
      ...dbContacts.map((c: any) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone || null,
        company: c.company || null,
        position: c.position || null,
        location: c.location || null,
      })),
      ...signatories.map((s: Signatory) => ({
        id: s.id,
        firstName: s.name.split(" ")[0] || "",
        lastName: s.name.split(" ").slice(1).join(" ") || "",
        email: s.email,
        phone: null,
        company: null,
        position: null,
        location: null,
      })),
    ];

    const uniqueContacts = Array.from(
      new Map(combinedContacts.map((c) => [c.email, c])).values()
    );

    return uniqueContacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
} 