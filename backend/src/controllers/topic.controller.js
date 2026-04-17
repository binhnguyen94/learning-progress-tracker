import {
  createTopic,
  deleteTopic,
  getTopics,
  updateTopic,
} from "../services/topic.service.js";

const buildErrorResponse = (error) => {
  if (error.code === "P2025") {
    return {
      statusCode: 404,
      body: {
        success: false,
        message: "Topic not found",
      },
    };
  }

  if (error.code === "P2003") {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: "Invalid category_id",
      },
    };
  }

  if (error.code === "P2023") {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: "Invalid ID format",
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      success: false,
      message: "Unable to process topic request",
    },
  };
};

const normalizeEstimatedHours = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const estimatedHours = Number(value);

  if (!Number.isInteger(estimatedHours) || estimatedHours < 0) {
    return undefined;
  }

  return estimatedHours;
};

export const createTopicController = async (req, res) => {
  try {
    const body = req.body || {};
    const categoryId = body.category_id?.trim();
    const topicName = body.topic_name?.trim();
    const description = body.description?.trim();
    const estimatedHours = normalizeEstimatedHours(body.estimated_hours);

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "category_id is required",
      });
    }

    if (!topicName) {
      return res.status(400).json({
        success: false,
        message: "topic_name is required",
      });
    }

    if (estimatedHours === undefined) {
      return res.status(400).json({
        success: false,
        message: "estimated_hours must be a non-negative integer",
      });
    }

    const topic = await createTopic({
      category_id: categoryId,
      topic_name: topicName,
      description: description || null,
      estimated_hours: estimatedHours,
    });

    return res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    console.error("TOPICS ERROR:", error);
    
    const errorResponse = buildErrorResponse(error);
    return res
      .status(errorResponse.statusCode)
      .json(errorResponse.body);
  }
};

export const getTopicsController = async (req, res) => {
  try {
    const categoryId = req.query.category_id?.trim();
    const topics = await getTopics({
      category_id: categoryId || undefined,
    });

    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const updateTopicController = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updateData = {};

    if (Object.hasOwn(body, "category_id")) {
      const categoryId = body.category_id?.trim();

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "category_id cannot be empty",
        });
      }

      updateData.category_id = categoryId;
    }

    if (Object.hasOwn(body, "topic_name")) {
      const topicName = body.topic_name?.trim();

      if (!topicName) {
        return res.status(400).json({
          success: false,
          message: "topic_name cannot be empty",
        });
      }

      updateData.topic_name = topicName;
    }

    if (Object.hasOwn(body, "description")) {
      updateData.description = body.description?.trim() || null;
    }

    if (Object.hasOwn(body, "estimated_hours")) {
      const estimatedHours = normalizeEstimatedHours(body.estimated_hours);

      if (estimatedHours === undefined) {
        return res.status(400).json({
          success: false,
          message: "estimated_hours must be a non-negative integer",
        });
      }

      updateData.estimated_hours = estimatedHours;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const topic = await updateTopic(id, updateData);

    return res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const deleteTopicController = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await deleteTopic(id);

    return res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};
