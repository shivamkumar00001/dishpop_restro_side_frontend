import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://dishpop-restro-side-backend.onrender.com/api
  withCredentials: true,                // 🔥 REQUIRED FOR COOKIE AUTH
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ DO NOT attach Authorization header
// Cookies handle auth automatically

export default api;
