"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, PenTool, Lock, Award, Info } from "lucide-react";

export type SignatureType = 'simple' | 'ses' | 'aes' | 'qes';

interface SignatureTypeInfo {
  id: SignatureType;
  name: string;
  description: string;
  legalValue: string;
  eIDASLevel: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  available: boolean;
}

interface SignatureTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: SignatureType) => void;
  signatoryName: string;
}

const SignatureTypeSelector: React.FC<SignatureTypeSelectorProps> = ({
  open,
  onOpenChange,
  onSelectType,
  signatoryName,
}) => {
  console.log("SignatureTypeSelector rendered with open:", open);

  const signatureTypes: SignatureTypeInfo[] = [
    {
      id: 'simple',
      name: 'Signature Simple',
      description: 'Signature basique sans validation eIDAS',
      legalValue: 'Basic',
      eIDASLevel: 'N/A',
      icon: <PenTool className="h-5 w-5" />,
      color: 'border-gray-300 bg-gray-50',
      features: [
        'Signature manuscrite',
        'Pas de validation requise',
        'Rapide et simple',
        'Usage interne'
      ],
      available: true
    },
    {
      id: 'ses',
      name: 'SES - Simple Electronic Signature',
      description: 'Signature électronique simple conforme eIDAS',
      legalValue: 'Basic',
      eIDASLevel: 'SES',
      icon: <Shield className="h-5 w-5" />,
      color: 'border-blue-300 bg-blue-50',
      features: [
        'Conforme eIDAS',
        'Validation par email/SMS',
        'Horodatage sécurisé',
        'Valeur légale reconnue'
      ],
      available: true
    },
    {
      id: 'aes',
      name: 'AES - Advanced Electronic Signature',
      description: 'Signature électronique avancée avec certificats',
      legalValue: 'Advanced',
      eIDASLevel: 'AES',
      icon: <Lock className="h-5 w-5" />,
      color: 'border-yellow-300 bg-yellow-50',
      features: [
        'Certificats qualifiés',
        'Authentification forte',
        'Intégrité garantie',
        'Valeur légale avancée'
      ],
      available: false // À implémenter
    },
    {
      id: 'qes',
      name: 'QES - Qualified Electronic Signature',
      description: 'Signature électronique qualifiée (équivalent manuscrit)',
      legalValue: 'Qualified',
      eIDASLevel: 'QES',
      icon: <Award className="h-5 w-5" />,
      color: 'border-green-300 bg-green-50',
      features: [
        'Certificats qualifiés + QSCD',
        'Équivalent signature manuscrite',
        'Valeur légale maximale',
        'Conformité totale eIDAS'
      ],
      available: false // À implémenter
    }
  ];

  const handleSelectType = (type: SignatureType) => {
    console.log("Type selected:", type);
    onSelectType(type);
    onOpenChange(false);
  };

  console.log("Rendering SignatureTypeSelector with open:", open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Choisir le Type de Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Sélectionnez le type de signature pour <strong>{signatoryName}</strong> :</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signatureTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  type.available 
                    ? 'hover:border-blue-400' 
                    : 'opacity-60 cursor-not-allowed'
                } ${type.color}`}
                onClick={() => type.available && handleSelectType(type.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge 
                        variant={type.available ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {type.eIDASLevel}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {type.legalValue}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Fonctionnalités :
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!type.available && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                      <Info className="h-3 w-3" />
                      Bientôt disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Conformité eIDAS :</p>
                <ul className="space-y-1">
                  <li><strong>SES</strong> : Signature simple conforme (niveau 1)</li>
                  <li><strong>AES</strong> : Signature avancée avec certificats (niveau 2)</li>
                  <li><strong>QES</strong> : Signature qualifiée (niveau 3, équivalent manuscrit)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureTypeSelector; 