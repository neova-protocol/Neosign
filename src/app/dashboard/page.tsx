"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, ExternalLink, Shield, Clock, Settings, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { DecorativeDashboard } from "@/components/DecorativeDashboard";
import { getDocuments } from "@/lib/api";
import { Document } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    drafts: 0,
    signingInvitations: 0,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchDocuments() {
      if (status !== "authenticated") {
        return;
      }
      try {
        const docs = await getDocuments();
        setDocuments(docs);

        // Calcul des statistiques selon la logique spécifiée
        const userId = session.user.id;
        const userEmail = session.user.email;

        // 1. Completed signatures = Documents signés par tout le monde
        const completed = docs.filter((doc: Document) => 
          doc.status === "completed"
        ).length;

        // 2. In progress = Je n'ai pas à signer et j'attends la signature de quelqu'un
        const inProgress = docs.filter((doc: Document) => {
          // Je suis le créateur du document
          const isCreator = doc.creatorId === userId;
          // Je n'ai pas à signer (pas dans les signataires ou déjà signé)
          const hasNoSignatureRequired = !doc.signatories.some(s => 
            s.email === userEmail && s.status === "pending"
          );
          // Le document est envoyé (pas draft, pas cancelled)
          const isSent = doc.status === "sent";
          
          return isCreator && hasNoSignatureRequired && isSent;
        }).length;

        // 3. Signing invitation = J'ai à signer un document
        const signingInvitations = docs.filter((doc: Document) => {
          // Je suis dans les signataires et j'ai encore à signer
          return doc.signatories.some(s => 
            s.email === userEmail && s.status === "pending"
          );
        }).length;

        // 4. Drafts = Mes brouillons
        const drafts = docs.filter((doc: Document) => 
          doc.status === "draft" && doc.creatorId === userId
        ).length;

        setStats({
          completed,
          inProgress,
          drafts,
          signingInvitations,
        });
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocuments();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 relative overflow-hidden">
      <main>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-2xl">
              Create, manage and sign docs by{" "}
              <span className="text-blue-500">leveraging decentralisation</span>
            </h1>
            <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1 hover:border-blue-500 hover:text-blue-500 transition-colors">
              Learn more
            </button>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 relative">
            <h2 className="text-3xl font-semibold text-blue-500 mb-8 text-center">
              Your overview
            </h2>
            <div className="flex justify-around items-center">
              <div className="relative">
                <DecorativeDashboard />
              </div>

              <div className="text-center">
                <div className="text-7xl font-bold text-gray-900 mb-3">
                  {stats.completed}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Completed Signatures
                </div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold text-gray-900 mb-3">
                  {stats.inProgress}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  In progress Signatures
                </div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold text-gray-900 mb-3">
                  {stats.signingInvitations}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Signing Invitation
                </div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold text-gray-900 mb-3">
                  {stats.drafts}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  Drafts Signatures
                </div>
              </div>

              <div className="relative">
                <DecorativeDashboard />
              </div>
            </div>
          </div>

          {/* Tests Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold text-blue-500 mb-8 text-center">
              Tests & Compliance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/test-compliance">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Test eIDAS Compliance</h3>
                      <p className="text-sm text-gray-600">Vérifier la conformité SES/AES</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Testez la compliance de vos signatures aux standards eIDAS
                  </p>
                </div>
              </Link>

              <Link href="/test-session-timeout">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Test Session Timeout</h3>
                      <p className="text-sm text-gray-600">Vérifier les timeouts de session</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Testez le système de timeout de session et d&apos;authentification
                  </p>
                </div>
              </Link>

              <Link href="/test-aes-dialog">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Test Dialog AES</h3>
                      <p className="text-sm text-gray-600">Tester le dialog AES</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Testez le dialog AES avec différents scénarios 2FA
                  </p>
                </div>
              </Link>

              <Link href="/test-2fa-config">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Test Config 2FA</h3>
                      <p className="text-sm text-gray-600">Vérifier la config 2FA</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Vérifiez la configuration 2FA et son impact sur AES
                  </p>
                </div>
              </Link>

              <Link href="/debug-2fa">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:border-red-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Bug className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Debug 2FA</h3>
                      <p className="text-sm text-gray-600">Debug détaillé</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Debug détaillé de la configuration 2FA
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Loading documents...</p>
              </div>
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <Link href={`/dashboard/documents/${doc.id}`} key={doc.id}>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Created on{" "}
                        {new Date(doc.createdAt).toLocaleDateString()} | By{" "}
                        {doc.creator.name}{" "}
                        {doc.creatorId === session?.user?.id ? "(me)" : ""}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center -space-x-2">
                        {doc.signatories.slice(0, 3).map((signatory) => (
                          <Avatar
                            key={signatory.id}
                            className="w-6 h-6 border-2 border-white"
                          >
                            <AvatarImage
                              src={
                                signatory.user?.image ||
                                `https://ui-avatars.com/api/?name=${signatory.name}&background=random`
                              }
                            />
                            <AvatarFallback className="text-xs">
                              {signatory.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {doc.signatories.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                            +{doc.signatories.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            doc.status === "completed"
                              ? "bg-green-500"
                              : doc.status === "draft"
                                ? "bg-gray-400"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {doc.status}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/dashboard/documents/${doc.id}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("More options");
                        }}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No documents to display.</p>
                <Link href="/dashboard/sign">
                  <Button className="mt-4">Create your first document</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
