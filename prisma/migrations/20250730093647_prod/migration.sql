-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SignatureField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "value" TEXT,
    "signatureType" TEXT NOT NULL DEFAULT 'simple',
    "documentId" TEXT NOT NULL,
    "signatoryId" TEXT,
    CONSTRAINT "SignatureField_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SignatureField_signatoryId_fkey" FOREIGN KEY ("signatoryId") REFERENCES "Signatory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SignatureField" ("documentId", "height", "id", "page", "signatoryId", "type", "value", "width", "x", "y") SELECT "documentId", "height", "id", "page", "signatoryId", "type", "value", "width", "x", "y" FROM "SignatureField";
DROP TABLE "SignatureField";
ALTER TABLE "new_SignatureField" RENAME TO "SignatureField";
CREATE INDEX "SignatureField_documentId_idx" ON "SignatureField"("documentId");
CREATE INDEX "SignatureField_signatoryId_idx" ON "SignatureField"("signatoryId");
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
    "typedSignature" TEXT,
    "typedSignatureFont" TEXT,
    "drawnSignature" TEXT,
    "uploadedSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "drawnSignature", "email", "emailVerified", "hashedPassword", "id", "image", "name", "typedSignature", "typedSignatureFont", "updatedAt", "uploadedSignature", "zkCommitment") SELECT "createdAt", "drawnSignature", "email", "emailVerified", "hashedPassword", "id", "image", "name", "typedSignature", "typedSignatureFont", "updatedAt", "uploadedSignature", "zkCommitment" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_zkCommitment_key" ON "User"("zkCommitment");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
