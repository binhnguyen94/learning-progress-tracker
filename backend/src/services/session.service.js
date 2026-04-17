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

export const createSession = async ({ topic_id, planned_minutes, notes }) => {
  await getTopicOrThrow(topic_id);

  if (!planned_minutes || planned_minutes <= 0) {
    const error = new Error("Planned minutes must be > 0");
    error.statusCode = 400;
    throw error;
  }

  return prisma.studySession.create({
    data: {
      topic_id,
      planned_minutes,
      actual_minutes: null,
      start_time: null,
      end_time: null,
      notes,
    },
  });
};

export const startSession = async (session_id) => {
  return prisma.studySession.update({
    where: {
      session_id,
    },
    data: {
      start_time: new Date(),
    },
  });
};

export const endSession = async (session_id) => {
  const session = await prisma.studySession.findUnique({
    where: {
      session_id,
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

  if (!session.start_time) {
    const error = new Error("Study session has not started");
    error.statusCode = 400;
    throw error;
  }

  const endTime = new Date();
  const actualMinutes = Math.max(
    0,
    Math.round((endTime.getTime() - session.start_time.getTime()) / 60000),
  );

  return prisma.studySession.update({
    where: {
      session_id,
    },
    data: {
      end_time: endTime,
      actual_minutes: actualMinutes,
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
