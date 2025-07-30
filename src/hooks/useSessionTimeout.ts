"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

interface SessionTimeoutConfig {
  warningTime: number; // Temps avant l'avertissement (en secondes)
  logoutTime: number; // Temps avant la déconnexion (en secondes)
  checkInterval: number; // Intervalle de vérification (en millisecondes)
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  warningTime: 25 * 60, // 25 minutes (5 min avant expiration)
  logoutTime: 30 * 60, // 30 minutes
  checkInterval: 1000, // Vérifier toutes les secondes
};

export const useSessionTimeout = (config: Partial<SessionTimeoutConfig> = {}) => {
  const { data: session, status } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Fonction pour réinitialiser le timer d'activité
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = useCallback(async () => {
    await signOut({ 
      redirect: true, 
      callbackUrl: "/login?message=session_expired" 
    });
  }, []);

  // Fonction pour étendre la session
  const extendSession = useCallback(async () => {
    try {
      // Appeler l'API pour rafraîchir la session
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        resetActivityTimer();
        setShowWarning(false);
      } else {
        // Si l'API échoue, déconnecter l'utilisateur
        handleLogout();
      }
    } catch (error) {
      console.error("Erreur lors de l'extension de session:", error);
      // En cas d'erreur, déconnecter l'utilisateur
      handleLogout();
    }
  }, [resetActivityTimer, handleLogout]);

  // Écouter les événements d'activité utilisateur
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [resetActivityTimer]);

  // Vérifier le timeout de session
  useEffect(() => {
    if (status !== "authenticated" || !session) {
      return;
    }

    const checkSessionTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = (now - lastActivity) / 1000;
      const timeUntilWarning = finalConfig.warningTime - timeSinceLastActivity;
      const timeUntilLogout = finalConfig.logoutTime - timeSinceLastActivity;

      // Afficher l'avertissement
      if (timeUntilWarning <= 0 && timeUntilLogout > 0) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(timeUntilLogout));
      }

      // Déconnexion automatique
      if (timeUntilLogout <= 0) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSessionTimeout, finalConfig.checkInterval);

    return () => clearInterval(interval);
  }, [
    session,
    status,
    lastActivity,
    finalConfig,
    handleLogout,
  ]);

  return {
    showWarning,
    timeLeft,
    extendSession,
    handleLogout,
    resetActivityTimer,
  };
}; 