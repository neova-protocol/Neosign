import { NextRequest, NextResponse } from "next/server";
import { ZKProvider } from "@/lib/zk-provider";
import { prisma } from "@/lib/db";
import { ZKAuth } from "@/lib/zk-auth";

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case "generate_challenge":
        const challenge = await ZKProvider.generateChallenge();
        return NextResponse.json({ challenge });

      case "verify_proof":
        const { commitment, proof, challenge: challengeData } = data;

        console.log("Vérification de preuve ZK pour commitment:", commitment.substring(0, 16) + "...");

        // Vérifier la preuve ZK
        const isValid = await ZKProvider.verifyCredentials({
          commitment,
          proof,
          challenge: challengeData,
        });

        if (!isValid) {
          console.log("Preuve ZK invalide");
          return NextResponse.json(
            { error: "Invalid ZK proof" },
            { status: 401 },
          );
        }

        console.log("Preuve ZK valide, recherche de l'utilisateur...");

        // Chercher l'utilisateur par commitment
        const user = await prisma.user.findFirst({
          where: { zkCommitment: commitment },
        });

        if (!user) {
          console.log("Utilisateur non trouvé, retour 404 pour déclencher l'auto-registration");
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        }

        console.log("Utilisateur trouvé:", user.email);
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });

      case "register":
        const { name, email, commitment: newCommitment } = data;

        console.log("Tentative d'enregistrement pour:", email);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          console.log("Utilisateur existe déjà:", email);
          return NextResponse.json(
            { error: "User already exists" },
            { status: 409 },
          );
        }

        // Vérifier si le commitment est déjà utilisé
        const existingCommitment = await prisma.user.findFirst({
          where: { zkCommitment: newCommitment },
        });

        if (existingCommitment) {
          console.log("Commitment déjà utilisé par:", existingCommitment.email);
          return NextResponse.json(
            { error: "ZK identity already registered" },
            { status: 409 },
          );
        }

        console.log("Création d'un nouvel utilisateur:", email);

        // Créer un nouvel utilisateur avec le commitment ZK
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            zkCommitment: newCommitment,
          },
        });

        console.log("Nouvel utilisateur créé avec succès:", newUser.id);

        return NextResponse.json({
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur dans l'API ZK:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
