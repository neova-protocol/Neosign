import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  console.log("POST /api/user/avatar called");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return new NextResponse("No file found", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${session.user.id}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), "public/avatars");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const avatarUrl = `/avatars/${filename}`;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: avatarUrl },
    });

    return NextResponse.json({ imageUrl: avatarUrl });
  } catch (error) {
    console.error("[AVATAR_UPLOAD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Récupérer l'utilisateur pour obtenir le chemin de l'avatar actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    if (user?.image) {
      // Supprimer le fichier physique
      const avatarPath = path.join(process.cwd(), "public", user.image);
      try {
        await fs.unlink(avatarPath);
      } catch {
        console.warn("Fichier avatar non trouvé:", avatarPath);
      }
    }

    // Mettre à jour la base de données
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AVATAR_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 