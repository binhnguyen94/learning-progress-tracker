import { Router } from "express";

import categoryRoutes from "./category.routes.js";
import topicRoutes from "./topic.routes.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.status(200).json({ status: "OK" });
  }),
);

router.use("/categories", categoryRoutes);
router.use("/topics", topicRoutes);

export default router;
