#!/usr/bin/env node

/**
 * Script de test pour vérifier la logique des statistiques du dashboard
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testDashboardStats() {
  console.log('🧪 Test de la logique des statistiques du dashboard\n');

  // Test 1: Vérifier que le serveur répond
  console.log('1️⃣ Test de connectivité du serveur...');
  try {
    const response = await fetch(`${BASE_URL}/api/documents`);
    
    if (response.status === 401) {
      console.log('✅ Serveur accessible (401 Unauthorized attendu - pas de session)');
    } else if (response.status === 200) {
      console.log('✅ Serveur accessible et documents récupérés');
      const documents = await response.json();
      console.log(`📄 Nombre de documents: ${documents.length}`);
      
      // Analyser les documents
      analyzeDocuments(documents);
    } else {
      console.log(`⚠️  Réponse inattendue: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Serveur inaccessible:', error.message);
    console.log('💡 Assurez-vous que le serveur est démarré avec: pnpm dev');
    return;
  }

  console.log('\n📊 Logique des statistiques:');
  console.log('✅ Completed signatures = Documents signés par tout le monde');
  console.log('✅ In progress = Je n\'ai pas à signer et j\'attends la signature de quelqu\'un');
  console.log('✅ Signing invitation = J\'ai à signer un document');
  console.log('✅ Drafts = Mes brouillons');
  console.log('✅ Cancelled = Se décompte de "In progress"');

  console.log('\n🎯 Pour tester complètement:');
  console.log('1. Connectez-vous à l\'application');
  console.log('2. Allez sur le dashboard');
  console.log('3. Vérifiez que les statistiques correspondent à la logique');
}

function analyzeDocuments(documents) {
  console.log('\n2️⃣ Analyse des documents:');
  
  const stats = {
    total: documents.length,
    byStatus: {},
    byCreator: {},
    bySignatory: {}
  };

  documents.forEach(doc => {
    // Compter par statut
    stats.byStatus[doc.status] = (stats.byStatus[doc.status] || 0) + 1;
    
    // Compter par créateur
    stats.byCreator[doc.creatorId] = (stats.byCreator[doc.creatorId] || 0) + 1;
    
    // Analyser les signataires
    doc.signatories.forEach(signatory => {
      if (!stats.bySignatory[signatory.email]) {
        stats.bySignatory[signatory.email] = {
          total: 0,
          pending: 0,
          signed: 0
        };
      }
      stats.bySignatory[signatory.email].total++;
      if (signatory.status === 'pending') {
        stats.bySignatory[signatory.email].pending++;
      } else if (signatory.status === 'signed') {
        stats.bySignatory[signatory.email].signed++;
      }
    });
  });

  console.log('📋 Répartition par statut:');
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });

  console.log('\n👥 Signataires avec des signatures en attente:');
  Object.entries(stats.bySignatory)
    .filter(([email, data]) => data.pending > 0)
    .forEach(([email, data]) => {
      console.log(`   ${email}: ${data.pending} en attente, ${data.signed} signées`);
    });
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

// Exécuter le test
testDashboardStats().catch(console.error); 