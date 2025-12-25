import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { fetchOrders, updateOrderStatus } from "../../api/orderApi";
import useLiveOrders from "../../hooks/useLiveOrders";
import OrderCard from "../../components/orders/OrderCard";
import { saveOrders, loadOrders } from "../../utils/orderStorage";
import { useAuth } from "../../context/AuthContext";
import OrderColumn from "../../components/orders/OrderColumn";

export default function OrderPage() {
  const { username } = useParams();
  const { owner } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const updatingRef = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  // Filters
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  /* ===============================
     FETCH ORDERS
  =============================== */
  const loadOrdersData = useCallback(async () => {
    const usernameToFetch = username || owner?.username;
    if (!usernameToFetch) return;

    try {
      // Load from cache first
      const cachedOrders = loadOrders();
      if (cachedOrders && Array.isArray(cachedOrders)) {
        setOrders(cachedOrders);
        setLoading(false);
      }

      // Fetch from server
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
    if (updatingRef.current) {
      console.log("⏭️ Skipping socket update during manual update");
      return;
    }

    console.log(`📡 Socket event: ${type}`, order);

    setOrders((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      let updated;

      if (type === "created") {
        if (prevArray.some((o) => o._id === order._id)) {
          return prevArray;
        }
        updated = [order, ...prevArray];
      } else if (type === "updated" || type === "replaced") {
        updated = prevArray.map((o) => (o._id === order._id ? order : o));
      } else if (type === "deleted") {
        updated = prevArray.filter((o) => o._id !== order);
      } else {
        return prevArray;
      }

      saveOrders(updated);
      return updated;
    });
  }, []);

  const { socket, reconnect, isConnected } = useLiveOrders(
    username || owner?.username,
    handleOrderEvent
  );

  // Update connection status
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
    async (id, status) => {
      const usernameToUpdate = username || owner?.username;
      if (!usernameToUpdate) return;

      updatingRef.current = true;
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
        setTimeout(() => {
          updatingRef.current = false;
        }, 1500);
      } catch (error) {
        console.error("Failed to update order:", error);
        updatingRef.current = false;

        if (previousOrders) {
          setOrders(previousOrders);
          saveOrders(previousOrders);
        }
        alert("Failed to update order. Please try again.");
      }
    },
    [username, owner]
  );

  /* ===============================
     DATE FILTER
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
        case "7days": {
          const diffTime = Math.abs(now - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }
        case "30days": {
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
     FILTER & SEARCH & SORT
  =============================== */
  const processedOrders = useMemo(() => {
    const ordersArray = Array.isArray(orders) ? orders : [];
    let filtered = [...ordersArray];

    filtered = filtered.filter(filterByDate);

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

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => {
        if (filterStatus === "pending") return order.status === "pending";
        if (filterStatus === "confirmed") return order.status === "confirmed";
        if (filterStatus === "completed") return order.status === "completed";
        if (filterStatus === "cancelled") return order.status === "cancelled";
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "table":
          return (a.tableNumber || 0) - (b.tableNumber || 0);
        case "status": {
          const statusOrder = {
            pending: 0,
            confirmed: 1,
            completed: 2,
            cancelled: 3,
          };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchQuery, sortBy, filterStatus, filterByDate]);

  /* ===============================
     STATUS GROUPING
  =============================== */
  const pendingOrders = processedOrders.filter((o) => o.status === "pending");
  const confirmedOrders = processedOrders.filter((o) => o.status === "confirmed");
  const completedOrders = processedOrders.filter((o) =>
    ["completed", "cancelled"].includes(o.status)
  );

  /* ===============================
     STATISTICS
  =============================== */
  const stats = {
    total: processedOrders.length,
    pending: processedOrders.filter((o) => o.status === "pending").length,
    confirmed: processedOrders.filter((o) => o.status === "confirmed").length,
    completed: processedOrders.filter((o) => o.status === "completed").length,
    revenue: processedOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0),
  };

  /* ===============================
     CLEAR FILTERS
  =============================== */
  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setFilterStatus("all");
    setDateFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters =
    searchQuery ||
    sortBy !== "newest" ||
    filterStatus !== "all" ||
    dateFilter !== "all";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b border-gray-800 bg-black sticky top-0 z-10 shadow-lg">
        <div className="px-6 py-4">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                Order <span className="text-cyan-400">Management</span>
              </h1>
              {owner && (
                <p className="text-gray-400 text-sm mt-1">
                  {owner.restaurantName || owner.username}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  connectionStatus === "connected"
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : connectionStatus === "disconnected"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-cyan-400 animate-pulse"
                      : connectionStatus === "disconnected"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                ></span>
                {connectionStatus === "connected"
                  ? "Live"
                  : connectionStatus === "disconnected"
                  ? "Disconnected"
                  : "Error"}
              </div>

              {connectionStatus !== "connected" && (
                <button
                  onClick={reconnect}
                  className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-xs"
                  title="Reconnect"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-cyan-500 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-semibold">{stats.total}</span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Pending:</span>
              <span className="text-cyan-400 font-semibold">
                {stats.pending}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Confirmed:</span>
              <span className="text-cyan-400 font-semibold">
                {stats.confirmed}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Completed:</span>
              <span className="text-green-400 font-semibold">
                {stats.completed}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">Revenue:</span>
              <span className="text-cyan-400 font-semibold">
                ₹{stats.revenue.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {[
                { value: "all", label: "All Time" },
                { value: "today", label: "Today" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateFilter(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${
                    dateFilter === option.value
                      ? "bg-cyan-500 text-black"
                      : "bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showFilters && (
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="table">By Table</option>
                  <option value="status">By Status</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-3 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            {hasActiveFilters && (
              <div className="flex items-center justify-between text-xs text-gray-400 bg-gray-900 rounded-lg px-4 py-2.5 border border-gray-800">
                <span>
                  Showing {processedOrders.length} of {orders.length} orders
                </span>
                <button
                  onClick={clearFilters}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold ml-4"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden bg-black">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <OrderColumn
            title="Pending Orders"
            count={pendingOrders.length}
            orders={pendingOrders}
            onUpdate={handleUpdate}
            color="cyan"
          />

          <OrderColumn
            title="Confirmed"
            count={confirmedOrders.length}
            orders={confirmedOrders}
            onUpdate={handleUpdate}
            color="cyan"
          />

          <OrderColumn
            title="Completed"
            count={completedOrders.length}
            orders={completedOrders}
            onUpdate={handleUpdate}
            color="green"
          />
        </div>
      </main>
    </div>
  );
}