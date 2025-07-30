import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // Documents à signer (reçus ou dans mes propres documents mais pas encore signés)
    const documentsToSign = await prisma.document.count({
      where: {
        OR: [
          // Documents reçus où je suis signataire et pas encore signé
          {
            signatories: {
              some: {
                email: userEmail,
                signedAt: null
              }
            }
          },
          // Mes propres documents où je suis signataire et pas encore signé
          {
            creatorId: userId,
            signatories: {
              some: {
                email: userEmail,
                signedAt: null
              }
            }
          }
        ]
      }
    });

    // Documents complétés (tous les signataires ont signé)
    const completedDocuments = await prisma.document.count({
      where: {
        OR: [
          // Documents reçus complétés
          {
            signatories: {
              some: {
                email: userEmail
              },
              none: {
                signedAt: null
              }
            }
          },
          // Mes propres documents complétés
          {
            creatorId: userId,
            signatories: {
              none: {
                signedAt: null
              }
            }
          }
        ]
      }
    });

    // Documents en cours (mes documents envoyés où je n'ai plus d'action à faire)
    const inProgressDocuments = await prisma.document.count({
      where: {
        creatorId: userId,
        status: {
          in: ['sent', 'partially_signed']
        },
        signatories: {
          some: {
            signedAt: null
          }
        }
      }
    });

    // Total des documents
    const totalDocuments = await prisma.document.count({
      where: {
        OR: [
          { creatorId: userId },
          {
            signatories: {
              some: {
                email: userEmail
              }
            }
          }
        ]
      }
    });

    return NextResponse.json({
      toSign: documentsToSign,
      completed: completedDocuments,
      inProgress: inProgressDocuments,
      total: totalDocuments
    });

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 