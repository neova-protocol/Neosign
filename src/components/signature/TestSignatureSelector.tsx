"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SignatureTypeSelector, { SignatureType } from "./SignatureTypeSelector";

const TestSignatureSelector: React.FC = () => {
  const [showSelector, setShowSelector] = useState(false);

  const handleSelectType = (type: SignatureType) => {
    console.log("Selected signature type:", type);
    alert(`Signature type selected: ${type}`);
    setShowSelector(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Signature Selector</h2>
      
      <Button 
        onClick={() => setShowSelector(true)}
        className="mb-4"
      >
        Test Signature Type Selector
      </Button>

      <SignatureTypeSelector
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelectType={handleSelectType}
        signatoryName="Test User"
      />

      <div className="text-sm text-gray-600">
        <p>Cliquez sur le bouton ci-dessus pour tester le sélecteur de type de signature.</p>
      </div>
    </div>
  );
};

export default TestSignatureSelector; 