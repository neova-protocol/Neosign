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
      return null;
    }

    try {
      const zkUser = JSON.parse(credentials.zkUser);

      // Vérifier que l'utilisateur existe dans la base de données
      const user = await prisma.user.findFirst({
        where: {
          zkCommitment: zkUser.commitment,
        } as any,
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        image: user.image,
        hashedPassword: user.hashedPassword,
        zkCommitment: (user as any).zkCommitment,
      };
    } catch (error) {
      console.error("Erreur lors de l'authentification ZK:", error);
      return null;
    }
  },
});
