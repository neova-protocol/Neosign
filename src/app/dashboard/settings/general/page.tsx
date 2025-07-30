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
  XCircle,
  Crown,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  // États pour la suppression de compte
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteVerification, setShowDeleteVerification] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [authenticatorCode, setAuthenticatorCode] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deletionReason, setDeletionReason] = useState("");

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

  const hasZKAuth = userProfile?.zkCommitment !== null && userProfile?.zkCommitment !== undefined;
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

  const handleDeleteAccount = () => {
    // Vérifier que 2FA email et authenticator sont activés
    if (!twoFactorConfig?.emailVerified || !twoFactorConfig?.authenticatorEnabled) {
      setDeleteError("Vous devez avoir l'authentification par email ET l'authenticator activés pour supprimer votre compte.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setShowDeleteVerification(true);
    setDeleteError("");

    // Envoyer un code de vérification par email
    try {
      const response = await fetch('/api/user/2fa/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: displayEmail })
      });

      if (!response.ok) {
        setDeleteError("Erreur lors de l'envoi du code de vérification.");
        setShowDeleteVerification(false);
      }
    } catch {
      setDeleteError("Erreur de connexion lors de l'envoi du code.");
      setShowDeleteVerification(false);
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!emailCode || !authenticatorCode) {
      setDeleteError("Veuillez saisir les deux codes de vérification.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailCode: emailCode,
          authenticatorCode: authenticatorCode,
          reason: deletionReason || "Demande de suppression par l'utilisateur"
        })
      });

      if (response.ok) {
        setShowDeleteVerification(false);
        
        // Rediriger vers la page de déconnexion
        window.location.href = "/api/auth/signout";
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.error || "Erreur lors de la suppression du compte.");
      }
    } catch {
      setDeleteError("Erreur de connexion lors de la suppression du compte.");
    } finally {
      setIsDeleting(false);
    }
  };

  const canDeleteAccount = twoFactorConfig?.emailVerified && twoFactorConfig?.authenticatorEnabled;

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
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Langue</span>
                <select 
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                  defaultValue="fr"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Thème</span>
                <select 
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                  defaultValue="system"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Sauvegarder (bientôt)
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
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Plan actuel</span>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <Badge variant="secondary">Gratuit</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Statut</span>
                <Badge variant="outline">Actif</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
                disabled={!canDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer le compte
              </Button>
              {!canDeleteAccount && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  L&apos;authentification par email ET l&apos;authenticator doivent être activés
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Supprimer le compte
            </DialogTitle>
            <DialogDescription>
              Cette action est <strong>définitive</strong> et ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Attention</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Tous vos documents seront définitivement supprimés</li>
                <li>• Vos données personnelles seront effacées de Neosign</li>
                <li>• Votre compte sera désactivé pendant 15 jours puis supprimé</li>
                <li>• Cette action ne peut pas être annulée</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deletion-reason">Raison de la suppression (optionnel)</Label>
              <Input
                id="deletion-reason"
                placeholder="Pourquoi souhaitez-vous supprimer votre compte ?"
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
              />
            </div>
            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de vérification 2FA */}
      <Dialog open={showDeleteVerification} onOpenChange={setShowDeleteVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Vérification finale
            </DialogTitle>
            <DialogDescription>
              Saisissez les codes de vérification pour confirmer la suppression
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-code">Code reçu par email</Label>
              <Input
                id="email-code"
                type="text"
                placeholder="000000"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                maxLength={6}
                className="text-center font-mono text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authenticator-code">Code Authenticator</Label>
              <Input
                id="authenticator-code"
                type="text"
                placeholder="000000"
                value={authenticatorCode}
                onChange={(e) => setAuthenticatorCode(e.target.value)}
                maxLength={6}
                className="text-center font-mono text-lg"
              />
            </div>
            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteVerification(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleVerifyAndDelete}
              disabled={isDeleting || !emailCode || !authenticatorCode}
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
