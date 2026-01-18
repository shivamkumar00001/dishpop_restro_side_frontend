/**
 * 🔥 FIXED ORDER API - WITH OFFLINE SUPPORT
 * 
 * FIXES:
 * 1. ✅ Loads orders from IndexedDB first (so offline bill data shows)
 * 2. ✅ Merges server data with offline data
 * 3. ✅ Preserves offline bill associations
 * 4. ✅ Works seamlessly online and offline
 */

import axios from "axios";
import API_BASE_URL from "../config/api";
import offlineDB from '../services/offlineDB';

const API_URL = API_BASE_URL || "http://localhost:5001/api/v1";

const getAuthToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
    timeout: 30000,
  });
};

// 🔥 CRITICAL: Check online status
const isOnline = () => navigator.onLine;

/**
 * 🔥 FIXED: Fetch orders with offline support
 */
export const fetchOrders = async (username, filters = {}) => {
  try {
    // 1️⃣ ALWAYS load from IndexedDB first (has offline bill data)
    const cachedOrders = await offlineDB.getAllOrders(filters);
    
    // 2️⃣ If offline, return cached data
    if (!isOnline()) {
      console.log('📴 Offline - returning cached orders:', cachedOrders.length);
      return { 
        success: true, 
        data: cachedOrders, 
        offline: true 
      };
    }

    // 3️⃣ If online, fetch from server
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
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // 4️⃣ CRITICAL: Merge server data with offline bill data
        const serverOrders = response.data.data;
        const mergedOrders = [];

        for (const serverOrder of serverOrders) {
          // Check if we have offline bill data for this order
          const cachedOrder = cachedOrders.find(o => o._id === serverOrder._id);
          
          if (cachedOrder && cachedOrder.billId && !serverOrder.billId) {
            // Preserve offline bill data
            mergedOrders.push({
              ...serverOrder,
              billed: cachedOrder.billed,
              billId: cachedOrder.billId,
              billNumber: cachedOrder.billNumber,
              billedAt: cachedOrder.billedAt,
            });
          } else {
            mergedOrders.push(serverOrder);
          }
        }

        // 5️⃣ Save merged data to IndexedDB
        await offlineDB.saveOrders(mergedOrders);

        return {
          ...response.data,
          data: mergedOrders,
        };
      }

      return response.data;
    } catch (apiError) {
      console.warn('❌ API failed, using cached data:', apiError.message);
      
      // If API fails but we have cached data, use it
      if (cachedOrders.length > 0) {
        return { 
          success: true, 
          data: cachedOrders, 
          offline: true 
        };
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    // Last resort: try to get any cached orders
    try {
      const cachedOrders = await offlineDB.getAllOrders(filters);
      if (cachedOrders.length > 0) {
        return { 
          success: true, 
          data: cachedOrders, 
          offline: true 
        };
      }
    } catch (cacheError) {
      console.error("Cache error:", cacheError);
    }
    
    throw error;
  }
};

/**
 * Fetch order by ID with offline support
 */
export const fetchOrderById = async (username, orderId) => {
  try {
    // Try offline first
    const cachedOrder = await offlineDB.getOrderById(orderId);
    
    if (!isOnline()) {
      return { 
        success: true, 
        data: cachedOrder, 
        offline: true 
      };
    }

    try {
      const axiosInstance = createAuthAxios();
      const response = await axiosInstance.get(
        `/restaurants/${username}/orders/${orderId}`
      );
      
      if (response.data.success && response.data.data) {
        // Merge with offline data
        const serverOrder = response.data.data;
        
        if (cachedOrder && cachedOrder.billId && !serverOrder.billId) {
          const mergedOrder = {
            ...serverOrder,
            billed: cachedOrder.billed,
            billId: cachedOrder.billId,
            billNumber: cachedOrder.billNumber,
            billedAt: cachedOrder.billedAt,
          };
          
          await offlineDB.saveOrder(mergedOrder);
          return {
            ...response.data,
            data: mergedOrder,
          };
        }
        
        await offlineDB.saveOrder(serverOrder);
      }
      
      return response.data;
    } catch (apiError) {
      if (cachedOrder) {
        return { 
          success: true, 
          data: cachedOrder, 
          offline: true 
        };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Update order status with offline queue
 */
export const updateOrderStatus = async (username, orderId, status) => {
  try {
    // Update locally first
    await offlineDB.updateOrder(orderId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    if (!isOnline()) {
      // Queue for sync
      await offlineDB.addToSyncQueue({
        action: 'UPDATE_ORDER_STATUS',
        orderId,
        data: { status },
      });
      
      return { 
        success: true, 
        offline: true,
        message: 'Status updated offline, will sync when online' 
      };
    }

    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.patch(
      `/restaurants/${username}/orders/${orderId}/status`,
      { status }
    );
    
    if (response.data.success && response.data.data) {
      await offlineDB.saveOrder(response.data.data);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Delete order with offline support
 */
export const deleteOrder = async (username, orderId) => {
  try {
    // Delete locally first
    await offlineDB.deleteOrder(orderId);

    if (!isOnline()) {
      await offlineDB.addToSyncQueue({
        action: 'DELETE_ORDER',
        orderId,
      });
      
      return { 
        success: true, 
        offline: true,
        message: 'Order deleted offline, will sync when online' 
      };
    }

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

/**
 * Fetch order statistics with offline calculation
 */
export const fetchOrderStatistics = async (username, period = "today") => {
  try {
    if (!isOnline()) {
      // Calculate from offline data
      const orders = await offlineDB.getAllOrders();
      const stats = calculateStatsFromOrders(orders, period);
      
      return { 
        success: true, 
        data: stats, 
        offline: true 
      };
    }

    const axiosInstance = createAuthAxios();
    const response = await axiosInstance.get(
      `/restaurants/${username}/orders/stats?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    
    // Fallback to offline calculation
    try {
      const orders = await offlineDB.getAllOrders();
      const stats = calculateStatsFromOrders(orders, period);
      
      return { 
        success: true, 
        data: stats, 
        offline: true 
      };
    } catch (cacheError) {
      throw error;
    }
  }
};

/**
 * Fetch orders by table with offline support
 */
export const fetchOrdersByTable = async (username, tableNumber) => {
  try {
    const cachedOrders = await offlineDB.getAllOrders({ tableNumber });
    
    if (!isOnline()) {
      return { 
        success: true, 
        data: cachedOrders, 
        offline: true 
      };
    }

    try {
      const axiosInstance = createAuthAxios();
      const response = await axiosInstance.get(
        `/restaurants/${username}/orders/table/${tableNumber}`
      );
      
      if (response.data.success && Array.isArray(response.data.data)) {
        await offlineDB.saveOrders(response.data.data);
      }
      
      return response.data;
    } catch (apiError) {
      if (cachedOrders.length > 0) {
        return { 
          success: true, 
          data: cachedOrders, 
          offline: true 
        };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error fetching orders by table:", error);
    throw error;
  }
};

/**
 * Helper: Calculate stats from orders array
 */
function calculateStatsFromOrders(orders, period) {
  let startDate = new Date(0);
  const now = new Date();
  
  switch (period) {
    case 'today':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  const filteredOrders = orders.filter(o => {
    try {
      return new Date(o.createdAt) >= startDate;
    } catch {
      return false;
    }
  });

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: filteredOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0),
  };

  return stats;
}