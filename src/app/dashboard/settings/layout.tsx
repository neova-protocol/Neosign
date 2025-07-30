"use client";

import React from "react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsMenuItems = [
  { name: "General", href: "/dashboard/settings/general" },
  { name: "Profile", href: "/dashboard/settings/profile" },
  { name: "Signatures", href: "/dashboard/settings/sign" },
  { name: "Notifications", href: "/dashboard/settings/notifications" },
  { name: "Security", href: "/dashboard/settings/security" },
  { name: "Billing", href: "/dashboard/settings/billing" },
  { name: "Contact", href: "/dashboard/settings/contact" },
  { name: "Advanced", href: "/dashboard/settings/advanced" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 px-6">
        <SettingsHeader />
        {children}
      </div>
      <div className="w-64 bg-white border-l border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
        <nav className="space-y-2">
          {settingsMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
