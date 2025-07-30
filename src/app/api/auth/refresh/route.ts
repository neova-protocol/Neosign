import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // La session NextAuth se rafraîchit automatiquement
    // Cette API peut être utilisée pour des vérifications supplémentaires
    // ou pour enregistrer l'activité utilisateur

    return NextResponse.json({
      success: true,
      message: "Session rafraîchie",
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });

  } catch (error) {
    console.error("Erreur lors du rafraîchissement de session:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 