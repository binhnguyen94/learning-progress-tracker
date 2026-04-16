import prisma from "../prisma/client.js";

const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000";
const DEFAULT_TOPIC_STATUS = "Not Started";

export const createTopic = async ({
  category_id,
  topic_name,
  description,
  estimated_hours,
}) => {
  return prisma.topic.create({
    data: {
      user_id: MOCK_USER_ID,
      category_id,
      topic_name,
      description,
      estimated_hours,
      start_date: new Date(),
      status: DEFAULT_TOPIC_STATUS,
    },
  });
};

export const getTopics = async ({ category_id } = {}) => {
  return prisma.topic.findMany({
    where: {
      user_id: MOCK_USER_ID,
      ...(category_id ? { category_id } : {}),
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const updateTopic = async (topicId, data) => {
  return prisma.topic.update({
    where: {
      topic_id: topicId,
    },
    data,
  });
};

export const deleteTopic = async (topicId) => {
  return prisma.topic.delete({
    where: {
      topic_id: topicId,
    },
  });
};
