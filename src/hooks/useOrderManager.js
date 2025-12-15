import { useEffect, useState, useCallback } from "react";
import { fetchOrders, updateOrderStatus } from "../api/orderApi";
import useLiveOrders from "./useLiveOrders";
import { saveOrders, loadOrders } from "../utils/orderStorage";

export default function useOrdersManager(username) {
  const [orders, setOrders] = useState(loadOrders());
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (!username) return;

    fetchOrders(username)
      .then((res) => {
        setOrders(res.data);
        saveOrders(res.data);
      })
      .finally(() => setLoading(false));
  }, [username]);

  // Live updates via socket (Redis → Socket)
  useLiveOrders(username, setOrders);

  // Accept / Reject / Complete
  const updateStatus = useCallback(
    async (orderId, status) => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status, updatedAt: new Date() } : o
        )
      );

      try {
        await updateOrderStatus(username, orderId, status);
      } catch (err) {
        console.error("Order update failed", err);
        setOrders((prev) => [...prev]); // revert
      }
    },
    [username]
  );

  return {
    orders,
    loading,
    updateStatus,
  };
}
