import { Router } from "express";

import { syncGoogleUserController } from "../controllers/auth.controller.js";
import { requireInternalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/google", requireInternalAuth, syncGoogleUserController);

export default router;
