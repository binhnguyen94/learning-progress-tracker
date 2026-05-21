-- DropForeignKey
ALTER TABLE "LearningLog" DROP CONSTRAINT "LearningLog_user_id_fkey";

-- DropIndex
DROP INDEX "LearningLog_topic_id_idx";

-- DropIndex
DROP INDEX "LearningLog_user_id_idx";
