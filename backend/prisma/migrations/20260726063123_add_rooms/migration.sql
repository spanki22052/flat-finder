-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomMember" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RoomRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_inviteCode_key" ON "Room"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_roomId_userId_key" ON "RoomMember"("roomId", "userId");

-- CreateIndex
CREATE INDEX "RoomMember_userId_idx" ON "RoomMember"("userId");

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Backfill: create one personal room per existing user, make them OWNER ────
-- Реализовано через цикл по id пользователя (а не JOIN по имени), чтобы корректно
-- работать и в случае, если у нескольких пользователей совпадает "name".

DO $$
DECLARE
    u RECORD;
    new_room_id TEXT;
BEGIN
    FOR u IN SELECT "id", "name" FROM "User" LOOP
        new_room_id := gen_random_uuid()::text;

        INSERT INTO "Room" ("id", "name", "inviteCode", "createdAt", "updatedAt")
        VALUES (
            new_room_id,
            u."name" || ' — комната',
            upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
            now(),
            now()
        );

        INSERT INTO "RoomMember" ("id", "roomId", "userId", "role", "joinedAt")
        VALUES (gen_random_uuid()::text, new_room_id, u."id", 'OWNER', now());
    END LOOP;
END $$;

-- ─── AlterTable: Apartment ──────────────────────────────────────────────────

ALTER TABLE "Apartment" ADD COLUMN "roomId" TEXT;

UPDATE "Apartment" a
SET "roomId" = rm."roomId"
FROM "RoomMember" rm
WHERE rm."userId" = a."assigneeId";

-- Квартиры без assignee (не должно быть в текущих данных) — привязываем к комнате первого пользователя.
UPDATE "Apartment" a
SET "roomId" = (SELECT rm."roomId" FROM "RoomMember" rm ORDER BY rm."joinedAt" ASC LIMIT 1)
WHERE a."roomId" IS NULL;

ALTER TABLE "Apartment" ALTER COLUMN "roomId" SET NOT NULL;

-- ─── AlterTable: Contact ─────────────────────────────────────────────────────

ALTER TABLE "Contact" ADD COLUMN "roomId" TEXT;

UPDATE "Contact"
SET "roomId" = (SELECT rm."roomId" FROM "RoomMember" rm ORDER BY rm."joinedAt" ASC LIMIT 1);

ALTER TABLE "Contact" ALTER COLUMN "roomId" SET NOT NULL;

-- ─── AlterTable: Reminder ────────────────────────────────────────────────────

ALTER TABLE "Reminder" ADD COLUMN "roomId" TEXT;

UPDATE "Reminder" r
SET "roomId" = rm."roomId"
FROM "RoomMember" rm
WHERE rm."userId" = r."assigneeId";

UPDATE "Reminder" r
SET "roomId" = (SELECT rm."roomId" FROM "RoomMember" rm ORDER BY rm."joinedAt" ASC LIMIT 1)
WHERE r."roomId" IS NULL;

ALTER TABLE "Reminder" ALTER COLUMN "roomId" SET NOT NULL;

-- ─── AlterTable: ApartmentTag ────────────────────────────────────────────────

ALTER TABLE "ApartmentTag" ADD COLUMN "roomId" TEXT;

UPDATE "ApartmentTag"
SET "roomId" = (SELECT rm."roomId" FROM "RoomMember" rm ORDER BY rm."joinedAt" ASC LIMIT 1);

ALTER TABLE "ApartmentTag" ALTER COLUMN "roomId" SET NOT NULL;

DROP INDEX IF EXISTS "ApartmentTag_name_key";
CREATE UNIQUE INDEX "ApartmentTag_roomId_name_key" ON "ApartmentTag"("roomId", "name");

-- ─── Indexes + FKs for roomId columns ────────────────────────────────────────

CREATE INDEX "Apartment_roomId_idx" ON "Apartment"("roomId");
CREATE INDEX "Contact_roomId_idx" ON "Contact"("roomId");
CREATE INDEX "Reminder_roomId_idx" ON "Reminder"("roomId");
CREATE INDEX "ApartmentTag_roomId_idx" ON "ApartmentTag"("roomId");

ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ApartmentTag" ADD CONSTRAINT "ApartmentTag_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
