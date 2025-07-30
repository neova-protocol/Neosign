// Stockage temporaire des codes (en production, utiliser Redis ou une base de données)
const tempCodes = new Map<string, { code: string; expiresAt: number }>();

export function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [key, value] of tempCodes.entries()) {
    if (value.expiresAt < now) {
      tempCodes.delete(key);
    }
  }
}

export function storeCode(email: string, code: string, expiresInMinutes: number = 5) {
  const expiresAt = Date.now() + (expiresInMinutes * 60 * 1000);
  tempCodes.set(email, { code, expiresAt });
  console.log(`Code stocké pour ${email}: ${code} (expire dans ${expiresInMinutes} minutes)`);
}

export function getCode(email: string): { code: string; expiresAt: number } | undefined {
  return tempCodes.get(email);
}

export function deleteCode(email: string) {
  tempCodes.delete(email);
}

export function getAllCodes() {
  return Array.from(tempCodes.entries());
}

export { tempCodes }; 