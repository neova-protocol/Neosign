import {
    Search,
    Grid3X3,
    Calendar,
    MoreHorizontal,
    ExternalLink,
    Edit,
    FileText,
    Users,
    BarChart3,
    Settings,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import Link from "next/link"
  
  export default function HomePage() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-white rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Navigation */}
              <nav className="flex items-center space-x-6">
                <a href="#" className="text-blue-500 font-medium">
                  Neova Ecosystem
                </a>
                <a href="#" className="text-gray-600 font-medium">
                  About
                </a>
                <Button variant="ghost" size="icon">
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </nav>
            </div>
  
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">Connect Wallet</Button>
          </div>
  
          {/* Search and Actions Bar */}
          <div className="flex items-center justify-between mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Type to search..." className="pl-10 bg-gray-50 border-gray-200" />
            </div>
  
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/sign">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">
                  New Signatures
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Tuesday</span>
                <span className="text-gray-400">19 April 2024</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>GG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
  
        {/* Sidebar */}
        <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
          <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
            <Grid3X3 className="h-5 w-5" />
          </Button>
          <Link href="/dashboard/sign">
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Link href="/dashboard/templates">
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </aside>
  
        {/* Main Content */}
        <main
          className="flex-1 p-6 relative overflow-hidden bg-gray-50"
          style={{
            backgroundImage: "url(/geometric-shapes.png)",
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Decorative dot patterns */}
          <div className="absolute left-8 top-32 opacity-30">
            <div className="grid grid-cols-6 gap-1.5">
              {[...Array(36)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              ))}
            </div>
          </div>
  
          <div className="absolute right-8 top-40 opacity-30">
            <div className="grid grid-cols-8 gap-1">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-500 rounded-full opacity-40" />
              ))}
            </div>
          </div>
  
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="mb-16 pt-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-2xl">
                Create, manage and sign docs by <span className="text-blue-500">leveraging decentralisation</span>
              </h1>
              <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1 hover:border-blue-500 hover:text-blue-500 transition-colors">
                Learn more
              </button>
            </div>
  
            {/* Overview Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-blue-500 mb-12 text-center">Your overview</h2>
  
              <div className="grid grid-cols-4 gap-12 mb-16">
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">32</div>
                  <div className="text-gray-600 font-medium text-sm">Completed Signatures</div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">6</div>
                  <div className="text-gray-600 font-medium text-sm">In progress Signatures</div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">1</div>
                  <div className="text-gray-600 font-medium text-sm">Signing Invitation</div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">2</div>
                  <div className="text-gray-600 font-medium text-sm">Drafts Signatures</div>
                </div>
              </div>
  
              {/* Documents List */}
              <div className="space-y-3">
                {/* Document 1 - Completed */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - NDA Contract - 2025.pdf</h3>
                    <p className="text-xs text-gray-500">Created on 30/01/2025 | By Guillaume G. (me) | Neova</p>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Quentin C.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">Completed</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
  
                {/* Document 2 - You have to sign */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - Employment Contract - 2025.pdf</h3>
                    <p className="text-xs text-gray-500">Created on 30/01/2025 | By Quentin C. | Neova</p>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Quentin C.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">You have to sign</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
  
                {/* Document 3 - In Progress */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - SAFT Contract - 2025.pdf</h3>
                    <p className="text-xs text-gray-500">Created on 30/01/2025 | By Guillaume G. (me) | Neova</p>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Quentin C.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Jean D.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs text-gray-600">Alice B.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">B</span>
                        </div>
                        <span className="text-xs text-gray-600">Bob E.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">In Progress</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
  
                {/* Document 4 - Draft */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - Test Contract - 2025.docx</h3>
                    <p className="text-xs text-gray-500">Created on 12/01/2025 | By Guillaume G. (me) | Neova</p>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">Draft</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }