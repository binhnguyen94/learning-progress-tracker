import {
  createTopic,
  deleteTopic,
  getTopics,
  updateTopic,
} from "../services/topic.service.js";

export const createTopicController = async (req, res, next) => {
  try {
    const topic = await createTopic(req.user.user_id, req.body);

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicsController = async (req, res, next) => {
  try {
    const topics = await getTopics(req.user.user_id, req.query);

    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTopicController = async (req, res, next) => {
  try {
    const topic = await updateTopic(req.user.user_id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTopicController = async (req, res, next) => {
  try {
    const topic = await deleteTopic(req.user.user_id, req.params.id);

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};
