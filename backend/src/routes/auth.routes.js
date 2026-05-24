import { Router } from "express";

import { syncGoogleUserController } from "../controllers/auth.controller.js";
import { requireAuthSync } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/google", requireAuthSync, syncGoogleUserController);

export default router;
