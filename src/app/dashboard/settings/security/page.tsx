"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "/dashboard/settings" },
  { name: "Security", active: true, href: "/dashboard/settings/security" },
  { name: "Signatures", active: false, href: "/dashboard/settings/sign" },
  { name: "Notifications", active: false, href: "/dashboard/settings/notifications" },
  { name: "Contact", active: false, href: "/dashboard/settings/contact" },
  { name: "Advanced", active: false, href: "/dashboard/settings/advanced" },
  { name: "Billing", active: false, href: "/dashboard/settings/billing" },
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
    <div className="flex bg-gray-50 min-h-screen">
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button variant="outline" onClick={handleChangePassword} className="px-4">
                      Change
                    </Button>
                  </div>
                </div>

                {/* Wallet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet</label>
                  <div className="flex space-x-3">
                    <Input value={walletAddress} readOnly className="flex-1 bg-gray-50" />
                    <Button variant="outline" onClick={handleConnectWallet} className="px-4">
                      Connect
                    </Button>
                    <Button variant="outline" onClick={handleSetProofOfIdentity} className="px-4">
                      Set Proof of Identity
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Two-factor Authentication</h2>
              <p className="text-gray-600 text-sm mb-6">Configure your two-factor authentication</p>

              <div className="space-y-6">
                {/* Phone */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${phoneVerificationEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {phoneVerificationEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => setPhoneVerificationEnabled(!phoneVerificationEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors ${phoneVerificationEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${phoneVerificationEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex-1" />
                    <Button variant="outline" onClick={handleEditPhone} className="px-4">
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Authenticator App */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Authenticator App</label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${authAppEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {authAppEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => setAuthAppEnabled(!authAppEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors ${authAppEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${authAppEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Input value={authApp} readOnly className="flex-1 bg-gray-50" />
                    <Button variant="outline" onClick={handleEditAuthApp} className="px-4">
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Auto Logout */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Auto logout</label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${autoLogoutEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {autoLogoutEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => setAutoLogoutEnabled(!autoLogoutEnabled)}
                        className={`w-8 h-4 rounded-full transition-colors ${autoLogoutEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoLogoutEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <Select value={autoLogoutTime} onValueChange={setAutoLogoutTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">5 minutes</SelectItem>
                      <SelectItem value="10min">10 minutes</SelectItem>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="w-64 bg-white border-l border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
        <nav className="space-y-2">
          {settingsMenuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}