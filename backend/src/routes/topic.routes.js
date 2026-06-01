import { Router } from "express";

import {
  createTopicController,
  deleteTopicController,
  getTopicsController,
  updateTopicController,
} from "../controllers/topic.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  validateCreateTopic,
  validateTopicId,
  validateTopicQuery,
  validateUpdateTopic,
} from "../validators/topic.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validateTopicQuery, getTopicsController);
router.post("/", validateCreateTopic, createTopicController);
router.put("/:id", validateTopicId, validateUpdateTopic, updateTopicController);
router.delete("/:id", validateTopicId, deleteTopicController);

export default router;
