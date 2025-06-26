"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "/settings" },
  { name: "Security", active: false, href: "/settings/security" },
  { name: "Signatures", active: false, href: "/settings/signatures" },
  { name: "Notifications", active: false, href: "/settings/notifications" },
  { name: "Contact", active: true, href: "/settings/contact" },
  { name: "Advanced", active: false, href: "/settings/advanced" },
  { name: "Billing", active: false, href: "/settings/billing" },
]

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("learn-more")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    object: "",
    location: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log("Submitting contact form:", formData)
    // Handle form submission
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
          {/* Contact Content */}
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
              {/* Left Column - Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-500 mb-6">Provide you answers is our priority</h2>

                  <div className="space-y-4 text-gray-700 mb-8">
                    <p>Before contacting us, we encourage you to check :</p>
                    <ul className="space-y-2 ml-4">
                      <li>• Our docs: It contains details guides and technical information</li>
                      <li>• Our Q&A: It addresses the most common questions</li>
                    </ul>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex space-x-4 mb-6">
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "learn-more"
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("learn-more")}
                    >
                      Learn more
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "qa"
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab("qa")}
                    >
                      Q&A
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-4 text-gray-700">
                    {activeTab === "learn-more" ? (
                      <div>
                        <p>If you can't find the answer you're looking for, please fill out the form.</p>
                        <p>Our team will get back to you as soon as possible.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">How do I create a new signature?</h4>
                          <p className="text-sm text-gray-600">
                            Click on "New Signatures" in the header, then upload your document and add signatories.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Can I track signature progress?</h4>
                          <p className="text-sm text-gray-600">
                            Yes, you can see the status of all signatures on your dashboard with real-time updates.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Is my data secure?</h4>
                          <p className="text-sm text-gray-600">
                            We use blockchain technology and encryption to ensure your documents are secure and
                            tamper-proof.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                    <Input
                      placeholder="John..."
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                    <Input
                      placeholder="Doe..."
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="john.doe@neova.io"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                {/* Object and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Object</label>
                    <Select value={formData.object} onValueChange={(value) => handleInputChange("object", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an object" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical-support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feature-request">Feature Request</SelectItem>
                        <SelectItem value="bug-report">Bug Report</SelectItem>
                        <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="United States..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="How can we help ?"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                >
                  Submit my message
                </Button>
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