"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Qu'est-ce que NeoSign ?",
    answer: "NeoSign est une plateforme de signature électronique nouvelle génération qui combine la sécurité blockchain avec la facilité d'utilisation. Elle permet de créer, gérer et signer des documents de manière sécurisée, traçable et juridiquement valide."
  },
  {
    question: "Comment NeoSign utilise-t-il la blockchain ?",
    answer: "NeoSign utilise la technologie blockchain pour garantir l'immutabilité et la traçabilité de chaque signature. Chaque action est enregistrée de manière cryptographique, créant une preuve irréfutable de l'authenticité du document."
  },
  {
    question: "Comment utiliser NeoSign ?",
    answer: "L'utilisation de NeoSign est simple : 1) Uploadez votre document, 2) Placez les champs de signature, 3) Invitez les signataires, 4) Suivez l'avancement en temps réel. L'interface intuitive guide chaque étape du processus."
  },
  {
    question: "Y a-t-il des coûts pour utiliser NeoSign ?",
    answer: "NeoSign propose différents plans tarifaires adaptés à vos besoins. Un plan gratuit est disponible pour commencer, avec des fonctionnalités premium pour les utilisateurs professionnels et les entreprises."
  },
  {
    question: "Les signatures NeoSign sont-elles juridiquement valides ?",
    answer: "Oui, NeoSign est conforme aux standards internationaux (eIDAS, UETA, ESIGN) et certifié par les autorités de régulation. Chaque signature est juridiquement valide et reconnue légalement."
  },
  {
    question: "Où puis-je en savoir plus sur NeoSign ?",
    answer: "Vous pouvez consulter notre documentation complète, rejoindre notre communauté Discord, ou nous contacter directement. Notre équipe est disponible pour répondre à toutes vos questions."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur NeoSign et la signature électronique nouvelle génération.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={() => window.location.href = 'mailto:contact@neosign.com'}
          >
            Contactez notre équipe
          </button>
        </div>
      </div>
    </section>
  );
} 