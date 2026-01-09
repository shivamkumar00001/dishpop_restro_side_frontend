import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = API_BASE_URL || "http://localhost:5001/api/v1";

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

export const fetchAllBills = async (username, filters = {}) => {
  try {
    const axiosInstance = createAuthAxios();
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.tableNumber) params.append("tableNumber", filters.tableNumber);
    if (filters.phoneNumber) params.append("phoneNumber", filters.phoneNumber);
    if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.page) params.append("page", filters.page);

    const queryString = params.toString();
    const url = `/restaurants/${username}/bills${queryString ? `?${queryString}` : ""}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

export const fetchBillById = async (username, billId) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(`/restaurants/${username}/bills/${billId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bill:", error);
    throw error;
  }
};

export const createBillFromOrders = async (username, data) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.post(
      `/restaurants/${username}/bills/create-from-orders`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating bill from orders:", error);
    throw error;
  }
};

export const createBillFromSelectedItems = async (username, data) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.post(
      `/restaurants/${username}/bills/create-from-selected-items`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating bill from selected items:", error);
    throw error;
  }
};

export const createBillManually = async (username, billData) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.post(
      `/restaurants/${username}/bills/create`,
      billData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating bill manually:", error);
    throw error;
  }
};

export const updateBillItems = async (username, billId, items) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.patch(
      `/restaurants/${username}/bills/${billId}/items`,
      { items }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating bill items:", error);
    throw error;
  }
};

export const updateBillCharges = async (username, billId, chargesData) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.patch(
      `/restaurants/${username}/bills/${billId}/charges`,
      chargesData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating bill charges:", error);
    throw error;
  }
};

export const mergeBills = async (username, data) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.post(
      `/restaurants/${username}/bills/merge`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error merging bills:", error);
    throw error;
  }
};

export const finalizeBill = async (username, billId, paymentData) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.post(
      `/restaurants/${username}/bills/${billId}/finalize`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error finalizing bill:", error);
    throw error;
  }
};

export const deleteBill = async (username, billId, reason) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.delete(
      `/restaurants/${username}/bills/${billId}`,
      { data: { reason } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};

export const fetchBillsByTable = async (username, tableNumber, status) => {
  try {
    const axiosInstance = createAuthAxios();
    const url = `/restaurants/${username}/bills/table/${tableNumber}${
      status ? `?status=${status}` : ""
    }`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching bills by table:", error);
    throw error;
  }
};

export const fetchBillingStats = async (username, period = "today") => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/bills/stats?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching billing stats:", error);
    throw error;
  }
};

export const fetchActiveSessions = async (username) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(`/restaurants/${username}/sessions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw error;
  }
};

export const fetchSessionDetails = async (username, sessionId) => {
  try {
    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/sessions/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching session details:", error);
    throw error;
  }
};