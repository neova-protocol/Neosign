"use client"

import {
  Search,
  Grid3X3,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  Type,
  PenTool,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

type FieldType = "signature" | "initials" | "date";

type Field = {
  id: number;
  type: FieldType;
  x?: number;
  y?: number;
  signatory: Signatory;
};

type Signatory = {
  id: number;
  name: string;
  email: string;
  role: string;
  color: string;
  fields: Field[];
};

export default function EditDocumentPage() {
  const router = useRouter()
  const [draggedField, setDraggedField] = useState<Field | null>(null)
  const [placedFields, setPlacedFields] = useState<Field[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [signatories, setSignatories] = useState<Signatory[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSignatory, setNewSignatory] = useState<Omit<Signatory, 'id' | 'fields'>>({
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
        sig.id === signatoryId ? { ...sig, fields: [...sig.fields, { type: fieldType, id: Date.now(), signatory: sig }] } : sig,
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
            <Link href="/new-signature">
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
          <Link href="/new-signature">
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <BarChart3 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex bg-gray-50">
          {/* Document Viewer */}
          <div className="flex-1 p-6">
            {/* Document Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-gray-900">Neova - Test Contract - 2025.docx</h1>
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
              <div
                className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm min-h-[800px] relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ cursor: isDragging ? "crosshair" : "default" }}
              >
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Test Contract</h2>

                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>

                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.
                    </p>

                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur.
                    </p>

                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                      est laborum.
                    </p>

                    <div className="mt-12 space-y-4">
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo.
                      </p>

                      <p>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                      </p>

                      <p>
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                        sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placed Fields */}
                {placedFields.map((field) => (
                  <div
                    key={field.id}
                    className="absolute border-2 border-dashed rounded px-3 py-2 text-sm font-medium cursor-move"
                    style={{
                      left: field.x,
                      top: field.y,
                      borderColor: field.signatory.color,
                      backgroundColor: `${field.signatory.color}20`,
                      color: field.signatory.color,
                    }}
                  >
                    {field.type === "signature" && `${field.signatory.name} - Signature`}
                    {field.type === "initials" && `${field.signatory.name} - Initials`}
                    {field.type === "date" && `${field.signatory.name} - Date`}
                  </div>
                ))}
              </div>

              {/* Page 2 */}
              <div
                className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm min-h-[800px] relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ cursor: isDragging ? "crosshair" : "default" }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>

                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.
                    </p>

                    <div className="mt-12 space-y-4">
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                      </p>

                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                      </p>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Signature:</p>
                          <div className="h-16 border-b border-gray-300"></div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Date:</p>
                          <div className="h-16 border-b border-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placed Fields on Page 2 */}
                {placedFields.map((field) => (
                  <div
                    key={`page2-${field.id}`}
                    className="absolute border-2 border-dashed rounded px-3 py-2 text-sm font-medium cursor-move"
                    style={{
                      left: field.x,
                      top: field.y,
                      borderColor: field.signatory.color,
                      backgroundColor: `${field.signatory.color}20`,
                      color: field.signatory.color,
                    }}
                  >
                    {field.type === "signature" && `${field.signatory.name} - Signature`}
                    {field.type === "initials" && `${field.signatory.name} - Initials`}
                    {field.type === "date" && `${field.signatory.name} - Date`}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fields Panel */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fields</h2>

            <div className="space-y-4">
              {/* Add Comment */}
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Add comment</span>
              </div>

              {/* Add Initials */}
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <Type className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Add initials</span>
              </div>

              {/* Add Signatory */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <div
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div className="flex items-center space-x-3">
                      <PenTool className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Add signatory</span>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Signatory</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newSignatory.name}
                        onChange={(e) => setNewSignatory({ ...newSignatory, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newSignatory.email}
                        onChange={(e) => setNewSignatory({ ...newSignatory, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role (Optional)</Label>
                      <Input
                        id="role"
                        placeholder="e.g., CEO, Manager, Client"
                        value={newSignatory.role}
                        onChange={(e) => setNewSignatory({ ...newSignatory, role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Signature Color</Label>
                      <Select
                        value={newSignatory.color}
                        onValueChange={(value) => setNewSignatory({ ...newSignatory, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="#3B82F6">Blue</SelectItem>
                          <SelectItem value="#EF4444">Red</SelectItem>
                          <SelectItem value="#10B981">Green</SelectItem>
                          <SelectItem value="#F59E0B">Orange</SelectItem>
                          <SelectItem value="#8B5CF6">Purple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addSignatory} className="bg-blue-500 hover:bg-blue-600">
                      Add Signatory
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Signatories List */}
            {signatories.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Signatories</h3>
                <div className="space-y-4">
                  {signatories.map((signatory) => (
                    <div key={signatory.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: signatory.color }}></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{signatory.name}</p>
                          <p className="text-xs text-gray-500">{signatory.email}</p>
                          {signatory.role && <p className="text-xs text-gray-400">{signatory.role}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => handleDragStart({ type: "signature", id: Date.now(), signatory }, signatory)}
                          onDragEnd={handleDragEnd}
                        >
                          <PenTool className="h-3 w-3 mr-2" />
                          Add Signature Field
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => handleDragStart({ type: "initials", id: Date.now(), signatory }, signatory)}
                          onDragEnd={handleDragEnd}
                        >
                          <Type className="h-3 w-3 mr-2" />
                          Add Initials Field
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs cursor-grab active:cursor-grabbing"
                          draggable
                          onDragStart={(e) => handleDragStart({ type: "date", id: Date.now(), signatory }, signatory)}
                          onDragEnd={handleDragEnd}
                        >
                          <Calendar className="h-3 w-3 mr-2" />
                          Add Date Field
                        </Button>
                      </div>

                      {signatory.fields.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Fields to place:</p>
                          <div className="space-y-1">
                            {signatory.fields.map((field) => (
                              <div key={field.id} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{field.type}</span>
                                <span className="text-gray-400">Click to place</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Tools */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Document Actions</h3>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Preview Document
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Recipients
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Document Settings
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}