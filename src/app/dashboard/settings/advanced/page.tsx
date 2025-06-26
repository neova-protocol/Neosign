"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "/settings" },
  { name: "Security", active: false, href: "/settings/security" },
  { name: "Signatures", active: false, href: "/settings/signatures" },
  { name: "Notifications", active: false, href: "/settings/notifications" },
  { name: "Contact", active: false, href: "/settings/contact" },
  { name: "Advanced", active: true, href: "/settings/advanced" },
  { name: "Billing", active: false, href: "/settings/billing" },
]

// Sample data for the chart
const chartData = [
  { month: "Feb 2024", value: 0 },
  { month: "Mar 2024", value: 0 },
  { month: "Apr 2024", value: 7 },
  { month: "May 2024", value: 0 },
  { month: "Jun 2024", value: 4 },
  { month: "Jul 2024", value: 0 },
  { month: "Aug 2024", value: 2 },
  { month: "Sep 2024", value: 8 },
  { month: "Oct 2024", value: 3 },
  { month: "Nov 2024", value: 2 },
  { month: "Dec 2024", value: 6 },
  { month: "Jan 2025", value: 0 },
  { month: "Feb 2025", value: 0 },
]

export default function AdvancedPage() {
  const handleDisconnectWallet = () => {
    if (confirm("Are you sure you want to disconnect your wallet?")) {
      console.log("Disconnecting wallet...")
      // Handle wallet disconnection
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account...")
      // Handle account deletion
    }
  }

  const maxValue = Math.max(...chartData.map((d) => d.value))

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
          {/* Advanced Content */}
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

            <div className="max-w-4xl space-y-8">
              {/* Disconnect Wallet */}
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Disconnect your wallet</h2>
                    <p className="text-gray-600">Sometimes you can desire to change your wallet...</p>
                  </div>
                  <Button
                    onClick={handleDisconnectWallet}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete my account</h2>
                    <div className="space-y-1">
                      <p className="text-gray-600">We regret seeing you leave NeoSign!</p>
                      <p className="text-gray-600">Make sure to export your keys before deleting it</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Usage Chart */}
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview of electronic signature usage</h2>
                    <p className="text-gray-600">Track your usage over time</p>
                  </div>
                  <Button className="text-blue-500 hover:text-blue-600 font-medium">Upgrade Plan</Button>
                </div>

                {/* Chart */}
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-sm text-gray-500">
                    <span>8</span>
                    <span>6</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>

                  {/* Chart area */}
                  <div className="ml-8 pl-4">
                    <div className="flex items-end justify-between h-64 border-l border-b border-gray-200">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="w-full flex justify-center mb-2">
                            <div
                              className="bg-blue-500 rounded-t w-8"
                              style={{
                                height: `${(data.value / (maxValue || 1)) * 200}px`,
                                minHeight: data.value > 0 ? "4px" : "0px",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      {chartData.map((data, index) => (
                        <span key={index} className="flex-1 text-center">
                          {data.month.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      {chartData.map((data, index) => (
                        <span key={index} className="flex-1 text-center">
                          {data.month.split(" ")[1]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Y-axis label */}
                  <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 -translate-x-6 text-sm text-gray-500 whitespace-nowrap">
                    Number of documents signed
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