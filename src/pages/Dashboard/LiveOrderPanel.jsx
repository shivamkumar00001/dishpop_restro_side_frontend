import { useEffect, useRef, useState, useCallback } from "react";
import { updateOrderStatus, fetchOrders } from "../../api/orderApi";
import useLiveOrders from "../../hooks/useLiveOrders";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Bell } from "lucide-react";

const STORAGE_KEY = "dashboard-live-orders";

export default function LiveOrdersPanel({ username }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  /* ===============================
     STATE (PERSISTED)
  =============================== */
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  /* ===============================
     SOUND INIT
  =============================== */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/new-order.mp3");

    const unlock = () => {
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  /* ===============================
     INITIAL FETCH
  =============================== */
  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const res = await fetchOrders(username);

        const latestPending = (res.data || [])
          .filter((o) => o.status === "pending")
          .slice(0, 3);

        setOrders(latestPending);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPending));
      } catch {
        console.warn("LiveOrders fallback fetch failed");
      }
    })();
  }, [username]);

  /* ===============================
     SOCKET EVENTS
  =============================== */
  const handleLiveOrder = useCallback((type, order) => {
    if (type === "created" && order.status === "pending") {
      setOrders((prev) => {
        if (prev.some((o) => o._id === order._id)) return prev;
        const updated = [order, ...prev].slice(0, 3);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      audioRef.current?.play().catch(() => {});
    }

    if (type === "updated" || type === "replaced") {
      setOrders((prev) => {
        const updated = prev.filter((o) => o._id !== order._id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  useLiveOrders(username, handleLiveOrder);

  /* ===============================
     ACTIONS
  =============================== */
  const handleAction = useCallback(
    async (orderId, status) => {
      try {
        await updateOrderStatus(username, orderId, status);
        toast.success(`Order ${status}`);

        setOrders((prev) => {
          const updated = prev.filter((o) => o._id !== orderId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      } catch {
        toast.error("Failed to update order");
      }
    },
    [username]
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            Live Orders
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Real-time incoming orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
            <Bell className="w-4 h-4 text-blue-400" />
          </div>

          {orders.length >= 3 && (
            <button
              onClick={() => navigate(`/${username}/orders`)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              View all
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {orders.length === 0 ? (
        <p className="text-xs text-gray-500">
          No new orders right now
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#12151D] border border-[#232A37] rounded-xl p-4 transition hover:border-blue-400/40"
            >
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="font-medium text-gray-200">
                  {order.customerName || "Guest"}
                </span>
                <span>{order.phoneNumber}</span>
              </div>

              <p className="text-[11px] text-gray-500 mb-2">
                Table {order.tableNumber || "-"}
              </p>

              <ul className="text-xs text-gray-300 mb-3 space-y-0.5">
                {order.items.slice(0, 2).map((item) => (
                  <li key={item._id}>
                    {item.name} × {item.qty}
                  </li>
                ))}
                {order.items.length > 2 && (
                  <li className="text-gray-500">
                    +{order.items.length - 2} more items
                  </li>
                )}
              </ul>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(order._id, "accepted")}
                  className="flex-1 bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 text-xs py-1.5 rounded-lg transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleAction(order._id, "rejected")}
                  className="flex-1 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 text-xs py-1.5 rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
