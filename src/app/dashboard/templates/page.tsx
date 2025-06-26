"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full" />
                  ))}
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-blue-500 font-medium">
                Neova Ecosystem
              </a>
              <a href="#" className="text-gray-600 font-medium">
                About
              </a>
              <Button variant="ghost" size="icon">
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </nav>
          </div>

          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">Connect Wallet</Button>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Type to search..." className="pl-10 bg-gray-50 border-gray-200" />
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard/sign">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
                New Signatures
              </Button>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Tuesday</span>
              <span className="text-gray-400">19 April 2024</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>GG</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Grid3X3 className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard/sign">
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Link href="/templates">
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
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
        </main>
      </div>
    </div>
  )
}