const fetch = require('node-fetch');

async function testZKNewUser() {
  console.log('🧪 Test de création d\'un nouvel utilisateur ZK...\n');

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

    // 2. Simuler une preuve ZK (pour le test, on utilise des données factices)
    console.log('2. Simulation d\'une preuve ZK...');
    const mockCommitment = 'mock-commitment-' + Date.now();
    const mockProof = 'mock-proof-' + Date.now();
    
    console.log('✅ Preuve ZK simulée\n');

    // 3. Tenter de vérifier la preuve (devrait retourner 404 car l'utilisateur n'existe pas)
    console.log('3. Tentative de vérification de la preuve...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_proof',
        data: {
          commitment: mockCommitment,
          proof: mockProof,
          challenge: challenge,
        },
      }),
    });

    console.log('📊 Statut de la réponse:', verifyResponse.status);

    if (verifyResponse.status === 404) {
      console.log('✅ Utilisateur non trouvé (comportement attendu pour un nouvel utilisateur)\n');
      
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

      // 5. Vérifier que l'utilisateur existe maintenant
      console.log('5. Vérification de l\'existence du nouvel utilisateur...');
      const checkUserResponse = await fetch('http://localhost:3000/api/auth/zk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_proof',
          data: {
            commitment: mockCommitment,
            proof: mockProof,
            challenge: challenge,
          },
        }),
      });

      console.log('📊 Statut de la vérification après création:', checkUserResponse.status);
      
      if (checkUserResponse.status === 404) {
        console.log('⚠️  L\'utilisateur n\'est toujours pas trouvé (normal car la preuve est invalide)');
      } else {
        console.log('✅ L\'utilisateur est maintenant trouvé dans la base de données');
      }

    } else if (verifyResponse.ok) {
      console.log('⚠️  Utilisateur trouvé (commitment déjà utilisé)');
      const userData = await verifyResponse.json();
      console.log('   - Email existant:', userData.user.email);
    } else {
      const errorData = await verifyResponse.json();
      console.log('❌ Erreur lors de la vérification:', errorData.error);
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
  await testZKNewUser();
}

main(); 