import type { Category, CategoryInput } from "@/types/category";

import api from "./api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const getCategories = async () => {
  const response = await api.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
};

export const createCategory = async (payload: CategoryInput) => {
  const response = await api.post<ApiResponse<Category>>("/categories", payload);
  return response.data.data;
};

export const updateCategory = async (
  categoryId: string,
  payload: CategoryInput,
) => {
  const response = await api.put<ApiResponse<Category>>(
    `/categories/${categoryId}`,
    payload,
  );
  return response.data.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await api.delete<ApiResponse<Category>>(
    `/categories/${categoryId}`,
  );
  return response.data.data;
};
