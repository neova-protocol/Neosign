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
  PenSquare,
  LayoutGrid,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { NeovaLogo } from "@/components/NeovaLogo"
import { BackgroundPattern } from "@/components/BackgroundPattern"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const sidebarLinks = [
    { href: "/dashboard", icon: Grid3X3 },
    { href: "/dashboard/sign", icon: PenSquare },
    { href: "/dashboard/templates", icon: FileText },
    { href: "/dashboard/users", icon: LayoutGrid },
    { href: "/dashboard/calendar", icon: Calendar },
    { href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-20 bg-white flex flex-col items-center py-6 space-y-6">
        <Link href="/dashboard">
              <NeovaLogo className="w-8 h-8" />
            </Link>
        <nav className="flex flex-col items-center space-y-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link href={link.href} key={link.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-lg ${
                    isActive
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-500 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        </aside>

        {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/30 backdrop-blur-md border-b border-gray-200/80 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Type to search..."
                className="pl-12 pr-4 py-2 h-10 bg-white rounded-lg border-gray-200 shadow-sm"
              />
            </div>

            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-2">
                <a
                  href="#"
                  className="text-sm font-semibold text-blue-500 px-3 py-2"
                >
                  Neova Ecosystem
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  About
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:bg-gray-100 h-9 w-9"
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </nav>
              <div className="flex items-center space-x-4 pr-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg text-sm">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 relative">
          {/* Background Pattern around Neova Logo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 right-16">
              <BackgroundPattern />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
} 