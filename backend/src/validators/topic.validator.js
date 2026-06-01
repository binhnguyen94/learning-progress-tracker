import { z } from "zod";

const statusEnum = z.enum(["Active", "Completed"]);

const createTopicSchema = z.object({
  category_id: z.string().uuid("category_id must be a valid UUID"),
  topic_name: z
    .string({ required_error: "topic_name is required" })
    .trim()
    .min(2, "topic_name must be at least 2 characters")
    .max(120, "topic_name must be at most 120 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "description must be at most 1000 characters")
    .optional()
    .nullable(),
  start_date: z.string({ required_error: "start_date is required" }).datetime(),
  status: statusEnum,
});

const updateTopicSchema = z
  .object({
    category_id: z.string().uuid("category_id must be a valid UUID").optional(),
    topic_name: z
      .string()
      .trim()
      .min(2, "topic_name must be at least 2 characters")
      .max(120, "topic_name must be at most 120 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, "description must be at most 1000 characters")
      .optional()
      .nullable(),
    start_date: z.string().datetime().optional(),
    status: statusEnum.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required to update",
  });

const paramsSchema = z.object({
  id: z.string().uuid("Topic id must be a valid UUID"),
});

const querySchema = z.object({
  category_id: z.string().uuid("category_id must be a valid UUID").optional(),
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

export const validateCreateTopic = validate(createTopicSchema, "body");
export const validateUpdateTopic = validate(updateTopicSchema, "body");
export const validateTopicId = validate(paramsSchema, "params");
export const validateTopicQuery = validate(querySchema, "query");
