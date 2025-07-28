"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const templates = [
  {
    id: 1,
    name: "NDA - Template (FR)",
    category: "Legal",
    fileUrl: "/templates/nda-fr.pdf",
    docxUrl: "/templates/nda-fr.docx",
  },
  {
    id: 2,
    name: "Employment contract - Template",
    category: "HR",
    fileUrl: "/templates/employment_contract.pdf",
  },
  {
    id: 3,
    name: "SAFT contract - Template",
    category: "Finance",
    fileUrl: "/templates/saft_contract.pdf",
  },
  {
    id: 4,
    name: "Service contract - Template",
    category: "Business",
    fileUrl: "/templates/service_contract.pdf",
  },
  {
    id: 5,
    name: "Buyer contract - Template",
    category: "Sales",
    fileUrl: "/templates/buyer_contract.pdf",
  },
  {
    id: 6,
    name: "Resignation letter - Template",
    category: "HR",
    fileUrl: "/templates/resignation_letter.pdf",
  },
  {
    id: 7,
    name: "LOI - Template",
    category: "Legal",
    fileUrl: "/templates/loi.pdf",
  },
  {
    id: 8,
    name: "Partnership contract - Template",
    category: "Business",
    fileUrl: "/templates/partnership_contract.pdf",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [userTemplates, setUserTemplates] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");

  useEffect(() => {
    fetch("/api/user-templates")
      .then((res) => res.json())
      .then(setUserTemplates);
  }, []);

  const handleOpenTemplate = (
    templateId: number,
    templateName: string,
    fileUrl: string,
    docxUrl?: string,
  ) => {
    router.push(
      `/dashboard/templates/view?fileUrl=${encodeURIComponent(fileUrl)}${docxUrl ? `&docxUrl=${encodeURIComponent(docxUrl)}` : ""}&name=${encodeURIComponent(templateName)}`,
    );
  };

  const handleUserTemplateOpen = (template: any) => {
    router.push(
      `/dashboard/templates/view?id=${template.id}&fileUrl=${encodeURIComponent(template.fileUrl)}&name=${encodeURIComponent(template.name)}`,
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = prompt("Template name:", file.name.replace(/\.[^.]+$/, ""));
    if (!name) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    const res = await fetch("/api/user-templates", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const newTemplate = await res.json();
      setUserTemplates((prev) => [newTemplate, ...prev]);
    }
    setIsUploading(false);
    e.target.value = "";
  };

  const handleDeleteUserTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/user-templates?id=${id}`, { method: "DELETE" });
    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRenameUserTemplate = async (id: string, newName: string) => {
    const res = await fetch(`/api/user-templates?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      setUserTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name: newName } : t)),
      );
    }
    setRenamingId(null);
    setRenameValue("");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <Button
          onClick={handleUploadClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Uploading..." : "Import template"}</span>
        </Button>
        <input
          type="file"
          accept=".pdf,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Save time with recurring invitations!
        </h2>
        <div className="text-gray-600 space-y-2">
          <p>
            Use invitation templates to reuse them and save preparation time
          </p>
          <p>You can also create your own templates by importing them</p>
        </div>
      </div>

      {/* User Templates Section */}
      {userTemplates.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            My Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTemplates.map((template) => (
              <Card
                key={template.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px] flex flex-col justify-center">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/6"></div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="bg-blue-100 rounded px-3 py-2 text-center flex gap-2 justify-center">
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded text-sm"
                            onClick={() => handleUserTemplateOpen(template)}
                          >
                            Open
                          </Button>
                          <Button
                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm"
                            variant="ghost"
                            onClick={() =>
                              handleDeleteUserTemplate(template.id)
                            }
                          >
                            Delete
                          </Button>
                          <a
                            href={template.fileUrl}
                            download
                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm ml-2"
                          >
                            Download
                          </a>
                          {/* Preview remplacé par un lien download ou rien */}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/6"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    {renamingId === template.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRenameUserTemplate(template.id, renameValue);
                        }}
                        className="flex gap-2 justify-center items-center"
                      >
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="px-2 py-1 text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="px-2 py-1 text-xs"
                          variant="ghost"
                          onClick={() => setRenamingId(null)}
                        >
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <h4 className="font-medium text-gray-900 text-sm">
                        {template.name}
                      </h4>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Templates by NeoSign
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                {/* Document Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px] flex flex-col justify-center">
                  <div className="space-y-3">
                    {/* Document lines simulation */}
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/6"></div>
                    </div>
                    {/* Signature area simulation */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-blue-100 rounded px-3 py-2 text-center">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded text-sm"
                          onClick={() =>
                            handleOpenTemplate(
                              template.id,
                              template.name,
                              template.fileUrl,
                              template.docxUrl,
                            )
                          }
                        >
                          Open
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/6"></div>
                    </div>
                  </div>
                </div>
                {/* Template Info */}
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {template.name}
                  </h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
