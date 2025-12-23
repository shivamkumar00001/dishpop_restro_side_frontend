const ORDERS_STORAGE_KEY = "restaurant_orders";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const saveOrders = (orders) => {
  try {
    const data = {
      orders: Array.isArray(orders) ? orders : [],
      timestamp: Date.now(),
    };
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
    return false;
  }
};

export const loadOrders = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);

    if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
      clearOrders();
      return null;
    }

    return Array.isArray(data.orders) ? data.orders : null;
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
    return null;
  }
};

export const clearOrders = () => {
  try {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing orders from localStorage:", error);
    return false;
  }
};

export const updateOrderInStorage = (orderId, updates) => {
  try {
    const orders = loadOrders();

    if (!orders) {
      return false;
    }

    const updatedOrders = orders.map((order) =>
      order._id === orderId ? { ...order, ...updates } : order
    );

    return saveOrders(updatedOrders);
  } catch (error) {
    console.error("Error updating order in localStorage:", error);
    return false;
  }
};

export const addOrderToStorage = (newOrder) => {
  try {
    const orders = loadOrders() || [];
    const updatedOrders = [newOrder, ...orders];
    return saveOrders(updatedOrders);
  } catch (error) {
    console.error("Error adding order to localStorage:", error);
    return false;
  }
};

export const removeOrderFromStorage = (orderId) => {
  try {
    const orders = loadOrders();

    if (!orders) {
      return false;
    }

    const updatedOrders = orders.filter((order) => order._id !== orderId);
    return saveOrders(updatedOrders);
  } catch (error) {
    console.error("Error removing order from localStorage:", error);
    return false;
  }
};