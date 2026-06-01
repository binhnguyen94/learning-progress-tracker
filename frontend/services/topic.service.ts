import type { Topic, TopicInput } from "@/types/topic";

import api from "./api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const getTopics = async (categoryId?: string) => {
  const response = await api.get<ApiResponse<Topic[]>>("/topics", {
    params: categoryId ? { category_id: categoryId } : undefined,
  });
  return response.data.data;
};

export const createTopic = async (payload: TopicInput) => {
  const response = await api.post<ApiResponse<Topic>>("/topics", payload);
  return response.data.data;
};

export const updateTopic = async (topicId: string, payload: TopicInput) => {
  const response = await api.put<ApiResponse<Topic>>(`/topics/${topicId}`, payload);
  return response.data.data;
};

export const deleteTopic = async (topicId: string) => {
  const response = await api.delete<ApiResponse<{ topic_id: string }>>(
    `/topics/${topicId}`,
  );
  return response.data.data;
};
