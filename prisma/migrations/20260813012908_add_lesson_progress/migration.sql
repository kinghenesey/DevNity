-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "completedLessonIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
