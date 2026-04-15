import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/category.service.js";

const buildErrorResponse = (error) => {
  if (error.code === "P2025") {
    return {
      statusCode: 404,
      body: {
        success: false,
        message: "Category not found",
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      success: false,
      message: "Unable to process category request",
    },
  };
};

export const createCategoryController = async (req, res) => {
  try {
    const body = req.body || {};
    const categoryName = body.category_name?.trim();
    const description = body.description?.trim();

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "category_name is required",
      });
    }

    const category = await createCategory({
      category_name: categoryName,
      description: description || null,
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const getCategoriesController = async (req, res) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const categoryName = body.category_name?.trim();
    const description = body.description?.trim();
    const updateData = {};

    if (Object.hasOwn(body, "category_name")) {
      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "category_name cannot be empty",
        });
      }

      updateData.category_name = categoryName;
    }

    if (Object.hasOwn(body, "description")) {
      updateData.description = description || null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const category = await updateCategory(id, updateData);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = buildErrorResponse(error);
    return res.status(statusCode).json(body);
  }
};
