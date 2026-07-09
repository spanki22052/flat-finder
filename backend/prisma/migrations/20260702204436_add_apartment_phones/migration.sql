-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "phones" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];