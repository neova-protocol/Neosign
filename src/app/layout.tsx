import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SignatureProvider } from "@/contexts/SignatureContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeoSign - Modern Electronic Signature",
  description: "Securely sign and manage your documents online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <SignatureProvider>
          {children}
          </SignatureProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
