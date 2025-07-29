"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Shield, 
  User, 
  Bell, 
  Palette,
  Database,
  Key
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour accéder aux paramètres.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-gray-600" />
          <h1 className="text-3xl font-bold">Paramètres</h1>
        </div>
        <p className="text-gray-600">
          Gérez vos préférences et configurations personnelles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profil Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Gérez vos informations personnelles et votre compte.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nom</span>
                <Badge variant="outline">{session.user.name || "Non renseigné"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <Badge variant="outline">{session.user.email}</Badge>
              </div>
            </div>

            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Modifier le profil
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Configurez vos méthodes d'authentification forte pour les signatures AES et QES.</p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                SMS
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                Email
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                Authenticator
              </Badge>
            </div>

            <Link href="/dashboard/settings/security">
              <Button className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Configurer 2FA
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Gérez vos préférences de notifications et alertes.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Emails</span>
                <Badge variant="secondary">Activé</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS</span>
                <Badge variant="outline">Désactivé</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full" disabled>
              Configurer (bientôt)
            </Button>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Personnalisez l'apparence de votre interface.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Thème</span>
                <Badge variant="secondary">Système</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Langue</span>
                <Badge variant="secondary">Français</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full" disabled>
              Configurer (bientôt)
            </Button>
          </CardContent>
        </Card>

        {/* Données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Gérez vos données et exportez vos informations.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Documents</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Signatures</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full" disabled>
              Exporter (bientôt)
            </Button>
          </CardContent>
        </Card>

        {/* Compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-red-600" />
              Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Actions avancées sur votre compte.</p>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Changer le mot de passe
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Supprimer le compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
