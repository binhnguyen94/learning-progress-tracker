import { useCallback, useEffect, useState } from "react";

import { getCategories } from "../services/categoryService";
import { createTopic, deleteTopic, getTopics } from "../services/topicService";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const fetchTopics = useCallback(async (categoryData = categories) => {
    try {
      const data = await getTopics();
      const topicsWithCategory = data.map((topic) => {
        if (topic.category?.name) {
          return topic;
        }

        const matchedCategory = categoryData.find(
          (category) => String(category.id) === String(topic.category_id),
        );

        return {
          ...topic,
          category: matchedCategory
            ? { id: matchedCategory.id, name: matchedCategory.name }
            : { id: topic.category_id, name: "Unknown Category" },
        };
      });

      setAllTopics(topicsWithCategory);
      if (categoryId) {
        setTopics(
          topicsWithCategory.filter(
            (topic) => String(topic.category_id) === String(categoryId),
          ),
        );
      } else {
        setTopics(topicsWithCategory);
      }
      setError("");
    } catch (error) {
      console.error("Topic error:", error);
      setError("Failed to load topics");
    }
  }, [categories, categoryId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);

        await fetchTopics(categoryData);
      } catch (error) {
        console.error("Topic error:", error);
        setError("Failed to load topics");
      }
    };

    loadData();
  }, [fetchTopics]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || !categoryId) {
      return;
    }

    try {
      await createTopic(trimmedName, categoryId);
      setName("");
      await fetchTopics();
    } catch (error) {
      console.error("Topic error:", error);
      setError("Failed to load topics");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTopic(id);
      await fetchTopics();
    } catch (error) {
      console.error("Topic error:", error);
      setError("Failed to load topics");
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);

    if (!selectedCategoryId) {
      setTopics(allTopics);
      return;
    }

    const filteredTopics = allTopics.filter(
      (topic) => String(topic.category_id) === String(selectedCategoryId),
    );
    setTopics(filteredTopics);
  };

  return (
    <section className="topics-page">
      <div className="page-header">
        <h1>Topics</h1>
      </div>

      <form className="topics-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter topic name"
        />
        <select value={categoryId} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Topic</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <ul className="topics-list">
        {topics.map((topic) => (
          <li key={topic.id} className="topic-item">
            <span>{topic.name}</span>
            <span>{topic.category?.name}</span>
            <button type="button" onClick={() => handleDelete(topic.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Topics;
