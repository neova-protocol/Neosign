#!/usr/bin/env node

/**
 * Script de test pour l'intégration Twilio SMS
 * 
 * Usage:
 * node test-twilio-sms.js
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testTwilioSMS() {
  console.log('🧪 Test de l\'intégration Twilio SMS\n');

  // Test 1: Vérifier que le serveur répond
  console.log('1️⃣ Test de connectivité du serveur...');
  try {
    const response = await fetch(`${BASE_URL}/api/user/2fa/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '0612345678' })
    });

    if (response.status === 401) {
      console.log('✅ Serveur accessible (401 Unauthorized attendu - pas de session)');
    } else {
      console.log(`⚠️  Réponse inattendue: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Serveur inaccessible:', error.message);
    console.log('💡 Assurez-vous que le serveur est démarré avec: pnpm dev');
    return;
  }

  // Test 2: Vérifier la configuration Twilio
  console.log('\n2️⃣ Test de la configuration Twilio...');
  
  const twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  };

  const missingConfig = Object.entries(twilioConfig)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingConfig.length > 0) {
    console.log('⚠️  Variables d\'environnement Twilio manquantes:');
    missingConfig.forEach(key => console.log(`   - ${key}`));
    console.log('\n💡 Ajoutez ces variables à votre fichier .env:');
    console.log('TWILIO_ACCOUNT_SID=your-account-sid');
    console.log('TWILIO_AUTH_TOKEN=your-auth-token');
    console.log('TWILIO_PHONE_NUMBER=+1234567890');
    console.log('\n📖 Consultez TWILIO_SETUP_GUIDE.md pour la configuration');
  } else {
    console.log('✅ Configuration Twilio détectée');
  }

  // Test 3: Vérifier les dépendances
  console.log('\n3️⃣ Test des dépendances...');
  
  try {
    const twilio = require('twilio');
    console.log('✅ Twilio package installé');
  } catch (error) {
    console.log('❌ Package Twilio manquant');
    console.log('💡 Installez avec: pnpm add twilio');
  }

  // Test 4: Vérifier les fichiers d'implémentation
  console.log('\n4️⃣ Test des fichiers d\'implémentation...');
  
  const fs = require('fs');
  const filesToCheck = [
    'src/lib/twilio.ts',
    'src/lib/sms-codes-db.ts',
    'src/app/api/user/2fa/phone/route.ts',
    'src/app/api/user/2fa/verify/route.ts'
  ];

  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} manquant`);
    }
  });

  // Test 5: Instructions de test manuel
  console.log('\n5️⃣ Instructions de test manuel...');
  console.log('\n📱 Pour tester l\'intégration SMS complète:');
  console.log('1. Démarrez le serveur: pnpm dev');
  console.log('2. Connectez-vous à l\'application');
  console.log('3. Allez sur: /dashboard/settings/security');
  console.log('4. Entrez un numéro de téléphone français');
  console.log('5. Cliquez sur "Vérifier"');
  console.log('6. Entrez le code reçu par SMS');
  console.log('7. Activez le 2FA SMS');

  console.log('\n🔧 Pour tester en mode simulation (sans Twilio):');
  console.log('- Laissez les variables d\'environnement vides');
  console.log('- Les SMS seront simulés dans les logs du serveur');

  console.log('\n📊 Logs à surveiller:');
  console.log('- [SIMULATION] SMS to +33612345678: Votre code de vérification Neosign: 123456');
  console.log('- SMS sent successfully to +33612345678, SID: sim_1234567890');

  console.log('\n🎉 Test terminé !');
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

// Exécuter le test
testTwilioSMS().catch(console.error); 