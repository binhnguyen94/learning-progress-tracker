import prisma from "../prisma/client.js";

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

  return topic;
};

export const startSession = async ({ topic_id, notes }) => {
  await getTopicOrThrow(topic_id);

  return prisma.studySession.create({
    data: {
      topic_id,
      start_time: new Date(),
      end_time: null,
      duration_minutes: null,
      notes,
    },
  });
};

export const endSession = async (sessionId) => {
  const session = await prisma.studySession.findUnique({
    where: {
      session_id: sessionId,
    },
  });

  if (!session) {
    const error = new Error("Study session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.end_time) {
    const error = new Error("Study session has already ended");
    error.statusCode = 400;
    throw error;
  }

  const endTime = new Date();
  const durationMinutes = Math.max(
    0,
    Math.round((endTime.getTime() - session.start_time.getTime()) / 60000),
  );

  return prisma.studySession.update({
    where: {
      session_id: sessionId,
    },
    data: {
      end_time: endTime,
      duration_minutes: durationMinutes,
    },
  });
};

export const getSessions = async ({ topic_id } = {}) => {
  return prisma.studySession.findMany({
    where: {
      ...(topic_id ? { topic_id } : {}),
    },
    orderBy: {
      start_time: "desc",
    },
  });
};

export const deleteSession = async (sessionId) => {
  return prisma.studySession.delete({
    where: {
      session_id: sessionId,
    },
  });
};
