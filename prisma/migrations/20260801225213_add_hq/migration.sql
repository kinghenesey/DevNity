-- CreateEnum
CREATE TYPE "HqRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "Hq" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "CrewVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HqMember" (
    "id" TEXT NOT NULL,
    "hqId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "HqRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HqMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HqBuild" (
    "id" TEXT NOT NULL,
    "hqId" TEXT NOT NULL,
    "buildId" TEXT NOT NULL,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HqBuild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hq_slug_key" ON "Hq"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HqMember_hqId_userId_key" ON "HqMember"("hqId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "HqBuild_hqId_buildId_key" ON "HqBuild"("hqId", "buildId");

-- AddForeignKey
ALTER TABLE "HqMember" ADD CONSTRAINT "HqMember_hqId_fkey" FOREIGN KEY ("hqId") REFERENCES "Hq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HqMember" ADD CONSTRAINT "HqMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HqBuild" ADD CONSTRAINT "HqBuild_hqId_fkey" FOREIGN KEY ("hqId") REFERENCES "Hq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HqBuild" ADD CONSTRAINT "HqBuild_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE ON UPDATE CASCADE;
