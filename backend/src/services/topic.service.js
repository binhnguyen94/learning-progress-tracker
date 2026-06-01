import prisma from "../prisma/client.js";

const topicStatusMap = {
  Active: "ACTIVE",
  Completed: "COMPLETED",
};

const toTopicStatus = (status) => topicStatusMap[status] ?? status;
const fromTopicStatus = (status) =>
  status === "COMPLETED" ? "Completed" : "Active";

const getCategoryOrThrow = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: {
      category_id: categoryId,
      user_id: userId,
    },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }
};

const getTopicOrThrow = async (userId, topicId) => {
  const topic = await prisma.topic.findFirst({
    where: {
      topic_id: topicId,
      user_id: userId,
    },
  });

  if (!topic) {
    const error = new Error("Topic not found");
    error.statusCode = 404;
    throw error;
  }
};

const mapTopic = (topic, aggregate) => ({
  topic_id: topic.topic_id,
  topic_name: topic.topic_name,
  description: topic.description,
  start_date: topic.start_date,
  status: fromTopicStatus(topic.status),
  created_at: topic.created_at,
  updated_at: topic.updated_at,
  category: {
    category_id: topic.category.category_id,
    category_name: topic.category.category_name,
  },
  total_study_minutes: aggregate?._sum.duration_minutes || 0,
  learning_log_count: aggregate?._count._all || 0,
});

export const createTopic = async (userId, payload) => {
  await getCategoryOrThrow(userId, payload.category_id);

  const topic = await prisma.topic.create({
    data: {
      user_id: userId,
      category_id: payload.category_id,
      topic_name: payload.topic_name,
      description: payload.description || null,
      start_date: new Date(payload.start_date),
      status: toTopicStatus(payload.status),
    },
    include: {
      category: {
        select: {
          category_id: true,
          category_name: true,
        },
      },
    },
  });

  return mapTopic(topic);
};

export const getTopics = async (userId, { category_id } = {}) => {
  const topics = await prisma.topic.findMany({
    where: {
      user_id: userId,
      ...(category_id ? { category_id } : {}),
    },
    include: {
      category: {
        select: {
          category_id: true,
          category_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (topics.length === 0) {
    return [];
  }

  const aggregates = await prisma.learningLog.groupBy({
    by: ["topic_id"],
    where: {
      user_id: userId,
      topic_id: {
        in: topics.map((topic) => topic.topic_id),
      },
    },
    _sum: {
      duration_minutes: true,
    },
    _count: {
      _all: true,
    },
  });

  const aggregateMap = new Map(
    aggregates.map((aggregate) => [aggregate.topic_id, aggregate]),
  );

  return topics.map((topic) => mapTopic(topic, aggregateMap.get(topic.topic_id)));
};

export const updateTopic = async (userId, topicId, payload) => {
  await getTopicOrThrow(userId, topicId);

  if (payload.category_id) {
    await getCategoryOrThrow(userId, payload.category_id);
  }

  const topic = await prisma.topic.update({
    where: {
      topic_id: topicId,
    },
    data: {
      category_id: payload.category_id,
      topic_name: payload.topic_name,
      description: Object.hasOwn(payload, "description")
        ? payload.description || null
        : undefined,
      start_date: payload.start_date ? new Date(payload.start_date) : undefined,
      status: payload.status ? toTopicStatus(payload.status) : undefined,
    },
    include: {
      category: {
        select: {
          category_id: true,
          category_name: true,
        },
      },
    },
  });

  const aggregate = await prisma.learningLog.groupBy({
    by: ["topic_id"],
    where: {
      user_id: userId,
      topic_id: topic.topic_id,
    },
    _sum: {
      duration_minutes: true,
    },
    _count: {
      _all: true,
    },
  });

  return mapTopic(topic, aggregate[0]);
};

export const deleteTopic = async (userId, topicId) => {
  await getTopicOrThrow(userId, topicId);

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.topic.delete({
      where: {
        topic_id: topicId,
      },
    });

    return {
      topic_id: deleted.topic_id,
      topic_name: deleted.topic_name,
    };
  });
};
