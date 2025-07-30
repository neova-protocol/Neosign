"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UniversalSignatureButton from "./UniversalSignatureButton";
import { SignatureType } from "./SignatureTypeSelector";
import SESComplianceBadge from "./SESComplianceBadge";
import { SESSignature } from "@/types/signature";
import { CheckCircle, AlertCircle } from "lucide-react";

interface SignatureExampleProps {
  signatoryName: string;
  signatoryId: string;
  documentId: string;
}

const SignatureExample: React.FC<SignatureExampleProps> = ({
  signatoryName,
  signatoryId,
  documentId,
}) => {
  const [signatures, setSignatures] = useState<Array<{
    type: SignatureType;
    data: string | SESSignature;
    timestamp: Date;
  }>>([]);

  const handleSignatureComplete = (signatureData: string | SESSignature, type: SignatureType) => {
    const newSignature = {
      type,
      data: signatureData,
      timestamp: new Date(),
    };

    setSignatures(prev => [...prev, newSignature]);
  };

  const getSignatureIcon = (type: SignatureType) => {
    switch (type) {
      case 'simple':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ses':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'aes':
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      case 'qes':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSignatureLabel = (type: SignatureType) => {
    switch (type) {
      case 'simple':
        return 'Signature Simple';
      case 'ses':
        return 'SES - Simple Electronic Signature';
      case 'aes':
        return 'AES - Advanced Electronic Signature';
      case 'qes':
        return 'QES - Qualified Electronic Signature';
      default:
        return 'Signature Inconnue';
    }
  };

  const getSignatureBadgeColor = (type: SignatureType) => {
    switch (type) {
      case 'simple':
        return 'bg-gray-100 text-gray-800';
      case 'ses':
        return 'bg-blue-100 text-blue-800';
      case 'aes':
        return 'bg-yellow-100 text-yellow-800';
      case 'qes':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section de signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Signature pour {signatoryName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Choisissez le type de signature que vous souhaitez utiliser :</p>
          </div>

          <UniversalSignatureButton
            signatoryName={signatoryName}
            signatoryId={signatoryId}
            documentId={documentId}
            onSignatureComplete={handleSignatureComplete}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Historique des signatures */}
      {signatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Signatures Créées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signatures.map((signature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getSignatureIcon(signature.type)}
                    <div>
                      <div className="font-medium">
                        {getSignatureLabel(signature.type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {signature.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getSignatureBadgeColor(signature.type)}>
                      {signature.type.toUpperCase()}
                    </Badge>

                    {/* Affichage de conformité pour SES */}
                    {signature.type === 'ses' && signature.data && typeof signature.data === 'object' && 'validation' in signature.data && (
                      <SESComplianceBadge
                        compliance={{
                          eIDASLevel: 'SES',
                          requirements: ['Signature data integrity', 'Timestamp validation'],
                          validationSteps: ['Signature format validation', 'Signatory authentication'],
                          legalValue: 'Basic'
                        }}
                        showDetails={false}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations sur les types de signature */}
      <Card>
        <CardHeader>
          <CardTitle>Types de Signature Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Signature Simple</h4>
              <p className="text-gray-600">
                Signature basique sans validation eIDAS. Idéale pour les documents internes.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">SES - Simple Electronic Signature</h4>
              <p className="text-gray-600">
                Signature conforme eIDAS avec validation par email/SMS. Valeur légale reconnue.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">AES - Advanced Electronic Signature</h4>
              <p className="text-gray-600">
                Signature avancée avec certificats qualifiés. Bientôt disponible.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">QES - Qualified Electronic Signature</h4>
              <p className="text-gray-600">
                Signature qualifiée équivalente à la signature manuscrite. Bientôt disponible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureExample; 