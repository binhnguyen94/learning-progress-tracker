import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/category.service.js";

export const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.user.user_id, req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategories(req.user.user_id);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategory(req.user.user_id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const category = await deleteCategory(req.user.user_id, req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
