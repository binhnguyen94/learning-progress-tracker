import prisma from "../prisma/client.js";

const MOCK_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export const createCategory = async ({ category_name, description }) => {
  return prisma.category.create({
    data: {
      user_id: MOCK_USER_ID,
      category_name,
      description,
    },
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    where: {
      user_id: MOCK_USER_ID,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const updateCategory = async (categoryId, data) => {
  return prisma.category.update({
    where: {
      category_id: categoryId,
    },
    data,
  });
};

export const deleteCategory = async (categoryId) => {
  return prisma.category.delete({
    where: {
      category_id: categoryId,
    },
  });
};
