-- CreateEnum
CREATE TYPE "CollabBudget" AS ENUM ('VOLUNTEER', 'REVENUE_SHARE', 'PAID');

-- CreateEnum
CREATE TYPE "CollabStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Collab" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rolesNeeded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "budget" "CollabBudget" NOT NULL DEFAULT 'VOLUNTEER',
    "deadline" TIMESTAMP(3),
    "experience" TEXT,
    "status" "CollabStatus" NOT NULL DEFAULT 'OPEN',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabApplication" (
    "id" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollabApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollabApplication_collabId_userId_key" ON "CollabApplication"("collabId", "userId");

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabApplication" ADD CONSTRAINT "CollabApplication_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabApplication" ADD CONSTRAINT "CollabApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
