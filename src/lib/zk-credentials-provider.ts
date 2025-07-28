import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const zkCredentialsProvider = CredentialsProvider({
  id: "zk-credentials",
  name: "ZK Credentials",
  credentials: {
    zkUser: { label: "ZK User", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.zkUser) {
      console.log("ZK Provider: Aucune donnée ZK fournie");
      return null;
    }

    try {
      const zkUser = JSON.parse(credentials.zkUser);
      console.log("ZK Provider: Données ZK reçues:", {
        id: zkUser.id,
        name: zkUser.name,
        email: zkUser.email,
        commitment: zkUser.commitment ? zkUser.commitment.substring(0, 16) + "..." : "non fourni"
      });

      // Si on a un ID d'utilisateur, chercher directement par ID
      if (zkUser.id) {
        console.log("ZK Provider: Recherche par ID:", zkUser.id);
        const user = await prisma.user.findUnique({
          where: { id: zkUser.id },
        });

        if (user) {
          console.log("ZK Provider: Utilisateur trouvé par ID:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            image: user.image,
            hashedPassword: user.hashedPassword,
            zkCommitment: (user as any).zkCommitment,
          };
        }
      }

      // Sinon, chercher par commitment ZK
      if (zkUser.commitment) {
        console.log("ZK Provider: Recherche par commitment ZK");
        const user = await prisma.user.findFirst({
          where: {
            zkCommitment: zkUser.commitment,
          } as any,
        });

        if (user) {
          console.log("ZK Provider: Utilisateur trouvé par commitment:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            image: user.image,
            hashedPassword: user.hashedPassword,
            zkCommitment: (user as any).zkCommitment,
          };
        }
      }

      console.log("ZK Provider: Aucun utilisateur trouvé");
      return null;
    } catch (error) {
      console.error("ZK Provider: Erreur lors de l'authentification ZK:", error);
      return null;
    }
  },
});
