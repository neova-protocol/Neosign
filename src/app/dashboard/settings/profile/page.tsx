"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import ZKInfo from "@/components/dashboard/ZKInfo";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Informations de base du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du Profil
          </CardTitle>
          <CardDescription>
            Gérez vos informations personnelles et votre identité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{session.user.name}</h3>
              <p className="text-sm text-gray-500">{session.user.email}</p>
              <div className="flex items-center gap-2">
                               <Badge variant="outline">
                 {(session.user as any).zkCommitment ? "Utilisateur ZK" : "Utilisateur Standard"}
               </Badge>
                <Badge variant="secondary">
                  Membre depuis {new Date(session.user.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue={session.user.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={session.user.email || ""} disabled />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Compte créé le {new Date(session.user.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Informations de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité du Compte
          </CardTitle>
          <CardDescription>
            Méthodes d'authentification et paramètres de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Authentification par Email</h4>
                <p className="text-sm text-gray-500">
                  {(session.user as any).hashedPassword 
                    ? "Activée" 
                    : (session.user as any).zkCommitment 
                      ? "Non utilisée (ZK actif)" 
                      : "Non configurée"
                  }
                </p>
              </div>
            </div>
            <Badge variant={(session.user as any).hashedPassword ? "default" : "secondary"}>
              {(session.user as any).hashedPassword ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Section ZK - Toujours visible pour les utilisateurs ZK */}
          {(session.user as any).zkCommitment && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Authentification ZK</h4>
                  <p className="text-sm text-gray-500">Zero Knowledge active</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          )}

          {(session.user as any).zkCommitment && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Authentification ZK</h4>
                  <p className="text-sm text-gray-500">Zero Knowledge active</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      <ChangePasswordForm hasPassword={!!(session.user as any).hashedPassword} />

      {/* Informations ZK - Déplacé ici */}
      {session.user && (
        <ZKInfo user={session.user} />
      )}
    </div>
  );
} 