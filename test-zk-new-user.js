const { ZKAuth } = require('./src/lib/zk-auth');

async function testZKNewUser() {
  console.log('🧪 Test de création d\'un nouvel utilisateur ZK...\n');

  try {
    // 1. Générer une nouvelle identité ZK
    console.log('1. Génération d\'une nouvelle identité ZK...');
    const identity = await ZKAuth.generateIdentity();
    console.log('✅ Identité ZK générée:', identity.commitment.substring(0, 16) + '...\n');

    // 2. Générer un challenge
    console.log('2. Génération d\'un challenge...');
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

    // 3. Générer une preuve ZK
    console.log('3. Génération d\'une preuve ZK...');
    const proof = await ZKAuth.generateProof(identity, challenge);
    console.log('✅ Preuve ZK générée\n');

    // 4. Tenter de vérifier la preuve (devrait retourner 404 car l'utilisateur n'existe pas)
    console.log('4. Tentative de vérification de la preuve...');
    const verifyResponse = await fetch('http://localhost:3000/api/auth/zk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_proof',
        data: {
          commitment: identity.commitment,
          proof: proof.proof,
          challenge: challenge,
        },
      }),
    });

    console.log('📊 Statut de la réponse:', verifyResponse.status);

    if (verifyResponse.status === 404) {
      console.log('✅ Utilisateur non trouvé (comportement attendu pour un nouvel utilisateur)\n');
      
      // 5. Créer automatiquement un nouveau compte
      console.log('5. Création automatique d\'un nouveau compte...');
      const uniqueId = identity.commitment.substring(0, 8);
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
            commitment: identity.commitment,
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
      console.log('   - Commitment:', identity.commitment.substring(0, 16) + '...\n');

      // 6. Vérifier que l'utilisateur peut maintenant se connecter
      console.log('6. Test de connexion avec le nouveau compte...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/zk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_proof',
          data: {
            commitment: identity.commitment,
            proof: proof.proof,
            challenge: challenge,
          },
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Connexion réussie avec le nouveau compte!');
        console.log('   - Utilisateur connecté:', loginData.user.email);
      } else {
        console.log('❌ Échec de la connexion après création du compte');
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