-- CreateTable
CREATE TABLE "StudySession" (
    "session_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE INDEX "StudySession_topic_id_idx" ON "StudySession"("topic_id");

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
