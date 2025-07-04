"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const templates = [
  {
    id: 1,
    name: "Employment contract - Template",
    category: "HR",
  },
  {
    id: 2,
    name: "NDA - Template",
    category: "Legal",
  },
  {
    id: 3,
    name: "SAFT contract - Template",
    category: "Finance",
  },
  {
    id: 4,
    name: "Service contract - Template",
    category: "Business",
  },
  {
    id: 5,
    name: "Buyer contract - Template",
    category: "Sales",
  },
  {
    id: 6,
    name: "Resignation letter - Template",
    category: "HR",
  },
  {
    id: 7,
    name: "LOI - Template",
    category: "Legal",
  },
  {
    id: 8,
    name: "Partnership contract - Template",
    category: "Business",
  },
]

export default function TemplatesPage() {
  const router = useRouter()

  const handleOpenTemplate = (templateId: number, templateName: string) => {
    // Redirect to edit page with template data
    router.push(`/dashboard/sign/edit?template=${templateId}&name=${encodeURIComponent(templateName)}`)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Import template</span>
        </Button>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Save time with recurring invitations!</h2>
        <div className="text-gray-600 space-y-2">
          <p>Use invitation templates to reuse them and save preparation time</p>
          <p>You can also create your own templates by importing them</p>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Templates by NeoSign</h3>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
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
                          onClick={() => handleOpenTemplate(template.id, template.name)}
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
                  <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}