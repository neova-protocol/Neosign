const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkZKUsers() {
  console.log('🔍 Vérification des utilisateurs ZK dans la base de données...\n');

  try {
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        zkCommitment: true,
        hashedPassword: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total d'utilisateurs: ${users.length}\n`);

    // Analyser les utilisateurs ZK
    const zkUsers = users.filter(user => user.zkCommitment);
    const emailUsers = users.filter(user => user.hashedPassword && !user.zkCommitment);
    const hybridUsers = users.filter(user => user.zkCommitment && user.hashedPassword);

    console.log('👥 Répartition des utilisateurs:');
    console.log(`   - Utilisateurs ZK uniquement: ${zkUsers.length}`);
    console.log(`   - Utilisateurs Email uniquement: ${emailUsers.length}`);
    console.log(`   - Utilisateurs Hybrides (ZK + Email): ${hybridUsers.length}\n`);

    // Afficher les utilisateurs ZK
    if (zkUsers.length > 0) {
      console.log('🔐 Utilisateurs ZK:');
      zkUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      - ID: ${user.id}`);
        console.log(`      - Commitment: ${user.zkCommitment.substring(0, 16)}...`);
        console.log(`      - Créé le: ${user.createdAt.toLocaleString()}`);
        console.log('');
      });
    }

    // Afficher les utilisateurs hybrides
    if (hybridUsers.length > 0) {
      console.log('🔄 Utilisateurs Hybrides (ZK + Email):');
      hybridUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      - ID: ${user.id}`);
        console.log(`      - Commitment: ${user.zkCommitment.substring(0, 16)}...`);
        console.log(`      - Mot de passe: ✅ configuré`);
        console.log(`      - Créé le: ${user.createdAt.toLocaleString()}`);
        console.log('');
      });
    }

    // Vérifier les doublons de commitments
    const commitments = zkUsers.map(user => user.zkCommitment);
    const uniqueCommitments = new Set(commitments);
    
    if (commitments.length !== uniqueCommitments.size) {
      console.log('⚠️  ATTENTION: Des commitments ZK dupliqués ont été détectés!');
      const duplicates = commitments.filter((item, index) => commitments.indexOf(item) !== index);
      console.log('   Commitments dupliqués:', duplicates);
    } else {
      console.log('✅ Tous les commitments ZK sont uniques');
    }

    // Vérifier les doublons d'emails
    const emails = users.map(user => user.email);
    const uniqueEmails = new Set(emails);
    
    if (emails.length !== uniqueEmails.size) {
      console.log('⚠️  ATTENTION: Des emails dupliqués ont été détectés!');
      const duplicates = emails.filter((item, index) => emails.indexOf(item) !== index);
      console.log('   Emails dupliqués:', duplicates);
    } else {
      console.log('✅ Tous les emails sont uniques');
    }

    // Statistiques récentes
    const recentUsers = users.filter(user => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return user.createdAt > oneDayAgo;
    });

    console.log(`\n📈 Utilisateurs créés dans les dernières 24h: ${recentUsers.length}`);
    
    if (recentUsers.length > 0) {
      console.log('   Utilisateurs récents:');
      recentUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.createdAt.toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkZKUsers(); 