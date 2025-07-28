import { NextRequest, NextResponse } from "next/server";
import convert from "libreoffice-convert";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const docxBuf = Buffer.from(arrayBuffer);
    const pdfBuf: Buffer = await new Promise((resolve, reject) => {
      convert.convert(docxBuf, ".pdf", undefined, (err, done) => {
        if (err) return reject(err);
        resolve(done);
      });
    });
    return new NextResponse(pdfBuf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error("Error converting DOCX to PDF:", error);
    return NextResponse.json({ message: "Conversion error" }, { status: 500 });
  }
}
