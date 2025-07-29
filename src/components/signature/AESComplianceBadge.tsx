"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Clock, CheckCircle } from "lucide-react";
import { SignatureCompliance } from "@/types/signature";

interface AESComplianceBadgeProps {
  compliance: SignatureCompliance;
}

const AESComplianceBadge: React.FC<AESComplianceBadgeProps> = ({ compliance }) => {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-yellow-600" />
          Conformité AES - Advanced Electronic Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Lock className="h-3 w-3 mr-1" />
            eIDAS Niveau 2
          </Badge>
          <Badge variant="outline" className="text-xs">
            Valeur Légale Avancée
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Exigences Satisfaites :</h4>
          <ul className="text-xs space-y-1">
            {compliance.requirements.map((requirement, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Étapes de Validation :</h4>
          <ul className="text-xs space-y-1">
            {compliance.validationSteps.map((step, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        {compliance.certificateInfo && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Certificat Qualifié
            </h4>
            <div className="text-xs space-y-1 bg-white p-2 rounded border">
              <div><strong>Émetteur :</strong> {compliance.certificateInfo.issuer}</div>
              <div><strong>Valide du :</strong> {compliance.certificateInfo.validFrom.toLocaleDateString()}</div>
              <div><strong>Valide jusqu&apos;au :</strong> {compliance.certificateInfo.validTo.toLocaleDateString()}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {compliance.certificateInfo.isQualified ? 'Qualifié' : 'Non qualifié'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {compliance.timestampInfo && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Horodatage RFC 3161
            </h4>
            <div className="text-xs space-y-1 bg-white p-2 rounded border">
              <div><strong>TSA :</strong> {compliance.timestampInfo.tsaUrl}</div>
              <div><strong>Horodatage :</strong> {compliance.timestampInfo.timestamp.toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-3 p-2 bg-white rounded border">
          <strong>Note :</strong> Cette signature AES offre une valeur légale avancée avec intégrité garantie et non-répudiation selon le standard eIDAS.
        </div>
      </CardContent>
    </Card>
  );
};

export default AESComplianceBadge; 