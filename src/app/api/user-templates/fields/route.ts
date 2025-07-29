import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth-options";
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// GET /api/user-templates/fields?id=... : retourne la liste des balises dynamiques d'un docx
export async function GET(req: NextRequest) {
  console.log("GET /api/user-templates/fields called");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log('API DEBUG: Pas de session utilisateur');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    console.log('API DEBUG: id manquant');
    return NextResponse.json({ message: 'Missing template id' }, { status: 400 });
  }
  try {
    const template = await prisma.userTemplate.findUnique({ where: { id } });
    console.log('API DEBUG', { id, sessionUserId: session.user.id, template });
    if (!template || template.userId !== session.user.id) {
      console.log('API DEBUG: template introuvable ou non autorisé', { id, sessionUserId: session.user.id, template });
      return NextResponse.json({ message: 'Not found or forbidden' }, { status: 404 });
    }
    if (!template.fileUrl.endsWith('.docx')) {
      console.log('API DEBUG: mauvais type de fichier', { fileUrl: template.fileUrl });
      return NextResponse.json({ message: 'Not a DOCX file' }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'public', template.fileUrl);
    console.log('API DEBUG filePath', filePath);
    const content = await fs.readFile(filePath);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    const tags = doc.getFullText().match(/{{\s*([a-zA-Z0-9_]+)\s*}}/g) || [];
    // Extraire les noms de balises uniques
    const fields = Array.from(new Set(tags.map(tag => tag.replace(/{{|}}|\s/g, ''))));
    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error reading docx fields:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 