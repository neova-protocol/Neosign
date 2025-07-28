# Test de l'Ajout d'Email et Mot de Passe pour Utilisateurs ZK

## 🎯 Fonctionnalité Implémentée

**Objectif :** Permettre aux utilisateurs ZK d'ajouter un email et un mot de passe à leur compte pour une double authentification.

## 🔧 Composants Créés

### 1. API `/api/user/add-email-password`
- **Fichier :** `src/app/api/user/add-email-password/route.ts`
- **Fonction :** Permet aux utilisateurs ZK d'ajouter un email et un mot de passe
- **Sécurité :** Vérifie que l'utilisateur a un commitment ZK et que l'email n'est pas déjà utilisé

### 2. Composant React `AddEmailPasswordForm`
- **Fichier :** `src/components/settings/AddEmailPasswordForm.tsx`
- **Fonction :** Interface utilisateur pour ajouter email/mot de passe
- **Validation :** Vérifie la correspondance des mots de passe et la longueur minimale

### 3. Intégration dans la Page de Profil
- **Fichier :** `src/app/dashboard/settings/profile/page.tsx`
- **Fonction :** Affiche le formulaire pour les utilisateurs ZK uniquement

## 🧪 Comment Tester

### Test Manuel

1. **Se connecter avec un utilisateur ZK** :
   - Aller sur `/zk-login`
   - Créer une nouvelle identité ZK
   - Se connecter

2. **Accéder à la page de profil** :
   - Aller sur `/dashboard/settings/profile`
   - Vérifier que la section "Ajouter une Authentification par Email" apparaît

3. **Tester l'ajout d'email/mot de passe** :
   - Remplir le formulaire avec :
     - Email : `test@example.com`
     - Mot de passe : `password123`
     - Confirmation : `password123`
   - Cliquer sur "Ajouter l'authentification par email"

4. **Vérifier le résultat** :
   - La page devrait se recharger
   - L'utilisateur devrait maintenant avoir un email et mot de passe
   - La section devrait afficher "Email et mot de passe configurés"

### Test de Connexion

1. **Se déconnecter** :
   - Cliquer sur le bouton de déconnexion

2. **Se reconnecter avec email** :
   - Aller sur `/login`
   - Utiliser l'email et mot de passe ajoutés
   - Vérifier que la connexion fonctionne

3. **Se reconnecter avec ZK** :
   - Aller sur `/zk-login`
   - Charger l'identité ZK existante
   - Vérifier que la connexion fonctionne aussi

## 📊 Flux de Fonctionnement

### Avant l'Ajout
```
Utilisateur ZK → Authentification ZK uniquement
```

### Après l'Ajout
```
Utilisateur ZK → Double authentification :
├── Authentification ZK (continue de fonctionner)
└── Authentification Email/Mot de passe (nouveau)
```

## 🔍 Vérifications dans la Base de Données

Après un test réussi, vérifiez dans la base de données :

```sql
SELECT id, name, email, hashedPassword, zkCommitment 
FROM User 
WHERE email = 'test@example.com';
```

L'utilisateur devrait avoir :
- ✅ `email` : Le nouvel email
- ✅ `hashedPassword` : Le mot de passe hashé
- ✅ `zkCommitment` : Le commitment ZK original

## 🚀 Avantages de cette Fonctionnalité

### Pour l'Utilisateur
- **Flexibilité** : Peut choisir entre ZK et email/mot de passe
- **Récupération** : Peut récupérer son compte même s'il perd son identité ZK
- **Compatibilité** : Fonctionne sur tous les navigateurs
- **Sécurité** : Double authentification disponible

### Pour l'Application
- **Adoption** : Facilite l'adoption de ZK en gardant une option traditionnelle
- **Migration** : Permet une migration progressive vers ZK
- **Fiabilité** : Réduit les risques de perte d'accès

## 🐛 Dépannage

### Si le formulaire n'apparaît pas
1. Vérifier que l'utilisateur a un `zkCommitment`
2. Vérifier que l'utilisateur n'a pas déjà un `hashedPassword`

### Si l'ajout échoue
1. Vérifier les logs du serveur
2. Vérifier que l'email n'est pas déjà utilisé
3. Vérifier que le mot de passe fait au moins 6 caractères

### Si la connexion par email ne fonctionne pas
1. Vérifier que l'utilisateur a bien un `hashedPassword` dans la base
2. Vérifier que le mot de passe est correct
3. Tester avec l'authentification ZK pour confirmer que le compte fonctionne

## 📝 Notes Importantes

- **Sécurité** : Le mot de passe est hashé avec bcrypt (12 rounds)
- **Unicité** : Un email ne peut être utilisé que par un seul compte
- **Rétrocompatibilité** : L'authentification ZK continue de fonctionner
- **Interface** : Le formulaire n'apparaît que pour les utilisateurs ZK

## 🎯 Prochaines Étapes

1. **Tester en production** avec de vrais utilisateurs
2. **Ajouter des notifications** pour informer l'utilisateur du succès
3. **Améliorer l'interface** avec des animations et transitions
4. **Ajouter la possibilité** de supprimer l'authentification par email 