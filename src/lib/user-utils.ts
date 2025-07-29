// Utilitaires pour gérer les types d'utilisateurs et plans de souscription

export type UserPlan = 'basic' | 'premium' | 'enterprise';

export interface UserPlanInfo {
  name: string;
  displayName: string;
  features: string[];
  maxDocuments?: number;
  maxSignatories?: number;
  hasZKAuth?: boolean;
  hasAdvancedFeatures?: boolean;
}

export const USER_PLANS: Record<UserPlan, UserPlanInfo> = {
  basic: {
    name: 'basic',
    displayName: 'Plan Basic',
    features: [
      'Signature électronique standard',
      'Jusqu\'à 10 documents par mois',
      'Support email'
    ],
    maxDocuments: 10,
    maxSignatories: 5,
    hasZKAuth: false,
    hasAdvancedFeatures: false
  },
  premium: {
    name: 'premium',
    displayName: 'Plan Premium',
    features: [
      'Signature électronique avancée',
      'Documents illimités',
      'Authentification ZK',
      'Support prioritaire',
      'Templates personnalisés'
    ],
    maxDocuments: -1, // illimité
    maxSignatories: 20,
    hasZKAuth: true,
    hasAdvancedFeatures: true
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Plan Enterprise',
    features: [
      'Toutes les fonctionnalités Premium',
      'API personnalisée',
      'Support dédié',
      'Intégrations avancées',
      'Audit trail complet'
    ],
    maxDocuments: -1,
    maxSignatories: -1, // illimité
    hasZKAuth: true,
    hasAdvancedFeatures: true
  }
};

export function getUserPlan(): UserPlan {
  // Pour l'instant, tous les utilisateurs sont en plan Basic
  // À l'avenir, cela sera déterminé par la base de données
  return 'basic';
}

export function getUserPlanInfo(): UserPlanInfo {
  const plan = getUserPlan();
  return USER_PLANS[plan];
}

export function getUserTypeDisplay(): string {
  const plan = getUserPlan();
  
  switch (plan) {
    case 'basic':
      return 'Utilisateur Standard';
    case 'premium':
      return 'Utilisateur Premium';
    case 'enterprise':
      return 'Utilisateur Enterprise';
    default:
      return 'Utilisateur Standard';
  }
}

export function hasZKAuth(user: unknown): boolean {
  const planInfo = getUserPlanInfo();
  return planInfo.hasZKAuth || !!(user as { zkCommitment?: string }).zkCommitment;
}

export function canUseZKAuth(): boolean {
  const planInfo = getUserPlanInfo();
  return planInfo.hasZKAuth || false;
} 