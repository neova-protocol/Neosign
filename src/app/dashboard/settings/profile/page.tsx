"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";
import ZKInfo from "@/components/dashboard/ZKInfo";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import ZKIdentityManager from "@/components/settings/ZKIdentityManager";
import AddEmailPasswordForm from "@/components/settings/AddEmailPasswordForm";
import AddZKAuthForm from "@/components/settings/AddZKAuthForm";
import EditNameForm from "@/components/settings/EditNameForm";
import EditAvatarForm from "@/components/settings/EditAvatarForm";
import { getUserTypeDisplay } from "@/lib/user-utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // Show skeleton loading animation only while loading
  if (status === "loading") {
    // Next.js will use loading.tsx for Suspense fallback
    return null;
  }

  if (!session?.user) {
    // If no user, show a simple message or redirect
    return <div className="text-center py-10 text-gray-500">Aucun utilisateur connecté.</div>;
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
          <EditAvatarForm />
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{session.user.name}</h3>
            <p className="text-sm text-gray-500">{session.user.email}</p>
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={session.user.email || ""}
                disabled
              />
            </div>
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
          currentEmail={session.user.email || undefined}
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
