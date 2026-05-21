import prisma from "../prisma/client.js";

const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

const getTopicOrThrow = async (topicId) => {
  const topic = await prisma.topic.findUnique({
    where: {
      topic_id: topicId,
    },
  });

  if (!topic) {
    const error = new Error("Topic not found");
    error.statusCode = 404;
    throw error;
  }
};

export const createLog = async ({
  topic_id,
  study_date,
  duration_minutes,
  study_content,
}) => {
  await getTopicOrThrow(topic_id);

  return prisma.learningLog.create({
    data: {
      user_id: MOCK_USER_ID,
      topic_id,
      study_date,
      duration_minutes,
      study_content,
    },
  });
};

export const getLogs = async () => {
  const logs = await prisma.learningLog.findMany({
    include: {
      topic: true,
    },
    orderBy: {
      study_date: "desc",
    },
  });

  return logs.map((log) => ({
    log_id: log.log_id,
    topic_name: log.topic.topic_name,
    study_date: log.study_date,
    duration_minutes: log.duration_minutes,
    study_content: log.study_content,
  }));
};
