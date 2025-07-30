"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

const SettingsHeader = () => {
  const { data: session } = useSession();

  const memberSince = session?.user?.createdAt
    ? formatDistanceToNow(new Date(session.user.createdAt), { addSuffix: true })
    : "N/A";

  // Plan actuel de l'utilisateur (à connecter avec la vraie logique)
  const currentPlan = {
    name: "Basic Plan",
    type: "freemium" as "freemium" | "premium" | "corporate"
  };

  const getPlanDisplayName = (planType: string) => {
    switch (planType) {
      case "freemium":
        return "Basic Plan";
      case "premium":
        return "Premium Plan";
      case "corporate":
        return "Corporate Plan";
      default:
        return "Basic Plan";
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case "freemium":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "premium":
        return "bg-gradient-to-r from-purple-400 to-pink-500";
      case "corporate":
        return "bg-gradient-to-r from-gray-600 to-gray-800";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "premium":
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case "corporate":
        return <Sparkles className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">
      {/* Effet de fond avec cercles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-4 ring-white/20 shadow-xl">
              <AvatarImage
                src={
                  session?.user?.image ?? "/placeholder.svg?height=80&width=80"
                }
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {session?.user?.name?.charAt(0).toUpperCase() ?? "S"}
              </AvatarFallback>
            </Avatar>
            {/* Indicateur de statut en ligne */}
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-400 border-2 border-white shadow-lg"></div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {session?.user?.name ?? "User Name"}
            </h1>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Member Since: {memberSince}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Badge du plan */}
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className={`w-3 h-3 rounded-full ${getPlanColor(currentPlan.type)} shadow-lg`}></div>
            <span className="text-white font-medium flex items-center gap-2">
              {getPlanIcon(currentPlan.type)}
              {getPlanDisplayName(currentPlan.type)}
            </span>
          </div>

          {/* Bouton Upgrade */}
          {currentPlan.type === "freemium" && (
            <Link href="/dashboard/settings/subscription">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
    </div>
  );
};

export default SettingsHeader;
