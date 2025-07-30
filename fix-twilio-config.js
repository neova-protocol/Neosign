#!/usr/bin/env node

/**
 * Script pour corriger la configuration Twilio
 */

const fs = require('fs');

console.log('🔧 Correction de la configuration Twilio\n');

// Lire le fichier .env.local actuel
const envPath = '.env.local';
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Fichier .env.local trouvé');
} catch (error) {
  console.log('❌ Fichier .env.local non trouvé');
  process.exit(1);
}

// Extraire les valeurs actuelles
const accountSidMatch = envContent.match(/TWILIO_ACCOUNT_SID=([^\n]+)/);
const authTokenMatch = envContent.match(/TWILIO_AUTH_TOKEN=([^\n]+)/);
const phoneNumberMatch = envContent.match(/TWILIO_PHONE_NUMBER=([^\n]+)/);

console.log('\n📋 Configuration actuelle:');
console.log(`Account SID: ${accountSidMatch ? accountSidMatch[1] : 'Non trouvé'}`);
console.log(`Auth Token: ${authTokenMatch ? authTokenMatch[1] : 'Non trouvé'}`);
console.log(`Phone Number: ${phoneNumberMatch ? phoneNumberMatch[1] : 'Non trouvé'}`);

// Vérifier les formats
const accountSid = accountSidMatch ? accountSidMatch[1] : '';
const authToken = authTokenMatch ? authTokenMatch[1] : '';

console.log('\n🔍 Analyse des formats:');

if (accountSid.startsWith('VA')) {
  console.log('❌ Account SID incorrect: commence par "VA" au lieu de "AC"');
  console.log('💡 Vous avez probablement utilisé un Auth Token au lieu de l\'Account SID');
} else if (accountSid.startsWith('AC')) {
  console.log('✅ Account SID correct: commence par "AC"');
} else {
  console.log('⚠️  Account SID: format inconnu');
}

if (authToken.startsWith('VA')) {
  console.log('✅ Auth Token correct: commence par "VA"');
} else if (authToken.startsWith('AC')) {
  console.log('❌ Auth Token incorrect: commence par "AC"');
  console.log('💡 Vous avez probablement utilisé l\'Account SID au lieu de l\'Auth Token');
} else {
  console.log('⚠️  Auth Token: format inconnu');
}

console.log('\n📖 Instructions de correction:');
console.log('1. Allez sur https://console.twilio.com');
console.log('2. Dans le dashboard, trouvez:');
console.log('   - Account SID (commence par "AC")');
console.log('   - Auth Token (commence par "VA")');
console.log('3. Mettez à jour votre fichier .env.local:');
console.log('');
console.log('TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef');
console.log('TWILIO_AUTH_TOKEN=VA10dc1f1006de30da854eb9602f513d87');
console.log('TWILIO_PHONE_NUMBER=+13865187716');
console.log('');

// Proposer une correction automatique si les valeurs sont inversées
if (accountSid.startsWith('VA') && authToken.startsWith('AC')) {
  console.log('🔄 Correction automatique proposée:');
  console.log('Il semble que Account SID et Auth Token soient inversés.');
  
  const correctedContent = envContent
    .replace(/TWILIO_ACCOUNT_SID=([^\n]+)/, `TWILIO_ACCOUNT_SID=${authToken}`)
    .replace(/TWILIO_AUTH_TOKEN=([^\n]+)/, `TWILIO_AUTH_TOKEN=${accountSid}`);
  
  console.log('Voulez-vous appliquer cette correction ? (y/N)');
  
  // En mode non-interactif, on affiche juste la correction
  console.log('\n📝 Contenu corrigé:');
  console.log(correctedContent);
  
  console.log('\n💡 Pour appliquer la correction:');
  console.log(`echo '${correctedContent}' > .env.local`);
} else {
  console.log('⚠️  Correction manuelle requise');
  console.log('Vérifiez vos identifiants Twilio dans la console.');
}

console.log('\n🎯 Après correction, testez avec:');
console.log('node test-twilio-sms.js'); 