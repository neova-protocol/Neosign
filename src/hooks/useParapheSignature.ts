import { useState, useEffect, useCallback } from "react";
import { Paraphe } from "@/types/paraphe";
import { ParapheSignatureService, ParapheSignatureData } from "@/services/paraphe/ParapheSignatureService";

export interface UseParapheSignatureReturn {
  paraphes: Paraphe[];
  defaultParaphe: Paraphe | null;
  loading: boolean;
  error: string | null;
  selectParaphe: (paraphe: Paraphe) => void;
  createSignatureWithParaphe: (paraphe: Paraphe, signatoryName: string, documentId: string) => ParapheSignatureData;
  setDefaultParapheAsync: (parapheId: string) => Promise<boolean>;
  refreshParaphes: () => Promise<void>;
}

export function useParapheSignature(): UseParapheSignatureReturn {
  const [paraphes, setParaphes] = useState<Paraphe[]>([]);
  const [defaultParaphe, setDefaultParaphe] = useState<Paraphe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parapheSignatureService = ParapheSignatureService.getInstance();

  const loadParaphes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const availableParaphes = await parapheSignatureService.getAvailableParaphes();
      const defaultParaphe = await parapheSignatureService.getDefaultParaphe();

      setParaphes(availableParaphes);
      setDefaultParaphe(defaultParaphe);
    } catch (err) {
      setError("Erreur lors du chargement des paraphes");
      console.error("Error loading paraphes:", err);
    } finally {
      setLoading(false);
    }
  }, [parapheSignatureService]);

  const selectParaphe = useCallback((paraphe: Paraphe) => {
    // Cette fonction peut être étendue pour gérer la sélection de paraphe
    console.log("Paraphe sélectionné:", paraphe);
  }, []);

  const createSignatureWithParaphe = useCallback((
    paraphe: Paraphe,
    signatoryName: string,
    documentId: string
  ): ParapheSignatureData => {
    return parapheSignatureService.createParapheSignature(paraphe, signatoryName, documentId);
  }, [parapheSignatureService]);

  const setDefaultParapheAsync = useCallback(async (parapheId: string): Promise<boolean> => {
    try {
      const success = await parapheSignatureService.setDefaultParaphe(parapheId);
      if (success) {
        // Recharger les paraphes pour mettre à jour l'état
        await loadParaphes();
      }
      return success;
    } catch (err) {
      console.error("Error setting default paraphe:", err);
      return false;
    }
  }, [parapheSignatureService, loadParaphes]);

  const refreshParaphes = useCallback(async () => {
    await loadParaphes();
  }, [loadParaphes]);

  // Charger les paraphes au montage du composant
  useEffect(() => {
    loadParaphes();
  }, [loadParaphes]);

  return {
    paraphes,
    defaultParaphe,
    loading,
    error,
    selectParaphe,
    createSignatureWithParaphe,
    setDefaultParapheAsync,
    refreshParaphes,
  };
} 