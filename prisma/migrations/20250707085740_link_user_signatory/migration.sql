/*
  Warnings:

  - You are about to drop the column `color` on the `Signatory` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Signatory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Signatory` table. All the data in the column will be lost.
  - Added the required column `token` to the `Signatory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Add token column with a default value for existing rows
ALTER TABLE "Signatory" ADD COLUMN "token" TEXT;
UPDATE "Signatory" SET "token" = hex(randomblob(16)) WHERE "token" IS NULL;

-- Now make the token column NOT NULL
CREATE TABLE "new_Signatory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "signedAt" DATETIME,
    "userId" TEXT,
    CONSTRAINT "Signatory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Signatory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
-- We select the newly added token column
INSERT INTO "new_Signatory" ("documentId", "email", "id", "name", "userId", "token") 
SELECT "documentId", "email", "id", "name", "userId", "token" FROM "Signatory";
DROP TABLE "Signatory";
ALTER TABLE "new_Signatory" RENAME TO "Signatory";
CREATE UNIQUE INDEX "Signatory_token_key" ON "Signatory"("token");
CREATE UNIQUE INDEX "Signatory_documentId_email_key" ON "Signatory"("documentId", "email");


CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- Add the new updatedAt column with a default value
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "image", "id", "name", "password", "updatedAt") 
SELECT "createdAt", "email", "emailVerified", "image", "id", "name", "password", CURRENT_TIMESTAMP FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
