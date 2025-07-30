"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Download, 
  FileText, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Workflow,
  Headphones,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PlanFeature {
  text: string;
  included: boolean;
  icon?: React.ReactNode;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Plan actuel (Freemium)
  const currentPlan = {
    name: "Freemium",
    price: "Gratuit",
    period: "Illimité",
    icon: <Crown className="h-5 w-5 text-yellow-600" />,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    features: [
      { text: "Jusqu'à 5 projets par mois", included: true, icon: <FileText className="h-4 w-4" /> },
      { text: "Jusqu'à 5 personnes dans l'organisation", included: true, icon: <Users className="h-4 w-4" /> },
      { text: "2FA & ZK Login", included: true, icon: <Shield className="h-4 w-4" /> },
      { text: "Système de stockage décentralisé", included: true, icon: <Zap className="h-4 w-4" /> },
      { text: "Fonctionnalités de base pour l'édition", included: true, icon: <FileText className="h-4 w-4" /> },
      { text: "Support de base", included: true, icon: <Headphones className="h-4 w-4" /> },
    ]
  };

  // Avantages Premium non inclus
  const premiumFeatures = [
    { text: "Jusqu'à 20 projets par mois", icon: <FileText className="h-4 w-4" /> },
    { text: "Jusqu'à 20 personnes dans l'organisation", icon: <Users className="h-4 w-4" /> },
    { text: "Toutes les fonctionnalités d'édition", icon: <FileText className="h-4 w-4" /> },
    { text: "Fonctionnalité de révision de base", icon: <TrendingUp className="h-4 w-4" /> },
    { text: "Fonctionnalités de modèles", icon: <FileText className="h-4 w-4" /> },
    { text: "Jusqu'à 5 workflows personnalisés par mois", icon: <Workflow className="h-4 w-4" /> },
    { text: "Support prioritaire", icon: <Headphones className="h-4 w-4" /> },
    { text: "Signatures AES/QES illimitées", icon: <Shield className="h-4 w-4" /> },
  ];

  // Factures simulées
  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: "0,00 €",
      status: 'paid',
      description: "Plan Freemium - Janvier 2024"
    },
    {
      id: "INV-2024-002", 
      date: "2024-02-15",
      amount: "0,00 €",
      status: 'paid',
      description: "Plan Freemium - Février 2024"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-15", 
      amount: "0,00 €",
      status: 'paid',
      description: "Plan Freemium - Mars 2024"
    }
  ];

  // Signatures restantes
  const signatureLimits = {
    aes: { used: 2, limit: 5, remaining: 3 },
    qes: { used: 0, limit: 2, remaining: 2 }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsLoading(true);
    try {
      // Simuler le téléchargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer un fichier PDF simulé
      const blob = new Blob(['Facture simulée'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation et abonnement</h1>
          <p className="text-gray-600">
            Gérez votre plan, consultez vos factures et suivez votre utilisation
          </p>
        </div>

        {/* Plan actuel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentPlan.icon}
              Plan actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations du plan */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${currentPlan.color} text-white`}>
                  {currentPlan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h3>
                  <p className="text-gray-600">{currentPlan.price} • {currentPlan.period}</p>
                </div>
              </div>
              <Link href="/dashboard/settings/subscription">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Voir les plans
                </Button>
              </Link>
            </div>

            {/* Fonctionnalités incluses */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Fonctionnalités incluses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages Premium */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Avantages Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Passez au plan Premium pour débloquer toutes les fonctionnalités avancées
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Link href="/dashboard/settings/subscription">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Passer au plan Premium
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Signatures restantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Signatures restantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Suivez votre utilisation des signatures AES et QES
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Signatures AES */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">Signatures AES</h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {signatureLimits.aes.remaining} restantes
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilisées</span>
                    <span className="font-medium">{signatureLimits.aes.used}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limite</span>
                    <span className="font-medium">{signatureLimits.aes.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(signatureLimits.aes.used / signatureLimits.aes.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Signatures QES */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-900">Signatures QES</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {signatureLimits.qes.remaining} restantes
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Utilisées</span>
                    <span className="font-medium">{signatureLimits.qes.used}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limite</span>
                    <span className="font-medium">{signatureLimits.qes.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(signatureLimits.qes.used / signatureLimits.qes.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Les signatures AES et QES sont limitées dans le plan Freemium. 
                Passez au plan Premium pour des signatures illimitées.
              </p>
              <Link href="/dashboard/settings/subscription">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Voir les plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Factures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              Factures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Téléchargez vos factures et suivez vos dépenses
            </p>
            
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{invoice.description}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{invoice.id}</span>
                        <span>•</span>
                        <span>{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span className="font-medium">{invoice.amount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isLoading ? "Téléchargement..." : "Télécharger"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {invoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune facture disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
