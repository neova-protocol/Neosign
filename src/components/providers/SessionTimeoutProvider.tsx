"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import SessionTimeoutModal from "@/components/ui/SessionTimeoutModal";

interface SessionTimeoutProviderProps {
  children: React.ReactNode;
}

export default function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps) {
  const { showWarning, timeLeft, extendSession, handleLogout } = useSessionTimeout({
    warningTime: 25 * 60, // 25 minutes
    logoutTime: 30 * 60, // 30 minutes
    checkInterval: 1000, // Vérifier toutes les secondes
  });

  return (
    <>
      {children}
      <SessionTimeoutModal
        isOpen={showWarning}
        timeLeft={timeLeft}
        onExtend={extendSession}
        onLogout={handleLogout}
      />
    </>
  );
} 