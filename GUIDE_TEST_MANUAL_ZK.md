# Guide de Test Manuel - Auto-Registration ZK

## 🎯 Objectif
Vérifier que quand un nouvel utilisateur crée une identité ZK, un nouveau compte est automatiquement créé.

## 🧪 Test Étape par Étape

### Préparation
1. **Ouvrir une fenêtre de navigation privée** (ou un autre navigateur)
2. **Aller sur** `http://localhost:3000/zk-login`
3. **Ouvrir les DevTools** (F12) pour voir les logs

### Test 1 : Nouvel Utilisateur ZK

#### Étape 1 : Créer une Nouvelle Identité
1. **Cliquer sur** "Créer une nouvelle identité ZK"
2. **Attendre** que l'identité soit générée
3. **Vérifier** que vous êtes sur l'écran "Identité ZK Active"
4. **Noter** le commitment affiché (premiers caractères)

#### Étape 2 : S'Authentifier
1. **Cliquer sur** "S'authentifier avec ZK"
2. **Observer** les logs dans la console du navigateur
3. **Attendre** la redirection vers le dashboard

#### Étape 3 : Vérifier le Compte
1. **Aller sur** `/dashboard/settings/profile`
2. **Vérifier** :
   - Le nom d'utilisateur (devrait être "Utilisateur ZK [ID]")
   - L'email (devrait être "zk-[ID]@neosign.app")
   - La section "Ajouter une Authentification par Email" devrait apparaître

### Test 2 : Vérifier les Logs du Serveur

Dans le terminal où `npm run dev` est lancé, vous devriez voir :

```
Vérification de preuve ZK pour commitment: [commitment]...
Preuve ZK valide, recherche de l'utilisateur...
Utilisateur non trouvé, retour 404 pour déclencher l'auto-registration
Tentative d'enregistrement pour: zk-[ID]@neosign.app
Création d'un nouvel utilisateur: zk-[ID]@neosign.app
Nouvel utilisateur créé avec succès: [ID]
```

### Test 3 : Vérifier la Base de Données

```bash
# Vérifier les utilisateurs récents
node check-zk-users.js
```

Vous devriez voir le nouvel utilisateur dans la liste.

## 🔍 Debugging

### Si l'auto-registration ne se déclenche pas :

1. **Vérifier les logs du navigateur** :
   - Ouvrir DevTools → Console
   - Chercher les messages d'erreur

2. **Vérifier les logs du serveur** :
   - Regarder le terminal où `npm run dev` est lancé
   - Chercher les messages de debug

3. **Vérifier la base de données** :
   ```bash
   npx prisma studio
   ```

### Si l'utilisateur se connecte sur un profil existant :

1. **Vérifier le localStorage** :
   - DevTools → Application → Local Storage
   - Supprimer les données ZK
   - Recharger la page

2. **Vérifier les identités sauvegardées** :
   - Le navigateur peut avoir sauvegardé une ancienne identité
   - Utiliser une fenêtre de navigation privée

## 📊 Résultats Attendus

### ✅ Comportement Correct
- Nouvelle identité ZK → Nouveau compte créé
- Commitment unique → Utilisateur unique
- Redirection vers dashboard → Session créée
- Page de profil → Informations du nouveau compte

### ❌ Problèmes à Corriger
- Connexion sur profil existant
- Erreurs dans les logs
- Pas de création de compte
- Redirection échouée

## 🚀 Test de Régression

### Test avec Utilisateur Existant
1. **Créer un utilisateur ZK** (Test 1)
2. **Se déconnecter**
3. **Charger l'identité existante**
4. **Se reconnecter** - devrait se connecter sur le même compte

### Test avec Nouvelle Machine
1. **Exporter l'identité ZK** via les paramètres
2. **Importer sur une autre machine**
3. **Se connecter** - devrait se connecter sur le même compte

## 🔧 Commandes Utiles

```bash
# Vérifier les utilisateurs
node check-zk-users.js

# Voir les logs du serveur
npm run dev

# Ouvrir Prisma Studio
npx prisma studio

# Tester l'API
curl -X POST http://localhost:3000/api/auth/zk \
  -H "Content-Type: application/json" \
  -d '{"action":"generate_challenge"}'
```

## 📝 Notes Importantes

- **Chaque nouvelle identité ZK** doit créer un nouveau compte
- **Les commitments ZK** doivent être uniques
- **L'auto-registration** doit se déclencher automatiquement
- **NextAuth** doit créer une session valide
- **La redirection** doit fonctionner correctement

## 🐛 Problèmes Courants

1. **Commitment dupliqué** : Vérifier l'unicité des identités ZK
2. **Session NextAuth échouée** : Vérifier les logs du provider ZK
3. **Redirection échouée** : Vérifier les logs de la page zk-login
4. **Base de données** : Vérifier la synchronisation Prisma 