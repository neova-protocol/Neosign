import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  console.log("POST /api/upload called");
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), "public/uploads");

  // Sanitize the filename to prevent directory traversal attacks
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const path = join(uploadsDir, sanitizedFilename);

  try {
    // Ensure the upload directory exists
    await mkdir(uploadsDir, { recursive: true });

    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    const fileUrl = `/uploads/${sanitizedFilename}`;
    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Failed to save file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
