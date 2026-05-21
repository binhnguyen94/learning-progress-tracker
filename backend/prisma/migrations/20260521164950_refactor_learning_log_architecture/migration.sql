-- Create required TopicStatus enum for the new architecture.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TopicStatus') THEN
    CREATE TYPE "TopicStatus" AS ENUM ('ACTIVE', 'COMPLETED');
  END IF;
END $$;

-- Normalize legacy Topic.status values into the new enum domain.
UPDATE "Topic"
SET "status" = CASE
  WHEN UPPER(COALESCE("status", '')) = 'COMPLETED' THEN 'COMPLETED'
  ELSE 'ACTIVE'
END;

-- Convert Topic.status from text to TopicStatus enum.
ALTER TABLE "Topic"
ALTER COLUMN "status" TYPE "TopicStatus"
USING "status"::"TopicStatus";

-- Remove legacy fields that do not exist in the product schema.
ALTER TABLE "Category"
DROP COLUMN IF EXISTS "updated_at";

ALTER TABLE "Topic"
DROP COLUMN IF EXISTS "estimated_hours";

-- Reinstate relational integrity for LearningLog -> User.
ALTER TABLE "LearningLog"
ADD CONSTRAINT "LearningLog_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "LearningLog_user_id_idx" ON "LearningLog"("user_id");
CREATE INDEX IF NOT EXISTS "LearningLog_topic_id_idx" ON "LearningLog"("topic_id");

-- Remove obsolete timer/session architecture.
DROP TABLE IF EXISTS "StudySession";
