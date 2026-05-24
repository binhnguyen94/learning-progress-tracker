import { Router } from "express";

import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory,
} from "../validators/category.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", getCategoriesController);
router.post("/", validateCreateCategory, createCategoryController);
router.put(
  "/:id",
  validateCategoryId,
  validateUpdateCategory,
  updateCategoryController,
);
router.delete("/:id", validateCategoryId, deleteCategoryController);

export default router;
