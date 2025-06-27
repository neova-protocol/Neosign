"use client"

import { Search, Grid3X3, Calendar, FileText, Users, BarChart3, Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"

const settingsMenuItems = [
  { name: "Profile", active: false, href: "dashboard/settings" },
  { name: "Security", active: false, href: "dashboard/settings/security" },
  { name: "Signatures", active: false, href: "dashboard/settings/sign" },
  { name: "Notifications", active: false, href: "dashboard/settings/notifications" },
  { name: "Contact", active: false, href: "dashboard/settings/contact" },
  { name: "Advanced", active: false, href: "dashboard/settings/advanced" },
  { name: "Billing", active: true, href: "dashboard/settings/billing" },
]

const plans = [
  {
    id: "freemium",
    name: "Freemium",
    price: "Free",
    features: [
      "Up to 5 projects per month",
      "Up to 5 people in the organisation",
      "2FA & ZK Login",
      "Decentralized storing system",
      "Basic features for the editing",
      "Basic support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    features: [
      "Up to 20 projects per month",
      "Up to 20 people in the organisation",
      "2FA & ZK Login",
      "Decentralized storing system",
      "All features for the editing",
      "Basic review feature",
      "Models features",
      "Up to 5 custom workflows per month",
      "Priority support",
    ],
  },
  {
    id: "corporate",
    name: "Corporate",
    monthlyPrice: 29.99,
    yearlyPrice: 23.99,
    features: [
      "Unlimited projects",
      "Unlimited people in the organisation",
      "2FA & ZK Login",
      "Decentralized storing system",
      "All features for the editing",
      "Advanced document review features",
      "Models features",
      "Unlimited custom workflows per month",
      "Dedicated support",
    ],
  },
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("freemium")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [sliderPosition, setSliderPosition] = useState(0)

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    const planIndex = plans.findIndex((p) => p.id === planId)
    setSliderPosition(planIndex)
  }

  const handleSliderChange = (position: number) => {
    setSliderPosition(position)
    setSelectedPlan(plans[position].id)
  }

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to ${planId} plan with ${billingCycle} billing`)
    // Handle plan upgrade
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full" />
                  ))}
                </div>
              </div>
            </Link>

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
            <Link href="/new-signature">
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Grid3X3 className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/new-signature">
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
          <Link href="/templates">
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="bg-gray-900 text-white hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex bg-gray-50">
          {/* Billing Content */}
          <div className="flex-1 p-6">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-2xl">S</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Slyrack</h1>
                    <p className="text-gray-300 text-sm">Member Since: 3 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-white font-medium">Basic Plan</span>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-6xl">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upgrade and get more security</h2>

                {/* Billing Toggle */}
                <div className="flex items-center justify-end space-x-4 mb-6">
                  <span className="text-sm text-gray-700">Bill monthly</span>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 flex items-center">
                    Bill yearly
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">-20%</span>
                  </span>
                </div>

                {/* Plan Slider */}
                <div className="relative mb-8">
                  <div className="flex items-center space-x-4">
                    {/* Slider Track */}
                    <div className="flex-1 relative">
                      <div
                        className="h-2 bg-gray-200 rounded-full relative cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const x = e.clientX - rect.left
                          const percentage = x / rect.width
                          const newPosition = Math.round(percentage * (plans.length - 1))
                          const clampedPosition = Math.max(0, Math.min(plans.length - 1, newPosition))
                          handleSliderChange(clampedPosition)
                        }}
                      >
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${((sliderPosition + 1) / plans.length) * 100}%` }}
                        />

                        {/* Draggable Cursor */}
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg transition-all duration-300 hover:scale-110"
                          style={{
                            left: `${(sliderPosition / (plans.length - 1)) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          draggable={false}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            const startX = e.clientX
                            const startPosition = sliderPosition
                            const slider = e.currentTarget.parentElement
                            if (!slider) return;
                            const sliderRect = slider.getBoundingClientRect()

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaX = moveEvent.clientX - startX
                              const deltaPercentage = deltaX / sliderRect.width
                              const deltaPosition = deltaPercentage * (plans.length - 1)
                              const newPosition = Math.round(startPosition + deltaPosition)
                              const clampedPosition = Math.max(0, Math.min(plans.length - 1, newPosition))

                              if (clampedPosition !== sliderPosition) {
                                handleSliderChange(clampedPosition)
                              }
                            }

                            const handleMouseUp = () => {
                              document.removeEventListener("mousemove", handleMouseMove)
                              document.removeEventListener("mouseup", handleMouseUp)
                            }

                            document.addEventListener("mousemove", handleMouseMove)
                            document.addEventListener("mouseup", handleMouseUp)
                          }}
                        />

                        {/* Plan Position Markers */}
                        {plans.map((_, index) => (
                          <div
                            key={index}
                            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"
                            style={{
                              left: `${(index / (plans.length - 1)) * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                            onClick={() => handleSliderChange(index)}
                          />
                        ))}
                      </div>

                      {/* Plan Labels */}
                      <div className="flex justify-between mt-4">
                        {plans.map((plan, index) => (
                          <button
                            key={plan.id}
                            className={`text-sm font-medium transition-colors ${
                              selectedPlan === plan.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => handlePlanSelect(plan.id)}
                          >
                            {plan.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-lg p-6 border-2 transition-all cursor-pointer ${
                      selectedPlan === plan.id ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {/* Plan Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {plan.id === "freemium" ? (
                        <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                      ) : (
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}/month
                          </div>
                          <div className="text-sm text-gray-500">
                            per month, billed {billingCycle === "monthly" ? "monthly" : "annually"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full mb-6 ${
                        selectedPlan === plan.id
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.id === "freemium" ? "Actual Plan" : "Actual Plan"}
                    </Button>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="space-y-2">
              {settingsMenuItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>

            {/* Decorative Element */}
            <div className="mt-12 relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                  </div>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                    Explore Neova Ecosystem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}