"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NeovaLogo } from "@/components/NeovaLogo"
import { signOut } from "next-auth/react"
import {
  DashboardIcon,
  SignIcon,
  TemplatesIcon,
  ContactsIcon,
  SettingsIcon,
} from "@/components/icons/CustomIcons"

export default function Sidebar() {
  const pathname = usePathname()

  const sidebarLinks = [
    { href: "/dashboard", icon: DashboardIcon },
    { href: "/dashboard/sign", icon: SignIcon },
    { href: "/dashboard/templates", icon: TemplatesIcon },
    { href: "/dashboard/contacts", icon: ContactsIcon },
    { href: "/dashboard/settings", icon: SettingsIcon },
  ]

  return (
    <aside className="w-20 bg-white flex flex-col items-center py-6 space-y-6">
      <Link href="/dashboard">
        <NeovaLogo className="w-8 h-8" />
      </Link>
      <nav className="flex flex-col items-center space-y-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard");
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
          onClick={() => signOut({ callbackUrl: '/' })}
          title="Se déconnecter"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  )
} 