import { Router } from "express";

import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategoryController);
router.get("/", getCategoriesController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;
