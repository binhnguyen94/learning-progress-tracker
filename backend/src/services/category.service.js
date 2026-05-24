import prisma from "../prisma/client.js";

export const createCategory = async (userId, { category_name, description }) => {
  return prisma.category.create({
    data: {
      user_id: userId,
      category_name,
      description: description || null,
    },
  });
};

export const getCategories = async (userId) => {
  return prisma.category.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const updateCategory = async (userId, categoryId, data) => {
  const result = await prisma.category.updateMany({
    where: {
      category_id: categoryId,
      user_id: userId,
    },
    data: {
      ...data,
      description: Object.hasOwn(data, "description")
        ? data.description || null
        : undefined,
    },
  });

  if (result.count === 0) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.category.findFirst({
    where: {
      category_id: categoryId,
      user_id: userId,
    },
  });
};

export const deleteCategory = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: {
      category_id: categoryId,
      user_id: userId,
    },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.category.delete({
    where: {
      category_id: category.category_id,
    },
  });

  return category;
};
