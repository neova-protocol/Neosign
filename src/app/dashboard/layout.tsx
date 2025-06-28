"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  Search,
  Grid3X3,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { NeovaLogo } from "@/components/NeovaLogo"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const sidebarLinks = [
    { href: "/dashboard", icon: Grid3X3 },
    { href: "/dashboard/sign", icon: FileText },
    { href: "/dashboard/users", icon: Users },
    { href: "/dashboard/templates", icon: BarChart3 },
    { href: "/dashboard/calendar", icon: Calendar },
    { href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <NeovaLogo className="w-8 h-8" />
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

          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
            Connect Wallet
          </Button>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Type to search..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
              New Signatures
            </Button>
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
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link href={link.href} key={link.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    isActive ? "bg-gray-900 text-white hover:bg-gray-800" : ""
                  }
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </Link>
            )
          })}
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
} 