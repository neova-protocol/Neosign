"use client"

import {
  MessageSquare,
  Type,
  PenTool,
  Plus,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useFile } from "@/contexts/FileContext"

type FieldType = "signature" | "initials" | "date"

type Field = {
  id: number
  type: FieldType
  x?: number
  y?: number
  signatory: Signatory
}

type Signatory = {
  id: number
  name: string
  email: string
  role: string
  color: string
  fields: Field[]
}

export default function EditDocumentPage() {
  const router = useRouter()
  const { file } = useFile()

  useEffect(() => {
    if (!file) {
      router.push("/dashboard/sign")
    }
  }, [file, router])

  const [draggedField, setDraggedField] = useState<Field | null>(null)
  const [placedFields, setPlacedFields] = useState<Field[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [signatories, setSignatories] = useState<Signatory[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSignatory, setNewSignatory] = useState<Omit<Signatory, "id" | "fields">>({
    name: "",
    email: "",
    role: "",
    color: "#3B82F6",
  })

  const addSignatory = () => {
    if (newSignatory.name && newSignatory.email) {
      setSignatories([
        ...signatories,
        {
          ...newSignatory,
          id: Date.now(),
          fields: [],
        },
      ])
      setNewSignatory({ name: "", email: "", role: "", color: "#3B82F6" })
      setIsModalOpen(false)
    }
  }

  const addFieldToSignatory = (signatoryId: number, fieldType: FieldType) => {
    setSignatories(
      signatories.map((sig) =>
        sig.id === signatoryId
          ? { ...sig, fields: [...sig.fields, { type: fieldType, id: Date.now(), signatory: sig }] }
          : sig,
      ),
    )
  }

  const handleDragStart = (field: Field, signatory: Signatory) => {
    setDraggedField({ ...field, signatory })
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setDraggedField(null)
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (draggedField) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newField: Field = {
        ...draggedField,
        id: Date.now(),
        x: x - 50, // Center the field
        y: y - 15,
      }

      setPlacedFields([...placedFields, newField])

      // Remove field from signatory's pending fields
      setSignatories(
        signatories.map((sig) =>
          sig.id === draggedField.signatory.id
            ? { ...sig, fields: sig.fields.filter((f) => f.id !== draggedField.id) }
            : sig,
        ),
      )
    }
    setDraggedField(null)
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSendDocument = () => {
    // Simulate sending document
    alert("Document sent successfully!")
    router.push("/")
  }

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Document Viewer */}
      <div className="flex-1 p-6">
        {/* Document Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            {file ? file.name : "Loading document..."}
          </h1>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={handleSendDocument}
          >
            Send
          </Button>
        </div>

        {/* Document Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          {/* Page 1 */}
          {file && (
            <div
              className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm min-h-[800px] relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{ cursor: isDragging ? "crosshair" : "default" }}
            >
              {file.type === "application/pdf" ? (
                <iframe
                  src={URL.createObjectURL(file)}
                  className="w-full h-full min-h-[800px]"
                />
              ) : (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                    Preview not available for this file type.
                  </h2>
                  <p>
                    Cannot preview files of type {file.type}. Please use a PDF file to see the
                    preview.
                  </p>
                </div>
              )}

              {placedFields.map((field) => (
                <div
                  key={field.id}
                  className="absolute px-4 py-2 rounded-lg text-white text-sm"
                  style={{
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    backgroundColor: field.signatory.color,
                  }}
                >
                  {field.type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for actions */}
      <aside className="w-80 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Signatories</h2>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">Add Signatory</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Signatory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSignatory.name}
                  onChange={(e) =>
                    setNewSignatory({ ...newSignatory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSignatory.email}
                  onChange={(e) =>
                    setNewSignatory({ ...newSignatory, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newSignatory.role}
                  onChange={(e) =>
                    setNewSignatory({ ...newSignatory, role: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={newSignatory.color}
                  onChange={(e) =>
                    setNewSignatory({ ...newSignatory, color: e.target.value })
                  }
                />
              </div>
              <Button onClick={addSignatory}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {signatories.map((signatory) => (
            <div key={signatory.id} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: signatory.color }}
                  />
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">{signatory.name}</h3>
                    <p className="text-xs text-gray-500">{signatory.email}</p>
                  </div>
                </div>
                <Select
                  onValueChange={(value: FieldType) => addFieldToSignatory(signatory.id, value)}
                >
                  <SelectTrigger className="w-10 h-10 p-2">
                    <Plus className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signature">Signature</SelectItem>
                    <SelectItem value="initials">Initials</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {signatory.fields.map((field, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(field, signatory)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm cursor-move"
                    style={{
                      backgroundColor: `${signatory.color}20`,
                      color: signatory.color,
                      border: `1px solid ${signatory.color}`,
                    }}
                  >
                    {field.type === "signature" && <PenTool className="h-4 w-4" />}
                    {field.type === "initials" && <Type className="h-4 w-4" />}
                    {field.type === "date" && <Calendar className="h-4 w-4" />}
                    <span>{field.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">Comments</h3>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                Q
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-900">Quentin</h4>
                  <p className="text-xs text-gray-500">10:32 AM</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Hi, could you please review and sign this contract at your earliest convenience?
                  Thanks!
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-900">Guillaume</h4>
                  <p className="text-xs text-gray-500">10:35 AM</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">Sure, I'll take a look now.</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Add a comment"
                  className="flex-1 bg-white border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}