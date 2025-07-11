"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [phoneVerificationEnabled, setPhoneVerificationEnabled] = useState(true)
  const [authAppEnabled, setAuthAppEnabled] = useState(false)
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true)

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Profile Section */}
        <Card className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Slyrack" />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">S</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">Slyrack</h2>
                  <p className="text-gray-300 text-sm">Member Since: 3 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-gray-600 text-white">
                  Basic Plan
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700">Upgrade Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Connection options</CardTitle>
              <p className="text-gray-600 text-sm">Configure your email information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <div className="flex gap-2">
                  <Input type="email" defaultValue="quentin@neova.io" className="flex-1" readOnly />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input type={showPassword ? "text" : "password"} defaultValue="NeOvAqyiOkQ5" className="pr-10" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Configure your wallet information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Wallet</Label>
                <div className="flex gap-2">
                  <Input defaultValue="0x01234..." className="flex-1" readOnly />
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              {/* Proof of Identity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Proof of identity</Label>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium">
                      Not active
                    </div>
                    <Button variant="outline" size="sm">
                      Set
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2-step Verification */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">2-step verification</CardTitle>
                <p className="text-gray-600 text-sm">An extra layer of protection to access</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Number */}
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Phone number</Label>
                <div className="flex gap-2">
                  <Input defaultValue="+1 987 654 432" className="flex-1" disabled={!twoFactorEnabled} />
                  <Button variant="outline" size="sm" disabled={!twoFactorEnabled}>
                    Edit
                  </Button>
                </div>
              </div>
              <Switch
                checked={phoneVerificationEnabled && twoFactorEnabled}
                onCheckedChange={setPhoneVerificationEnabled}
                disabled={!twoFactorEnabled}
                className="ml-4"
              />
            </div>

            {/* Auth Application */}
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Auth Application</Label>
                <div className="flex gap-2">
                  <Input type="password" defaultValue="••••••••••••" className="flex-1" disabled={!twoFactorEnabled} />
                  <Button variant="outline" size="sm" disabled={!twoFactorEnabled}>
                    Edit
                  </Button>
                </div>
              </div>
              <Switch
                checked={authAppEnabled && twoFactorEnabled}
                onCheckedChange={setAuthAppEnabled}
                disabled={!twoFactorEnabled}
                className="ml-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Automatic Unlogging */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Automatic unlogging</CardTitle>
                <div className="space-y-1">
                  <p className="text-gray-600 text-sm">In case of inactivity, it is better to be safe</p>
                  <p className="text-gray-600 text-sm">Active automatic unlogging to lock your digital safe vault</p>
                </div>
              </div>
              <Switch checked={autoLogoutEnabled} onCheckedChange={setAutoLogoutEnabled} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select defaultValue="10min" disabled={!autoLogoutEnabled}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">After 5min</SelectItem>
                  <SelectItem value="10min">After 10min</SelectItem>
                  <SelectItem value="15min">After 15min</SelectItem>
                  <SelectItem value="30min">After 30min</SelectItem>
                  <SelectItem value="1hour">After 1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 