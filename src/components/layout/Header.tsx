"use client"
import { Search, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
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
              <Grid3x3 className="h-5 w-5" />
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
  )
} 