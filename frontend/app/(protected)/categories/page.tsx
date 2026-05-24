"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category.service";
import type { Category } from "@/types/category";

type FormState = {
  category_name: string;
  description: string;
};

const initialFormState: FormState = {
  category_name: "",
  description: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditing = useMemo(() => Boolean(editingCategory), [editingCategory]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialCategories = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load categories.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingCategory(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const categoryName = form.category_name.trim();

    if (categoryName.length < 2) {
      setError("Category name must be at least 2 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        category_name: categoryName,
        description: form.description.trim(),
      };

      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.category_id,
          payload,
        );
        setCategories((current) =>
          current.map((category) =>
            category.category_id === updatedCategory.category_id
              ? updatedCategory
              : category,
          ),
        );
      } else {
        const newCategory = await createCategory(payload);
        setCategories((current) => [newCategory, ...current]);
      }

      resetForm();
    } catch {
      setError("Unable to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setForm({
      category_name: category.category_name,
      description: category.description || "",
    });
    setError(null);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Delete "${category.category_name}"? Related topics and logs may also be removed by database cascade rules.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.category_id);
    setError(null);

    try {
      await deleteCategory(category.category_id);
      setCategories((current) =>
        current.filter((item) => item.category_id !== category.category_id),
      );

      if (editingCategory?.category_id === category.category_id) {
        resetForm();
      }
    } catch {
      setError("Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">Categories</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Organize learning fields by domain.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="w-full rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto"
        >
          + Add Category
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-semibold text-neutral-950">
            {isEditing ? "Edit Category" : "Add Category"}
          </h2>

          <label className="mt-5 block text-sm font-medium text-neutral-800">
            Category Name
            <input
              value={form.category_name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category_name: event.target.value,
                }))
              }
              maxLength={80}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
              placeholder="Programming"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-neutral-800">
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              maxLength={500}
              rows={4}
              className="mt-2 w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
              placeholder="Coding skills"
            />
          </label>

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-base font-semibold text-neutral-950">
              Category Name
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              <div className="h-12 animate-pulse rounded-md bg-neutral-100" />
              <div className="h-12 animate-pulse rounded-md bg-neutral-100" />
              <div className="h-12 animate-pulse rounded-md bg-neutral-100" />
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-neutral-900">
                No categories yet
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Create First Category
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {categories.map((category) => (
                <li
                  key={category.category_id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-neutral-950">
                      {category.category_name}
                    </p>
                    {category.description ? (
                      <p className="mt-1 break-words text-sm text-neutral-600">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.category_id}
                      className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                    >
                      {deletingId === category.category_id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
