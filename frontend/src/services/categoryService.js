import API from "./api";

const normalizeCategory = (category) => ({
  id: category.id ?? category.category_id,
  name: category.name ?? category.category_name,
});

export const getCategories = async () => {
  const response = await API.get("/categories");
  return response.data.data.map(normalizeCategory);
};

export const createCategory = async (name) => {
  const response = await API.post("/categories", {
    category_name: name,
    name,
  });
  return normalizeCategory(response.data.data);
};

export const deleteCategory = async (id) => {
  await API.delete(`/categories/${id}`);
};
