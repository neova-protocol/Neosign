"use client"

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
  import { NeovaLogo } from "@/components/NeovaLogo"
  import { DecorativeDashboard } from "@/components/DecorativeDashboard"
  
  export default function HomePage() {
    return (
      <div className="flex-1 p-6 relative overflow-hidden">
        <NeovaLogo
          style={{
            position: "absolute",
            top: "2rem",
            right: "4rem",
            width: "500px",
            height: "500px",
            opacity: "0.1",
          }}
        />
        <main>
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
                Create, manage and sign docs by{" "}
                <span className="text-blue-500">
                  leveraging decentralisation
                </span>
              </h1>
              <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1 hover:border-blue-500 hover:text-blue-500 transition-colors">
                Learn more
              </button>
            </div>
  
            {/* Overview Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 relative">
              <h2 className="text-3xl font-semibold text-blue-500 mb-8 text-center">
                Your overview
              </h2>
              <div className="flex justify-around items-center">
                {/* Decorative pattern (Left) */}
                <div className="relative">
                  <DecorativeDashboard />
                </div>
  
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">
                    32
                  </div>
                  <div className="text-gray-600 font-medium text-sm">
                    Completed Signatures
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">6</div>
                  <div className="text-gray-600 font-medium text-sm">
                    In progress Signatures
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">1</div>
                  <div className="text-gray-600 font-medium text-sm">
                    Signing Invitation
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-gray-900 mb-3">2</div>
                  <div className="text-gray-600 font-medium text-sm">
                    Drafts Signatures
                  </div>
                </div>
  
                {/* Decorative pattern (Right) */}
                <div className="relative">
                  <DecorativeDashboard />
                </div>
                </div>
              </div>
  
              {/* Documents List */}
              <div className="space-y-3">
                {/* Document 1 - Completed */}
              <Link href="/dashboard/sign/status">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
  
                {/* Document 2 - You have to sign */}
              <Link href="/dashboard/sign/status">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
  
                {/* Document 3 - In Progress */}
              <Link href="/dashboard/sign/status">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - SAFT Contract - 2025.pdf</h3>
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
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">In Progress</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
  
              {/* Document 4 - In Draft */}
              <Link href="/dashboard/sign/status">
                <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">Neova - Partnership - 2025.pdf</h3>
                    <p className="text-xs text-gray-500">Created on 30/01/2025 | By Guillaume G. (me) | Neova</p>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <span className="text-xs text-gray-600">Guillaume G.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Q</span>
                        </div>
                        <span className="text-xs text-gray-600">Quentin C.</span>
                      </div>
                    </div>
  
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">In Draft</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }