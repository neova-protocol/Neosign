import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { AdvancedAuthService } from "@/services/auth/AdvancedAuthService";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { requiredMethods = ['sms', 'email'] } = await req.json();
    const userId = session.user.id;

    // 1. Vérifier que l'utilisateur a configuré au moins 2 méthodes 2FA
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        phoneNumber: true,
        authenticatorEnabled: true,
        twoFactorMethods: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Parser les méthodes 2FA configurées
    const configuredMethods = JSON.parse(user.twoFactorMethods || '[]');
    
    // Vérifier qu'au moins 2 méthodes sont configurées
    if (configuredMethods.length < 2) {
      return NextResponse.json({
        error: "Configuration 2FA insuffisante",
        message: "Pour signer en AES, vous devez configurer au moins 2 méthodes d'authentification",
        requiredMethods: 2,
        configuredMethods: configuredMethods.length,
        availableMethods: configuredMethods
      }, { status: 400 });
    }

    // 2. Créer une session d'authentification avancée
    const authService = AdvancedAuthService.getInstance();
    const authSession = await authService.createAdvancedAuthSession(
      userId,
      req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1',
      req.headers.get('user-agent') || 'Unknown',
      requiredMethods.slice(0, 2) // Prendre les 2 premières méthodes
    );

    // 3. Envoyer les codes de validation
    const validationResults = [];
    
    for (const method of authSession.requirements) {
      let sent = false;
      
      switch (method.type) {
        case 'sms':
          if (user.phoneNumber) {
            sent = await authService.sendSMSValidationCode(user.phoneNumber, method.validationCode!);
          }
          break;
        case 'email':
          if (user.email) {
            sent = await authService.sendEmailValidationCode(user.email, method.validationCode!);
          }
          break;
        case 'authenticator':
          // Pour l'authenticator, on génère un code TOTP
          authService.generateTOTPCode('test-secret'); // En production, utiliser le secret réel
          sent = true;
          break;
      }
      
      validationResults.push({
        method: method.type,
        sent,
        code: method.validationCode,
        expiresAt: method.expiresAt
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: authSession.id,
      sessionToken: authSession.sessionToken,
      requirements: authSession.requirements.map(req => ({
        type: req.type,
        isRequired: req.isRequired,
        isCompleted: req.isCompleted,
        expiresAt: req.expiresAt
      })),
      validationResults,
      message: "Session d'authentification AES créée. Validez les codes reçus pour continuer."
    });

  } catch (error) {
    console.error("Erreur lors de la validation d'authentification AES:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { sessionId, validationCodes } = await req.json();

    const authService = AdvancedAuthService.getInstance();
    
    // Valider chaque méthode
    const validationResults = [];
    let allValid = true;

    for (const [methodType, code] of Object.entries(validationCodes)) {
      const isValid = await authService.validateAuthMethod(sessionId, methodType, code as string);
      validationResults.push({
        method: methodType,
        isValid
      });
      
      if (!isValid) {
        allValid = false;
      }
    }

    if (!allValid) {
      return NextResponse.json({
        error: "Validation échouée",
        message: "Un ou plusieurs codes de validation sont incorrects",
        validationResults
      }, { status: 400 });
    }

    // Vérifier la completion de la session
    const completion = await authService.checkAuthCompletion(sessionId);
    
    if (!completion.isCompleted) {
      return NextResponse.json({
        error: "Authentification incomplète",
        message: "Vous devez valider au moins 2 méthodes d'authentification pour AES",
        completion
      }, { status: 400 });
    }

    // Vérifier la compliance eIDAS
    const eidasValidation = authService.validateEIDASRequirements(
      completion.completedMethods
    );

    if (!eidasValidation.isCompliant) {
      return NextResponse.json({
        error: "Non conforme eIDAS",
        message: "L'authentification ne respecte pas les exigences eIDAS pour AES",
        requirements: eidasValidation.requirements,
        validations: eidasValidation.validations
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Authentification AES validée avec succès",
      eIDASLevel: "AES",
      legalValue: "Advanced",
      completedMethods: completion.completedMethods,
      compliance: eidasValidation
    });

  } catch (error) {
    console.error("Erreur lors de la validation des codes AES:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 