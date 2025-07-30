# Guide de configuration Twilio pour Neosign

## 🎯 **Vue d'ensemble**

Ce guide vous accompagne dans la configuration de Twilio pour l'envoi de SMS 2FA dans Neosign.

---

## 📋 **Étapes de configuration**

### **1. Créer un compte Twilio**

1. Allez sur [twilio.com](https://www.twilio.com)
2. Créez un compte gratuit
3. Vérifiez votre numéro de téléphone
4. Complétez la vérification d'identité

### **2. Obtenir les informations d'identification**

Une fois connecté à votre console Twilio :

1. **Account SID** : Trouvé dans le dashboard principal
2. **Auth Token** : Cliquez sur "Show" dans la section Auth Token
3. **Numéro de téléphone** : Achetez un numéro dans "Phone Numbers" > "Manage" > "Buy a number"

### **3. Configuration des variables d'environnement**

Ajoutez ces variables à votre fichier `.env` :

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

### **4. Test de configuration**

Lancez votre serveur de développement :

```bash
pnpm dev
```

Testez l'envoi d'un SMS :

```bash
curl -X POST http://localhost:3000/api/user/2fa/phone \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+33123456789"}'
```

---

## 🔧 **Fonctionnalités implémentées**

### ✅ **Envoi de SMS sécurisé**
- Validation du format des numéros de téléphone
- Gestion des erreurs Twilio spécifiques
- Limitation des tentatives (5 par heure)
- Expiration des codes (5 minutes)

### ✅ **Formatage automatique**
- Support des numéros français
- Conversion automatique vers le format E.164
- Gestion des espaces et caractères spéciaux

### ✅ **Mode développement**
- Simulation des SMS si Twilio n'est pas configuré
- Logs détaillés pour le débogage
- Pas d'erreur si les variables d'environnement sont manquantes

---

## 🛡️ **Sécurité**

### **Bonnes pratiques**
- ✅ Variables d'environnement sécurisées
- ✅ Validation des numéros de téléphone
- ✅ Rate limiting (5 SMS par heure par numéro)
- ✅ Expiration automatique des codes
- ✅ Gestion des erreurs robuste

### **Conformité RGPD**
- ✅ Consentement utilisateur requis
- ✅ Suppression automatique des codes expirés
- ✅ Logs d'audit pour les SMS envoyés

---

## 📱 **Format des numéros de téléphone**

### **Numéros français supportés**
- `06 12 34 56 78` → `+33612345678`
- `0612345678` → `+33612345678`
- `+33612345678` → `+33612345678` (inchangé)

### **Validation**
- Format international E.164 requis
- Numéros mobiles uniquement
- Vérification automatique par Twilio

---

## 🧪 **Tests**

### **Test avec curl**
```bash
# Envoyer un code SMS
curl -X POST http://localhost:3000/api/user/2fa/phone \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"0612345678"}'

# Vérifier le code (utilisez le code reçu par SMS)
curl -X POST http://localhost:3000/api/user/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"method":"sms","code":"123456","phoneNumber":"+33612345678"}'
```

### **Test avec l'interface web**
1. Allez sur `/dashboard/settings/security`
2. Cliquez sur "Configurer SMS"
3. Entrez votre numéro de téléphone
4. Recevez le code par SMS
5. Entrez le code pour activer le 2FA SMS

---

## 💰 **Coûts Twilio**

### **Compte gratuit**
- 15$ de crédit gratuit
- ~150 SMS gratuits
- Numéro de téléphone gratuit inclus

### **Tarifs production**
- ~0.0075$ par SMS (France)
- Numéro de téléphone : ~1$/mois
- Pas de frais cachés

---

## 🔧 **Dépannage**

### **Erreur "Invalid phone number"**
- Vérifiez le format du numéro
- Assurez-vous qu'il s'agit d'un numéro mobile
- Testez avec le format international

### **Erreur "Message delivery failed"**
- Vérifiez votre crédit Twilio
- Assurez-vous que le numéro est valide
- Vérifiez les logs du serveur

### **SMS non reçus**
- Vérifiez le dossier spam
- Testez avec un autre numéro
- Vérifiez les logs Twilio dans la console

---

## 🚀 **Production**

### **Recommandations**
1. Utilisez un compte Twilio payant
2. Configurez les webhooks pour le suivi
3. Activez les logs détaillés
4. Surveillez les coûts mensuels

### **Monitoring**
- Logs des SMS envoyés
- Taux de livraison
- Erreurs de livraison
- Coûts par mois

---

## 📞 **Support**

Pour toute question :
1. Consultez la [documentation Twilio](https://www.twilio.com/docs)
2. Vérifiez les logs du serveur
3. Testez avec l'API Twilio directement
4. Contactez l'équipe Neosign

---

**🎉 Votre intégration Twilio est maintenant opérationnelle !** 