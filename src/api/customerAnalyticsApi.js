/**
 * Customer Analytics API Service
 * Path: src/api/customerAnalyticsApi.js
 */

import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

class CustomerAnalyticsAPI {
  getAuthToken() {
    return localStorage.getItem("token");
  }

  createAuthAxios() {
    const token = this.getAuthToken();
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      withCredentials: true,
    });
  }

  /**
   * Get all customers with filtering and pagination
   */
  async getAllCustomers(username, filters = {}) {
    try {
      const axiosInstance = this.createAuthAxios();
      const params = new URLSearchParams();

      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.order) params.append("order", filters.order);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.page) params.append("page", filters.page);
      if (filters.status) params.append("status", filters.status);
      if (filters.minVisits) params.append("minVisits", filters.minVisits);
      if (filters.minSpend) params.append("minSpend", filters.minSpend);

      const queryString = params.toString();
      const url = `/analytics/${username}/customers${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(username) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/analytics/${username}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      throw error;
    }
  }

  /**
   * Get repeat customers
   */
  async getRepeatCustomers(username) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/analytics/${username}/repeat-customers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching repeat customers:", error);
      throw error;
    }
  }

  /**
   * Get top customers by spending
   */
  async getTopCustomers(username, limit = 10) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/analytics/${username}/top-customers?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching top customers:", error);
      throw error;
    }
  }

  /**
   * Get inactive customers
   */
  async getInactiveCustomers(username, days = 30) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/analytics/${username}/inactive-customers?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching inactive customers:", error);
      throw error;
    }
  }

  /**
   * Get customer by phone number
   */
  async getCustomerByPhone(username, phoneNumber) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/analytics/${username}/customer/${phoneNumber}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  }

  /**
   * Update customer details (notes, tags, status)
   */
  async updateCustomer(username, phoneNumber, data) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.patch(
        `/analytics/${username}/customer/${phoneNumber}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  /**
   * Export customers to Excel
   */
  async exportToExcel(username, type = "all") {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/analytics/${username}/export-excel?type=${type}`,
        {
          responseType: "blob", // Important for file download
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customers-${type}-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: "Export successful" };
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  /**
   * Export customers to CSV (client-side)
   */
  async exportToCSV(username, type = "all") {
    try {
      // Fetch data based on type
      let data;
      switch (type) {
        case "repeat":
          data = await this.getRepeatCustomers(username);
          break;
        case "top":
          data = await this.getTopCustomers(username, 50);
          break;
        case "inactive":
          data = await this.getInactiveCustomers(username, 30);
          break;
        default:
          data = await this.getAllCustomers(username, { limit: 1000 });
      }

      const customers = data.data || [];

      // Convert to CSV
      const headers = [
        "Customer Name",
        "Phone Number",
        "Total Visits",
        "Total Purchase",
        "Average Purchase",
        "First Visit",
        "Last Visit",
        "Days Since Last Visit",
        "Status",
      ];

      const rows = customers.map((customer) => {
        const daysSince = Math.floor(
          (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
        );

        return [
          customer.customerName,
          customer.phoneNumber,
          customer.totalVisits,
          customer.totalPurchase.toFixed(2),
          customer.averagePurchase.toFixed(2),
          new Date(customer.firstVisit).toLocaleDateString("en-IN"),
          new Date(customer.lastVisit).toLocaleDateString("en-IN"),
          daysSince,
          customer.status,
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customers-${type}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: "CSV export successful" };
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      throw error;
    }
  }

  /**
   * Copy customer data to clipboard (for sharing)
   */
  async copyToClipboard(username, type = "all", format = "table") {
    try {
      let data;
      switch (type) {
        case "repeat":
          data = await this.getRepeatCustomers(username);
          break;
        case "top":
          data = await this.getTopCustomers(username, 50);
          break;
        case "inactive":
          data = await this.getInactiveCustomers(username, 30);
          break;
        default:
          data = await this.getAllCustomers(username, { limit: 1000 });
      }

      const customers = data.data || [];

      let clipboardText = "";

      if (format === "table") {
        // Tab-separated format (works well in Excel/Sheets when pasted)
        const headers = [
          "Customer Name",
          "Phone",
          "Visits",
          "Total Spend",
          "Avg Spend",
          "Last Visit",
          "Status",
        ];

        clipboardText =
          headers.join("\t") +
          "\n" +
          customers
            .map((c) => {
              const daysSince = Math.floor(
                (new Date() - new Date(c.lastVisit)) / (1000 * 60 * 60 * 24)
              );
              return [
                c.customerName,
                c.phoneNumber,
                c.totalVisits,
                `₹${c.totalPurchase.toFixed(2)}`,
                `₹${c.averagePurchase.toFixed(2)}`,
                `${daysSince} days ago`,
                c.status,
              ].join("\t");
            })
            .join("\n");
      } else if (format === "json") {
        clipboardText = JSON.stringify(customers, null, 2);
      } else if (format === "whatsapp") {
        // WhatsApp-friendly format
        clipboardText = customers
          .map(
            (c, i) =>
              `${i + 1}. *${c.customerName}* (${c.phoneNumber})\n   📊 ${c.totalVisits} visits • ₹${c.totalPurchase.toFixed(2)} total\n   📅 Last visit: ${new Date(c.lastVisit).toLocaleDateString("en-IN")}`
          )
          .join("\n\n");
      }

      await navigator.clipboard.writeText(clipboardText);
      return { success: true, message: "Copied to clipboard" };
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      throw error;
    }
  }
}

// Singleton instance
const customerAnalyticsAPI = new CustomerAnalyticsAPI();

// Export methods
export const getAllCustomers = (username, filters) =>
  customerAnalyticsAPI.getAllCustomers(username, filters);
export const getCustomerStats = (username) =>
  customerAnalyticsAPI.getCustomerStats(username);
export const getRepeatCustomers = (username) =>
  customerAnalyticsAPI.getRepeatCustomers(username);
export const getTopCustomers = (username, limit) =>
  customerAnalyticsAPI.getTopCustomers(username, limit);
export const getInactiveCustomers = (username, days) =>
  customerAnalyticsAPI.getInactiveCustomers(username, days);
export const getCustomerByPhone = (username, phoneNumber) =>
  customerAnalyticsAPI.getCustomerByPhone(username, phoneNumber);
export const updateCustomer = (username, phoneNumber, data) =>
  customerAnalyticsAPI.updateCustomer(username, phoneNumber, data);
export const exportToExcel = (username, type) =>
  customerAnalyticsAPI.exportToExcel(username, type);
export const exportToCSV = (username, type) =>
  customerAnalyticsAPI.exportToCSV(username, type);
export const copyToClipboard = (username, type, format) =>
  customerAnalyticsAPI.copyToClipboard(username, type, format);

export default customerAnalyticsAPI;