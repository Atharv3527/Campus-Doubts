// frontend/src/services/api.js
import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("campus_user");
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export const googleLoginApi = (credential) =>
  api.post("/auth/google", { credential });

export default api;
