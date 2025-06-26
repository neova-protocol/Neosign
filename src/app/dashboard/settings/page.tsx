"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState } from "react"

// Update the settingsMenuItems array to replace "Data & Backups" with "Signatures"
const settingsMenuItems = [
  { name: "Profile", active: true, href: "/dashboard/settings" },
  { name: "Security", active: false, href: "/dashboard/settings/security" },
  { name: "Signatures", active: false, href: "/dashboard/settings/sign" },
  { name: "Notifications", active: false, href: "/dashboard/settings/notifications" },
  { name: "Contact", active: false, href: "/dashboard/settings/contact" },
  { name: "Advanced", active: false, href: "/dashboard/settings/advanced" },
  { name: "Billing", active: false, href: "/dashboard/settings/billing" },
]

export default function SettingsPage() {
  const [username, setUsername] = useState("Slyrack")
  const [organizationName, setOrganizationName] = useState("Neova")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [selectedTheme, setSelectedTheme] = useState("light")

  const handleUpdateUsername = () => {
    // Handle username update
    console.log("Updating username:", username)
  }

  const handleUpdateOrganization = () => {
    // Handle organization update
    console.log("Updating organization:", organizationName)
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
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex bg-gray-50">
          {/* Settings Content */}
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
              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600 text-sm mb-6">Configure your personal information</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="flex space-x-3">
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1" />
                      <Button variant="outline" onClick={handleUpdateUsername} className="px-6">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organisation Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Organisation Information</h2>
                <p className="text-gray-600 text-sm mb-6">Configure your organisation information</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name of the organisation</label>
                    <div className="flex space-x-3">
                      <Input
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleUpdateOrganization} className="px-6">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Language</h2>
                <p className="text-gray-600 text-sm mb-6">Change your language parameters</p>

                <div className="space-y-4">
                  <div>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English - Selected</SelectItem>
                        <SelectItem value="french">Français</SelectItem>
                        <SelectItem value="spanish">Español</SelectItem>
                        <SelectItem value="german">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Theme</h2>
                <p className="text-gray-600 text-sm mb-6">Change your theme.</p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="light-theme"
                        checked={selectedTheme === "light"}
                        onCheckedChange={() => setSelectedTheme("light")}
                      />
                      <label htmlFor="light-theme" className="text-sm font-medium text-gray-700">
                        Light Theme
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dark-theme"
                        checked={selectedTheme === "dark"}
                        onCheckedChange={() => setSelectedTheme("dark")}
                      />
                      <label htmlFor="dark-theme" className="text-sm font-medium text-gray-700">
                        Dark Theme
                      </label>
                    </div>
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
