"use client"

import { useState, useRef, DragEvent } from "react"
import { useRouter } from "next/navigation"
import { useFile } from "@/contexts/FileContext"
import {
  Search,
  MoreHorizontal,
  ExternalLink,
  Upload,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewSignaturePage() {
  const router = useRouter()
  const { setFile } = useFile()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile)
      router.push("/dashboard/sign/edit")
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Upload Section */}
      <div
        className={`bg-white rounded-lg border-2 border-dashed border-gray-300 p-16 text-center mb-8 ${
          isDragOver ? "border-blue-500 bg-blue-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          className="hidden"
          accept=".pdf,.doc,.docx" // Example file types
        />
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500 text-lg">
            Drag and drop your files here to start uploading
          </p>
          <div className="flex items-center space-x-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <Button
            variant="outline"
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={handleBrowseClick}
          >
            Browse
          </Button>
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
                <h3 className="font-medium text-gray-900 text-sm">
                  Neova - NDA Contract - 2025.pdf
                </h3>
                <p className="text-xs text-gray-500">
                  Created on 30/01/2025 | By Guillaume G. (me) | Neova
                </p>
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
                <span className="text-sm font-medium text-gray-900">
                  Completed
                </span>
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
                <h3 className="font-medium text-gray-900 text-sm">
                  Neova - Employment Contract - 2025.pdf
                </h3>
                <p className="text-xs text-gray-500">
                  Created on 30/01/2025 | By Quentin C. | Neova
                </p>
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
                <span className="text-sm font-medium text-gray-900">
                  You have to sign
                </span>
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
                <h3 className="font-medium text-gray-900 text-sm">
                  Neova - SAFT Contract - 2025.pdf
                </h3>
                <p className="text-xs text-gray-500">
                  Created on 30/01/2025 | By Guillaume G. (me) | Neova
                </p>
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
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-xs text-gray-600">Paul L.</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">
                  In Progress
                </span>
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
        </div>
      </div>
    </div>
  )
}