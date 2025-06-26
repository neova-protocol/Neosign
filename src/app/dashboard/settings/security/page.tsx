"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

// Update the settingsMenuItems array to replace "Data & Backups" with "Signatures"
const settingsMenuItems = [
  { name: "Profile", active: false, href: "/settings" },
  { name: "Security", active: true, href: "/settings/security" },
  { name: "Signatures", active: false, href: "/settings/signatures" },
  { name: "Notifications", active: false, href: "/settings/notifications" },
  { name: "Contact", active: false, href: "/settings/contact" },
  { name: "Advanced", active: false, href: "/settings/advanced" },
  { name: "Billing", active: false, href: "/settings/billing" },
]

export default function SecurityPage() {
  const [email, setEmail] = useState("quentin@neova.io")
  const [password, setPassword] = useState("NeOVa3y*2025")
  const [showPassword, setShowPassword] = useState(false)
  const [walletAddress, setWalletAddress] = useState("0x0234")
  const [phoneNumber, setPhoneNumber] = useState("+1 987 654 432")
  const [authApp, setAuthApp] = useState("••••••••••••••")

  // Toggle states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [phoneVerificationEnabled, setPhoneVerificationEnabled] = useState(true)
  const [authAppEnabled, setAuthAppEnabled] = useState(false)
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true)
  const [autoLogoutTime, setAutoLogoutTime] = useState("10min")

  const handleUpdateEmail = () => {
    console.log("Updating email:", email)
  }

  const handleVerifyEmail = () => {
    console.log("Verifying email:", email)
  }

  const handleChangePassword = () => {
    console.log("Changing password")
  }

  const handleConnectWallet = () => {
    console.log("Connecting wallet")
  }

  const handleSetProofOfIdentity = () => {
    console.log("Setting proof of identity")
  }

  const handleEditPhone = () => {
    console.log("Editing phone number")
  }

  const handleEditAuthApp = () => {
    console.log("Editing auth app")
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
          {/* Security Content */}
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
              {/* Connection Options */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection options</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure your email information</p>

                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="flex space-x-3">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
                        <Button variant="outline" onClick={handleUpdateEmail} className="px-4">
                          Update
                        </Button>
                        <Button variant="outline" onClick={handleVerifyEmail} className="px-4">
                          Verify
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="flex space-x-3">
                        <div className="relative flex-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword} className="px-4">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2-step verification */}
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">2-step verification</h2>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        twoFactorEnabled ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">An extra layer of protection to access</p>

                  <div className="space-y-6">
                    {/* Phone number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                      <div className="flex items-center space-x-3">
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" onClick={handleEditPhone} className="px-4">
                          Edit
                        </Button>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            phoneVerificationEnabled ? "bg-blue-500" : "bg-gray-200"
                          }`}
                          onClick={() => setPhoneVerificationEnabled(!phoneVerificationEnabled)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              phoneVerificationEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Auth Application */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auth Application</label>
                      <div className="flex items-center space-x-3">
                        <Input value={authApp} readOnly className="flex-1" />
                        <Button variant="outline" onClick={handleEditAuthApp} className="px-4">
                          Edit
                        </Button>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            authAppEnabled ? "bg-blue-500" : "bg-gray-200"
                          }`}
                          onClick={() => setAuthAppEnabled(!authAppEnabled)}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              authAppEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automatic unlogging */}
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">Automatic unlogging</h2>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoLogoutEnabled ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onClick={() => setAutoLogoutEnabled(!autoLogoutEnabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoLogoutEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">In case of inactivity, it's better to be safe.</p>
                  <p className="text-gray-600 text-sm mb-6">
                    Active automatic unlogging to lock your digital safe vault.
                  </p>

                  <div className="flex items-center space-x-3">
                    <Select value={autoLogoutTime} onValueChange={setAutoLogoutTime}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5min">After 5 min</SelectItem>
                        <SelectItem value="10min">After 10 min</SelectItem>
                        <SelectItem value="15min">After 15 min</SelectItem>
                        <SelectItem value="30min">After 30 min</SelectItem>
                        <SelectItem value="1hour">After 1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Wallet Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Configure your wallet information</h2>

                <div className="space-y-6">
                  {/* Wallet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet</label>
                    <div className="flex space-x-3">
                      <Input
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleConnectWallet} className="px-4">
                        Connect
                      </Button>
                    </div>
                  </div>

                  {/* Proof of Identity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Identity</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
                        <div className="flex space-x-3">
                          <div className="flex-1 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center">
                            <span className="text-red-600 font-medium">Not active</span>
                          </div>
                          <Button variant="outline" onClick={handleSetProofOfIdentity} className="px-6">
                            Set
                          </Button>
                        </div>
                      </div>
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