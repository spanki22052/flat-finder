-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
