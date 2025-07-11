import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  const today = new Date();
  const day = today.toLocaleDateString('en-US', { weekday: 'long' });
  const date = `${today.getDate()} ${today.toLocaleDateString('en-US', { month: 'long' })} ${today.getFullYear()}`;

  return (
    <header className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-50 w-full p-4">
      <div className="flex items-center justify-between">
        <div /> {/* Empty div for spacing */}
        <nav className="flex items-center justify-end space-x-6 text-sm font-medium">
            <Link href="#" className="text-gray-600 hover:text-blue-600" prefetch={false}>
                Neova Ecosystem
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600" prefetch={false}>
                About
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600" prefetch={false}>
                <LayoutGrid className="h-5 w-5" />
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                Connect Wallet
            </Button>
        </nav>
      </div>
      <div className="flex items-center justify-between w-full p-2 bg-white rounded-lg mt-4">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
            type="search"
            placeholder="Type to search..."
            className="pl-10 text-sm bg-gray-50 border-gray-200"
            />
        </div>
        <div className="flex items-center gap-4">
            <Link href="/dashboard/sign">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    New Signatures
                </Button>
            </Link>
            <div className="flex items-center gap-4 p-2 rounded-lg bg-white shadow-sm">
            <div>
                <p className="font-semibold text-sm text-gray-800">{day}</p>
                <p className="text-xs text-gray-500">{date}</p>
            </div>
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            </div>
        </div>
      </div>
    </header>
  )
} 