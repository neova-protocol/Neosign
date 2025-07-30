"use client";

import { 
  Shield, 
  Zap, 
  Users, 
  FileText, 
  Lock, 
  CheckCircle,
  Globe,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Sécurité Blockchain",
    description: "Vos signatures sont sécurisées par la technologie blockchain, garantissant l'intégrité et l'irréversibilité de vos documents."
  },
  {
    icon: Zap,
    title: "Signature Instantanée",
    description: "Signez vos documents en quelques clics, où que vous soyez. Plus besoin d'imprimer, scanner ou poster."
  },
  {
    icon: Users,
    title: "Collaboration Multi-utilisateurs",
    description: "Invitez plusieurs signataires et suivez en temps réel l'avancement de vos documents."
  },
  {
    icon: FileText,
    title: "Gestion de Documents",
    description: "Organisez, archivez et retrouvez facilement tous vos documents signés dans un espace sécurisé."
  },
  {
    icon: Lock,
    title: "Conformité Légale",
    description: "Signatures conformes aux standards internationaux (eIDAS, UETA, ESIGN) pour une validité juridique."
  },
  {
    icon: CheckCircle,
    title: "Traçabilité Complète",
    description: "Historique détaillé de chaque action avec horodatage et preuves cryptographiques."
  },
  {
    icon: Globe,
    title: "Accessible Partout",
    description: "Interface web responsive qui fonctionne sur tous vos appareils : ordinateur, tablette, smartphone."
  },
  {
    icon: Smartphone,
    title: "Signature Mobile",
    description: "Signez directement sur votre écran tactile avec notre interface intuitive optimisée mobile."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir NeoSign ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme complète qui combine innovation technologique et facilité d&apos;utilisation 
            pour révolutionner votre expérience de signature électronique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4 group-hover:bg-blue-700 transition-colors">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 