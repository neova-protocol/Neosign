"use client"

import {
  Search,
  Grid3X3,
  Calendar,
  MoreHorizontal,
  ExternalLink,
  Edit,
  FileText,
  Users,
  BarChart3,
  Settings,
  Upload,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function NewSignaturePage() {
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
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">New Signatures</Button>
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
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Link href="/templates">
            <Button variant="ghost" size="icon">
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
            {/* Upload Section */}
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center mb-8">
              <div className="flex flex-col items-center space-y-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-gray-500 text-lg">Drag and drop your files here to start uploading</p>
                <div className="flex items-center space-x-4">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <Link href="/dashboard/sign/edit">
                  <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50">
                    Browse
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search file..." className="pl-10" />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-medium text-sm text-gray-700">
                <div className="col-span-6 flex items-center space-x-3">
                  <Checkbox />
                  <span>Name</span>
                </div>
                <div className="col-span-3">Owner</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {/* Document 1 - Completed */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - NDA Contract - 2025.pdf</h3>
                      <p className="text-xs text-gray-500">Created on 30/01/2025 | By Guillaume G. (me) | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Quentin C.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Completed</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Document 2 - You have to sign */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - Employment Contract - 2025.pdf</h3>
                      <p className="text-xs text-gray-500">Created on 30/01/2025 | By Quentin C. | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Quentin C.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">You have to sign</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Document 3 - In Progress */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - SAFT Contract - 2025.pdf</h3>
                      <p className="text-xs text-gray-500">Created on 30/01/2025 | By Guillaume G. (me) | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Quentin C.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Jean D.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-600">Alice B.</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <span className="text-xs text-gray-600">Bob E.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">In Progress</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Document 4 - Draft */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - Test Contract - 2025.docx</h3>
                      <p className="text-xs text-gray-500">Created on 12/01/2025 | By Guillaume G. (me) | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Draft</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Document 5 - Draft */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - Test Contract - 2025.docx</h3>
                      <p className="text-xs text-gray-500">Created on 12/01/2025 | By Guillaume G. (me) | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Draft</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Document 6 - Draft */}
                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-6 flex items-center space-x-3">
                    <Checkbox />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Neova - Test Contract - 2025.docx</h3>
                      <p className="text-xs text-gray-500">Created on 12/01/2025 | By Guillaume G. (me) | Neova</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs text-gray-600">Guillaume G.</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Draft</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}