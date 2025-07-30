"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-400">
              NeoSign
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Fonctionnalités
            </a>
            <a 
              href="#token" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => document.getElementById('token')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Blockchain
            </a>
            <a 
              href="#faq" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
            >
              FAQ
            </a>
            <a 
              href="#community" 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Communauté
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:border-white hover:text-white"
              onClick={() => window.location.href = '/login'}
            >
              Se connecter
            </Button>
            <Button 
              onClick={() => window.location.href = '/signup'}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              Commencer gratuitement
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Fonctionnalités
              </a>
              <a 
                href="#token" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  document.getElementById('token')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Blockchain
              </a>
              <a 
                href="#faq" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                FAQ
              </a>
              <a 
                href="#community" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Communauté
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:border-white hover:text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  Commencer gratuitement
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 