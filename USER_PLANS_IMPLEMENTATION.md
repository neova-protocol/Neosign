# 🎯 Implémentation des Plans de Souscription

## ✅ **Problème Résolu**

Le badge "Utilisateur ZK" a été remplacé par "Utilisateur Standard" car il était basé sur la présence d'un `zkCommitment` dans la base de données, alors qu'il devrait refléter le plan de souscription de l'utilisateur.

## 🔧 **Changements Effectués**

### **1. Page de Profil (`src/app/dashboard/settings/profile/page.tsx`)**

**Avant :**
```tsx
<Badge variant="outline">
  {(session.user as { zkCommitment?: string }).zkCommitment
    ? "Utilisateur ZK"
    : "Utilisateur Standard"}
</Badge>
```

**Après :**
```tsx
<Badge variant="outline">
  {getUserTypeDisplay()}
</Badge>
```

### **2. Utilitaires Utilisateur (`src/lib/user-utils.ts`)**

Création d'un système de plans avec :
- **3 plans** : Basic, Premium, Enterprise
- **Fonctions utilitaires** pour déterminer le type d'utilisateur
- **Préparation** pour l'implémentation future

## 📋 **Plans de Souscription**

### **Plan Basic (Actuel)**
- ✅ Signature électronique standard
- ✅ Jusqu'à 10 documents par mois
- ✅ Support email
- ❌ Authentification ZK
- ❌ Fonctionnalités avancées

### **Plan Premium (Futur)**
- ✅ Signature électronique avancée
- ✅ Documents illimités
- ✅ Authentification ZK
- ✅ Support prioritaire
- ✅ Templates personnalisés

### **Plan Enterprise (Futur)**
- ✅ Toutes les fonctionnalités Premium
- ✅ API personnalisée
- ✅ Support dédié
- ✅ Intégrations avancées
- ✅ Audit trail complet

## 🚀 **Implémentation Future**

### **1. Base de Données**

Ajouter un champ `plan` à la table `User` :

```sql
-- Dans prisma/schema.prisma
model User {
  // ... autres champs
  plan UserPlan @default(BASIC)
}

enum UserPlan {
  BASIC
  PREMIUM
  ENTERPRISE
}
```

### **2. Fonction `getUserPlan()`**

Modifier pour lire depuis la base de données :

```typescript
export function getUserPlan(user: { plan?: string }): UserPlan {
  switch (user.plan) {
    case 'PREMIUM':
      return 'premium';
    case 'ENTERPRISE':
      return 'enterprise';
    default:
      return 'basic';
  }
}
```

### **3. Gestion des Limites**

Créer des fonctions de validation :

```typescript
export function canCreateDocument(user: User): boolean {
  const planInfo = getUserPlanInfo(user);
  return planInfo.maxDocuments === -1 || 
         user.documentCount < planInfo.maxDocuments;
}

export function canAddSignatory(user: User): boolean {
  const planInfo = getUserPlanInfo(user);
  return planInfo.maxSignatories === -1 || 
         user.signatoryCount < planInfo.maxSignatories;
}
```

### **4. Interface de Gestion des Plans**

Créer une page d'administration pour :
- **Afficher** le plan actuel
- **Changer** de plan
- **Voir** les fonctionnalités disponibles
- **Gérer** les paiements

## 🧪 **Tests à Effectuer**

### **Test 1 : Affichage Actuel**
1. **Connectez-vous** à l'application
2. **Allez sur** `/dashboard/settings/profile`
3. **Vérifiez** que le badge affiche "Utilisateur Standard"

### **Test 2 : Préparation Future**
1. **Vérifiez** que `src/lib/user-utils.ts` existe
2. **Vérifiez** que les fonctions sont exportées
3. **Préparez** la migration de base de données

## 🔄 **Migration de Base de Données**

Quand vous serez prêt à implémenter les plans :

```bash
# 1. Modifier le schéma Prisma
# 2. Générer la migration
npx prisma migrate dev --name add-user-plans

# 3. Mettre à jour les fonctions
# 4. Tester avec différents plans
```

## ✅ **Avantages de cette Approche**

1. **Séparation des préoccupations** : Type d'utilisateur ≠ Méthode d'auth
2. **Extensibilité** : Facile d'ajouter de nouveaux plans
3. **Cohérence** : Toutes les fonctions utilisent le même système
4. **Maintenabilité** : Code centralisé et réutilisable

## 🎯 **Prochaines Étapes**

1. **Implémenter** le système de plans dans la base de données
2. **Créer** l'interface de gestion des plans
3. **Ajouter** la validation des limites par plan
4. **Intégrer** un système de paiement
5. **Tester** avec différents scénarios

---

**🎉 Le badge affiche maintenant "Utilisateur Standard" et est prêt pour l'implémentation des plans !** 