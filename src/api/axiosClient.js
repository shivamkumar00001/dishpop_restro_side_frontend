import axios from "axios";
import API_BASE_URL from "../config/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,    // 10 seconds
  
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
