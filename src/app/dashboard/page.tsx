"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NeovaLogo } from "@/components/NeovaLogo";
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

        const completed = docs.filter(
          (doc: Document) => doc.status === "completed"
        ).length;
        const inProgress = docs.filter(
          (doc: Document) => doc.status === "sent"
        ).length;
        const drafts = docs.filter(
          (doc: Document) => doc.status === "draft"
        ).length;

        setStats({
          completed,
          inProgress,
          drafts,
          signingInvitations: inProgress,
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
    return <div className="flex items-center justify-center h-screen"><p>Loading session...</p></div>;
  }

  return (
    <div className="flex-1 p-6 relative overflow-hidden">
      <NeovaLogo
        style={{
          position: "absolute",
          top: "2rem",
          right: "4rem",
          width: "500px",
          height: "500px",
          opacity: "0.1",
        }}
      />
      <main>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-2xl">
              Create, manage and sign docs by{" "}
              <span className="text-blue-500">
                leveraging decentralisation
              </span>
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
                  <Button className="mt-4">
                    Create your first document
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}