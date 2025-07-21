import type { Metadata } from "next";
import { Inter, Corinthia } from "next/font/google";
import "./globals.css";
import { SignatureProvider } from "@/contexts/SignatureContext";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const corinthia = Corinthia({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-corinthia",
});

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
      <body className={`${inter.variable} ${corinthia.variable} font-sans bg-neutral-100`}>
        <NextAuthProvider>
          <SignatureProvider>
          {children}
          </SignatureProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
