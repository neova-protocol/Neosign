"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users, Mail, Twitter, Github } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Social Links */}
      <div className="absolute top-8 right-8 flex space-x-4 z-10">
        <a href="mailto:contact@neosign.com" className="text-white/70 hover:text-white transition-colors">
          <Mail className="h-5 w-5" />
        </a>
        <a href="https://twitter.com/neosign" className="text-white/70 hover:text-white transition-colors">
          <Twitter className="h-5 w-5" />
        </a>
        <a href="https://github.com/neosign" className="text-white/70 hover:text-white transition-colors">
          <Github className="h-5 w-5" />
        </a>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            La signature électronique{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              nouvelle génération
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            NeoSign révolutionne la signature électronique en combinant sécurité blockchain, 
            facilité d&apos;utilisation et conformité légale. Créez, gérez et signez vos documents 
            en toute confiance avec la puissance de la décentralisation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = '/signup'}
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Découvrir les fonctionnalités
          </Button>
        </div>

        <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-400" />
            <span>100% Sécurisé</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-400" />
            <span>Signature instantanée</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-400" />
            <span>Collaboration en temps réel</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
} 