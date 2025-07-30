import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDeletedAccounts() {
  try {
    console.log('Starting cleanup of deleted accounts...');

    // Trouver tous les comptes en attente de suppression dont la date est dépassée
    const accountsToDelete = await prisma.user.findMany({
      where: {
        accountStatus: 'pending_deletion',
        deletionScheduledAt: {
          lte: new Date()
        }
      },
      select: {
        id: true,
        email: true,
        deletionScheduledAt: true
      }
    });

    console.log(`Found ${accountsToDelete.length} accounts to delete`);

    for (const account of accountsToDelete) {
      try {
        console.log(`Deleting account ${account.id} (${account.email})`);

        // Supprimer l'utilisateur (cascade supprimera toutes les données associées)
        await prisma.user.delete({
          where: { id: account.id }
        });

        console.log(`Successfully deleted account ${account.id}`);
      } catch (error) {
        console.error(`Error deleting account ${account.id}:`, error);
      }
    }

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  cleanupDeletedAccounts();
}

export { cleanupDeletedAccounts }; 