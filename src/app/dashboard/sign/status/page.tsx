"use client"

import { Button } from "@/components/ui/button"
import { NeovaLogo } from "@/components/NeovaLogo"
import { DecorativePattern } from "@/components/DecorativePattern"
import { Check, Eye, Bell, Edit, Calendar, MoreHorizontal, ExternalLink } from "lucide-react"

export default function SignStatusPage() {
  return (
    <div className="flex-1 relative overflow-hidden">
      <NeovaLogo
        style={{
          position: "absolute",
          top: "2rem",
          right: "4rem", 
          width: "500px",
          height: "500px",
          opacity: "0.05",
        }}
      />

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Document Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[300px] mb-4">
                <div className="text-center">
                  <div className="w-20 h-24 bg-white border-2 border-gray-200 rounded mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <span className="text-sm text-gray-500 font-medium">PDF</span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Neova - NDA Contract</p>
                  <p className="text-xs text-gray-500">2025.pdf</p>
                </div>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                See
              </Button>
            </div>
          </div>

          {/* Right Column - Document Details */}
          <div className="lg:col-span-2">
            {/* Document Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Neova - NDA Contract - 2025.pdf
              </h1>
              <p className="text-gray-600 mb-4">
                Sent by Guillaume G. as Neova
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm text-gray-500 flex items-center">
                  📅 4 days ago
                </span>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                Download the document
              </Button>
            </div>

            {/* Status Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-xl">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Signatories */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">Guillaume Gournier</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        Signed
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">guillaume@neova.io</p>
                    <p className="text-xs text-gray-500 italic">Valid proof of identity</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">Quentin Clement</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        Signed
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">quentin@neova.io</p>
                    <p className="text-xs text-gray-500 italic">Valid proof of identity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section - Full Width */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 relative">
          <div className="relative">
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">14/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Edit className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Invitation created</p>
                  <p className="text-xs text-gray-500">Guillaume G.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">14/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Invitation sent</p>
                  <p className="text-xs text-gray-500">Guillaume G.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">14/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Document consulted</p>
                  <p className="text-xs text-gray-500">Quentin C.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">21/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Bell className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Automatic reminder to all</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">21/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Edit className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Document signed</p>
                  <p className="text-xs text-gray-500">Guillaume G.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">22/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Bell className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Manual reminder to Quentin C.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">22/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Document consulted</p>
                  <p className="text-xs text-gray-500">Quentin C.</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-xs text-gray-500 mb-2">22/01/2025</div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Edit className="h-4 w-4 text-gray-600" />
                </div>
                <div className="max-w-24">
                  <p className="text-xs font-medium text-gray-900 mb-1">Document signed</p>
                  <p className="text-xs text-gray-500">Quentin C.</p>
                </div>
              </div>
            </div>
            
            {/* Timeline Line */}
            <div className="absolute top-9 left-5 right-5 h-0.5 bg-gray-300 -z-10"></div>
          </div>
          
          {/* Decorative Pattern at bottom of timeline */}
          <div className="flex justify-center mt-6">
            <DecorativePattern />
          </div>
        </div>
      </main>
    </div>
  )
} 