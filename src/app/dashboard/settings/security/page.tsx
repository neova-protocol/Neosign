"use client"

import Link from "next/link"
import SecuritySettings from "@/components/settings/SecuritySettings"

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
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 p-6">
        <SecuritySettings />
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