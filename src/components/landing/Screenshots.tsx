"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const screenshots = [
  {
    id: 1,
    title: "Dashboard Principal",
    description: "Vue d'ensemble de vos documents et signatures en cours",
    image: "/api/files/signature/dashboard-screenshot.png", // Placeholder - vous devrez ajouter vos vraies screenshots
    alt: "Dashboard NeoSign"
  },
  {
    id: 2,
    title: "Interface de Signature",
    description: "Signature intuitive avec placement précis des champs",
    image: "/api/files/signature/signature-interface.png",
    alt: "Interface de signature"
  },
  {
    id: 3,
    title: "Gestion des Documents",
    description: "Organisez et suivez tous vos documents en un coup d'œil",
    image: "/api/files/signature/document-management.png",
    alt: "Gestion des documents"
  },
  {
    id: 4,
    title: "Collaboration Multi-utilisateurs",
    description: "Invitez des signataires et suivez l'avancement en temps réel",
    image: "/api/files/signature/collaboration.png",
    alt: "Collaboration"
  }
];

export default function Screenshots() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez l&apos;interface NeoSign
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une interface moderne et intuitive conçue pour simplifier vos processus de signature.
          </p>
        </div>

        <div className="relative">
          {/* Screenshot Display */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {/* Placeholder pour les screenshots - remplacez par vos vraies images */}
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {screenshots[currentIndex].title}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {screenshots[currentIndex].description}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Screenshot {currentIndex + 1} sur {screenshots.length}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interface Rapide
            </h3>
            <p className="text-gray-600">
              Navigation fluide et réponses instantanées pour une expérience optimale.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sécurité Avancée
            </h3>
            <p className="text-gray-600">
              Chiffrement de bout en bout et authentification multi-facteurs.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Responsive Design
            </h3>
            <p className="text-gray-600">
              Fonctionne parfaitement sur tous vos appareils : desktop, tablette, mobile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 