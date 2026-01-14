/**
 * Billing API Service with Offline Support + GST Configuration
 * Wraps existing billingApi.js with offline capabilities
 * Maintains compatibility with existing API structure
 * 
 * 🆕 Added: Billing configuration methods for GST compliance
 */

import axios from "axios";
import API_BASE_URL from "../config/api";
import offlineDB from '../services/offlineDB';

const API_URL = API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

class BillingAPI {
  constructor() {
    this.isOnline = navigator.onLine;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Connection restored');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Connection lost');
    });
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
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      withCredentials: true,
    });
  }

  /* ===============================
     🆕 BILLING CONFIGURATION METHODS
  ================================ */

  /**
   * Fetch billing configuration for a restaurant
   * Public endpoint - no auth required (for printing bills)
   */
  async fetchBillingConfig(username) {
    try {
      console.log('📋 Fetching billing config for:', username);
      
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/billing/config/${username}`);

      if (response.data.success && response.data.data) {
        console.log('✅ Billing config loaded:', response.data.data.legalName);
        
        // Cache config locally for offline use
        try {
          localStorage.setItem(
            `billingConfig_${username}`,
            JSON.stringify(response.data.data)
          );
        } catch (storageError) {
          console.warn('Failed to cache billing config:', storageError);
        }
        
        return response.data;
      }

      return { success: false, data: null };
    } catch (error) {
      console.warn('Failed to fetch billing config:', error.response?.status);
      
      // Try to get cached config
      try {
        const cached = localStorage.getItem(`billingConfig_${username}`);
        if (cached) {
          console.log('📦 Using cached billing config');
          return { success: true, data: JSON.parse(cached), cached: true };
        }
      } catch (cacheError) {
        console.warn('Failed to get cached config:', cacheError);
      }
      
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Create or update billing configuration
   * Authenticated endpoint - requires login
   */
  async saveBillingConfig(configData) {
    try {
      console.log('💾 Saving billing config...');
      
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post('/billing/setup', configData);

      if (response.data.success && response.data.data) {
        console.log('✅ Billing config saved:', response.data.data.legalName);
        
        // Update cache
        try {
          const username = response.data.data.username;
          localStorage.setItem(
            `billingConfig_${username}`,
            JSON.stringify(response.data.data)
          );
        } catch (storageError) {
          console.warn('Failed to cache billing config:', storageError);
        }
        
        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to save billing config:', error);
      throw error;
    }
  }

  /**
   * Delete billing configuration
   * Authenticated endpoint - requires login
   */
  async deleteBillingConfig(username) {
    try {
      console.log('🗑️ Deleting billing config...');
      
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.delete('/billing/config');

      if (response.data.success) {
        console.log('✅ Billing config deleted');
        
        // Clear cache
        try {
          localStorage.removeItem(`billingConfig_${username}`);
        } catch (storageError) {
          console.warn('Failed to clear cached config:', storageError);
        }
        
        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to delete billing config:', error);
      throw error;
    }
  }

  /* ===============================
     EXISTING BILLING METHODS
  ================================ */

  /**
   * Fetch all bills with offline support
   */
  async fetchAllBills(username, filters = {}) {
    try {
      if (!this.isOnline) {
        console.log('📴 Offline - fetching from IndexedDB');
        const bills = await offlineDB.getAllBills(filters);
        return { success: true, data: bills, offline: true };
      }

      // Try API first
      const axiosInstance = this.createAuthAxios();
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
      
      // Cache bills for offline use
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log(`💾 Caching ${response.data.data.length} bills for offline use`);
        for (const bill of response.data.data) {
          await offlineDB.saveBill(bill);
        }
      }

      return response.data;
    } catch (error) {
      console.error('API call failed, using cached data:', error);
      const bills = await offlineDB.getAllBills(filters);
      return { success: true, data: bills, offline: true };
    }
  }

  /**
   * Fetch bill by ID with offline support
   */
  async fetchBillById(username, billId) {
    try {
      if (!this.isOnline) {
        const bill = await offlineDB.getBillById(billId);
        return { success: true, data: bill, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/restaurants/${username}/bills/${billId}`);
      
      if (response.data.success && response.data.data) {
        await offlineDB.saveBill(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error('API call failed, using cached data:', error);
      const bill = await offlineDB.getBillById(billId);
      return { success: true, data: bill, offline: true };
    }
  }

  /**
   * Create bill from orders
   */
  async createBillFromOrders(username, data) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post(
        `/restaurants/${username}/bills/create-from-orders`,
        data
      );
      
      if (response.data.success && response.data.data) {
        await offlineDB.saveBill(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error creating bill from orders:", error);
      throw error;
    }
  }

  /**
   * Create bill from selected items
   */
  async createBillFromSelectedItems(username, data) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post(
        `/restaurants/${username}/bills/create-from-selected-items`,
        data
      );
      
      if (response.data.success && response.data.data) {
        await offlineDB.saveBill(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error("Error creating bill from selected items:", error);
      throw error;
    }
  }

  /**
   * Create bill manually with offline support
   */
  async createBillManually(username, billData) {
    try {
      console.log('💾 Creating bill:', billData.tableNumber);
      
      // Always save to IndexedDB first
      const offlineBill = await offlineDB.saveBill({
        ...billData,
        username,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      });

      if (!this.isOnline) {
        console.log('📴 Offline - bill saved locally');
        return { success: true, data: offlineBill, offline: true };
      }

      // Try to sync immediately if online
      console.log('📡 Syncing bill to server...');
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post(
        `/restaurants/${username}/bills/create`,
        billData
      );

      if (response.data.success) {
        // Update with server data
        console.log('✅ Bill synced to server:', response.data.data.billNumber);
        await offlineDB.saveBill({
          ...response.data.data,
          syncStatus: 'synced',
        });
        return response.data;
      }

      return { success: true, data: offlineBill, offline: true };
    } catch (error) {
      console.error('API call failed, saved offline:', error);
      const offlineBill = await offlineDB.saveBill({
        ...billData,
        username,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      });
      return { success: true, data: offlineBill, offline: true };
    }
  }

  /**
   * Update bill items
   */
  async updateBillItems(username, billId, items) {
    try {
      // Update locally first
      await offlineDB.updateBill(billId, { items });

      if (!this.isOnline) {
        return { success: true, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.patch(
        `/restaurants/${username}/bills/${billId}/items`,
        { items }
      );

      if (response.data.success && response.data.data) {
        await offlineDB.saveBill({
          ...response.data.data,
          syncStatus: 'synced',
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error updating bill items:", error);
      return { success: true, offline: true };
    }
  }

  /**
   * Update bill charges
   */
  async updateBillCharges(username, billId, chargesData) {
    try {
      // Update locally first
      await offlineDB.updateBill(billId, chargesData);

      if (!this.isOnline) {
        return { success: true, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.patch(
        `/restaurants/${username}/bills/${billId}/charges`,
        chargesData
      );

      if (response.data.success && response.data.data) {
        await offlineDB.saveBill({
          ...response.data.data,
          syncStatus: 'synced',
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error updating bill charges:", error);
      return { success: true, offline: true };
    }
  }

  /**
   * Merge bills
   */
  async mergeBills(username, data) {
    try {
      if (!this.isOnline) {
        return { 
          success: false, 
          message: 'Cannot merge bills offline. Please try when online.',
          offline: true 
        };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post(
        `/restaurants/${username}/bills/merge`,
        data
      );

      if (response.data.success && response.data.data) {
        // Save merged bill and mark old ones as cancelled
        await offlineDB.saveBill({
          ...response.data.data,
          syncStatus: 'synced',
        });
        
        for (const billId of data.billIds) {
          await offlineDB.deleteBill(billId, 'Merged into new bill');
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error merging bills:", error);
      return { 
        success: false, 
        message: 'Merge failed. Please try again.',
        error: error.message 
      };
    }
  }

  /**
   * Finalize bill with offline support
   */
  async finalizeBill(username, billId, paymentData) {
    try {
      // Update locally first
      await offlineDB.updateBill(billId, {
        status: 'FINALIZED',
        ...paymentData,
        finalizedAt: new Date().toISOString(),
      });

      if (!this.isOnline) {
        return { success: true, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.post(
        `/restaurants/${username}/bills/${billId}/finalize`,
        paymentData
      );

      if (response.data.success && response.data.data) {
        await offlineDB.saveBill({
          ...response.data.data,
          syncStatus: 'synced',
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error finalizing bill:", error);
      return { success: true, offline: true };
    }
  }

  /**
   * Delete bill with offline support
   */
  async deleteBill(username, billId, reason) {
    try {
      await offlineDB.deleteBill(billId, reason);

      if (!this.isOnline) {
        return { success: true, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.delete(
        `/restaurants/${username}/bills/${billId}`,
        { data: { reason } }
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting bill:", error);
      return { success: true, offline: true };
    }
  }

  /**
   * Fetch bills by table
   */
  async fetchBillsByTable(username, tableNumber, status) {
    try {
      if (!this.isOnline) {
        const bills = await offlineDB.getAllBills({ tableNumber, status });
        return { success: true, data: bills, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const url = `/restaurants/${username}/bills/table/${tableNumber}${
        status ? `?status=${status}` : ""
      }`;
      const response = await axiosInstance.get(url);

      if (response.data.success && Array.isArray(response.data.data)) {
        for (const bill of response.data.data) {
          await offlineDB.saveBill(bill);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching bills by table:", error);
      const bills = await offlineDB.getAllBills({ tableNumber, status });
      return { success: true, data: bills, offline: true };
    }
  }

  /**
   * Fetch billing stats with offline support
   */
  async fetchBillingStats(username, period = "today") {
    try {
      if (!this.isOnline) {
        const stats = await offlineDB.calculateStats(period);
        return { success: true, data: stats, offline: true };
      }

      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/restaurants/${username}/bills/stats?period=${period}`
      );

      // Cache stats
      if (response.data.success) {
        await offlineDB.db.put('statsCache', {
          key: `stats_${period}`,
          value: response.data.data,
          timestamp: new Date().toISOString(),
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching billing stats:", error);
      const stats = await offlineDB.calculateStats(period);
      return { success: true, data: stats, offline: true };
    }
  }

  /**
   * Fetch active sessions
   */
  async fetchActiveSessions(username) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/restaurants/${username}/sessions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      throw error;
    }
  }

  /**
   * Fetch session details
   */
  async fetchSessionDetails(username, sessionId) {
    try {
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(
        `/restaurants/${username}/sessions/${sessionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session details:", error);
      throw error;
    }
  }

  /**
   * Fetch menu and cache for offline use
   */
  async fetchAndCacheMenu(username) {
    try {
      console.log('📡 Fetching menu for offline caching...');
      
      const axiosInstance = this.createAuthAxios();
      const response = await axiosInstance.get(`/restaurants/${username}/menu`);

      if (response.data.success && response.data.data?.menu) {
        // Flatten dishes from all categories
        const allDishes = response.data.data.menu.flatMap(cat => cat.dishes || []);
        await offlineDB.saveDishes(allDishes);
        console.log(`✅ Cached ${allDishes.length} dishes for offline use`);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to cache menu:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get cached dishes for offline use
   */
  async getCachedDishes() {
    try {
      const dishes = await offlineDB.getAvailableDishes();
      return { success: true, data: dishes, offline: true };
    } catch (error) {
      console.error('Failed to get cached dishes:', error);
      return { success: false, data: [], error: error.message };
    }
  }
}

// Singleton instance
const billingAPI = new BillingAPI();

/* ===============================
   EXPORTS - Existing Methods
================================ */
export const fetchAllBills = (username, filters) => billingAPI.fetchAllBills(username, filters);
export const fetchBillById = (username, billId) => billingAPI.fetchBillById(username, billId);
export const createBillFromOrders = (username, data) => billingAPI.createBillFromOrders(username, data);
export const createBillFromSelectedItems = (username, data) => billingAPI.createBillFromSelectedItems(username, data);
export const createBillManually = (username, billData) => billingAPI.createBillManually(username, billData);
export const updateBillItems = (username, billId, items) => billingAPI.updateBillItems(username, billId, items);
export const updateBillCharges = (username, billId, chargesData) => billingAPI.updateBillCharges(username, billId, chargesData);
export const mergeBills = (username, data) => billingAPI.mergeBills(username, data);
export const finalizeBill = (username, billId, paymentData) => billingAPI.finalizeBill(username, billId, paymentData);
export const deleteBill = (username, billId, reason) => billingAPI.deleteBill(username, billId, reason);
export const fetchBillsByTable = (username, tableNumber, status) => billingAPI.fetchBillsByTable(username, tableNumber, status);
export const fetchBillingStats = (username, period) => billingAPI.fetchBillingStats(username, period);
export const fetchActiveSessions = (username) => billingAPI.fetchActiveSessions(username);
export const fetchSessionDetails = (username, sessionId) => billingAPI.fetchSessionDetails(username, sessionId);

/* ===============================
   🆕 EXPORTS - Billing Config Methods
================================ */
export const fetchBillingConfig = (username) => billingAPI.fetchBillingConfig(username);
export const saveBillingConfig = (configData) => billingAPI.saveBillingConfig(configData);
export const deleteBillingConfig = (username) => billingAPI.deleteBillingConfig(username);

// Export default for convenience
export default billingAPI;