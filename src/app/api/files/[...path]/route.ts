import { NextRequest, NextResponse } from "next/server";
import { createReadStream, promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  // params.path is an array: ["signature", "filename.pdf"] or ["avatars", "avatar.png"]
  if (!params?.path || params.path.length < 2) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const [folder, ...fileParts] = params.path;
  if (!["signature", "avatars"].includes(folder)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Prevent directory traversal
  const filename = fileParts.join("");
  if (filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", folder, filename);

  try {
    await fs.access(filePath);
    // Guess content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".pdf") contentType = "application/pdf";
    // Stream file
    const stream = createReadStream(filePath);
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename=\"${filename}\"`,
      },
    });
  } catch (err) {
    return new NextResponse("File not found", { status: 404 });
  }
}
