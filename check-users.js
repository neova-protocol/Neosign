const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs dans la base de données...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        hashedPassword: true,
        zkCommitment: true,
        createdAt: true
      }
    });

    console.log(`📊 Nombre total d'utilisateurs: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      console.log('💡 Vous devez créer un utilisateur pour pouvoir vous connecter par email');
      return;
    }

    users.forEach((user, index) => {
      console.log(`👤 Utilisateur ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nom: ${user.name || 'Non défini'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Mot de passe hashé: ${user.hashedPassword ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Commitment ZK: ${user.zkCommitment ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Créé le: ${user.createdAt}`);
      console.log('');
    });

    // Vérifier s'il y a des utilisateurs avec des mots de passe
    const usersWithPassword = users.filter(u => u.hashedPassword);
    console.log(`🔐 Utilisateurs avec mot de passe: ${usersWithPassword.length}/${users.length}`);

    if (usersWithPassword.length === 0) {
      console.log('⚠️  Aucun utilisateur n\'a de mot de passe hashé');
      console.log('💡 Vous devez créer un utilisateur avec un mot de passe pour l\'authentification par email');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 