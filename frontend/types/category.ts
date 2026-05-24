export type Category = {
  category_id: string;
  user_id: string;
  category_name: string;
  description: string | null;
  created_at: string;
};

export type CategoryInput = {
  category_name: string;
  description?: string;
};
