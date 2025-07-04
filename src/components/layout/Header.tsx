"use client"
import { Search, Grid3x3, User as UserIcon, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import CustomDropdown from "@/components/ui/CustomDropdown"

export default function Header() {
  const { currentUser, users, switchUser } = useAuth();
  const dropdownItems = users.map(user => ({ id: user.id, label: user.name }));

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
            <CustomDropdown 
              items={dropdownItems}
              onSelect={switchUser}
              trigger={
                <Button variant="outline" className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{currentUser.name}</span>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
} 