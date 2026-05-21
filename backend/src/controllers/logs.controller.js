import { createLog, getLogs } from "../services/logs.service.js";

const buildErrorResponse = (error) => {
  if (error.statusCode) {
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        message: error.message,
      },
    };
  }

  if (error.code === "P2003") {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: "Invalid topic_id",
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      success: false,
      message: "Unable to process logs request",
    },
  };
};

export const createLogController = async (req, res) => {
  try {
    const body = req.body || {};
    const topicId = body.topic_id?.trim();
    const studyContent = body.study_content?.trim();
    const durationMinutes = Number(body.duration_minutes);
    const studyDate = body.study_date ? new Date(body.study_date) : null;

    if (!topicId) {
      return res
        .status(400)
        .json({ success: false, message: "topic_id is required" });
    }

    if (!studyDate || Number.isNaN(studyDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "study_date is required" });
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "duration_minutes must be a positive integer",
      });
    }

    if (!studyContent) {
      return res
        .status(400)
        .json({ success: false, message: "study_content is required" });
    }

    const log = await createLog({
      topic_id: topicId,
      study_date: studyDate,
      duration_minutes: durationMinutes,
      study_content: studyContent,
    });

    return res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const getLogsController = async (req, res) => {
  try {
    const logs = await getLogs();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};
