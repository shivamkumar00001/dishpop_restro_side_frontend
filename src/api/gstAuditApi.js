/**
 * GST Audit API Service
 * Frontend service for GST audit log operations
 */

import axios from "axios";
import API_BASE_URL from "../config/api";

const API_URL = API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

class GSTAuditAPI {
  constructor() {
    this.baseURL = `${API_URL}/gst-audit`;

  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return localStorage.getItem("token");
  }

  /**
   * Create axios instance with auth
   */
  createAuthAxios() {
    const token = this.getAuthToken();
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      withCredentials: true,
    });
  }

  /**
   * Fetch GST audit logs with filters
   */
  async fetchAuditLogs(username, filters = {}) {
    try {
      const axiosInstance = this.createAuthAxios();
      const params = new URLSearchParams();

      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.gstType) params.append("gstType", filters.gstType);
      if (filters.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = `/${username}/logs${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  }

  /**
   * Get GST summary for date range
   */
  async fetchGSTSummary(username, startDate, endDate) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/${username}/summary`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching GST summary:", error);
      throw error;
    }
  }

  /**
   * Get monthly GST report
   */
  async fetchMonthlyReport(username, year, month) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/${username}/monthly`, {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly report:", error);
      throw error;
    }
  }

  /**
   * Get tax rate wise breakdown
   */
  async fetchTaxRateBreakdown(username, startDate, endDate) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/${username}/tax-breakdown`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tax rate breakdown:", error);
      throw error;
    }
  }

  /**
   * Export GST audit logs to Excel
   */
  async exportToExcel(username, startDate, endDate, gstType = "") {
    try {
      const axiosInstance = this.createAuthAxios();
      const params = { startDate, endDate };
      if (gstType) params.gstType = gstType;

      const response = await axiosInstance.get(`/${username}/export`, {
        params,
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `GST_Audit_${username}_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  /**
   * Get GST statistics for dashboard
   */
  async fetchGSTStats(username, period = "today") {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      let startDate;

      switch (period) {
        case "today":
          startDate = endDate;
          break;
        case "week":
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split("T")[0];
          break;
        case "month":
          const monthStart = new Date();
          monthStart.setDate(1);
          startDate = monthStart.toISOString().split("T")[0];
          break;
        case "quarter":
          const quarterStart = new Date();
          quarterStart.setMonth(quarterStart.getMonth() - 3);
          startDate = quarterStart.toISOString().split("T")[0];
          break;
        default:
          startDate = endDate;
      }

      return this.fetchGSTSummary(username, startDate, endDate);
    } catch (error) {
      console.error("Error fetching GST stats:", error);
      throw error;
    }
  }
}

// Singleton instance
const gstAuditAPI = new GSTAuditAPI();

// Named exports
export const fetchAuditLogs = (username, filters) =>
  gstAuditAPI.fetchAuditLogs(username, filters);
export const fetchGSTSummary = (username, startDate, endDate) =>
  gstAuditAPI.fetchGSTSummary(username, startDate, endDate);
export const fetchMonthlyReport = (username, year, month) =>
  gstAuditAPI.fetchMonthlyReport(username, year, month);
export const fetchTaxRateBreakdown = (username, startDate, endDate) =>
  gstAuditAPI.fetchTaxRateBreakdown(username, startDate, endDate);
export const exportToExcel = (username, startDate, endDate, gstType) =>
  gstAuditAPI.exportToExcel(username, startDate, endDate, gstType);
export const fetchGSTStats = (username, period) =>
  gstAuditAPI.fetchGSTStats(username, period);

// Default export
export default gstAuditAPI;