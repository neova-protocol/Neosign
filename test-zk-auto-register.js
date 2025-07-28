const crypto = require('crypto');

// Simuler la génération d'une identité ZK
function generateMockZKIdentity() {
  const commitment = crypto.randomBytes(32).toString('hex');
  return {
    commitment,
    trapdoor: crypto.randomBytes(32).toString('hex'),
    nullifier: crypto.randomBytes(32).toString('hex')
  };
}

// Test du flux d'enregistrement automatique
async function testAutoRegistration() {
  console.log('🧪 Test d\'enregistrement automatique ZK');
  
  // Simuler une nouvelle identité ZK
  const identity = generateMockZKIdentity();
  console.log('📝 Identité ZK générée:', {
    commitment: identity.commitment.substring(0, 16) + '...',
    trapdoor: identity.trapdoor.substring(0, 16) + '...',
    nullifier: identity.nullifier.substring(0, 16) + '...'
  });

  // Test 1: Tentative d'authentification avec un utilisateur inexistant
  console.log('\n🔍 Test 1: Authentification avec utilisateur inexistant');
  try {
    const response = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_proof',
        data: {
          commitment: identity.commitment,
          proof: 'mock-proof',
          challenge: 'mock-challenge'
        }
      })
    });

    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📄 Réponse:', data);

    if (response.status === 404) {
      console.log('✅ Utilisateur non trouvé - prêt pour l\'enregistrement automatique');
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }

  // Test 2: Enregistrement automatique
  console.log('\n📝 Test 2: Enregistrement automatique');
  try {
    const uniqueId = identity.commitment.substring(0, 8);
    const userName = `Utilisateur ZK ${uniqueId}`;
    const userEmail = `zk-${uniqueId}@neosign.app`;

    const response = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        data: {
          name: userName,
          email: userEmail,
          commitment: identity.commitment
        }
      })
    });

    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📄 Réponse:', data);

    if (response.ok) {
      console.log('✅ Utilisateur créé avec succès');
      console.log('👤 Nom:', data.user.name);
      console.log('📧 Email:', data.user.email);
      console.log('🆔 ID:', data.user.id);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }

  // Test 3: Vérification que l'utilisateur existe maintenant
  console.log('\n🔍 Test 3: Vérification de l\'existence de l\'utilisateur');
  try {
    const response = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_proof',
        data: {
          commitment: identity.commitment,
          proof: 'mock-proof',
          challenge: 'mock-challenge'
        }
      })
    });

    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📄 Réponse:', data);

    if (response.ok) {
      console.log('✅ Utilisateur trouvé - authentification réussie');
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Instructions d'utilisation
console.log('🚀 Test d\'enregistrement automatique ZK');
console.log('📋 Instructions:');
console.log('1. Assurez-vous que le serveur Next.js est démarré (npm run dev)');
console.log('2. Ce script testera le flux d\'enregistrement automatique');
console.log('3. Il simule une nouvelle identité ZK et teste l\'enregistrement');
console.log('');

// Exécuter le test
testAutoRegistration().catch(console.error); 