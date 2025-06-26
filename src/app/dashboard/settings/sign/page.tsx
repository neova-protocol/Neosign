"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings, PenTool, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "/settings" },
  { name: "Security", active: false, href: "/settings/security" },
  { name: "Signatures", active: true, href: "/settings/signatures" },
  { name: "Notifications", active: false, href: "/settings/notifications" },
  { name: "Contact", active: false, href: "/settings/contact" },
  { name: "Advanced", active: false, href: "/settings/advanced" },
  { name: "Billing", active: false, href: "/settings/billing" },
]

export default function SignaturesPage() {
  const [defaultSender, setDefaultSender] = useState("neova")
  const [expiryNumber, setExpiryNumber] = useState("3")
  const [expiryUnit, setExpiryUnit] = useState("months")
  const [reminderFrequency, setReminderFrequency] = useState("1week")
  const [reminderMaximum, setReminderMaximum] = useState("3times")
  const [signatureStyle, setSignatureStyle] = useState("default")
  const [referenceType, setReferenceType] = useState("agreement")

  // Toggle states
  const [mustRegisterToSign, setMustRegisterToSign] = useState(true)
  const [allowRefuseToSign, setAllowRefuseToSign] = useState(false)
  const [allowAnnotateDocument, setAllowAnnotateDocument] = useState(true)

  const handleEditReference = () => {
    console.log("Editing reference settings")
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
            <Link href="/sign">
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
            <Button variant="ghost" size="icon">
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
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex bg-gray-50">
          {/* Signatures Content */}
          <div className="flex-1 p-6">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-2xl">S</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Slyrack</h1>
                    <p className="text-gray-300 text-sm">Member Since: 3 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-white font-medium">Basic Plan</span>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Signatures Settings */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Signatures settings</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure your invitation to sign</p>

                  <div className="space-y-6">
                    {/* Default Sender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Default sender</label>
                      <p className="text-xs text-gray-500 mb-3">Define the default sender for invitations to sign</p>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="defaultSender"
                            value="neova"
                            checked={defaultSender === "neova"}
                            onChange={(e) => setDefaultSender(e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">N</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">Neova</span>
                              <p className="text-xs text-gray-500">Organisation</p>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="defaultSender"
                            value="individual"
                            checked={defaultSender === "individual"}
                            onChange={(e) => setDefaultSender(e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900">Quentin Clement</span>
                        </label>
                      </div>
                    </div>

                    {/* Preferences for signature project expiry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferences for signature project expiry
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Define a default validity period during which your recipients can sign
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpiryNumber(String(Math.max(1, Number.parseInt(expiryNumber) - 1)))}
                          >
                            -
                          </Button>
                          <Input
                            value={expiryNumber}
                            onChange={(e) => setExpiryNumber(e.target.value)}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpiryNumber(String(Number.parseInt(expiryNumber) + 1))}
                          >
                            +
                          </Button>
                        </div>
                        <Select value={expiryUnit} onValueChange={setExpiryUnit}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Automatic reminders */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Automatic reminders</label>
                      <div className="flex items-center space-x-3">
                        <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">1 time a day</SelectItem>
                            <SelectItem value="1week">1 time a week</SelectItem>
                            <SelectItem value="2weeks">1 time every 2 weeks</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={reminderMaximum} onValueChange={setReminderMaximum}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1time">1 time maximum</SelectItem>
                            <SelectItem value="3times">3 times maximum</SelectItem>
                            <SelectItem value="5times">5 times maximum</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Signatures flows */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Signatures flows</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">The signer must register on NeoSign to sign</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              mustRegisterToSign ? "bg-blue-500" : "bg-gray-200"
                            }`}
                            onClick={() => setMustRegisterToSign(!mustRegisterToSign)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                mustRegisterToSign ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Allow signer to refuse to sign</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              allowRefuseToSign ? "bg-blue-500" : "bg-gray-200"
                            }`}
                            onClick={() => setAllowRefuseToSign(!allowRefuseToSign)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                allowRefuseToSign ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Allow signer to annotate document</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              allowAnnotateDocument ? "bg-blue-500" : "bg-gray-200"
                            }`}
                            onClick={() => setAllowAnnotateDocument(!allowAnnotateDocument)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                allowAnnotateDocument ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Signature Style */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Signature style</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Define the signature styles available for your signature invitations.
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Default signature */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="signatureStyle"
                        value="default"
                        checked={signatureStyle === "default"}
                        onChange={(e) => setSignatureStyle(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`border-2 rounded-lg p-4 text-center transition-colors ${
                          signatureStyle === "default" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="h-16 flex items-center justify-center mb-3">
                          <div className="text-2xl font-script text-gray-700" style={{ fontFamily: "cursive" }}>
                            Name
                          </div>
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              signatureStyle === "default" ? "bg-blue-500 border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {signatureStyle === "default" && (
                              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Default signature</span>
                      </div>
                    </label>

                    {/* Signature drawn */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="signatureStyle"
                        value="drawn"
                        checked={signatureStyle === "drawn"}
                        onChange={(e) => setSignatureStyle(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`border-2 rounded-lg p-4 text-center transition-colors ${
                          signatureStyle === "drawn" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="h-16 flex items-center justify-center mb-3">
                          <PenTool className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              signatureStyle === "drawn" ? "bg-blue-500 border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {signatureStyle === "drawn" && (
                              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Signature drawn</span>
                      </div>
                    </label>

                    {/* Import signature */}
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="signatureStyle"
                        value="import"
                        checked={signatureStyle === "import"}
                        onChange={(e) => setSignatureStyle(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`border-2 rounded-lg p-4 text-center transition-colors ${
                          signatureStyle === "import" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="h-16 flex items-center justify-center mb-3">
                          <Download className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              signatureStyle === "import" ? "bg-blue-500 border-blue-500" : "border-gray-300"
                            }`}
                          >
                            {signatureStyle === "import" && (
                              <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Import signature</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Reference settings */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Reference settings</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Define the reference to simplify the adding when editing the document
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="referenceType"
                        value="agreement"
                        checked={referenceType === "agreement"}
                        onChange={(e) => setReferenceType(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-sm text-gray-700">For agreement</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="referenceType"
                        value="approval"
                        checked={referenceType === "approval"}
                        onChange={(e) => setReferenceType(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-sm text-gray-700">For approval</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="referenceType"
                        value="auto-date"
                        checked={referenceType === "auto-date"}
                        onChange={(e) => setReferenceType(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-sm text-gray-700">Signed on (insert date automatically)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="referenceType"
                        value="terms"
                        checked={referenceType === "terms"}
                        onChange={(e) => setReferenceType(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        By signing below, I agree to the terms and conditions
                      </span>
                    </label>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={handleEditReference}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="space-y-2">
              {settingsMenuItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>

            {/* Decorative Element */}
            <div className="mt-12 relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                  </div>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                    Explore Neova Ecosystem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}