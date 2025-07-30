"use client";

import { Shield, Lock, Users, CheckCircle, Zap, Globe, Award, Coins } from "lucide-react";

const utilities = [
  {
    icon: Shield,
    title: "SÉCURITÉ BLOCKCHAIN",
    description: "Vos signatures sont immutables et sécurisées par la technologie blockchain"
  },
  {
    icon: Lock,
    title: "CONFORMITÉ LÉGALE",
    description: "Signatures conformes aux standards eIDAS, UETA et ESIGN"
  },
  {
    icon: Users,
    title: "COLLABORATION MULTI-UTILISATEURS",
    description: "Invitez plusieurs signataires avec gestion des permissions"
  },
  {
    icon: CheckCircle,
    title: "TRAÇABILITÉ COMPLÈTE",
    description: "Historique détaillé avec horodatage et preuves cryptographiques"
  },
  {
    icon: Zap,
    title: "SIGNATURE INSTANTANÉE",
    description: "Signez vos documents en quelques clics, où que vous soyez"
  },
  {
    icon: Globe,
    title: "ACCESSIBLE PARTOUT",
    description: "Interface web responsive qui fonctionne sur tous vos appareils"
  },
  {
    icon: Award,
    title: "CERTIFICATION INTERNATIONALE",
    description: "Certifié par les autorités de régulation européennes et américaines"
  },
  {
    icon: Coins,
    title: "ÉCONOMIE DÉCENTRALISÉE",
    description: "Infrastructure blockchain pour une gouvernance transparente"
  }
];

export default function TokenUtility() {
  return (
    <section id="token" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            La puissance de la décentralisation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            NeoSign combine la sécurité blockchain avec la facilité d&apos;utilisation 
            pour révolutionner la signature électronique. Chaque signature est immutables, 
            traçable et juridiquement valide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {utilities.map((utility, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                <utility.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {utility.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {utility.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              Audité et Certifié
            </h3>
            <p className="text-gray-300 mb-6">
              NeoSign a été audité par les plus grandes firmes de sécurité et certifié 
              par les autorités de régulation internationales.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                <span>Audit de sécurité</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                <span>Certification eIDAS</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-purple-400" />
                <span>Conformité RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 