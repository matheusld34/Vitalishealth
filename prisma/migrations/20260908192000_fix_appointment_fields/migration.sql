-- Migration: fix_appointment_fields
-- Apply after schema.prisma Appointment model fix:
--   Add URGENTE to AppointmentStatus enum
--   Add columns: specialties (text[]), reminder (bool), observation (text)
--   Rename notes -> observation (copy data if exists)
--   Make secretary_id nullable (drop not null)

-- 1. Enum: add 'URGENTE' if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'AppointmentStatus' AND e.enumlabel = 'URGENTE'
    ) THEN
        ALTER TYPE "AppointmentStatus" ADD VALUE 'URGENTE';
    END IF;
END $$;

-- 2. Add new columns (safe IF NOT EXISTS)
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "specialties" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "reminder" BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. observation column: create + copy data from legacy notes if exists
DO $$
BEGIN
    -- Add observation column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'observation'
    ) THEN
        ALTER TABLE "appointments" ADD COLUMN "observation" TEXT;
    END IF;

    -- If legacy "notes" column still exists, migrate its data then drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'appointments' AND column_name = 'notes'
    ) THEN
        UPDATE "appointments" SET "observation" = "notes" WHERE "observation" IS NULL;
        ALTER TABLE "appointments" DROP COLUMN "notes";
    END IF;
END $$;

-- 4. secretary_id: drop NOT NULL (allow nullable)
ALTER TABLE "appointments" ALTER COLUMN "secretary_id" DROP NOT NULL;
