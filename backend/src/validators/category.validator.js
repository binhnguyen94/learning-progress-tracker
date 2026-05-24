import { z } from "zod";

const categoryBodySchema = z.object({
  category_name: z
    .string({ required_error: "category_name is required" })
    .trim()
    .min(2, "category_name must be at least 2 characters")
    .max(80, "category_name must be at most 80 characters"),
  description: z
    .string()
    .trim()
    .max(500, "description must be at most 500 characters")
    .optional()
    .nullable(),
});

const updateCategoryBodySchema = categoryBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required to update",
);

const paramsSchema = z.object({
  id: z.string().uuid("Category id must be a valid UUID"),
});

const validate = (schema, source) => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req[source] = result.data;
  next();
};

export const validateCreateCategory = validate(categoryBodySchema, "body");
export const validateUpdateCategory = validate(updateCategoryBodySchema, "body");
export const validateCategoryId = validate(paramsSchema, "params");
