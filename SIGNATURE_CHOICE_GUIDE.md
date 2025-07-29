# 🎯 Guide - Où Choisir le Type de Signature

## 📍 **Emplacement du Choix**

Le choix entre les types de signature se fait **après avoir cliqué sur "Send for Signature"** dans l'interface de préparation de document.

## 🔄 **Workflow Complet**

### **Étape 1 : Préparation du Document**
1. **Upload du document** PDF
2. **Ajout des signataires** dans le panneau de droite
3. **Placement des champs** de signature sur le document
4. **Sélection d'un signataire** pour placer ses champs

### **Étape 2 : Envoi pour Signature**
1. **Clic sur "Send for Signature"** (bouton en bas à droite)
2. **Ouverture automatique** du sélecteur de type de signature
3. **Choix du type** selon les besoins

### **Étape 3 : Sélection du Type**

#### **Interface de Sélection**
```
┌─────────────────────────────────────────┐
│  🛡️ Choisir le Type de Signature      │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ ✏️ Signature    │ │ 🛡️ SES          │ │
│  │    Simple       │ │   Conforme      │ │
│  │                 │ │   eIDAS         │ │
│  │ • Pas de        │ │ • Validation    │ │
│  │   validation    │ │   email/SMS     │ │
│  │ • Usage interne │ │ • Valeur légale │ │
│  └─────────────────┘ └─────────────────┘ │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ 🔒 AES          │ │ 🏆 QES          │ │
│  │   (Bientôt)     │ │   (Bientôt)     │ │
│  │                 │ │                 │ │
│  │ • Certificats   │ │ • Équivalent    │ │
│  │   qualifiés     │ │   manuscrit     │ │
│  │ • Niveau 2      │ │ • Niveau 3      │ │
│  └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────┘
```

## 🎯 **Types Disponibles**

### **🔵 Signature Simple** ✅ **Disponible**
- **Quand l'utiliser** : Documents internes, notes, brouillons
- **Avantages** : Rapide, pas de validation
- **Inconvénients** : Pas de valeur légale

### **🛡️ SES (Simple Electronic Signature)** ✅ **Disponible**
- **Quand l'utiliser** : Documents officiels, contrats, factures
- **Avantages** : Conforme eIDAS, valeur légale
- **Processus** : Validation par email/SMS/password

### **🔒 AES (Advanced Electronic Signature)** 🔄 **Bientôt**
- **Quand l'utiliser** : Documents sensibles, transactions importantes
- **Avantages** : Certificats qualifiés, niveau 2 eIDAS
- **Processus** : Authentification forte + certificats

### **🏆 QES (Qualified Electronic Signature)** 🔄 **Bientôt**
- **Quand l'utiliser** : Documents légaux, contrats critiques
- **Avantages** : Équivalent signature manuscrite
- **Processus** : Certificats + QSCD

## 🎨 **Interface Utilisateur**

### **Dans votre Interface Actuelle**

1. **Préparation** : Vous êtes sur la page d'édition avec le document
2. **Signataires** : Panneau de droite avec la liste des signataires
3. **Champs** : Placement des champs de signature sur le PDF
4. **Envoi** : Bouton "Send for Signature" en bas à droite

### **Après Clic sur "Send for Signature"**

```
┌─────────────────────────────────────────┐
│  🛡️ Choisir le Type de Signature      │
│                                         │
│  Sélectionnez le type de signature     │
│  pour Document Signatories :            │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ ✏️ Signature Simple                │ │
│  │ Signature basique sans validation   │ │
│  │ eIDAS. Idéale pour les documents   │ │
│  │ internes.                          │ │
│  │                                     │ │
│  │ Fonctionnalités :                   │ │
│  │ • Signature manuscrite             │ │
│  │ • Pas de validation requise        │ │
│  │ • Rapide et simple                 │ │
│  │ • Usage interne                    │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🛡️ SES - Simple Electronic        │ │
│  │ Signature conforme eIDAS           │ │
│  │                                     │ │
│  │ Fonctionnalités :                   │ │
│  │ • Conforme eIDAS                   │ │
│  │ • Validation par email/SMS         │ │
│  │ • Horodatage sécurisé              │ │
│  │ • Valeur légale reconnue           │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🔒 AES - Advanced Electronic       │ │
│  │ Signature avancée avec certificats │ │
│  │                                     │ │
│  │ Fonctionnalités :                   │ │
│  │ • Certificats qualifiés            │ │
│  │ • Authentification forte            │ │
│  │ • Intégrité garantie               │ │
│  │ • Valeur légale avancée            │ │
│  │                                     │ │
│  │ ⚠️ Bientôt disponible              │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │ 🏆 QES - Qualified Electronic      │ │
│  │ Signature qualifiée (équivalent    │ │
│  │ manuscrit)                         │ │
│  │                                     │ │
│  │ Fonctionnalités :                   │ │
│  │ • Certificats qualifiés + QSCD     │ │
│  │ • Équivalent signature manuscrite  │ │
│  │ • Valeur légale maximale           │ │
│  │ • Conformité totale eIDAS          │ │
│  │                                     │ │
│  │ ⚠️ Bientôt disponible              │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🚀 **Utilisation Pratique**

### **Scénario 1 : Document Interne**
1. **Préparer** le document avec les signataires
2. **Cliquer** "Send for Signature"
3. **Choisir** "Signature Simple"
4. **Envoyer** directement

### **Scénario 2 : Contrat Commercial**
1. **Préparer** le document avec les signataires
2. **Cliquer** "Send for Signature"
3. **Choisir** "SES - Simple Electronic Signature"
4. **Configurer** la validation (email/SMS)
5. **Envoyer** avec conformité eIDAS

### **Scénario 3 : Document Légal (Futur)**
1. **Préparer** le document avec les signataires
2. **Cliquer** "Send for Signature"
3. **Choisir** "QES - Qualified Electronic Signature"
4. **Configurer** les certificats qualifiés
5. **Envoyer** avec valeur légale maximale

## 📊 **Comparaison des Types**

| Type | Validation | Valeur Légale | Conformité | Usage Recommandé |
|------|------------|---------------|------------|-------------------|
| **Simple** | Aucune | Basique | N/A | Documents internes |
| **SES** | Email/SMS/Password | Basic | eIDAS Niveau 1 | Documents officiels |
| **AES** | Certificats + 2FA | Advanced | eIDAS Niveau 2 | Documents sensibles |
| **QES** | Certificats + QSCD | Qualified | eIDAS Niveau 3 | Documents légaux |

## 🎯 **Avantages du Système**

- ✅ **Choix utilisateur** : L'utilisateur décide selon ses besoins
- ✅ **Flexibilité** : Différents niveaux de sécurité
- ✅ **Conformité** : Respect des standards eIDAS
- ✅ **Évolutivité** : Prêt pour les niveaux supérieurs
- ✅ **Interface intuitive** : Sélection claire et informative

## 🔧 **Intégration Technique**

Le choix se fait dans le composant `SignatoryPanel` :

```typescript
// Dans SignatoryPanel.tsx
const handleSend = async () => {
  // Ouvrir le sélecteur de type de signature
  setShowSignatureTypeSelector(true);
};

const handleSignatureTypeSelected = async (type: SignatureType) => {
  // Traitement selon le type choisi
  console.log('Selected signature type:', type);
  
  // Envoi avec le type de signature
  const res = await fetch(`/api/send-document`, {
    method: "POST",
    body: JSON.stringify({ 
      documentId: currentDocument!.id,
      signatureType: type
    }),
  });
};
```

## 🎉 **Résultat**

L'utilisateur peut maintenant **choisir le type de signature** qui correspond à ses besoins :

- **Document interne** → Signature Simple
- **Contrat commercial** → SES conforme eIDAS
- **Document sensible** → AES (futur)
- **Document légal** → QES (futur)

**Le choix se fait exactement où vous l'attendiez : après avoir cliqué sur "Send for Signature" !** 🎯 