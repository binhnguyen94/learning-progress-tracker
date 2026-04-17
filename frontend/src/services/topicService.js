import API from "./api";

const normalizeTopic = (topic) => ({
  id: topic.id ?? topic.topic_id,
  name: topic.name ?? topic.topic_name,
  category_id: topic.category_id,
  category: topic.category
    ? {
        id: topic.category.id ?? topic.category.category_id,
        name: topic.category.name ?? topic.category.category_name,
      }
    : null,
});

export const getTopics = async () => {
  const response = await API.get("/topics");
  return response.data.data.map(normalizeTopic);
};

export const createTopic = async (name, category_id) => {
  const response = await API.post("/topics", {
    topic_name: name,
    name,
    category_id,
  });
  return normalizeTopic(response.data.data);
};

export const deleteTopic = async (id) => {
  await API.delete(`/topics/${id}`);
};
