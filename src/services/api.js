// // src/services/api.js
// import axios from "axios";

// const BASE_URL = "http://localhost:5000/api"; // backend URL

// export const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Automatically attach token from localStorage
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,   // 🔥 REQUIRED FOR COOKIE AUTH
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Only attach Bearer token if you actually use localStorage for mobile apps
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 