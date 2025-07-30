import { prisma } from "@/lib/db";

export async function cleanupExpiredSMSCodes() {
  const now = new Date();
  await prisma.tempCode.deleteMany({
    where: {
      expiresAt: {
        lt: now
      }
    }
  });
}

export async function storeSMSCode(phoneNumber: string, code: string, type: string = "2fa", expiresInMinutes: number = 5) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
  
  // Utiliser le numéro de téléphone comme identifiant dans le champ email
  // (pour réutiliser la table TempCode existante)
  await prisma.tempCode.create({
    data: {
      email: phoneNumber, // Réutilisation du champ email pour le numéro de téléphone
      code,
      type: `sms_${type}`, // Préfixer avec 'sms_' pour distinguer des codes email
      expiresAt
    }
  });
  
  console.log(`Code SMS stocké en DB pour ${phoneNumber}: ${code} (expire dans ${expiresInMinutes} minutes)`);
}

export async function getSMSCode(phoneNumber: string, type: string = "2fa") {
  const tempCode = await prisma.tempCode.findFirst({
    where: {
      email: phoneNumber, // Utiliser le numéro de téléphone
      type: `sms_${type}`, // Préfixer avec 'sms_'
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return tempCode ? {
    code: tempCode.code,
    expiresAt: tempCode.expiresAt.getTime()
  } : undefined;
}

export async function deleteSMSCode(phoneNumber: string, type: string = "2fa") {
  await prisma.tempCode.deleteMany({
    where: {
      email: phoneNumber,
      type: `sms_${type}`
    }
  });
}

export async function getAllSMSCodes() {
  const codes = await prisma.tempCode.findMany({
    where: {
      type: {
        startsWith: 'sms_'
      },
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return codes.map((code) => [code.email, {
    code: code.code,
    expiresAt: code.expiresAt.getTime(),
    type: code.type
  }]);
}

/**
 * Vérifie si un numéro de téléphone a un code SMS valide
 */
export async function hasValidSMSCode(phoneNumber: string, type: string = "2fa"): Promise<boolean> {
  const code = await getSMSCode(phoneNumber, type);
  return !!code;
}

/**
 * Compte le nombre de tentatives SMS pour un numéro de téléphone
 */
export async function getSMSCodeAttempts(phoneNumber: string, type: string = "2fa"): Promise<number> {
  const codes = await prisma.tempCode.count({
    where: {
      email: phoneNumber,
      type: `sms_${type}`,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000) // Dernière heure
      }
    }
  });
  
  return codes;
} 