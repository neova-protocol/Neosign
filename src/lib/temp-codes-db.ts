import { prisma } from "@/lib/db";

export async function cleanupExpiredCodes() {
  const now = new Date();
  await prisma.tempCode.deleteMany({
    where: {
      expiresAt: {
        lt: now
      }
    }
  });
}

export async function storeCode(email: string, code: string, type: string = "2fa", expiresInMinutes: number = 5) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
  
  await prisma.tempCode.create({
    data: {
      email,
      code,
      type,
      expiresAt
    }
  });
  
  console.log(`Code stocké en DB pour ${email}: ${code} (expire dans ${expiresInMinutes} minutes)`);
}

export async function getCode(email: string, type: string = "2fa") {
  const tempCode = await prisma.tempCode.findFirst({
    where: {
      email,
      type,
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

export async function deleteCode(email: string, type: string = "2fa") {
  await prisma.tempCode.deleteMany({
    where: {
      email,
      type
    }
  });
}

export async function getAllCodes() {
  const codes = await prisma.tempCode.findMany({
    where: {
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return codes.map((code: any) => [code.email, {
    code: code.code,
    expiresAt: code.expiresAt.getTime()
  }]);
} 