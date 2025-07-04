import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface Params {
    params: {
        documentId: string;
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const { documentId } = params;
        const { name, email, role, color, id: potentialUserId } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
        }
        
        // Find if a user exists with this email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const signatoryData = {
            documentId,
            name,
            email,
            role: role || 'Signatory',
            color: color || '#CCCCCC',
            status: 'preparing',
            userId: user ? user.id : null, // Link to existing user if found
        };
        
        const newSignatory = await prisma.signatory.create({
            data: signatoryData
        });

        return NextResponse.json(newSignatory, { status: 201 });

    } catch (error) {
        console.error('Failed to add signatory:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 