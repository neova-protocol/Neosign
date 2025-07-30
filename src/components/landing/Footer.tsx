"use client";

import { Mail, Phone, MapPin, Github, Twitter, Linkedin, FileText, Shield, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-blue-400 mb-4">
              NeoSign
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La plateforme de signature électronique nouvelle génération, 
              combinant sécurité blockchain et facilité d&apos;utilisation 
              pour révolutionner vos processus de signature.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/neosign" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/neosign" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/neosign" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#features" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a 
                  href="#token" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => document.getElementById('token')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Blockchain
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Se connecter
                </a>
              </li>
              <li>
                <a href="/signup" className="text-gray-300 hover:text-white transition-colors">
                  S&apos;inscrire
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="/security" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Sécurité
                </a>
              </li>
              <li>
                <a href="/community" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Communauté
                </a>
              </li>
              <li>
                <a href="/brand-kit" className="text-gray-300 hover:text-white transition-colors">
                  Brand Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:contact@neosign.com" className="hover:text-white transition-colors">
                  contact@neosign.com
                </a>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 NeoSign. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Politique de confidentialité
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Conditions d&apos;utilisation
            </a>
            <a href="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 