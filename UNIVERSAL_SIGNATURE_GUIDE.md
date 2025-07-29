# 🎯 Guide d'Utilisation - Système de Signature Universelle

## 🚀 Vue d'ensemble

Neosign dispose maintenant d'un **système de signature universelle** qui permet à l'utilisateur de choisir le type de signature qu'il souhaite utiliser selon ses besoins.

## 📋 Types de Signature Disponibles

### 🔵 **Signature Simple** ✅ **Disponible**
- **Usage** : Documents internes, notes, brouillons
- **Validation** : Aucune validation requise
- **Valeur légale** : Basique
- **Conformité eIDAS** : N/A

### 🛡️ **SES (Simple Electronic Signature)** ✅ **Disponible**
- **Usage** : Documents officiels, contrats, factures
- **Validation** : Email, SMS ou Password
- **Valeur légale** : Basic (conforme eIDAS)
- **Conformité eIDAS** : Niveau 1

### 🔒 **AES (Advanced Electronic Signature)** 🔄 **Bientôt disponible**
- **Usage** : Documents sensibles, transactions importantes
- **Validation** : Certificats qualifiés + authentification forte
- **Valeur légale** : Advanced
- **Conformité eIDAS** : Niveau 2

### 🏆 **QES (Qualified Electronic Signature)** 🔄 **Bientôt disponible**
- **Usage** : Documents légaux, contrats critiques
- **Validation** : Certificats qualifiés + QSCD
- **Valeur légale** : Qualified (équivalent manuscrit)
- **Conformité eIDAS** : Niveau 3

## 🎨 Interface Utilisateur

### **Bouton Universel de Signature**

```typescript
import UniversalSignatureButton from '@/components/signature/UniversalSignatureButton';

// Utilisation simple
<UniversalSignatureButton
  signatoryName="John Doe"
  signatoryId="123"
  documentId="456"
  onSignatureComplete={(signatureData, type) => {
    console.log('Signature completed:', { signatureData, type });
  }}
/>
```

### **Workflow de Sélection**

1. **Clic sur le bouton** → Ouverture du sélecteur de type
2. **Choix du type** → Interface avec comparaison des options
3. **Configuration** → Options spécifiques selon le type
4. **Signature** → Processus de signature adapté
5. **Validation** → Étapes de validation selon le type
6. **Confirmation** → Badge de conformité et preuve

## 🔧 Implémentation dans votre Interface

### **Remplacement de l'Ancien Système**

```typescript
// AVANT (ancien système)
<SignatureDialog
  open={open}
  onOpenChange={setOpen}
  onConfirm={handleSignature}
  signatoryName={name}
/>

// APRÈS (nouveau système universel)
<UniversalSignatureButton
  signatoryName={name}
  signatoryId={id}
  documentId={docId}
  onSignatureComplete={handleSignatureComplete}
/>
```

### **Gestion des Callbacks**

```typescript
const handleSignatureComplete = (
  signatureData: string | SESSignature, 
  type: SignatureType
) => {
  switch (type) {
    case 'simple':
      // Traitement signature simple
      console.log('Simple signature:', signatureData);
      break;
      
    case 'ses':
      // Traitement signature SES
      console.log('SES signature:', signatureData);
      break;
      
    case 'aes':
      // Traitement signature AES (futur)
      console.log('AES signature:', signatureData);
      break;
      
    case 'qes':
      // Traitement signature QES (futur)
      console.log('QES signature:', signatureData);
      break;
  }
};
```

## 📊 Comparaison des Types

| Type | Validation | Valeur Légale | Conformité | Usage Recommandé |
|------|------------|---------------|------------|-------------------|
| **Simple** | Aucune | Basique | N/A | Documents internes |
| **SES** | Email/SMS/Password | Basic | eIDAS Niveau 1 | Documents officiels |
| **AES** | Certificats + 2FA | Advanced | eIDAS Niveau 2 | Documents sensibles |
| **QES** | Certificats + QSCD | Qualified | eIDAS Niveau 3 | Documents légaux |

## 🎯 Exemples d'Usage

### **Document Interne (Signature Simple)**
```typescript
// Pour les notes, brouillons, documents internes
<UniversalSignatureButton
  signatoryName="Équipe Marketing"
  signatoryId="team-123"
  documentId="memo-456"
  onSignatureComplete={handleInternalSignature}
/>
```

### **Contrat Commercial (SES)**
```typescript
// Pour les contrats, factures, documents officiels
<UniversalSignatureButton
  signatoryName="Client Entreprise"
  signatoryId="client-789"
  documentId="contract-101"
  onSignatureComplete={handleContractSignature}
/>
```

### **Document Légal (QES - Futur)**
```typescript
// Pour les documents légaux critiques
<UniversalSignatureButton
  signatoryName="Notaire"
  signatoryId="notary-001"
  documentId="legal-doc-999"
  onSignatureComplete={handleLegalSignature}
/>
```

## 🔄 Migration Progressive

### **Phase 1 : Intégration** ✅ **Terminé**
- Système universel créé
- SES implémenté
- Interface de sélection opérationnelle

### **Phase 2 : AES** 🔄 **Prochaine étape**
- Certificats qualifiés
- Authentification forte
- Intégration avec autorités de certification

### **Phase 3 : QES** 🔄 **Final**
- Certificats qualifiés + QSCD
- Équivalent signature manuscrite
- Conformité totale eIDAS

## 🛠️ Composants Créés

### **Composants Principaux**
1. **`UniversalSignatureButton`** - Bouton principal universel
2. **`SignatureTypeSelector`** - Interface de sélection
3. **`SESSignatureDialog`** - Dialog SES conforme
4. **`SESComplianceBadge`** - Badge de conformité

### **Services**
1. **`SESSignatureService`** - Gestion SES
2. **API Routes** - Endpoints pour signatures

### **Types**
1. **`SignatureType`** - Types de signature
2. **`SESSignature`** - Structure SES
3. **`SignatureCompliance`** - Conformité eIDAS

## 🚀 Utilisation Immédiate

### **1. Remplacer vos boutons existants**
```typescript
// Remplacer
<Button onClick={() => setShowSignature(true)}>
  Sign Document
</Button>

// Par
<UniversalSignatureButton
  signatoryName={name}
  signatoryId={id}
  documentId={docId}
  onSignatureComplete={handleSignature}
/>
```

### **2. Tester les différents types**
```typescript
// Test complet
<SignatureExample
  signatoryName="Test User"
  signatoryId="test-123"
  documentId="test-doc"
/>
```

### **3. Intégrer dans votre workflow**
```typescript
// Dans votre contexte de signature
const handleSignatureComplete = (data, type) => {
  // Traitement selon le type
  switch (type) {
    case 'simple':
      // Logique signature simple
      break;
    case 'ses':
      // Logique signature SES
      break;
  }
};
```

## 🎉 Résultat

Vous disposez maintenant d'un **système de signature universelle** qui :

- ✅ **Préserve votre système existant** (signature simple)
- ✅ **Ajoute la conformité eIDAS** (SES)
- ✅ **Prépare l'évolution** (AES/QES)
- ✅ **Donne le choix à l'utilisateur**
- ✅ **Interface intuitive et moderne**

**Prêt pour la production !** 🚀 