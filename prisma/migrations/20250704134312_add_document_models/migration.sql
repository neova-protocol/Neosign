-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Document_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signatory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'preparing',
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Signatory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Signatory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SignatureField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "value" TEXT,
    "documentId" TEXT NOT NULL,
    "signatoryId" TEXT,
    CONSTRAINT "SignatureField_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SignatureField_signatoryId_fkey" FOREIGN KEY ("signatoryId") REFERENCES "Signatory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocumentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "DocumentEvent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Document_creatorId_idx" ON "Document"("creatorId");

-- CreateIndex
CREATE INDEX "Signatory_documentId_idx" ON "Signatory"("documentId");

-- CreateIndex
CREATE INDEX "Signatory_userId_idx" ON "Signatory"("userId");

-- CreateIndex
CREATE INDEX "SignatureField_documentId_idx" ON "SignatureField"("documentId");

-- CreateIndex
CREATE INDEX "SignatureField_signatoryId_idx" ON "SignatureField"("signatoryId");

-- CreateIndex
CREATE INDEX "DocumentEvent_documentId_idx" ON "DocumentEvent"("documentId");

-- CreateIndex
CREATE INDEX "DocumentEvent_userId_idx" ON "DocumentEvent"("userId");
