"use client";
import React from "react";
import TestSignatureSelector from "@/components/signature/TestSignatureSelector";

export default function TestSignaturePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Signature Selector</h1>
        <TestSignatureSelector />
      </div>
    </div>
  );
} 