const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👤 Création d\'un utilisateur administrateur...\n');
    
    const email = 'admin@neosign.app';
    const password = 'admin123';
    const name = 'Administrateur';
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà');
      console.log(`👤 ID: ${existingUser.id}`);
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`🔐 Mot de passe hashé: ${existingUser.hashedPassword ? '✅ Oui' : '❌ Non'}`);
      
      if (!existingUser.hashedPassword) {
        console.log('\n🔄 Mise à jour du mot de passe...');
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { 
            hashedPassword,
            name: name
          }
        });
        
        console.log('✅ Mot de passe mis à jour avec succès');
      }
      
      return;
    }
    
    // Créer un nouveau mot de passe hashé
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    });
    
    console.log('✅ Utilisateur administrateur créé avec succès !');
    console.log(`👤 ID: ${newUser.id}`);
    console.log(`📧 Email: ${newUser.email}`);
    console.log(`🔐 Mot de passe: ${password}`);
    console.log('\n📋 Informations de connexion :');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 