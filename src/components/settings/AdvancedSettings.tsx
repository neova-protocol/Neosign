"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Unlink, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for the chart
const usageData = [
  { month: "Feb 2024", value: 0 },
  { month: "Mar 2024", value: 0 },
  { month: "Apr 2024", value: 0 },
  { month: "May 2024", value: 7 },
  { month: "Jun 2024", value: 0 },
  { month: "Jul 2024", value: 4 },
  { month: "Aug 2024", value: 2 },
  { month: "Sep 2024", value: 8 },
  { month: "Oct 2024", value: 3 },
  { month: "Nov 2024", value: 2 },
  { month: "Dec 2024", value: 6 },
  { month: "Jan 2025", value: 0 },
  { month: "Feb 2025", value: 0 },
]

function UsageChart() {
  const maxValue = Math.max(...usageData.map((d) => d.value))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 px-4">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full text-xs text-gray-500 pr-2">
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Chart bars */}
        <div className="flex items-end justify-between flex-1 h-full gap-1">
          {usageData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-sm min-h-[2px]"
                style={{
                  height: `${(data.value / maxValue) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 px-4">
        {usageData.map((data, index) => (
          <span key={index} className="transform -rotate-45 origin-left whitespace-nowrap">
            {data.month}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AdvancedSettings() {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDisconnectWallet = () => {
    if (showDisconnectConfirm) {
      // Perform disconnect action
      console.log("Wallet disconnected")
      setShowDisconnectConfirm(false)
    } else {
      setShowDisconnectConfirm(true)
    }
  }

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Perform delete action
      console.log("Account deleted")
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

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

        {/* Advanced Settings */}
        <div className="space-y-6">
          {/* Disconnect Wallet */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Disconnect your wallet</h3>
                  <p className="text-gray-600 text-sm">Sometimes you can desire to change your wallet...</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDisconnectWallet}
                  className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                >
                  <Unlink className="w-4 h-4" />
                  {showDisconnectConfirm ? "Confirm" : "Disconnect"}
                </Button>
              </div>
              {showDisconnectConfirm && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">
                    Are you sure you want to disconnect your wallet? This action cannot be undone.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setShowDisconnectConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delete my account</h3>
                  <p className="text-gray-600 text-sm">
                    We regret seeing you leave NeoSign!
                    <br />
                    Make sure to export your keys before deleting it.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {showDeleteConfirm ? "Confirm" : "Delete"}
                </Button>
              </div>
              {showDeleteConfirm && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">
                    <strong>Warning:</strong> This will permanently delete your account and all associated data. This
                    action cannot be undone.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Overview of electronic signature usage</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">Track your usage over time</p>
                </div>
                <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0">
                  Upgrade Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <span className="transform -rotate-90 inline-block origin-center text-xs">
                    Number of documents signed
                  </span>
                </div>
                <UsageChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 