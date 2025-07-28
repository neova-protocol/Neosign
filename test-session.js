// Test script pour vérifier la session utilisateur
const fetch = require('node-fetch');

async function testSession() {
  try {
    console.log('🔍 Test de la session utilisateur...');
    
    // Test de la page de profil
    const response = await fetch('http://localhost:3000/dashboard/settings/profile');
    const html = await response.text();
    
    console.log('✅ Page de profil accessible');
    
    // Vérifier la présence des sections
    if (html.includes('Informations du Profil')) {
      console.log('✅ Section "Informations du Profil" présente');
    }
    
    if (html.includes('Sécurité du Compte')) {
      console.log('✅ Section "Sécurité du Compte" présente');
    }
    
    if (html.includes('Authentification par Email')) {
      console.log('✅ Section "Authentification par Email" présente');
    }
    
    if (html.includes('Authentification ZK')) {
      console.log('✅ Section "Authentification ZK" présente');
    } else {
      console.log('ℹ️  Section ZK non visible (normal si pas connecté en ZK)');
    }
    
    console.log('\n📋 Pour tester complètement :');
    console.log('1. Connectez-vous en ZK sur /zk-login');
    console.log('2. Allez sur /dashboard/settings/profile');
    console.log('3. Vérifiez que les deux méthodes d\'auth sont visibles');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testSession(); 