"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/api";
import { renderAsync } from "docx-preview";

function DocxPreviewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let revokedUrl: string | null = null;
    async function fetchAndRender() {
      if (!fileUrl || !containerRef.current) return;
      // Nettoie le container
      containerRef.current.innerHTML = "";
      try {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        revokedUrl = URL.createObjectURL(blob);
        await renderAsync(blob, containerRef.current!);
      } catch (e) {
        containerRef.current.innerHTML =
          '<div style="color:gray;text-align:center">Impossible d\'afficher le document DOCX</div>';
      }
    }
    fetchAndRender();
    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [fileUrl]);
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        minHeight: 400,
        background: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        overflow: "auto",
      }}
    />
  );
}

function TemplateViewContent() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("fileUrl");
  const docxUrl = searchParams.get("docxUrl");
  const name = searchParams.get("name") || "Template";
  const templateId = searchParams.get("id");

  const [fields, setFields] = useState<string[]>([]);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [loadingFields, setLoadingFields] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [previewGenerating, setPreviewGenerating] = useState(false);

  // Ouvre la modale au lieu du formulaire inline
  useEffect(() => {
    if (fileUrl && fileUrl.endsWith(".docx") && templateId) {
      setLoadingFields(true);
      fetch(`/api/user-templates/fields?id=${templateId}`)
        .then((res) => res.json())
        .then((data) => {
          let detectedFields = data.fields || [];
          const requiredFields = [
            "company_details",
            "company_name",
            "date",
            "place",
            "customer_name",
          ];
          for (const field of requiredFields.reverse()) {
            if (!detectedFields.includes(field)) {
              detectedFields = [field, ...detectedFields];
            }
          }
          setFields(detectedFields);
          setLoadingFields(false);
        });
    }
  }, [fileUrl, templateId]);

  const handleChange = (field: string, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  // Nouveau flux : génération, conversion, upload, création, redirection
  const handleFullGenerate = async () => {
    setGenerating(true);
    // 1. Générer le DOCX rempli
    const docxRes = await fetch("/api/user-templates/fill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: templateId, values }),
    });
    if (!docxRes.ok) {
      setGenerating(false);
      return;
    }
    const docxBlob = await docxRes.blob();
    // 2. Convertir en PDF
    const pdfRes = await fetch("/api/convert-to-pdf", {
      method: "POST",
      body: docxBlob,
    });
    if (!pdfRes.ok) {
      setGenerating(false);
      return;
    }
    const pdfBlob = await pdfRes.blob();
    // 3. Upload PDF (simulate upload to /public/uploads/)
    const pdfFile = new File(
      [pdfBlob],
      `generated_${name.replace(/\s+/g, "_")}.pdf`,
      { type: "application/pdf" },
    );
    const uploadForm = new FormData();
    uploadForm.append("file", pdfFile);
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm,
    });
    if (!uploadRes.ok) {
      setGenerating(false);
      return;
    }
    const { fileUrl: uploadedPdfUrl } = await uploadRes.json();
    // 4. Créer le document
    const newDoc = await createDocument(name, uploadedPdfUrl);
    setGenerating(false);
    if (newDoc && newDoc.id) {
      router.push(`/dashboard/sign/edit/${newDoc.id}`);
    }
  };

  // Génère la prévisualisation PDF à partir du DOCX (vierge ou rempli)
  const generatePdfPreview = async (customValues?: {
    [key: string]: string;
  }) => {
    if (!fileUrl || !fileUrl.endsWith(".docx") || !templateId) return;
    setPreviewGenerating(true);
    // 1. Générer le DOCX rempli (ou vierge)
    const docxRes = await fetch("/api/user-templates/fill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: templateId, values: customValues || values }),
    });
    if (!docxRes.ok) {
      setPreviewGenerating(false);
      return;
    }
    const docxBlob = await docxRes.blob();
    // 2. Convertir en PDF
    const pdfRes = await fetch("/api/convert-to-pdf", {
      method: "POST",
      body: docxBlob,
    });
    if (!pdfRes.ok) {
      setPreviewGenerating(false);
      return;
    }
    const pdfBlob = await pdfRes.blob();
    const url = window.URL.createObjectURL(pdfBlob);
    setPdfPreviewUrl(url);
    setPreviewGenerating(false);
  };

  // Génère la preview PDF au chargement
  useEffect(() => {
    if (fileUrl && fileUrl.endsWith(".docx") && templateId) {
      generatePdfPreview();
    }
    // eslint-disable-next-line
  }, [fileUrl, templateId]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">{name}</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Preview DOCX à gauche si PDF indisponible */}
        <div className="flex-1 w-full md:w-1/2">
          {fileUrl && fileUrl.endsWith(".docx") ? (
            pdfPreviewUrl ? (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-[80vh] border rounded mb-6"
                title={name + " PDF Preview"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <DocxPreviewer fileUrl={fileUrl} />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Télécharger et ouvrir le DOCX
                </a>
                <div className="text-gray-500 text-center mt-2">
                  La prévisualisation PDF n'est pas disponible.
                  <br />
                  Aperçu Word affiché ci-dessus.
                </div>
              </div>
            )
          ) : pdfPreviewUrl ? (
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-[80vh] border rounded mb-6"
              title={name + " PDF Preview"}
            />
          ) : (
            <div className="text-gray-500 text-center">
              Aucune prévisualisation disponible.
            </div>
          )}
        </div>
        {/* Formulaire à droite */}
        <div className="flex-1 w-full md:w-1/2">
          {fileUrl && fileUrl.endsWith(".docx") ? (
            <div className="w-full max-w-lg mx-auto mb-6">
              {loadingFields ? (
                <div className="text-center text-gray-500">
                  Loading fields...
                </div>
              ) : fields.length > 0 ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFullGenerate();
                  }}
                  className="space-y-4"
                  autoComplete="off"
                >
                  {fields.map((field) => (
                    <div key={field} className="flex flex-col gap-1">
                      <label className="font-medium text-sm capitalize">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        className="border rounded px-3 py-2"
                        value={values[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generatePdfPreview()}
                      disabled={previewGenerating}
                    >
                      {previewGenerating
                        ? "Mise à jour..."
                        : "Mettre à jour la prévisualisation"}
                    </Button>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={generating}
                    >
                      {generating
                        ? "Génération en cours..."
                        : "Générer et envoyer pour signature"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center text-gray-500">
                  No dynamic fields detected in this template.
                </div>
              )}
            </div>
          ) : null}
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
    </div>
  );
}

export default function TemplateViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateViewContent />
    </Suspense>
  );
}
