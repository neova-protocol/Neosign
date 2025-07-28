"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Eye, EyeOff } from "lucide-react";
import { ZKSessionManager } from "@/lib/zk-auth";

interface ZKInfoProps {
  user: any;
}

export default function ZKInfo({ user }: ZKInfoProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [identity, setIdentity] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const savedIdentity = ZKSessionManager.getIdentity();
    const savedSession = ZKSessionManager.getSession();

    setIdentity(savedIdentity);
    setSession(savedSession);
  }, []);

  const handleClearZK = () => {
    ZKSessionManager.clearSession();
    setIdentity(null);
    setSession(null);
  };

  const isZKUser = user?.zkCommitment;

  if (!isZKUser && !identity) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Authentification Zero Knowledge
        </CardTitle>
        <CardDescription>
          Informations sur votre identité ZK et votre session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={identity ? "default" : "secondary"}>
              {identity ? "Identité Active" : "Identité Inactive"}
            </Badge>
            {session && <Badge variant="outline">Session Active</Badge>}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showDetails && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            {identity && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Identité ZK
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Commitment:</span>
                    <p className="font-mono bg-gray-100 p-2 rounded break-all">
                      {identity.commitment}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Nullifier:</span>
                    <p className="font-mono bg-gray-100 p-2 rounded break-all">
                      {identity.nullifier}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {session && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Session Active
                </h4>
                <div className="text-xs">
                  <p>
                    <span className="font-medium">Timestamp:</span>{" "}
                    {new Date(session.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Public Input:</span>{" "}
                    {session.publicInput.substring(0, 32)}...
                  </p>
                </div>
              </div>
            )}

            {user?.zkCommitment && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Commitment Enregistré
                </h4>
                <p className="font-mono bg-gray-100 p-2 rounded break-all text-xs">
                  {user.zkCommitment}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearZK}
            className="flex-1"
          >
            Effacer les données ZK
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            • Votre identité ZK est stockée localement dans votre navigateur
          </p>
          <p>• Aucune information sensible n'est transmise au serveur</p>
          <p>• Vous pouvez effacer vos données ZK à tout moment</p>
        </div>
      </CardContent>
    </Card>
  );
}
