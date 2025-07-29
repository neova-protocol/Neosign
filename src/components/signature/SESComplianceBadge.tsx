"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignatureCompliance } from "@/types/signature";
import { Shield, CheckCircle, AlertCircle, Info } from "lucide-react";

interface SESComplianceBadgeProps {
  compliance: SignatureCompliance;
  showDetails?: boolean;
}

const SESComplianceBadge: React.FC<SESComplianceBadgeProps> = ({
  compliance,
  showDetails = false,
}) => {
  const getComplianceColor = () => {
    if (compliance.isCompliant) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getComplianceIcon = () => {
    if (compliance.isCompliant) {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-3">
      {/* Badge principal */}
      <div className="flex items-center gap-2">
        <Badge className={`flex items-center gap-1 ${getComplianceColor()}`}>
          {getComplianceIcon()}
          {compliance.eIDASLevel} - {compliance.legalValue}
        </Badge>
        {compliance.isCompliant && (
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Shield className="h-3 w-3 mr-1" />
            eIDAS Compliant
          </Badge>
        )}
      </div>

      {/* Détails de conformité */}
      {showDetails && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Conformité eIDAS - {compliance.eIDASLevel}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Exigences */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Exigences de conformité :
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {compliance.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Étapes de validation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Étapes de validation :
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {compliance.validationSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Valeur légale */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Valeur légale :</span>
                <Badge variant="outline" className="text-xs">
                  {compliance.legalValue}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SESComplianceBadge; 