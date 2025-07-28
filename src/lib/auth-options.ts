import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { zkCredentialsProvider } from "@/lib/zk-credentials-provider";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isPasswordValid) {
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
      },
    }),
    zkCredentialsProvider,
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
        token.createdAt = user.createdAt;
        token.hashedPassword = (
          user as { hashedPassword?: string }
        ).hashedPassword;
        token.zkCommitment = (user as { zkCommitment?: string }).zkCommitment;
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (dbUser) {
        token.name = dbUser.name;
        token.image = dbUser.image;
        token.hashedPassword = dbUser.hashedPassword;
        token.zkCommitment = (dbUser as { zkCommitment?: string }).zkCommitment;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.createdAt = token.createdAt as Date;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as { hashedPassword?: string }).hashedPassword =
          token.hashedPassword as string;
        (session.user as { zkCommitment?: string }).zkCommitment =
          token.zkCommitment as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
