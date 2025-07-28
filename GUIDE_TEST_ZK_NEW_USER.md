# Guide de Test - Nouvel Utilisateur ZK

## 🎯 Problème à Résoudre

**Symptôme :** Quand un nouvel utilisateur se connecte avec ZK sur une nouvelle machine, il se connecte sur un profil existant au lieu de créer un nouveau compte.

## 🧪 Test Manuel

### Étape 1 : Préparation
1. **Ouvrir une fenêtre de navigation privée** (ou un autre navigateur)
2. **Aller sur** `http://localhost:3000/zk-login`

### Étape 2 : Créer une Nouvelle Identité ZK
1. **Cliquer sur** "Créer une nouvelle identité ZK"
2. **Attendre** que l'identité soit générée
3. **Vérifier** que vous êtes sur l'écran "Identité ZK Active"

### Étape 3 : Tenter l'Authentification
1. **Cliquer sur** "S'authentifier avec ZK"
2. **Observer** ce qui se passe :
   - ✅ **Comportement attendu** : Création automatique d'un nouveau compte
   - ❌ **Problème actuel** : Connexion sur un profil existant

### Étape 4 : Vérification
1. **Aller sur** `/dashboard/settings/profile`
2. **Vérifier** :
   - Le nom d'utilisateur (devrait être "Utilisateur ZK [ID]")
   - L'email (devrait être "zk-[ID]@neosign.app")
   - La section "Ajouter une Authentification par Email" devrait apparaître

## 🔍 Debugging

### Vérifier les Logs du Serveur
Dans le terminal où `npm run dev` est lancé, vous devriez voir :

```
Vérification de preuve ZK pour commitment: [commitment]...
Preuve ZK valide, recherche de l'utilisateur...
Utilisateur non trouvé, retour 404 pour déclencher l'auto-registration
```

### Vérifier la Base de Données
Utilisez Prisma Studio pour vérifier les utilisateurs :

```bash
npx prisma studio
```

Puis regardez la table `User` pour voir :
- Les nouveaux utilisateurs créés
- Leurs commitments ZK
- Leurs emails

## 🐛 Problèmes Possibles

### 1. L'auto-registration ne se déclenche pas
**Symptôme :** L'utilisateur se connecte sur un profil existant
**Cause possible :** Le commitment ZK généré correspond à un utilisateur existant
**Solution :** Vérifier que chaque nouvelle identité ZK est unique

### 2. L'auto-registration échoue
**Symptôme :** Erreur lors de la création du compte
**Cause possible :** Problème dans l'API `/api/auth/zk`
**Solution :** Vérifier les logs du serveur

### 3. L'utilisateur n'est pas créé
**Symptôme :** 404 persistant après auto-registration
**Cause possible :** Problème dans la base de données
**Solution :** Vérifier les logs Prisma

## 🔧 Test de Régression

### Test avec un Utilisateur Existant
1. **Créer un utilisateur ZK** sur une machine
2. **Exporter l'identité ZK** via les paramètres
3. **Importer l'identité** sur une autre machine
4. **Se connecter** - devrait se connecter sur le même compte

### Test avec un Nouvel Utilisateur
1. **Créer une nouvelle identité ZK** sur une machine
2. **Se connecter** - devrait créer un nouveau compte
3. **Vérifier** que c'est bien un nouveau compte

## 📊 Résultats Attendus

### ✅ Comportement Correct
- Nouvel utilisateur ZK → Nouveau compte créé
- Utilisateur ZK existant → Connexion sur le compte existant
- Double authentification → Possibilité d'ajouter email/mot de passe

### ❌ Problèmes à Corriger
- Nouvel utilisateur ZK → Connexion sur profil existant
- Erreurs lors de l'auto-registration
- Utilisateurs dupliqués dans la base

## 🚀 Solutions

### Si le problème persiste :

1. **Vérifier l'unicité des commitments ZK**
2. **Ajouter plus de logs** dans l'API
3. **Tester avec des données de test** isolées
4. **Vérifier la synchronisation** de la base de données

### Commandes utiles :

```bash
# Vérifier les utilisateurs dans la base
npx prisma studio

# Voir les logs du serveur
npm run dev

# Tester l'API directement
curl -X POST http://localhost:3000/api/auth/zk \
  -H "Content-Type: application/json" \
  -d '{"action":"generate_challenge"}'
``` 