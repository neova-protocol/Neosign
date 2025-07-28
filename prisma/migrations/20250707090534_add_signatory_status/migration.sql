-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signatory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'preparing',
    "signedAt" DATETIME,
    "userId" TEXT,
    CONSTRAINT "Signatory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Signatory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Signatory" ("documentId", "email", "id", "name", "signedAt", "token", "userId") SELECT "documentId", "email", "id", "name", "signedAt", "token", "userId" FROM "Signatory";
DROP TABLE "Signatory";
ALTER TABLE "new_Signatory" RENAME TO "Signatory";
CREATE UNIQUE INDEX "Signatory_token_key" ON "Signatory"("token");
CREATE UNIQUE INDEX "Signatory_documentId_email_key" ON "Signatory"("documentId", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
