import { Router } from "express";

import {
  createSessionController,
  deleteSessionController,
  endSessionController,
  getSessionsController,
  startSessionController,
} from "../controllers/session.controller.js";

const router = Router();

router.post("/", createSessionController);
router.post("/start", startSessionController);
router.post("/end", endSessionController);
router.post("/:id/end", endSessionController);
router.get("/", getSessionsController);
router.delete("/:id", deleteSessionController);

export default router;
