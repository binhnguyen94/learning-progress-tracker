import { Router } from "express";

import {
  createTopicController,
  deleteTopicController,
  getTopicsController,
  updateTopicController,
} from "../controllers/topic.controller.js";

const router = Router();

router.post("/", createTopicController);
router.get("/", getTopicsController);
router.put("/:id", updateTopicController);
router.delete("/:id", deleteTopicController);

export default router;
