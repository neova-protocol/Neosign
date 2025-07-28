"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SignatureProvider } from "@/contexts/SignatureContext";
import { BackgroundPattern } from "@/components/BackgroundPattern";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignatureProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8 relative">
            <BackgroundPattern />
            {children}
          </main>
        </div>
      </div>
    </SignatureProvider>
  );
}
