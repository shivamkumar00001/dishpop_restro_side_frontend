import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Download,
  Search,
  Filter,
  X,
  RefreshCw,
  ArrowLeft,
  Copy,
  FileSpreadsheet,
  Share2,
  Crown,
  Calendar,
  Phone,
  Tag,
  Edit2,
  Save,
  MessageSquare,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Settings,
  Mail,
  MapPin,
  ShoppingBag,
  Receipt,
  Star,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import customerAnalyticsAPI from "../../api/customerAnalyticsApi";

/**
 * Enterprise-Level Customer Analytics Dashboard
 * 
 * API Endpoints Used:
 * - GET /analytics/:username/customers - Get all customers with filters
 * - GET /analytics/:username/stats - Get customer statistics
 * - GET /analytics/:username/repeat-customers - Get repeat customers
 * - GET /analytics/:username/top-customers - Get top spending customers
 * - GET /analytics/:username/inactive-customers - Get inactive customers
 * - PATCH /analytics/:username/customer/:phoneNumber - Update customer details
 * - GET /analytics/:username/export-excel - Export to Excel
 * - Client-side CSV export and clipboard operations
 */

export default function CustomerAnalyticsPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { owner } = useAuth();
  const usernameToFetch = username || owner?.username;

  // Core state
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("lastVisit");
  const [order, setOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minVisits, setMinVisits] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState("all");

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load data based on view mode
  const loadData = useCallback(async () => {
    if (!usernameToFetch) return;

    try {
      setLoading(true);
      
      let customersRes;
      
      switch (viewMode) {
        case "repeat":
          customersRes = await customerAnalyticsAPI.getRepeatCustomers(usernameToFetch);
          break;
        case "top":
          customersRes = await customerAnalyticsAPI.getTopCustomers(usernameToFetch, 50);
          break;
        case "inactive":
          customersRes = await customerAnalyticsAPI.getInactiveCustomers(usernameToFetch, 30);
          break;
        default:
          // For "all" view, we don't apply filters to API, we filter client-side
          customersRes = await customerAnalyticsAPI.getAllCustomers(usernameToFetch, {
            limit: 1000,
          });
      }

      const statsRes = await customerAnalyticsAPI.getCustomerStats(usernameToFetch);

      setCustomers(customersRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("Failed to load data:", error);
      showToast("Failed to load customer data", "error");
    } finally {
      setLoading(false);
    }
  }, [usernameToFetch, viewMode, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Filter and sort customers client-side
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.customerName.toLowerCase().includes(query) ||
          c.phoneNumber.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter.toUpperCase());
    }

    // Apply min visits filter
    if (minVisits && minVisits !== "") {
      const min = parseInt(minVisits);
      if (!isNaN(min)) {
        filtered = filtered.filter((c) => c.totalVisits >= min);
      }
    }

    // Apply min spend filter
    if (minSpend && minSpend !== "") {
      const min = parseFloat(minSpend);
      if (!isNaN(min)) {
        filtered = filtered.filter((c) => c.totalPurchase >= min);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "customerName":
          aVal = a.customerName.toLowerCase();
          bVal = b.customerName.toLowerCase();
          break;
        case "totalVisits":
          aVal = a.totalVisits;
          bVal = b.totalVisits;
          break;
        case "totalPurchase":
          aVal = a.totalPurchase;
          bVal = b.totalPurchase;
          break;
        case "lastVisit":
        default:
          aVal = new Date(a.lastVisit).getTime();
          bVal = new Date(b.lastVisit).getTime();
          break;
      }

      if (order === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return filtered;
  }, [customers, searchQuery, statusFilter, minVisits, minSpend, sortBy, order]);

  // Export handlers
  const handleExport = async (type, format) => {
    try {
      if (format === "excel") {
        await customerAnalyticsAPI.exportToExcel(usernameToFetch, type);
        showToast("Excel file downloaded successfully!", "success");
      } else if (format === "csv") {
        await customerAnalyticsAPI.exportToCSV(usernameToFetch, type);
        showToast("CSV file downloaded successfully!", "success");
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error("Export error:", error);
      showToast("Export failed. Please try again.", "error");
    }
  };

  const handleShare = async (type, format) => {
    try {
      await customerAnalyticsAPI.copyToClipboard(usernameToFetch, type, format);
      showToast(`Data copied to clipboard as ${format} format!`, "success");
      setShowShareMenu(false);
    } catch (error) {
      console.error("Share error:", error);
      showToast("Failed to copy data. Please try again.", "error");
    }
  };

  // Update customer
  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;

    try {
      await customerAnalyticsAPI.updateCustomer(
        usernameToFetch,
        editingCustomer.phoneNumber,
        {
          notes: editingCustomer.notes,
          tags: editingCustomer.tags,
          status: editingCustomer.status,
        }
      );

      showToast("Customer updated successfully!", "success");
      setEditingCustomer(null);
      loadData();
    } catch (error) {
      showToast("Failed to update customer", "error");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setMinVisits("");
    setMinSpend("");
    setSortBy("lastVisit");
    setOrder("desc");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    minVisits ||
    minSpend ||
    sortBy !== "lastVisit" ||
    order !== "desc";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading customer analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* TOP HEADER BAR */}
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Customer Analytics</h1>
              <p className="text-xs text-gray-500">{owner?.restaurantName}</p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Customers</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.totalCustomers || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-sm font-bold text-green-600">
                  ₹{(stats.totalRevenue || 0).toFixed(0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Purchase</p>
                <p className="text-sm font-bold text-purple-600">
                  ₹{(stats.avgPurchasePerCustomer || 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {[
              { value: "all", label: "All", icon: Users },
              { value: "repeat", label: "Repeat", icon: UserCheck },
              { value: "top", label: "Top", icon: Crown },
              { value: "inactive", label: "Inactive", icon: UserX },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  viewMode === mode.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <mode.icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {showShareMenu && (
              <ShareMenu
                onShare={handleShare}
                onClose={() => setShowShareMenu(false)}
              />
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {showExportMenu && (
              <ExportMenu
                onExport={handleExport}
                onClose={() => setShowExportMenu(false)}
              />
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - FILTERS */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-500" />
              Filters & Search
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Search Customers
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lastVisit">Last Visit</option>
                <option value="totalVisits">Total Visits</option>
                <option value="totalPurchase">Total Purchase</option>
                <option value="customerName">Name</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Order
              </label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            {/* Min Visits */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Min Visits
              </label>
              <input
                type="number"
                value={minVisits}
                onChange={(e) => setMinVisits(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Min Spend */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Min Spend (₹)
              </label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg text-sm transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* CENTER PANEL - CUSTOMER LIST */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
              {hasActiveFilters && (
                <span className="text-xs font-semibold text-blue-600">
                  Filters Active
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {filteredCustomers.length === 0 ? (
              <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer._id}
                    customer={customer}
                    onView={() => setSelectedCustomer(customer)}
                    onEdit={() => setEditingCustomer({ ...customer })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - STATS */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Statistics
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <StatCard
              icon={Users}
              label="Total Customers"
              value={stats.totalCustomers || 0}
              color="blue"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`₹${(stats.totalRevenue || 0).toFixed(0)}`}
              color="green"
            />
            <StatCard
              icon={UserCheck}
              label="Repeat Customers"
              value={stats.repeatCustomers || 0}
              color="purple"
            />
            <StatCard
              icon={Crown}
              label="VIP Customers"
              value={stats.vipCustomers || 0}
              color="yellow"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Purchase"
              value={`₹${(stats.avgPurchasePerCustomer || 0).toFixed(0)}`}
              color="cyan"
            />
            <StatCard
              icon={Activity}
              label="Avg Visits"
              value={(stats.avgVisitsPerCustomer || 0).toFixed(1)}
              color="pink"
            />
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={() => {
            setEditingCustomer({ ...selectedCustomer });
            setSelectedCustomer(null);
          }}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onChange={setEditingCustomer}
          onSave={handleUpdateCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
    pink: "bg-pink-50 border-pink-200 text-pink-700",
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function CustomerCard({ customer, onView, onEdit }) {
  const daysSince = Math.floor(
    (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "VIP":
        return {
          badge: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
          card: "border-yellow-200 hover:border-yellow-300 hover:shadow-yellow-100",
          icon: Crown,
        };
      case "ACTIVE":
        return {
          badge: "bg-gradient-to-r from-green-400 to-green-500 text-white",
          card: "border-gray-200 hover:border-blue-300 hover:shadow-blue-100",
          icon: UserCheck,
        };
      case "INACTIVE":
        return {
          badge: "bg-gradient-to-r from-red-400 to-red-500 text-white",
          card: "border-gray-200 hover:border-red-200 hover:shadow-red-100",
          icon: UserX,
        };
      default:
        return {
          badge: "bg-gray-400 text-white",
          card: "border-gray-200 hover:border-gray-300 hover:shadow-gray-100",
          icon: Users,
        };
    }
  };

  const statusConfig = getStatusConfig(customer.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white border ${statusConfig.card} rounded-xl hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer`}
      onClick={onView}>
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {customer.customerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-gray-900 truncate">{customer.customerName}</h3>
              <p className="text-[10px] text-gray-500 truncate">{customer.phoneNumber}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shadow-sm flex items-center gap-1 ${statusConfig.badge}`}>
            <StatusIcon className="w-2.5 h-2.5" />
            {customer.status}
          </span>
        </div>
      </div>

      {/* Minimal Stats Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-0.5">Visits</p>
            <p className="text-lg font-bold text-blue-700">{customer.totalVisits}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs text-green-600 font-medium mb-0.5">Spent</p>
            <p className="text-lg font-bold text-green-700">₹{(customer.totalPurchase / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Single Most Important Info */}
        <div className="flex items-center justify-between text-xs mb-3 px-1">
          <span className="text-gray-500">Last visit</span>
          <span className="font-semibold text-gray-700">
            {daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince}d ago`}
          </span>
        </div>

        {/* Compact Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="mb-3 flex gap-1 flex-wrap">
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-semibold rounded border border-purple-200">
              {customer.tags[0]}
            </span>
            {customer.tags.length > 1 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-semibold rounded">
                +{customer.tags.length - 1}
              </span>
            )}
          </div>
        )}

        {/* Simple Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}

function CustomerDetailsModal({ customer, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const daysSince = Math.floor(
    (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
  );

  const totalDays = Math.floor(
    (new Date(customer.lastVisit) - new Date(customer.firstVisit)) / (1000 * 60 * 60 * 24)
  );

  const visitFrequency = totalDays > 0 ? (customer.totalVisits / (totalDays / 30)).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                {customer.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{customer.customerName}</h2>
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phoneNumber}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors border border-white/30"
                title="Edit Customer"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors border border-white/30"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Badge & Quick Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm border-2 ${
                  customer.status === "VIP"
                    ? "bg-yellow-500/90 text-white border-yellow-300"
                    : customer.status === "ACTIVE"
                    ? "bg-green-500/90 text-white border-green-300"
                    : "bg-red-500/90 text-white border-red-300"
                } flex items-center gap-2`}
              >
                {customer.status === "VIP" && <Crown className="w-4 h-4" />}
                {customer.status}
              </span>
              <div className="h-6 w-px bg-white/30"></div>
              <div className="text-sm">
                <span className="text-blue-100">Customer since </span>
                <span className="font-semibold">
                  {new Date(customer.firstVisit).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 px-6">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "history", label: "Visit History", icon: Clock },
              { id: "insights", label: "Insights", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                <MetricCard
                  icon={ShoppingBag}
                  label="Total Visits"
                  value={customer.totalVisits}
                  color="blue"
                  subtitle="All time"
                />
                <MetricCard
                  icon={DollarSign}
                  label="Total Spend"
                  value={`₹${customer.totalPurchase.toFixed(0)}`}
                  color="green"
                  subtitle="Lifetime value"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Avg Purchase"
                  value={`₹${customer.averagePurchase.toFixed(0)}`}
                  color="purple"
                  subtitle="Per visit"
                />
                <MetricCard
                  icon={Clock}
                  label="Last Visit"
                  value={daysSince === 0 ? "Today" : `${daysSince}d ago`}
                  color="orange"
                  subtitle={new Date(customer.lastVisit).toLocaleDateString("en-IN")}
                />
              </div>

              {/* Visit Pattern */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Visit Pattern
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visit Frequency</p>
                    <p className="text-2xl font-bold text-blue-600">{visitFrequency} <span className="text-sm font-normal text-gray-500">visits/month</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer Duration</p>
                    <p className="text-2xl font-bold text-purple-600">{Math.max(1, Math.floor(totalDays / 30))} <span className="text-sm font-normal text-gray-500">months</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loyalty Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (customer.totalVisits / 50) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{Math.min(100, Math.floor((customer.totalVisits / 50) * 100))}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Notes Row */}
              <div className="grid grid-cols-2 gap-4">
                {customer.tags && customer.tags.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      Customer Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-sm font-medium rounded-lg border border-purple-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {customer.notes && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Notes
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{customer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Visit History ({customer.visitHistory?.length || 0} visits)
                </h3>
              </div>

              {customer.visitHistory && customer.visitHistory.length > 0 ? (
                <div className="space-y-3">
                  {customer.visitHistory.slice().reverse().map((visit, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{visit.billNumber}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(visit.date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(visit.date).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                Table {visit.tableNumber}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{visit.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No visit history available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Customer Insights
                </h3>
                <div className="space-y-4">
                  <InsightRow
                    label="Spending Behavior"
                    value={customer.averagePurchase > 2000 ? "High Spender" : customer.averagePurchase > 1000 ? "Medium Spender" : "Value Conscious"}
                    color={customer.averagePurchase > 2000 ? "green" : customer.averagePurchase > 1000 ? "blue" : "gray"}
                  />
                  <InsightRow
                    label="Visit Regularity"
                    value={visitFrequency > 4 ? "Very Frequent" : visitFrequency > 2 ? "Regular" : "Occasional"}
                    color={visitFrequency > 4 ? "green" : visitFrequency > 2 ? "blue" : "orange"}
                  />
                  <InsightRow
                    label="Engagement Level"
                    value={customer.totalVisits > 20 ? "Highly Engaged" : customer.totalVisits > 10 ? "Engaged" : "New Customer"}
                    color={customer.totalVisits > 20 ? "green" : customer.totalVisits > 10 ? "blue" : "purple"}
                  />
                  <InsightRow
                    label="Recency Status"
                    value={daysSince < 7 ? "Active" : daysSince < 30 ? "Recent" : "At Risk"}
                    color={daysSince < 7 ? "green" : daysSince < 30 ? "blue" : "red"}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {daysSince > 30 && (
                    <RecommendationCard
                      icon={AlertCircle}
                      title="Re-engagement Needed"
                      description="Customer hasn't visited in over 30 days. Consider sending a personalized offer."
                      color="red"
                    />
                  )}
                  {customer.totalVisits > 10 && customer.status !== "VIP" && (
                    <RecommendationCard
                      icon={Crown}
                      title="VIP Upgrade Candidate"
                      description="Customer has shown strong loyalty. Consider upgrading to VIP status."
                      color="yellow"
                    />
                  )}
                  {customer.averagePurchase > 2000 && (
                    <RecommendationCard
                      icon={TrendingUp}
                      title="Premium Upsell Opportunity"
                      description="Customer is a high spender. Introduce premium menu items or special packages."
                      color="green"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Customer
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, subtitle }) {
  const colors = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold mb-0.5">{value}</p>
      <p className="text-xs opacity-75">{subtitle}</p>
    </div>
  );
}

function InsightRow({ label, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-700 border-green-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    red: "bg-red-100 text-red-700 border-red-300",
    gray: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}

function RecommendationCard({ icon: Icon, title, description, color }) {
  const colors = {
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} rounded-lg p-4 border`}>
      <div className="flex gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}

function EditCustomerModal({ customer, onChange, onSave, onClose }) {
  const [localTags, setLocalTags] = useState(customer.tags?.join(", ") || "");

  const handleSave = () => {
    const updatedCustomer = {
      ...customer,
      tags: localTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };
    onChange(updatedCustomer);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Customer Info Display */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Customer</p>
            <p className="font-bold text-lg text-gray-900">{customer.customerName}</p>
            <p className="text-sm text-gray-500">{customer.phoneNumber}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Status
            </label>
            <select
              value={customer.status}
              onChange={(e) =>
                onChange({ ...customer, status: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="VIP">VIP</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              VIP status is automatically assigned after 10+ visits
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={localTags}
              onChange={(e) => setLocalTags(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="regular, vip, birthday-club, vegetarian"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Use tags for customer segmentation and targeted marketing
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={customer.notes || ""}
              onChange={(e) =>
                onChange({ ...customer, notes: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add notes about dietary preferences, special requests, allergies, etc."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No customers match your filters
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            Try adjusting your search criteria or clear filters to see all customers
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No customers found
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Customer data will appear here as orders are completed
          </p>
        </>
      )}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  const config = {
    success: { bg: "bg-green-500", icon: CheckCircle },
    error: { bg: "bg-red-500", icon: AlertCircle },
    info: { bg: "bg-blue-500", icon: Info },
  };

  const { bg, icon: Icon } = config[type] || config.success;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`${bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-80 max-w-md`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}