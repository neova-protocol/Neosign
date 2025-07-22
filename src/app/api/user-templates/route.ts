import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/user-templates : liste des templates de l'utilisateur
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const templates = await prisma.userTemplate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching user templates:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/user-templates : upload d'un template
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    if (!file || !name) {
      return NextResponse.json({ message: 'Missing file or name' }, { status: 400 });
    }
    const ext = path.extname(file.name);
    const filename = `${session.user.id}_${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'user-templates');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));
    const fileUrl = `/user-templates/${filename}`;
    const template = await prisma.userTemplate.create({
      data: {
        userId: session.user.id,
        name,
        fileUrl,
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error uploading user template:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/user-templates?id=... : suppression d'un template
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'Missing template id' }, { status: 400 });
  }
  try {
    const template = await prisma.userTemplate.findUnique({ where: { id } });
    if (!template || template.userId !== session.user.id) {
      return NextResponse.json({ message: 'Not found or forbidden' }, { status: 404 });
    }
    // Supprime le fichier physique
    const filePath = path.join(process.cwd(), 'public', template.fileUrl);
    await fs.unlink(filePath).catch(() => {});
    await prisma.userTemplate.delete({ where: { id } });
    return NextResponse.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Error deleting user template:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 