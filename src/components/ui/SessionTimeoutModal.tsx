"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutModal({
  isOpen,
  timeLeft,
  onExtend,
  onLogout,
}: SessionTimeoutModalProps) {
  const [countdown, setCountdown] = useState(timeLeft);
  const [isExtending, setIsExtending] = useState(false);

  // Mettre à jour le countdown
  useEffect(() => {
    setCountdown(timeLeft);
  }, [timeLeft]);

  // Countdown en temps réel
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdown, onLogout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      await onExtend();
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Session expirant</DialogTitle>
          </div>
          <DialogDescription>
            Votre session va expirer dans{" "}
            <span className="font-semibold text-red-600">
              {formatTime(countdown)}
            </span>
            . Pour continuer à utiliser l&apos;application, cliquez sur &quot;Rester connecté&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {formatTime(countdown)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Temps restant
            </p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1"
          >
            Se déconnecter
          </Button>
          <Button
            onClick={handleExtend}
            disabled={isExtending}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isExtending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Extension...
              </>
            ) : (
              "Rester connecté"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 