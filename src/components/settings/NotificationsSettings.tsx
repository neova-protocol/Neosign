"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function NotificationsSettings() {
  // System notification states
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  // Specific notification states
  const [reminderToSign, setReminderToSign] = useState(true)
  const [signaturesUpdated, setSignaturesUpdated] = useState(false)
  const [messageReceived, setMessageReceived] = useState(false)
  const [signatureExpiring, setSignatureExpiring] = useState(true)

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Notifications Settings */}
        <Card>
          <CardContent className="p-8 space-y-8">
            {/* System Notification Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">System notification</h2>

              <div className="space-y-6">
                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="text-base font-medium cursor-pointer">
                    Push notifications
                  </Label>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
                    Email notifications
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Notifications</h2>

              <div className="space-y-6">
                {/* In case of reminder to sign */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminder-to-sign" className="text-base font-medium cursor-pointer">
                    In case of reminder to sign
                  </Label>
                  <Switch id="reminder-to-sign" checked={reminderToSign} onCheckedChange={setReminderToSign} />
                </div>

                {/* Process of signatures updated */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="signatures-updated" className="text-base font-medium cursor-pointer">
                    Process of signatures updated
                  </Label>
                  <Switch id="signatures-updated" checked={signaturesUpdated} onCheckedChange={setSignaturesUpdated} />
                </div>

                {/* Message received */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-received" className="text-base font-medium cursor-pointer">
                    Message received
                  </Label>
                  <Switch id="message-received" checked={messageReceived} onCheckedChange={setMessageReceived} />
                </div>

                {/* Project signature soon expiring */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="signature-expiring" className="text-base font-medium cursor-pointer">
                    Project signature soon expiring
                  </Label>
                  <Switch id="signature-expiring" checked={signatureExpiring} onCheckedChange={setSignatureExpiring} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 