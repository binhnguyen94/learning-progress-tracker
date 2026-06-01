export type TopicStatus = "Active" | "Completed";

export type Topic = {
  topic_id: string;
  topic_name: string;
  description: string | null;
  start_date: string;
  status: TopicStatus;
  created_at: string;
  updated_at: string;
  category: {
    category_id: string;
    category_name: string;
  };
  total_study_minutes: number;
  learning_log_count: number;
};

export type TopicInput = {
  topic_name: string;
  category_id: string;
  description?: string;
  start_date: string;
  status: TopicStatus;
};
