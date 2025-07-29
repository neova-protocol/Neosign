"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield,
  Settings,
  Smartphone,
  Key
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Veuillez vous connecter pour voir votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profil Utilisateur</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos paramètres de sécurité.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Nom</Label>
                <p className="text-lg">{session.user.name || "Non renseigné"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {session.user.email}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Membre depuis</Label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuration 2FA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Authentification Forte (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>
                Configurez vos méthodes d'authentification forte pour les signatures AES et QES.
                Ces méthodes sont requises pour les signatures conformes eIDAS.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                SMS
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                Authenticator
              </Badge>
            </div>

            <Link href="/dashboard/settings/security">
              <Button className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Configurer 2FA
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Mes Signatures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Historique de vos signatures électroniques.</p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">Simple</Badge>
              <Badge variant="secondary">SES</Badge>
              <Badge variant="secondary">AES</Badge>
              <Badge variant="outline">QES</Badge>
            </div>

            <Button variant="outline" className="w-full">
              Voir l'historique
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 