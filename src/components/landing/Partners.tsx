"use client";

export default function Partners() {
  const partners = [
    { name: "Microsoft", logo: "M" },
    { name: "Google", logo: "G" },
    { name: "Adobe", logo: "A" },
    { name: "DocuSign", logo: "D" },
    { name: "Salesforce", logo: "S" },
    { name: "Oracle", logo: "O" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Compatible avec les leaders du marché
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            NeoSign s&apos;intègre parfaitement avec vos outils existants pour une expérience 
            de signature électronique transparente et efficace.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-2xl font-bold text-gray-400 hover:text-blue-600 transition-colors">
                {partner.logo}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            * Logos des partenaires à titre d&apos;illustration
          </p>
        </div>
      </div>
    </section>
  );
} 