const fetch = require('node-fetch');

async function testZKAutoRegistration() {
  console.log('🧪 Test de l\'auto-registration ZK...\n');

  try {
    // 1. Générer un challenge
    console.log('1. Génération d\'un challenge...');
    const challengeResponse = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_challenge' }),
    });
    
    if (!challengeResponse.ok) {
      throw new Error('Erreur lors de la génération du challenge');
    }
    
    const { challenge } = await challengeResponse.json();
    console.log('✅ Challenge généré:', challenge.substring(0, 16) + '...\n');

    // 2. Créer un commitment unique (simulation)
    const mockCommitment = 'test-commitment-' + Date.now();
    console.log('2. Commitment unique généré:', mockCommitment.substring(0, 16) + '...\n');

    // 3. Tenter de vérifier la preuve (devrait retourner 404)
    console.log('3. Tentative de vérification de la preuve...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_proof',
        data: {
          commitment: mockCommitment,
          proof: 'mock-proof',
          challenge: challenge,
        },
      }),
    });

    console.log('📊 Statut de la réponse:', verifyResponse.status);

    if (verifyResponse.status === 404) {
      console.log('✅ Utilisateur non trouvé (comportement attendu)\n');
      
      // 4. Créer automatiquement un nouveau compte
      console.log('4. Création automatique d\'un nouveau compte...');
      const uniqueId = mockCommitment.substring(0, 8);
      const userName = `Utilisateur ZK ${uniqueId}`;
      const userEmail = `zk-${uniqueId}@neosign.app`;

      const registerResponse = await fetch('http://localhost:3000/api/auth/zk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          data: {
            name: userName,
            email: userEmail,
            commitment: mockCommitment,
          },
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(`Erreur lors de l'enregistrement: ${errorData.error}`);
      }

      const { user } = await registerResponse.json();
      console.log('✅ Nouveau compte créé avec succès!');
      console.log('   - ID:', user.id);
      console.log('   - Nom:', user.name);
      console.log('   - Email:', user.email);
      console.log('   - Commitment:', mockCommitment.substring(0, 16) + '...\n');

      // 5. Tester la connexion NextAuth
      console.log('5. Test de connexion NextAuth...');
      const nextAuthResponse = await fetch('http://localhost:3000/api/auth/signin/zk-credentials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          zkUser: JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            commitment: mockCommitment,
          }),
        }),
      });

      console.log('📊 Statut NextAuth:', nextAuthResponse.status);
      
      if (nextAuthResponse.ok) {
        console.log('✅ Connexion NextAuth réussie!');
      } else {
        console.log('⚠️  Connexion NextAuth échouée (normal car c\'est un test)');
      }

    } else {
      console.log('❌ Comportement inattendu - utilisateur trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Vérifier que le serveur est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_challenge' }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🚀 Test de l\'auto-registration ZK\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Le serveur Next.js n\'est pas en cours d\'exécution');
    console.log('   Veuillez démarrer le serveur avec: npm run dev');
    return;
  }
  
  console.log('✅ Serveur détecté, lancement du test...\n');
  await testZKAutoRegistration();
}

main(); 