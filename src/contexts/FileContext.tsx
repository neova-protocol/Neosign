"use client"

import { createContext, useState, ReactNode, useContext } from "react"

interface FileContextType {
  file: File | null
  setFile: (file: File | null) => void
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null)

  return <FileContext.Provider value={{ file, setFile }}>{children}</FileContext.Provider>
}

export const useFile = () => {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider")
  }
  return context
} 