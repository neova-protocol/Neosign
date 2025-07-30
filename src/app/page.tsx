import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Partners from "@/components/landing/Partners";
import Features from "@/components/landing/Features";
import Screenshots from "@/components/landing/Screenshots";
import TokenUtility from "@/components/landing/TokenUtility";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Partners />
        <Features />
        <Screenshots />
        <TokenUtility />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
