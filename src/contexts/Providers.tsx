"use client"

import { ReactNode } from "react"
import { FileProvider } from "./FileContext"

export function Providers({ children }: { children: ReactNode }) {
  return <FileProvider>{children}</FileProvider>
} 