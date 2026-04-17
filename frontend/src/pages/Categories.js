import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setError("");
    } catch (error) {
      console.error("Category error:", error);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    try {
      await createCategory(trimmedName);
      setName("");
      await fetchCategories();
    } catch (error) {
      console.error("Category error:", error);
      setError("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Category error:", error);
      setError("Failed to load categories");
    }
  };

  return (
    <section className="categories-page">
      <div className="page-header">
        <h1>Categories</h1>
      </div>

      <form className="categories-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter category name"
        />
        <button type="submit">Add Category</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <span>{category.name}</span>
            <button type="button" onClick={() => handleDelete(category.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Categories;
