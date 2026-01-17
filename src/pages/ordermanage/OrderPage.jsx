import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Search,
  X,
  ArrowLeft,
  Receipt,
  Clock,
  CheckCircle,
  TrendingUp,
  Filter,
  ChefHat,
} from "lucide-react";

import { fetchOrders, updateOrderStatus } from "../../api/orderApi";
import useLiveOrders from "../../hooks/useLiveOrders";
import { saveOrders, loadOrders } from "../../utils/orderStorage";
import { useAuth } from "../../context/AuthContext";

// Import components
import OrderCard from "../../components/orders/OrderCard";
import Toast from "../../components/Billing/Toast";
import ConfirmDialog from "../../components/orders/ConfirmDialog";

export default function OrderPage() {
  const { username } = useParams();
  const { owner } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const updatingRef = useRef(false);
  const updatingOrderIdRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  // Filters
  const [dateFilter, setDateFilter] = useState("today");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Toast & Confirm Dialog
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm, type = "warning") => {
    setConfirmDialog({ title, message, onConfirm, type });
  }, []);

  /* ===============================
     FETCH ORDERS
  =============================== */
  const loadOrdersData = useCallback(async () => {
    const usernameToFetch = username || owner?.username;
    if (!usernameToFetch) return;

    try {
      const cachedOrders = loadOrders();
      if (cachedOrders && Array.isArray(cachedOrders)) {
        setOrders(cachedOrders);
        setLoading(false);
      }

      const res = await fetchOrders(usernameToFetch);
      const fetchedOrders = Array.isArray(res.data) ? res.data : [];
      setOrders(fetchedOrders);
      saveOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      if (!orders.length) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [username, owner, orders.length]);

  useEffect(() => {
    loadOrdersData();
  }, [username, owner?.username]);

  /* ===============================
     LIVE SOCKET UPDATES
  =============================== */
  const handleOrderEvent = useCallback((type, order) => {
    if (updatingRef.current && updatingOrderIdRef.current === order._id) {
      return;
    }

    setOrders((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      let updated;

      if (type === "created") {
        if (prevArray.some((o) => o._id === order._id)) {
          return prevArray;
        }
        updated = [order, ...prevArray];
        showToast("New order received", "info");
      } else if (type === "updated" || type === "replaced") {
        updated = prevArray.map((o) => {
          if (o._id === order._id) {
            return { ...o, ...order };
          }
          return o;
        });
      } else if (type === "deleted") {
        updated = prevArray.filter((o) => o._id !== order);
      } else {
        return prevArray;
      }

      saveOrders(updated);
      return updated;
    });
  }, [showToast]);

  const { socket } = useLiveOrders(
    username || owner?.username,
    handleOrderEvent
  );

  useEffect(() => {
    if (socket) {
      const handleConnect = () => setConnectionStatus("connected");
      const handleDisconnect = () => setConnectionStatus("disconnected");
      const handleConnectError = () => setConnectionStatus("error");

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);

      setConnectionStatus(socket.connected ? "connected" : "disconnected");

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
      };
    }
  }, [socket]);

  /* ===============================
     MANUAL REFRESH
  =============================== */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrdersData();
    setTimeout(() => setRefreshing(false), 500);
  }, [loadOrdersData]);

  /* ===============================
     UPDATE ORDER STATUS
  =============================== */
  const handleUpdate = useCallback(
    async (id, status, skipConfirm = false) => {
      const usernameToUpdate = username || owner?.username;
      if (!usernameToUpdate) return;

      // Show confirmation only for reject action
      if (!skipConfirm && status === "cancelled") {
        showConfirm(
          "Reject Order",
          "Are you sure you want to reject this order?",
          () => handleUpdate(id, status, true),
          "danger"
        );
        return;
      }

      updatingRef.current = true;
      updatingOrderIdRef.current = id;
      let previousOrders = null;

      setOrders((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        previousOrders = [...prevArray];
        const updated = prevArray.map((o) =>
          o._id === id
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o
        );
        saveOrders(updated);
        return updated;
      });

      try {
        await updateOrderStatus(usernameToUpdate, id, status);
        
        const statusMessages = {
          confirmed: "Order accepted",
          completed: "Order completed",
          cancelled: "Order rejected"
        };
        
        showToast(statusMessages[status] || `Order ${status}`, "success");
        
        setTimeout(() => {
          updatingRef.current = false;
          updatingOrderIdRef.current = null;
        }, 1500);
      } catch (error) {
        console.error("Failed to update order:", error);
        updatingRef.current = false;
        updatingOrderIdRef.current = null;

        if (previousOrders) {
          setOrders(previousOrders);
          saveOrders(previousOrders);
        }
        showToast("Failed to update order", "error");
      }
    },
    [username, owner, showToast, showConfirm]
  );

  /* ===============================
     FILTER BY DATE
  =============================== */
  const filterByDate = useCallback(
    (order) => {
      if (dateFilter === "all") return true;

      const orderDate = new Date(order.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "today":
          return (
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case "week": {
          const diffTime = Math.abs(now - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }
        case "month": {
          const diffTime = Math.abs(now - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30;
        }
        default:
          return true;
      }
    },
    [dateFilter]
  );

  /* ===============================
     PROCESS ORDERS
  =============================== */
  const processedOrders = useMemo(() => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    let filtered = [...ordersArray];

    filtered = filtered.filter(filterByDate);

    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        return (
          order._id?.toLowerCase().includes(query) ||
          order.tableNumber?.toString().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.phoneNumber?.includes(query) ||
          order.items?.some((item) => item.name.toLowerCase().includes(query))
        );
      });
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [orders, searchQuery, statusFilter, filterByDate]);

  /* ===============================
     GROUP BY STATUS
  =============================== */
  const { pendingOrders, preparingOrders, completedOrders } = useMemo(() => {
    return {
      pendingOrders: processedOrders.filter((o) => o.status === "pending"),
      preparingOrders: processedOrders.filter((o) => o.status === "confirmed"),
      completedOrders: processedOrders.filter((o) =>
        ["completed", "cancelled"].includes(o.status)
      ),
    };
  }, [processedOrders]);

  /* ===============================
     STATISTICS
  =============================== */
  const stats = useMemo(() => {
    return {
      pending: pendingOrders.length,
      preparing: preparingOrders.length,
      completed: processedOrders.filter((o) => o.status === "completed").length,
      totalRevenue: processedOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + (o.grandTotal || 0), 0),
    };
  }, [processedOrders, pendingOrders, preparingOrders]);

  /* ===============================
     KEYBOARD SHORTCUTS
  =============================== */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        handleRefresh();
      }
      if (e.key === "Escape" && confirmDialog) {
        setConfirmDialog(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleRefresh, confirmDialog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Orders</h1>
              <p className="text-xs text-gray-500">{owner?.restaurantName}</p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Preparing</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.preparing}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-sm font-bold text-green-600">
                  ₹{stats.totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* CONNECTION STATUS */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              connectionStatus === "connected"
                ? "bg-green-50 text-green-700 border border-green-200"
                : connectionStatus === "disconnected"
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500 animate-pulse"
                  : connectionStatus === "disconnected"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            {connectionStatus === "connected"
              ? "Live"
              : connectionStatus === "disconnected"
              ? "Offline"
              : "Error"}
          </div>

          {/* DATE FILTER */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Filters"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FILTERS BAR */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* PENDING COLUMN */}
        <OrderColumn
          title="Pending"
          icon={Clock}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          count={pendingOrders.length}
          orders={pendingOrders}
          onUpdate={handleUpdate}
          allOrders={processedOrders}
        />

        {/* PREPARING COLUMN */}
        <OrderColumn
          title="Preparing"
          icon={ChefHat}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          count={preparingOrders.length}
          orders={preparingOrders}
          onUpdate={handleUpdate}
          allOrders={processedOrders}
        />

        {/* COMPLETED COLUMN */}
        <OrderColumn
          title="Completed"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          count={completedOrders.length}
          orders={completedOrders}
          onUpdate={handleUpdate}
          allOrders={processedOrders}
        />
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={() => {
            confirmDialog.onConfirm();
            setConfirmDialog(null);
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

/* ===============================
   ORDER COLUMN COMPONENT
=============================== */
function OrderColumn({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  count,
  orders,
  onUpdate,
  allOrders,
}) {
  return (
    <div className="flex-1 bg-white border-r border-gray-200 last:border-r-0 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${iconBg} rounded flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <span className={`px-2 py-0.5 ${iconBg} ${iconColor} text-xs font-bold rounded-full`}>
            {count}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Icon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No {title.toLowerCase()} orders</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdate={onUpdate}
                allOrders={allOrders}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}