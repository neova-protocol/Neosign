"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SettingsHeader = () => {
  const { data: session } = useSession();

  const memberSince = session?.user?.createdAt
    ? formatDistanceToNow(new Date(session.user.createdAt), { addSuffix: true })
    : "N/A";

  return (
    <div className="bg-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                session?.user?.image ?? "/placeholder.svg?height=80&width=80"
              }
            />
            <AvatarFallback className="text-2xl">
              {session?.user?.name?.charAt(0).toUpperCase() ?? "S"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {session?.user?.name ?? "User Name"}
            </h1>
            <p className="text-gray-300 text-sm">Member Since: {memberSince}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-white font-medium">Basic Plan</span>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
