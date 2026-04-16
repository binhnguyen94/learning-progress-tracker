import {
  deleteSession,
  endSession,
  getSessions,
  startSession,
} from "../services/session.service.js";

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

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      body: {
        success: false,
        message: "Study session not found",
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
      message: "Unable to process study session request",
    },
  };
};

export const startSessionController = async (req, res) => {
  try {
    const body = req.body || {};
    const topicId = body.topic_id?.trim();
    const notes = body.notes?.trim();

    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "topic_id is required",
      });
    }

    const session = await startSession({
      topic_id: topicId,
      notes: notes || null,
    });

    return res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const endSessionController = async (req, res) => {
  try {
    const body = req.body || {};
    const sessionId = body.session_id?.trim();

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "session_id is required",
      });
    }

    const session = await endSession(sessionId);

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const getSessionsController = async (req, res) => {
  try {
    const topicId = req.query.topic_id?.trim();
    const sessions = await getSessions({
      topic_id: topicId || undefined,
    });

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const deleteSessionController = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await deleteSession(id);

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};
