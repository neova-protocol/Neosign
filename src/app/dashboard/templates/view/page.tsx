"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TemplateViewPage() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("fileUrl");
  const docxUrl = searchParams.get("docxUrl");
  const name = searchParams.get("name") || "Template";

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">{name}</h1>
      <div className="flex flex-col items-center">
        {fileUrl ? (
          <iframe
            src={fileUrl}
            className="w-full h-[80vh] border rounded mb-6"
            title={name + " PDF"}
          />
        ) : (
          <div className="text-red-500">No PDF available for this template.</div>
        )}
        {docxUrl && (
          <a
            href={docxUrl}
            download
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Télécharger en .docx
          </a>
        )}
      </div>
    </div>
  );
} 