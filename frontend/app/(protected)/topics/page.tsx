"use client";

import { FormEvent, useEffect, useState } from "react";

import { getCategories } from "@/services/category.service";
import { createTopic, deleteTopic, getTopics, updateTopic } from "@/services/topic.service";
import type { Category } from "@/types/category";
import type { Topic, TopicInput, TopicStatus } from "@/types/topic";

type TopicFormState = {
  topic_name: string;
  category_id: string;
  description: string;
  start_date: string;
  status: TopicStatus;
};

const initialFormState: TopicFormState = {
  topic_name: "",
  category_id: "",
  description: "",
  start_date: "",
  status: "Active",
};

const toDateInput = (value: string) => value.slice(0, 10);

const toUtcIsoDate = (value: string) => new Date(`${value}T00:00:00.000Z`).toISOString();

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}m`;
  }

  if (rest === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${rest}m`;
};

export default function TopicsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [form, setForm] = useState<TopicFormState>(initialFormState);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(editingTopic);

  useEffect(() => {
    let isMounted = true;

    const loadDependencies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [categoryData, topicData] = await Promise.all([
          getCategories(),
          getTopics(),
        ]);

        if (isMounted) {
          setCategories(categoryData);
          setTopics(topicData);
          setForm((current) => ({
            ...current,
            category_id: current.category_id || categoryData[0]?.category_id || "",
          }));
        }
      } catch {
        if (isMounted) {
          setError("Unable to load topics.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDependencies();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadTopics = async (categoryId?: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await getTopics(categoryId);
      setTopics(data);
    } catch {
      setError("Unable to load topics.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTopic(null);
    setForm({
      ...initialFormState,
      category_id: categories[0]?.category_id || "",
    });
  };

  const validateForm = () => {
    if (form.topic_name.trim().length < 2) {
      return "Topic name must be at least 2 characters.";
    }

    if (!form.category_id) {
      return "Category is required.";
    }

    if (!form.start_date) {
      return "Start date is required.";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const payload: TopicInput = {
      topic_name: form.topic_name.trim(),
      category_id: form.category_id,
      description: form.description.trim(),
      start_date: toUtcIsoDate(form.start_date),
      status: form.status,
    };

    try {
      if (editingTopic) {
        const updated = await updateTopic(editingTopic.topic_id, payload);
        setTopics((current) =>
          current.map((topic) => (topic.topic_id === updated.topic_id ? updated : topic)),
        );
      } else {
        const created = await createTopic(payload);

        if (!filterCategoryId || filterCategoryId === created.category.category_id) {
          setTopics((current) => [created, ...current]);
        }
      }

      resetForm();
    } catch {
      setError("Unable to save topic.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilterChange = async (categoryId: string) => {
    setFilterCategoryId(categoryId);
    await loadTopics(categoryId || undefined);
  };

  const startEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setForm({
      topic_name: topic.topic_name,
      category_id: topic.category.category_id,
      description: topic.description || "",
      start_date: toDateInput(topic.start_date),
      status: topic.status,
    });
    setError(null);
  };

  const handleDelete = async (topic: Topic) => {
    const confirmed = window.confirm(
      `Delete "${topic.topic_name}"? Related learning logs will also be removed.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(topic.topic_id);
    setError(null);

    try {
      await deleteTopic(topic.topic_id);
      setTopics((current) => current.filter((item) => item.topic_id !== topic.topic_id));

      if (editingTopic?.topic_id === topic.topic_id) {
        resetForm();
      }
    } catch {
      setError("Unable to delete topic.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">Topics</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage learning topics and track study time by topic.
          </p>
        </div>

        <select
          value={filterCategoryId}
          onChange={(event) => void handleFilterChange(event.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 sm:w-64"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-base font-semibold text-neutral-950">
            {isEditing ? "Edit Topic" : "Create Topic"}
          </h2>

          <label className="mt-5 block text-sm font-medium text-neutral-800">
            Topic Name
            <input
              value={form.topic_name}
              onChange={(event) =>
                setForm((current) => ({ ...current, topic_name: event.target.value }))
              }
              maxLength={120}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
              placeholder="SQL Basics"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-neutral-800">
            Category
            <select
              value={form.category_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, category_id: event.target.value }))
              }
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-neutral-800">
            Start Date
            <input
              type="date"
              value={form.start_date}
              onChange={(event) =>
                setForm((current) => ({ ...current, start_date: event.target.value }))
              }
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-neutral-800">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as TopicStatus,
                }))
              }
              className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-neutral-800">
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={4}
              maxLength={1000}
              className="mt-2 w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-950 outline-none focus:border-neutral-900"
              placeholder="Learn SQL fundamentals for analysis work"
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
              disabled={isSaving || categories.length === 0}
              className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSaving ? "Saving..." : isEditing ? "Update Topic" : "Create Topic"}
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

        <section className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Topic Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Total Study Time
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Learning Log Count
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {isLoading ? (
                <>
                  <tr>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-10 animate-pulse rounded-md bg-neutral-100" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-10 animate-pulse rounded-md bg-neutral-100" />
                    </td>
                  </tr>
                </>
              ) : topics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-600">
                    No topics yet
                  </td>
                </tr>
              ) : (
                topics.map((topic) => (
                  <tr key={topic.topic_id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-neutral-900">{topic.topic_name}</p>
                      {topic.description ? (
                        <p className="mt-1 max-w-xs break-words text-neutral-600">
                          {topic.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {topic.category.category_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{topic.status}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {formatMinutes(topic.total_study_minutes)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {topic.learning_log_count}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(topic)}
                          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(topic)}
                          disabled={deletingId === topic.topic_id}
                          className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                        >
                          {deletingId === topic.topic_id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
