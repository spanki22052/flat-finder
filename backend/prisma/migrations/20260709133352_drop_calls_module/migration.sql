-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT IF EXISTS "Call_apartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT IF EXISTS "Call_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT IF EXISTS "Call_userId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Call_apartmentId_idx";
DROP INDEX IF EXISTS "Call_userId_idx";

-- DropTable
DROP TABLE IF EXISTS "Call";

-- DropEnum
DROP TYPE IF EXISTS "CallOutcome";