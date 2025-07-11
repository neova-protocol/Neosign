import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const contactsFromDb = await prisma.contact.findMany({
            where: {
                ownerId: session.user.id,
            },
        });

        const contacts = contactsFromDb.map(contact => ({
            ...contact,
            name: `${contact.firstName} ${contact.lastName}`,
        }));

        return NextResponse.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 