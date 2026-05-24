import { Router } from "express";

import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import logsRoutes from "./logs.routes.js";
import topicRoutes from "./topic.routes.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.status(200).json({ status: "OK" });
  }),
);

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/topics", topicRoutes);
router.use("/logs", logsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
