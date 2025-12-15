import axios from "axios";

// Base URL from Vite env
// Example: http://localhost:5001 OR https://your-backend.onrender.com
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default api;
