"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  X,
  Star,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface Plan {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  period: string;
  description: string;
  features: string[];
  notIncluded: string[];
  color: string;
  gradient: string;
  popular?: boolean;
  current?: boolean;
}

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans: Plan[] = [
    {
      name: "Freemium",
      priceMonthly: "Gratuit",
      priceYearly: "Gratuit",
      period: "Illimité",
      description: "Parfait pour commencer avec Neosign",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      gradient: "from-yellow-50 to-orange-50",
      current: true,
      features: [
        "Jusqu'à 5 projets par mois",
        "Jusqu'à 5 personnes dans l'organisation",
        "2FA & ZK Login",
        "Système de stockage décentralisé",
        "Fonctionnalités de base pour l'édition",
        "Support de base"
      ],
      notIncluded: [
        "Signatures AES/QES illimitées",
        "Support prioritaire",
        "Workflows personnalisés",
        "Fonctionnalités avancées"
      ]
    },
    {
      name: "Premium",
      priceMonthly: "9,99€",
      priceYearly: "6,99€",
      period: "par mois",
      description: "Pour les équipes qui ont besoin de plus de fonctionnalités",
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      gradient: "from-purple-50 to-blue-50",
      popular: true,
      features: [
        "Jusqu'à 20 projets par mois",
        "Jusqu'à 20 personnes dans l'organisation",
        "2FA & ZK Login",
        "Système de stockage décentralisé",
        "Toutes les fonctionnalités d'édition",
        "Fonctionnalité de révision de base",
        "Fonctionnalités de modèles",
        "Jusqu'à 5 workflows personnalisés par mois",
        "Support prioritaire"
      ],
      notIncluded: [
        "Fonctionnalités Enterprise",
        "Support dédié 24/7",
        "API personnalisée"
      ]
    },
    {
      name: "Corporate",
      priceMonthly: "29,99€",
      priceYearly: "20,99€",
      period: "par mois",
      description: "Solutions personnalisées pour les grandes organisations",
      color: "bg-gradient-to-r from-gray-800 to-gray-900",
      gradient: "from-gray-50 to-gray-100",
      features: [
        "Projets illimités",
        "Organisation illimitée",
        "2FA & ZK Login",
        "Système de stockage décentralisé",
        "Toutes les fonctionnalités d'édition",
        "Fonctionnalités de révision avancées",
        "Fonctionnalités de modèles",
        "Workflows personnalisés illimités",
        "Support dédié"
      ],
      notIncluded: []
    }
  ];

  const handleSelectPlan = (planName: string) => {
    // Ici on pourrait ajouter la logique de souscription
    console.log(`Plan sélectionné: ${planName}`);
  };

  const getCurrentPrice = (plan: Plan) => {
    if (plan.name === "Freemium") return plan.priceMonthly;
    return billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings/billing">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upgrade and get more security</h1>
              <p className="text-gray-600 mt-2">
                Sélectionnez le plan qui correspond le mieux à vos besoins
              </p>
            </div>
          </div>

          {/* Toggle de facturation */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Bill monthly</span>
            <div className="relative">
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Bill yearly</span>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-600 text-white text-xs">-30%</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-black text-white px-3 py-1">
                    {plan.name}
                  </Badge>
                </div>
              )}
              
              {plan.popular && !plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg ${plan.color} flex items-center justify-center`}>
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-3xl font-bold">{getCurrentPrice(plan)}</span>
                  {plan.period && plan.name !== "Freemium" && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                {plan.name !== "Freemium" && billingCycle === 'yearly' && (
                  <p className="text-xs text-gray-500 mt-1">par mois, facturé annuellement</p>
                )}
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fonctionnalités incluses */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Inclus</h4>
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fonctionnalités non incluses */}
                {plan.notIncluded.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Non inclus</h4>
                    <div className="space-y-2">
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton de sélection */}
                <div className="pt-4">
                  {plan.current ? (
                    <Button 
                      className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200" 
                      variant="outline"
                      disabled
                    >
                      Actual Plan
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${plan.color} hover:opacity-90`}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      Choisir {plan.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ ou informations supplémentaires */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Puis-je changer de plan à tout moment ?</h4>
              <p className="text-sm text-gray-600">
                Oui, vous pouvez changer de plan à tout moment. Les modifications prendront effet au début du prochain cycle de facturation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Y a-t-il des frais de résiliation ?</h4>
              <p className="text-sm text-gray-600">
                Non, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quels moyens de paiement acceptez-vous ?</h4>
              <p className="text-sm text-gray-600">
                Nous acceptons les cartes de crédit principales (Visa, Mastercard, American Express) et les paiements par SEPA.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 