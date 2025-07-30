"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Settings as SettingsIcon,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";

interface TwoFactorConfig {
  emailVerified: boolean;
  phoneVerified: boolean;
  authenticatorEnabled: boolean;
  twoFactorMethods: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  hashedPassword: string | null;
  zkCommitment: string | null;
}

interface UserStats {
  toSign: number;
  completed: number;
  inProgress: number;
  total: number;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading2FA, setLoading2FA] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          // Charger la config 2FA
          const configResponse = await fetch('/api/user/2fa');
          if (configResponse.ok) {
            const config = await configResponse.json();
            setTwoFactorConfig(config);
          }

          // Charger le profil utilisateur
          const profileResponse = await fetch('/api/user/me');
          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            setUserProfile(profile);
          }

          // Charger les statistiques
          const statsResponse = await fetch('/api/user/stats');
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setUserStats(stats);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading2FA(false);
          setLoadingStats(false);
        }
      }
    };

    loadUserData();
  }, [session?.user]);

  const hasZKAuth = session?.user?.email?.includes('zk-') || false;
  const displayEmail = userProfile?.email || session?.user?.email;

  const getTwoFactorStatus = (method: string) => {
    if (!twoFactorConfig) return { status: 'Non configuré', icon: <XCircle className="h-4 w-4 text-gray-400" /> };
    
    switch (method) {
      case 'email':
        return {
          status: twoFactorConfig.emailVerified ? 'Vérifié' : 'Non vérifié',
          icon: twoFactorConfig.emailVerified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />
        };
      case 'sms':
        return {
          status: twoFactorConfig.phoneVerified ? 'Configuré' : 'Non configuré',
          icon: twoFactorConfig.phoneVerified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />
        };
      case 'authenticator':
        return {
          status: twoFactorConfig.authenticatorEnabled ? 'Configuré' : 'Non configuré',
          icon: twoFactorConfig.authenticatorEnabled ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />
        };
      default:
        return { status: 'Non configuré', icon: <XCircle className="h-4 w-4 text-gray-400" /> };
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600 mt-2">
          Gérez vos préférences et la sécurité de votre compte
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil Utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profil Utilisateur
            </CardTitle>
            <CardDescription>
              Informations personnelles et statut d&apos;authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Nom</p>
              <p className="text-gray-600">{session?.user?.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-gray-600">{displayEmail}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">ZK Auth</p>
              <div className="flex items-center gap-2">
                {hasZKAuth ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Actif</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Inactif</span>
                  </>
                )}
              </div>
            </div>
            <Button asChild className="w-full">
              <a href="/dashboard/settings/profile">Modifier le profil</a>
            </Button>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Authentification à deux facteurs et sécurité du compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading2FA ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <div className="flex items-center gap-2">
                      {getTwoFactorStatus('email').icon}
                      <span className="text-sm">{getTwoFactorStatus('email').status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS</span>
                    <div className="flex items-center gap-2">
                      {getTwoFactorStatus('sms').icon}
                      <span className="text-sm">{getTwoFactorStatus('sms').status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authenticator</span>
                    <div className="flex items-center gap-2">
                      {getTwoFactorStatus('authenticator').icon}
                      <span className="text-sm">{getTwoFactorStatus('authenticator').status}</span>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <a href="/dashboard/settings/security">Configurer la sécurité</a>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              Données
            </CardTitle>
            <CardDescription>
              Gérez vos données et exportez vos informations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingStats ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">À signer</span>
                    <Badge variant="secondary">{userStats?.toSign || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Complétés</span>
                    <Badge variant="secondary">{userStats?.completed || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">En cours</span>
                    <Badge variant="secondary">{userStats?.inProgress || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total</span>
                    <Badge variant="outline">{userStats?.total || 0}</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Exporter (bientôt)
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Préférences de notifications et alertes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Activé</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS</span>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Désactivé</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bell dans l&apos;app</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Activé</span>
                </div>
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
              <Palette className="h-5 w-5 text-pink-600" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l&apos;apparence de l&apos;application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Configurer (bientôt)
            </Button>
          </CardContent>
        </Card>

        {/* Compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
              Compte
            </CardTitle>
            <CardDescription>
              Gestion du compte et déconnexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Gérer le compte (bientôt)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
