-- Add new planned vs actual time tracking columns
ALTER TABLE "StudySession"
ADD COLUMN "planned_minutes" INTEGER,
ADD COLUMN "actual_minutes" INTEGER;

-- Backfill planned minutes for existing records before enforcing NOT NULL
UPDATE "StudySession"
SET "planned_minutes" = COALESCE("duration_minutes", 0)
WHERE "planned_minutes" IS NULL;

-- Make start_time optional and planned_minutes required
ALTER TABLE "StudySession"
ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "planned_minutes" SET NOT NULL;

-- Move historical values into actual_minutes where available
UPDATE "StudySession"
SET "actual_minutes" = "duration_minutes"
WHERE "duration_minutes" IS NOT NULL;

-- Drop legacy duration column
ALTER TABLE "StudySession"
DROP COLUMN "duration_minutes";
