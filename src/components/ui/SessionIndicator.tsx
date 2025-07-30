"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { Clock, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SessionIndicator() {
  const { showWarning, timeLeft, extendSession } = useSessionTimeout({
    warningTime: 25 * 60,
    logoutTime: 30 * 60,
    checkInterval: 1000,
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!showWarning) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={extendSession}
            className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm font-medium transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cliquez pour étendre votre session</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 