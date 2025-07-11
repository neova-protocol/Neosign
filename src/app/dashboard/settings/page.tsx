"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useState, useTransition, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [isPending, startTransition] = useTransition()
  const [username, setUsername] = useState("")
  const [organizationName, setOrganizationName] = useState("Neova")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg?height=64&width=64")
  const [memberSince, setMemberSince] = useState<string>("")

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name ?? "")
      setAvatarPreview(session.user.image ?? "/placeholder.svg?height=64&width=64")
    }
    if (session?.user?.createdAt) {
      const creationDate = new Date(session.user.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - creationDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setMemberSince(`${diffDays} days`);
    }
  }, [session]);


  const handleUpdateUsername = async () => {
    if (!username) return;

    startTransition(async () => {
      try {
        const response = await fetch('/api/user/name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: username }),
        });

        if (response.ok) {
          // Update the session to reflect the new username
          await update({ name: username });
          console.log("Username updated successfully");
        } else {
          console.error("Username update failed");
        }
      } catch (error) {
        console.error("Error updating username:", error);
      }
    });
  }

  const handleUpdateOrganization = () => {
    console.log("Updating organization:", organizationName)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', avatarFile);

        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { imageUrl } = await response.json();
          // Now, update the session to reflect the new avatar globally.
          await update({ image: imageUrl });
          setAvatarPreview(imageUrl)
          console.log("Avatar updated with backend URL:", imageUrl);
        } else {
          console.error("Avatar upload failed. Status:", response.status, "Response:", await response.text());
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600 text-sm mb-6">Configure your personal information</p>

        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>{username?.charAt(0).toUpperCase() ?? 'S'}</AvatarFallback>
                </Avatar>
                <Input 
                type="file" 
                className="flex-1"
                onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null
                    setAvatarFile(file)
                    if (file) {
                    setAvatarPreview(URL.createObjectURL(file))
                    }
                }}
                accept="image/png, image/jpeg" 
                />
                <Button variant="outline" className="px-6" onClick={handleAvatarUpload} disabled={isPending || !avatarFile}>
                {isPending ? "Uploading..." : "Upload"}
                </Button>
            </div>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="flex space-x-3">
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={handleUpdateUsername} className="px-6" disabled={isPending || !username}>
                {isPending ? "Updating..." : "Update"}
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
        <p className="text-gray-600 text-sm mb-6">Configure your language preferences</p>

        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="german">German</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Theme</h2>
        <p className="text-gray-600 text-sm mb-6">Configure your theme preferences</p>

        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        </div>
    </div>
  )
}
