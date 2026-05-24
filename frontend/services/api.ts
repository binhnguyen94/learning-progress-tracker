import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001/api",
});

const getBackendToken = async () => {
  const response = await fetch("/api/backend-token", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Authentication required");
  }

  const payload = (await response.json()) as { token: string };
  return payload.token;
};

api.interceptors.request.use(async (config) => {
  const token = await getBackendToken();

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
