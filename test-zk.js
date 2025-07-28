// Script de test pour les APIs ZK
const BASE_URL = 'http://localhost:3000';

async function testZKAPI() {
  console.log('🧪 Test des APIs ZK...\n');

  try {
    // Test 1: Générer un challenge
    console.log('1️⃣ Test de génération de challenge...');
    const challengeResponse = await fetch(`${BASE_URL}/api/auth/zk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_challenge' })
    });

    if (challengeResponse.ok) {
      const challengeData = await challengeResponse.json();
      console.log('✅ Challenge généré:', challengeData.challenge.substring(0, 32) + '...');
    } else {
      console.log('❌ Erreur génération challenge:', challengeResponse.status);
      const errorText = await challengeResponse.text();
      console.log('Erreur:', errorText);
    }

    // Test 2: Test d'enregistrement (simulation)
    console.log('\n2️⃣ Test d\'enregistrement...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/zk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        data: {
          name: 'Test User ZK',
          email: `test-zk-${Date.now()}@example.com`,
          commitment: 'test-commitment-' + Date.now()
        }
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Enregistrement réussi:', registerData);
    } else {
      console.log('❌ Erreur enregistrement:', registerResponse.status);
      const errorText = await registerResponse.text();
      console.log('Erreur:', errorText);
    }

  } catch (error) {
    console.log('❌ Erreur générale:', error.message);
  }
}

// Exécuter le test
testZKAPI(); 