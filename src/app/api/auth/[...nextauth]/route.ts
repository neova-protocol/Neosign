import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import { Adapter } from "next-auth/adapters"
import bcrypt from 'bcrypt';
import { NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { zkCredentialsProvider } from "@/lib/zk-credentials-provider"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          if (!user.hashedPassword) {
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("CRITICAL: Error during database query in authorize function.", error);
          return null;
        }
      }
    }),
    zkCredentialsProvider
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.createdAt = user.createdAt;
        token.name = user.name;
        token.image = user.image;
        token.hashedPassword = (user as any).hashedPassword;
        token.zkCommitment = (user as any).zkCommitment;
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (dbUser) {
        token.name = dbUser.name;
        token.image = dbUser.image;
        token.hashedPassword = dbUser.hashedPassword;
        token.zkCommitment = (dbUser as any).zkCommitment;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.createdAt = token.createdAt as Date;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).hashedPassword = token.hashedPassword as string;
        (session.user as any).zkCommitment = token.zkCommitment as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 