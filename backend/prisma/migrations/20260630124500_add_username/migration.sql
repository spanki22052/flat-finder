-- Add username field and make email optional
-- Step 1: Add column as nullable first
ALTER TABLE "User" ADD COLUMN "username" TEXT;
-- Step 2: Update existing users with a generated username
UPDATE "User" SET "username" = 'user_' || id WHERE "username" IS NULL;
-- Step 3: Add unique constraint
ALTER TABLE "User" ADD CONSTRAINT "User_username_key" UNIQUE ("username");
-- Step 4: Make column required
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
-- Step 5: Make email optional
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
