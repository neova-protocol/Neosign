# Logique des statistiques du dashboard "Your overview"

## 🎯 **Vue d'ensemble**

La logique des statistiques du dashboard a été corrigée pour correspondre aux spécifications métier.

---

## 📊 **Nouvelles règles de calcul**

### **1. Completed Signatures**
```javascript
// Documents signés par tout le monde
const completed = docs.filter((doc: Document) => 
  doc.status === "completed"
).length;
```
- **Critères** : `status === "completed"`
- **Description** : Documents où tous les signataires ont signé

### **2. In Progress Signatures**
```javascript
// Je n'ai pas à signer et j'attends la signature de quelqu'un
const inProgress = docs.filter((doc: Document) => {
  const isCreator = doc.creatorId === userId;
  const hasNoSignatureRequired = !doc.signatories.some(s => 
    s.email === userEmail && s.status === "pending"
  );
  const isSentNotCancelled = doc.status === "sent" && doc.status !== "cancelled";
  
  return isCreator && hasNoSignatureRequired && isSentNotCancelled;
}).length;
```
- **Critères** :
  - Je suis le créateur du document (`creatorId === userId`)
  - Je n'ai pas à signer (pas dans les signataires ou déjà signé)
  - Le document est envoyé (`status === "sent"`)
  - Le document n'est pas annulé (`status !== "cancelled"`)

### **3. Signing Invitation**
```javascript
// J'ai à signer un document
const signingInvitations = docs.filter((doc: Document) => {
  return doc.signatories.some(s => 
    s.email === userEmail && s.status === "pending"
  );
}).length;
```
- **Critères** :
  - Je suis dans les signataires du document
  - Mon statut est "pending" (j'ai encore à signer)

### **4. Drafts Signatures**
```javascript
// Mes brouillons
const drafts = docs.filter((doc: Document) => 
  doc.status === "draft" && doc.creatorId === userId
).length;
```
- **Critères** :
  - Je suis le créateur du document (`creatorId === userId`)
  - Le document est en brouillon (`status === "draft"`)

---

## 🔄 **Gestion des documents annulés**

### **Règle spéciale pour "cancelled"**
- Les documents avec `status === "cancelled"` sont **exclus** de "In Progress"
- Ils ne comptent dans aucune catégorie
- Cela permet de ne pas fausser les statistiques

---

## 📋 **Exemples de cas d'usage**

### **Scénario 1 : Document envoyé par moi**
- **Document** : Contrat envoyé à 3 signataires
- **Mon rôle** : Créateur + Signataire
- **Résultat** :
  - "Signing Invitation" : +1 (j'ai à signer)
  - "In Progress" : +0 (je suis signataire, donc pas "In Progress")

### **Scénario 2 : Document reçu par moi**
- **Document** : Contrat reçu d'un autre utilisateur
- **Mon rôle** : Signataire uniquement
- **Résultat** :
  - "Signing Invitation" : +1 (j'ai à signer)

### **Scénario 3 : Document envoyé par moi, je ne signe pas**
- **Document** : Contrat envoyé à 2 autres signataires
- **Mon rôle** : Créateur uniquement
- **Résultat** :
  - "In Progress" : +1 (j'attends les autres)

### **Scénario 4 : Document annulé**
- **Document** : Contrat envoyé puis annulé
- **Résultat** :
  - Aucune catégorie : Le document est exclu des statistiques

---

## 🧪 **Test de la logique**

### **Script de test**
```bash
node test-dashboard-stats.js
```

### **Test manuel**
1. Connectez-vous à l'application
2. Allez sur le dashboard
3. Vérifiez que les statistiques correspondent à la logique

---

## 🔧 **Fichiers modifiés**

### **Code principal**
- `src/app/dashboard/page.tsx` - Logique de calcul des statistiques

### **Tests**
- `test-dashboard-stats.js` - Script de test des statistiques

---

## ✅ **Validation**

### **Critères de validation**
- ✅ **Completed** : Seulement les documents `status === "completed"`
- ✅ **In Progress** : Mes documents envoyés où je n'ai pas à signer
- ✅ **Signing Invitation** : Documents où j'ai à signer
- ✅ **Drafts** : Mes brouillons uniquement
- ✅ **Cancelled** : Exclus de toutes les catégories

### **Logs de débogage**
Les calculs sont maintenant plus précis et reflètent exactement l'état des documents selon le rôle de l'utilisateur.

---

**🎉 La logique des statistiques du dashboard est maintenant conforme aux spécifications métier !** 