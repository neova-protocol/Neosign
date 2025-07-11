"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { useState } from "react"

interface PlanFeature {
  text: string
  included: boolean
}

interface PricingPlan {
  name: string
  icon: string
  price: string
  subtitle?: string
  isCurrentPlan: boolean
  features: PlanFeature[]
  badge?: string
}

export default function BillingSettings() {
  const [isYearly, setIsYearly] = useState(true)

  const plans: PricingPlan[] = [
    {
      name: "Freemium",
      icon: "💎",
      price: "Free",
      isCurrentPlan: true,
      badge: "Freemium",
      features: [
        { text: "Up to 5 projects per month", included: true },
        { text: "Up to 5 people in the organisation", included: true },
        { text: "2FA & ZK Login", included: true },
        { text: "Decentralized storing system", included: true },
        { text: "Basic features for the editing", included: true },
        { text: "Basic support", included: true },
      ],
    },
    {
      name: "Premium",
      icon: "💎",
      price: isYearly ? "$9.99/month" : "$12.99/month",
      subtitle: "per month, billed annually",
      isCurrentPlan: false,
      features: [
        { text: "Up to 20 projects per month", included: true },
        { text: "Up to 20 people in the organisation", included: true },
        { text: "2FA & ZK Login", included: true },
        { text: "Decentralized storing system", included: true },
        { text: "All features for the editing", included: true },
        { text: "Basic review feature", included: true },
        { text: "Models features", included: true },
        { text: "Up to 5 custom workflows per month", included: true },
        { text: "Priority support", included: true },
      ],
    },
    {
      name: "Corporate",
      icon: "💎",
      price: isYearly ? "$29.99/month" : "$39.99/month",
      subtitle: "per month, billed annually",
      isCurrentPlan: false,
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Unlimited people in the organisation", included: true },
        { text: "2FA & ZK Login", included: true },
        { text: "Decentralized storing system", included: true },
        { text: "All features for the editing", included: true },
        { text: "Advanced document review features", included: true },
        { text: "Models features", included: true },
        { text: "Unlimited custom workflows per month", included: true },
        { text: "Dedicated support", included: true },
      ],
    },
  ]

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Billing Section */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Upgrade and get more security</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Bill monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className="text-sm">Bill yearly</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                -30%
              </Badge>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded-full"></div>
          </div>

          {/* Plan Labels */}
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">Premium</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">Premium</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">Corporate</span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.isCurrentPlan ? "border-2 border-blue-500 shadow-lg" : "border border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-800 text-white px-3 py-1">{plan.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">{plan.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{plan.price}</p>
                    {plan.subtitle && <p className="text-sm text-gray-500">{plan.subtitle}</p>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className={`w-full ${
                      plan.isCurrentPlan
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    disabled={plan.isCurrentPlan}
                  >
                    {plan.isCurrentPlan ? "Actual Plan" : "Actual Plan"}
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 