import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// POST /api/user-templates/fill : génère un docx avec les valeurs fournies
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log('API DEBUG: Pas de session utilisateur');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, values } = await req.json();
    if (!id || !values) {
      console.log('API DEBUG: id ou values manquants', { id, values });
      return NextResponse.json({ message: 'Missing template id or values' }, { status: 400 });
    }
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
    doc.setData(values);
    try {
      doc.render();
    } catch (error) {
      console.error('Docxtemplater render error:', error);
      return NextResponse.json({ message: 'Template rendering error', details: error.message }, { status: 400 });
    }
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="filled_template.docx"`,
      },
    });
  } catch (error) {
    console.error('Error filling docx template:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 