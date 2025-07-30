-- CreateTable
CREATE TABLE "TempCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "hashedPassword" TEXT,
    "zkCommitment" TEXT,
    "phoneNumber" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "authenticatorSecret" TEXT,
    "authenticatorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorMethods" TEXT NOT NULL DEFAULT '[]',
    "accountStatus" TEXT NOT NULL DEFAULT 'active',
    "deletionRequestedAt" DATETIME,
    "deletionScheduledAt" DATETIME,
    "deletionReason" TEXT,
    "typedSignature" TEXT,
    "typedSignatureFont" TEXT,
    "drawnSignature" TEXT,
    "uploadedSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("authenticatorEnabled", "authenticatorSecret", "createdAt", "drawnSignature", "email", "emailVerified", "hashedPassword", "id", "image", "name", "phoneNumber", "phoneVerified", "twoFactorMethods", "typedSignature", "typedSignatureFont", "updatedAt", "uploadedSignature", "zkCommitment") SELECT "authenticatorEnabled", "authenticatorSecret", "createdAt", "drawnSignature", "email", "emailVerified", "hashedPassword", "id", "image", "name", "phoneNumber", "phoneVerified", "twoFactorMethods", "typedSignature", "typedSignatureFont", "updatedAt", "uploadedSignature", "zkCommitment" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_zkCommitment_key" ON "User"("zkCommitment");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TempCode_email_type_idx" ON "TempCode"("email", "type");

-- CreateIndex
CREATE INDEX "TempCode_expiresAt_idx" ON "TempCode"("expiresAt");
