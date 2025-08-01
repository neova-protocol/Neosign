"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import ZKInfo from "@/components/dashboard/ZKInfo";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ZKIdentityManager from "@/components/settings/ZKIdentityManager";
import AddEmailPasswordForm from "@/components/settings/AddEmailPasswordForm";
import AddZKAuthForm from "@/components/settings/AddZKAuthForm";
import EditNameForm from "@/components/settings/EditNameForm";
import EditAvatarForm from "@/components/settings/EditAvatarForm";
import EditEmailForm from "@/components/settings/EditEmailForm";
import { getUserTypeDisplay } from "@/lib/user-utils";

interface UserProfile {
  email?: string;
  name?: string;
  hashedPassword?: string;
  zkCommitment?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Charger le profil utilisateur complet
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [session?.user]);

  // Show skeleton loading animation only while loading
  if (status === "loading") {
    // Next.js will use loading.tsx for Suspense fallback
    return null;
  }

  if (!session?.user) {
    // If no user, show a simple message or redirect
    return <div className="text-center py-10 text-gray-500">Aucun utilisateur connecté.</div>;
  }

  // Utiliser l'email d'authentification si disponible, sinon l'email de session
  const displayEmail = userProfile?.email || session.user.email;

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
          <EditAvatarForm />
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{session.user.name}</h3>
            <p className="text-sm text-gray-500">{displayEmail}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getUserTypeDisplay()}
              </Badge>
              <Badge variant="secondary">
                Membre depuis{" "}
                {new Date(session.user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditNameForm />
            <EditEmailForm 
              currentEmail={displayEmail || ""}
              onEmailChanged={(newEmail) => {
                // Mettre à jour l'état local si nécessaire
                console.log('Email changed to:', newEmail);
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              Compte créé le{" "}
              {new Date(session.user.createdAt).toLocaleDateString()}
            </span>
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
            Méthodes d&apos;authentification et paramètres de sécurité
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
                  {(session.user as { hashedPassword?: string }).hashedPassword
                    ? "Activée"
                    : (session.user as { zkCommitment?: string }).zkCommitment
                      ? "Non utilisée (ZK actif)"
                      : "Non configurée"}
                </p>
              </div>
            </div>
            <Badge
              variant={
                (session.user as { hashedPassword?: string }).hashedPassword
                  ? "default"
                  : "secondary"
              }
            >
              {(session.user as { hashedPassword?: string }).hashedPassword
                ? "Active"
                : "Inactive"}
            </Badge>
          </div>

          {/* Section ZK - Toujours visible pour les utilisateurs ZK */}
          {(session.user as { zkCommitment?: string }).zkCommitment && (
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

      {/* Ajout d'email/mot de passe pour les utilisateurs ZK */}
      {(session.user as { zkCommitment?: string }).zkCommitment && (
        <AddEmailPasswordForm
          hasEmailPassword={!!(session.user as { hashedPassword?: string }).hashedPassword}
          currentEmail={displayEmail || undefined}
        />
      )}

      {/* Ajout d'authentification ZK pour les utilisateurs email */}
      {(session.user as { hashedPassword?: string }).hashedPassword && (
        <AddZKAuthForm
          hasZKAuth={!!(session.user as { zkCommitment?: string }).zkCommitment}
        />
      )}

      {/* Changement de mot de passe */}
      <ChangePasswordForm
        hasPassword={
          !!(session.user as { hashedPassword?: string }).hashedPassword
        }
      />

      {/* Gestion de l'identité ZK */}
      {session.user  && (
        <ZKIdentityManager />
      )}

      {/* Informations ZK - Déplacé ici */}
      {session.user && <ZKInfo user={session.user} />}
    </div>
  );
}
