import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { 
  RefreshCw, 
  Search,
  SlidersHorizontal,
  X,
  Package,
  Calendar
} from "lucide-react";

import { fetchOrders, updateOrderStatus } from "../../api/orderApi";
import useLiveOrders from "../../hooks/useLiveOrders";
import OrderCard from "../../components/orders/OrderCard";
import { saveOrders, loadOrders } from "../../utils/orderStorage";
import { useAuth } from "../../context/AuthContext";

export default function OrderPage() {
  const { username } = useParams();
  const { owner } = useAuth();

  const [orders, setOrders] = useState(loadOrders());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const updatingRef = useRef(false); // Track if we're manually updating
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, 7days, 30days
  const [showFilters, setShowFilters] = useState(false);

  /* ===============================
     FETCH ORDERS
  =============================== */
  useEffect(() => {
    const usernameToFetch = username || owner?.username;
    if (!usernameToFetch) return;

    fetchOrders(usernameToFetch)
      .then((res) => {
        setOrders(res.data);
        saveOrders(res.data);
      })
      .finally(() => setLoading(false));
  }, [username, owner]);

  /* ===============================
     LIVE SOCKET UPDATES
  =============================== */
  useLiveOrders(username || owner?.username, (type, order) => {
  if (updatingRef.current) return;

  if (type === "created") {
    setOrders((prev) => {
      // avoid duplicates
      if (prev.some((o) => o._id === order._id)) return prev;
      const updated = [order, ...prev];
      saveOrders(updated);
      return updated;
    });
  }

  if (type === "updated" || type === "replaced") {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o._id === order._id ? order : o
      );
      saveOrders(updated);
      return updated;
    });
  }
});

  /* ===============================
     MANUAL REFRESH
  =============================== */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const usernameToFetch = username || owner?.username;
    if (!usernameToFetch) return;

    try {
      const res = await fetchOrders(usernameToFetch);
      setOrders(res.data);
      saveOrders(res.data);
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  }, [username, owner]);

  /* ===============================
     UPDATE ORDER STATUS - FIXED
  =============================== */
  const handleUpdate = useCallback(
    async (id, status) => {
      const usernameToUpdate = username || owner?.username;
      if (!usernameToUpdate) return;

      // Block socket updates during manual update
      updatingRef.current = true;

      // Optimistic update with rollback capability
      let previousOrders = null;
      
      setOrders((prev) => {
        previousOrders = [...prev]; // Store for potential rollback
        const updated = prev.map((o) => 
          o._id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
        );
        // Save to localStorage immediately
        saveOrders(updated);
        return updated;
      });

      try {
        // Send update to server
        await updateOrderStatus(usernameToUpdate, id, status);
        
        // Wait a bit for server to process, then allow socket updates again
        setTimeout(() => {
          updatingRef.current = false;
        }, 1000);
      } catch (error) {
        console.error("Failed to update order:", error);
        updatingRef.current = false;
        
        // Rollback on error
        if (previousOrders) {
          setOrders(previousOrders);
          saveOrders(previousOrders);
        }
      }
    },
    [username, owner]
  );

  /* ===============================
     DATE FILTER LOGIC
  =============================== */
  const filterByDate = useCallback((order) => {
    if (dateFilter === "all") return true;
    
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (dateFilter) {
      case "today":
        const today = new Date();
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      case "7days":
        return diffDays <= 7;
      case "30days":
        return diffDays <= 30;
      default:
        return true;
    }
  }, [dateFilter]);

  /* ===============================
     FILTER & SEARCH & SORT
  =============================== */
  const processedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply date filter
    filtered = filtered.filter(filterByDate);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        return (
          order._id.toLowerCase().includes(query) ||
          order.tableNumber?.toString().includes(query) ||
          order.items.some(item => item.name.toLowerCase().includes(query))
        );
      });
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => {
        if (filterStatus === "pending") return order.status === "pending";
        if (filterStatus === "accepted") return ["accepted", "preparing"].includes(order.status);
        if (filterStatus === "completed") return ["completed", "ready", "served"].includes(order.status);
        if (filterStatus === "rejected") return order.status === "rejected";
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "table":
          return (a.tableNumber || 0) - (b.tableNumber || 0);
        case "status":
          const statusOrder = { pending: 0, accepted: 1, preparing: 1, completed: 2, ready: 2, served: 2, rejected: 3 };
          return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchQuery, sortBy, filterStatus, filterByDate]);
  console.log("OrderPage room:", username);


  /* ===============================
     STATUS GROUPING
  =============================== */
  const pendingOrders = processedOrders.filter((o) => o.status === "pending");
  const acceptedOrders = processedOrders.filter((o) =>
    ["accepted", "preparing"].includes(o.status)
  );
  const completedOrders = processedOrders.filter((o) =>
    ["completed", "ready", "served", "rejected"].includes(o.status)
  );

  /* ===============================
     STATISTICS
  =============================== */
  const stats = {
    total: processedOrders.length,
    pending: processedOrders.filter(o => o.status === "pending").length,
    inProgress: processedOrders.filter(o => ["accepted", "preparing"].includes(o.status)).length,
    completed: processedOrders.filter(o => ["completed", "ready", "served"].includes(o.status)).length,
  };

  /* ===============================
     CLEAR ALL FILTERS
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
          <div className="w-10 h-10 border-3 border-gray-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchQuery || sortBy !== "newest" || filterStatus !== "all" || dateFilter !== "all";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b border-gray-800 bg-black">
        <div className="px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-blue-500">Order Management</h1>
              {owner && (
                <p className="text-xs text-gray-500 mt-0.5">{owner.restaurantName || owner.username}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total:</span>
              <span className="text-white font-medium">{stats.total}</span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">Pending:</span>
              <span className="text-orange-400 font-medium">{stats.pending}</span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">In Progress:</span>
              <span className="text-blue-400 font-medium">{stats.inProgress}</span>
            </div>
            <div className="w-px h-4 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">Completed:</span>
              <span className="text-green-400 font-medium">{stats.completed}</span>
            </div>
          </div>

          {/* Date Filter Tabs */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter("all")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  dateFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateFilter("today")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  dateFilter === "today"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter("7days")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  dateFilter === "7days"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateFilter("30days")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  dateFilter === "30days"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="flex gap-3 animate-fade-in">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="table">By Table</option>
                  <option value="status">By Status</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {/* Active Filters & Clear Button */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-900 rounded-lg px-3 py-2 border border-gray-800">
                <span>
                  Showing {processedOrders.length} of {orders.length} orders
                  {dateFilter !== "all" && ` • ${dateFilter === "today" ? "Today" : dateFilter === "7days" ? "Last 7 Days" : "Last 30 Days"}`}
                  {filterStatus !== "all" && ` • ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`}
                  {sortBy !== "newest" && ` • Sorted by ${sortBy}`}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-3 gap-4 p-4">
          {/* PENDING COLUMN */}
          <OrderColumn
            title="Pending"
            count={pendingOrders.length}
            orders={pendingOrders}
            onUpdate={handleUpdate}
            color="orange"
          />

          {/* IN PROGRESS COLUMN */}
          <OrderColumn
            title="In Progress"
            count={acceptedOrders.length}
            orders={acceptedOrders}
            onUpdate={handleUpdate}
            color="blue"
          />

          {/* COMPLETED COLUMN */}
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

/* ===============================
   COLUMN COMPONENT
=============================== */
function OrderColumn({ title, count, orders, onUpdate, color }) {
  const colorClasses = {
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  const headerBorder = {
    orange: "border-orange-500/20",
    blue: "border-blue-500/20",
    green: "border-green-500/20",
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Column Header */}
      <div className={`px-4 py-3 border-b ${headerBorder[color]} bg-gray-950`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
            {count}
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-xs text-gray-500">No orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}