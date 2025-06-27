"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "dashboard/settings" },
  { name: "Security", active: false, href: "dashboard/settings/security" },
  { name: "Signatures", active: false, href: "dashboard/settings/sign" },
  { name: "Notifications", active: true, href: "dashboard/settings/notifications" },
  { name: "Contact", active: false, href: "dashboard/settings/contact" },
  { name: "Advanced", active: false, href: "dashboard/settings/advanced" },
  { name: "Billing", active: false, href: "dashboard/settings/billing" },
]

export default function NotificationsPage() {
  // System notification states
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  // Notification states
  const [reminderToSign, setReminderToSign] = useState(true)
  const [processUpdated, setProcessUpdated] = useState(false)
  const [messageReceived, setMessageReceived] = useState(false)
  const [soonExpiring, setSoonExpiring] = useState(true)

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
          {/* Notifications Content */}
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

            <div className="max-w-2xl">
              {/* System notification */}
              <div className="bg-white rounded-lg p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">System notification</h2>

                <div className="space-y-8">
                  {/* Push notifications */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">Push notifications</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        pushNotifications ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setPushNotifications(!pushNotifications)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          pushNotifications ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email notifications */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">Email notifications</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        emailNotifications ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setEmailNotifications(!emailNotifications)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Notifications</h2>

                <div className="space-y-8">
                  {/* In case of reminder to sign */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">In case of reminder to sign</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        reminderToSign ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setReminderToSign(!reminderToSign)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          reminderToSign ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Process of signatures updated */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">Process of signatures updated</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        processUpdated ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setProcessUpdated(!processUpdated)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          processUpdated ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Message received */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">Message received</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        messageReceived ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setMessageReceived(!messageReceived)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          messageReceived ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Project signature soon expiring */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">Project signature soon expiring</span>
                    <button
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        soonExpiring ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setSoonExpiring(!soonExpiring)}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          soonExpiring ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
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