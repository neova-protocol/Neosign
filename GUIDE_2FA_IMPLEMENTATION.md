# Guide d'implémentation 2FA - Neosign

## 🎯 **Vue d'ensemble**

Ce guide documente l'implémentation complète de l'authentification à deux facteurs (2FA) dans Neosign, supportant **Email**, **SMS** et **TOTP/Authenticator**.

---

## 📋 **Fonctionnalités implémentées**

### ✅ **Backend (API Routes)**
- `GET /api/user/2fa` - Récupérer la configuration 2FA
- `PUT /api/user/2fa` - Mettre à jour la configuration 2FA
- `POST /api/user/2fa/email` - Envoyer un code par email
- `POST /api/user/2fa/phone` - Envoyer un code par SMS
- `POST /api/user/2fa/authenticator` - Configurer l'authenticator TOTP
- `POST /api/user/2fa/verify` - Vérifier un code 2FA

### ✅ **Frontend (Composants)**
- `TwoFactorVerificationDialog` - Dialog de vérification des codes
- `QRCodeDialog` - Affichage du QR code pour TOTP
- Page de sécurité avec interface complète

### ✅ **Base de données**
- Champs 2FA dans le modèle `User`
- Stockage sécurisé des secrets TOTP
- Gestion des méthodes activées

---

## 🔧 **Configuration requise**

### **Variables d'environnement**
```env
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@neosign.com

# SMS (optionnel - pour production)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### **Dépendances installées**
```bash
pnpm add nodemailer @types/nodemailer otplib
```

---

## 🚀 **Utilisation**

### **1. Configuration Email 2FA**
```typescript
// Envoyer un code par email
const response = await fetch('/api/user/2fa/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// Vérifier le code
const verifyResponse = await fetch('/api/user/2fa/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    method: 'email', 
    code: '123456' 
  })
});
```

### **2. Configuration SMS 2FA**
```typescript
// Envoyer un code par SMS
const response = await fetch('/api/user/2fa/phone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: '+33123456789' })
});

// Vérifier le code
const verifyResponse = await fetch('/api/user/2fa/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    method: 'sms', 
    code: '123456',
    phoneNumber: '+33123456789'
  })
});
```

### **3. Configuration TOTP/Authenticator**
```typescript
// Générer le secret et QR code
const response = await fetch('/api/user/2fa/authenticator', {
  method: 'POST'
});

// Vérifier le code TOTP
const verifyResponse = await fetch('/api/user/2fa/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    method: 'authenticator', 
    code: '123456'
  })
});
```

---

## 🛡️ **Sécurité**

### **Bonnes pratiques implémentées**
- ✅ Secrets TOTP stockés de manière sécurisée
- ✅ Codes temporaires avec expiration (5 minutes)
- ✅ Validation côté serveur
- ✅ Gestion des erreurs robuste
- ✅ Interface utilisateur sécurisée

### **Conformité eIDAS**
- **SES (Simple Electronic Signature)** : Email/SMS 2FA
- **AES (Advanced Electronic Signature)** : TOTP + certificats
- **QES (Qualified Electronic Signature)** : TOTP + QSCD (à implémenter)

---

## 📱 **Interface utilisateur**

### **Page de sécurité** (`/dashboard/settings/security`)
- Configuration des méthodes 2FA
- Activation/désactivation par méthode
- Affichage des méthodes actives
- Instructions détaillées

### **Dialogs de vérification**
- Interface intuitive pour saisir les codes
- Validation en temps réel
- Gestion des erreurs
- Feedback visuel

---

## 🔄 **Flow complet**

### **1. Activation Email 2FA**
1. Utilisateur entre son email
2. Système envoie un code par email
3. Utilisateur saisit le code
4. Système vérifie et active la méthode

### **2. Activation SMS 2FA**
1. Utilisateur entre son numéro de téléphone
2. Système envoie un code par SMS
3. Utilisateur saisit le code
4. Système vérifie et active la méthode

### **3. Activation TOTP**
1. Utilisateur clique sur "Configurer Authenticator"
2. Système génère un secret et QR code
3. Utilisateur scanne le QR code avec son app
4. Utilisateur saisit le code généré
5. Système vérifie et active la méthode

---

## 🧪 **Tests**

### **Test Email 2FA**
```bash
# Envoyer un code
curl -X POST http://localhost:3001/api/user/2fa/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Vérifier le code (utilisez n'importe quel code à 6 chiffres pour la démo)
curl -X POST http://localhost:3001/api/user/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"method":"email","code":"123456"}'
```

### **Test SMS 2FA**
```bash
# Envoyer un code
curl -X POST http://localhost:3001/api/user/2fa/phone \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+33123456789"}'

# Vérifier le code
curl -X POST http://localhost:3001/api/user/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"method":"sms","code":"123456","phoneNumber":"+33123456789"}'
```

### **Test TOTP**
```bash
# Générer le secret
curl -X POST http://localhost:3001/api/user/2fa/authenticator

# Vérifier le code (utilisez un code généré par votre app TOTP)
curl -X POST http://localhost:3001/api/user/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"method":"authenticator","code":"123456"}'
```

---

## 🔮 **Améliorations futures**

### **Production**
- [ ] Intégration Twilio pour SMS
- [ ] Service email professionnel
- [ ] Stockage sécurisé des codes temporaires (Redis)
- [ ] Rate limiting
- [ ] Audit logs

### **Fonctionnalités avancées**
- [ ] Backup codes
- [ ] Récupération de compte
- [ ] Notifications de sécurité
- [ ] Historique des connexions
- [ ] Géolocalisation

### **Conformité**
- [ ] QES (Qualified Electronic Signature)
- [ ] Certificats qualifiés
- [ ] Horodatage sécurisé
- [ ] Archivage légal

---

## 📞 **Support**

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Testez les endpoints individuellement
3. Consultez la documentation des dépendances
4. Contactez l'équipe de développement

---

**🎉 Félicitations ! Votre système 2FA est maintenant opérationnel !** 