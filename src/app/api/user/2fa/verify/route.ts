import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { authenticator } from "otplib";
import { getCode, deleteCode, cleanupExpiredCodes, getAllCodes } from "@/lib/temp-codes-db";
import { getSMSCode, deleteSMSCode, cleanupExpiredSMSCodes } from "@/lib/sms-codes-db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { method, code, phoneNumber, email } = await request.json();
    
    if (!method || !code) {
      return NextResponse.json(
        { error: "Method and code are required" },
        { status: 400 }
      );
    }

    let isValid = false;
    let updatedMethods: string[] = [];

    await cleanupExpiredCodes();

    switch (method) {
      case 'email':
        // Vérifier que l'email est fourni
        if (!email) {
          return NextResponse.json(
            { error: "Email is required for email verification" },
            { status: 400 }
          );
        }

        // Pour la vérification 2FA, on accepte l'email d'authentification
        // qui peut être différent de l'email de session (cas ZK)
        console.log(`Vérification 2FA email: ${email} (session email: ${session.user.email})`);
        
        // Récupérer le code stocké pour cet email
        const storedData = await getCode(email, "2fa");
        
        console.log(`Vérification email: ${email}`);
        console.log(`Codes stockés:`, await getAllCodes());
        console.log(`Code stocké pour ${email}:`, storedData);
        
        if (!storedData) {
          console.log(`Aucun code trouvé pour l'email: ${email}`);
          return NextResponse.json(
            { error: "Aucun code de vérification trouvé. Veuillez demander un nouveau code." },
            { status: 400 }
          );
        }

        // Vérifier l'expiration
        if (storedData.expiresAt < Date.now()) {
          console.log(`Code expiré pour l'email: ${email}`);
          await deleteCode(email, "2fa");
          return NextResponse.json(
            { error: "Code de vérification expiré. Veuillez demander un nouveau code." },
            { status: 400 }
          );
        }

        // Vérifier le code
        if (storedData.code === code) {
          console.log(`Code vérifié avec succès pour l'email: ${email}`);
          isValid = true;
          await deleteCode(email, "2fa");
          
          // Mettre à jour emailVerified quand l'email 2FA est vérifié
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              emailVerified: new Date()
            }
          });
        } else {
          console.log(`Code incorrect pour l'email: ${email}. Attendu: ${storedData.code}, Reçu: ${code}`);
          return NextResponse.json(
            { error: "Code de vérification incorrect" },
            { status: 400 }
          );
        }
        break;

      case 'sms':
        // Nettoyer les codes expirés
        await cleanupExpiredSMSCodes();
        
        // Vérifier que le numéro de téléphone est fourni
        if (!phoneNumber) {
          return NextResponse.json(
            { error: "Phone number is required for SMS verification" },
            { status: 400 }
          );
        }

        // Formater le numéro de téléphone
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+33${phoneNumber.replace(/^0/, '')}`;
        
        // Récupérer le code stocké pour ce numéro
        const storedSMSData = await getSMSCode(formattedPhoneNumber, "2fa");
        
        console.log(`Vérification SMS: ${formattedPhoneNumber}`);
        console.log(`Code stocké pour ${formattedPhoneNumber}:`, storedSMSData);
        
        if (!storedSMSData) {
          console.log(`Aucun code SMS trouvé pour le numéro: ${formattedPhoneNumber}`);
          return NextResponse.json(
            { error: "Aucun code de vérification SMS trouvé. Veuillez demander un nouveau code." },
            { status: 400 }
          );
        }

        // Vérifier l'expiration
        if (storedSMSData.expiresAt < Date.now()) {
          console.log(`Code SMS expiré pour le numéro: ${formattedPhoneNumber}`);
          await deleteSMSCode(formattedPhoneNumber, "2fa");
          return NextResponse.json(
            { error: "Code de vérification SMS expiré. Veuillez demander un nouveau code." },
            { status: 400 }
          );
        }

        // Vérifier le code
        if (storedSMSData.code === code) {
          console.log(`Code SMS vérifié avec succès pour le numéro: ${formattedPhoneNumber}`);
          isValid = true;
          await deleteSMSCode(formattedPhoneNumber, "2fa");
          
          // Mettre à jour phoneVerified quand le SMS 2FA est vérifié
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              phoneNumber: formattedPhoneNumber,
              phoneVerified: true,
            }
          });
        } else {
          console.log(`Code SMS incorrect pour le numéro: ${formattedPhoneNumber}. Attendu: ${storedSMSData.code}, Reçu: ${code}`);
          return NextResponse.json(
            { error: "Code de vérification SMS incorrect" },
            { status: 400 }
          );
        }
        break;

      case 'authenticator':
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { authenticatorSecret: true }
        });

        if (user?.authenticatorSecret) {
          isValid = authenticator.verify({
            token: code,
            secret: user.authenticatorSecret
          });
          
          // Activer l'authenticator si le code est valide
          if (isValid) {
            await prisma.user.update({
              where: { id: session.user.id },
              data: {
                authenticatorEnabled: true
              }
            });
          }
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid method" },
          { status: 400 }
        );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Mettre à jour les méthodes 2FA activées
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorMethods: true }
    });

    if (currentUser) {
      try {
        const currentMethods = JSON.parse(currentUser.twoFactorMethods || '[]');
        if (!currentMethods.includes(method)) {
          updatedMethods = [...currentMethods, method];
        } else {
          updatedMethods = currentMethods;
        }
      } catch {
        updatedMethods = [method];
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorMethods: JSON.stringify(updatedMethods),
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `${method.toUpperCase()} 2FA activated successfully`,
      methods: updatedMethods
    });

  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 