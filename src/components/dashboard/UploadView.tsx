"use client"
import { useState, useRef, DragEvent } from "react"
import { useRouter } from "next/navigation"
import { useSignature } from "@/contexts/SignatureContext"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UploadView() {
  const router = useRouter()
  const { createDocument } = useSignature()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile) {
      await createDocument(selectedFile)
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
        accept=".pdf"
      />
      <div className="flex flex-col items-center space-y-4">
        <Upload className="h-12 w-12 text-gray-400" />
        <p className="text-gray-500 text-lg">
          Drag and drop a PDF file here to start
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
          Browse Files
        </Button>
      </div>
    </div>
  )
} 