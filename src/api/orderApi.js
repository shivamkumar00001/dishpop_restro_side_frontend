import axios from "axios";
import API_BASE_URL from "../config/api";


const API_URL =API_BASE_URL || "http://localhost:5001/api/v1";

const getAuthToken = () => localStorage.getItem("token");

const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  });
};

export const fetchOrders = async (username, filters = {}) => {
  try {
    const axiosInstance = createAuthAxios();
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.tableNumber) params.append("tableNumber", filters.tableNumber);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit);

    const queryString = params.toString();
    const url = `/restaurants/${username}/orders${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchOrderById = async (username, orderId) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/orders/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (username, orderId, status) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.patch(
      `/restaurants/${username}/orders/${orderId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const deleteOrder = async (username, orderId) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.delete(
      `/restaurants/${username}/orders/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const fetchOrderStatistics = async (username, period = "today") => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/orders/stats?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw error;
  }
};

export const fetchOrdersByTable = async (username, tableNumber) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/orders/table/${tableNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by table:", error);
    throw error;
  }
};