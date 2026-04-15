import { Router } from "express";

import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.status(200).json({ status: "OK" });
  }),
);

export default router;
