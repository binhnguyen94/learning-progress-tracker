import { Router } from "express";

import { createLogController, getLogsController } from "../controllers/logs.controller.js";

const router = Router();

router.post("/", createLogController);
router.get("/", getLogsController);

export default router;
