import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ If no response (network error)
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest?.url || "";

    // ❌ NEVER try refresh on auth routes
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/me") ||
      url.includes("/auth/forgot") ||
      url.includes("/auth/reset")
    ) {
      return Promise.reject(error);
    }

    // ❌ Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 🔐 Handle ONLY 401
    if (status === 401) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        await api.get("/auth/refresh");
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
