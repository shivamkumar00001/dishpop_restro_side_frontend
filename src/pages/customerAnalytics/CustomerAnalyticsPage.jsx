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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import customerAnalyticsAPI from "../../api/customerAnalyticsApi";

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
  const [viewMode, setViewMode] = useState("all"); // all, repeat, top, inactive

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
          customersRes = await customerAnalyticsAPI.getAllCustomers(usernameToFetch, {
            sortBy,
            order,
            limit: 1000,
            ...(minVisits && { minVisits: parseInt(minVisits) }),
            ...(minSpend && { minSpend: parseFloat(minSpend) }),
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
  }, [usernameToFetch, sortBy, order, viewMode, minVisits, minSpend, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.customerName.toLowerCase().includes(query) ||
          c.phoneNumber.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter.toUpperCase());
    }

    return filtered;
  }, [customers, searchQuery, statusFilter]);

  // Export handlers
  const handleExport = async (type, format) => {
    try {
      if (format === "excel") {
        await customerAnalyticsAPI.exportToExcel(usernameToFetch, type);
        showToast("Excel file downloaded!", "success");
      } else if (format === "csv") {
        await customerAnalyticsAPI.exportToCSV(usernameToFetch, type);
        showToast("CSV file downloaded!", "success");
      }
      setShowExportMenu(false);
    } catch (error) {
      showToast("Export failed", "error");
    }
  };

  const handleShare = async (type, format) => {
    try {
      await customerAnalyticsAPI.copyToClipboard(usernameToFetch, type, format);
      showToast(`Copied as ${format}!`, "success");
      setShowShareMenu(false);
    } catch (error) {
      showToast("Failed to copy", "error");
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading customer analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-cyan-400" />
                  Customer Analytics
                </h1>
                {owner && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {owner.restaurantName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
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
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-500/20"
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
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <StatCard
              icon={Users}
              label="Total Customers"
              value={stats.totalCustomers || 0}
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`₹${(stats.totalRevenue || 0).toFixed(0)}`}
              valueClass="text-green-400"
            />
            <StatCard
              icon={UserCheck}
              label="Repeat Customers"
              value={stats.repeatCustomers || 0}
              valueClass="text-blue-400"
            />
            <StatCard
              icon={Crown}
              label="VIP Customers"
              value={stats.vipCustomers || 0}
              valueClass="text-yellow-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Purchase"
              value={`₹${(stats.avgPurchasePerCustomer || 0).toFixed(0)}`}
              valueClass="text-cyan-400"
            />
            <StatCard
              icon={Activity}
              label="Avg Visits"
              value={(stats.avgVisitsPerCustomer || 0).toFixed(1)}
              valueClass="text-purple-400"
            />
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {[
              { value: "all", label: "All Customers", icon: Users },
              { value: "repeat", label: "Repeat", icon: UserCheck },
              { value: "top", label: "Top Spenders", icon: Crown },
              { value: "inactive", label: "Inactive", icon: UserX },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all whitespace-nowrap ${
                  viewMode === mode.value
                    ? "bg-cyan-500 text-black scale-105"
                    : "bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800"
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                showFilters
                  ? "bg-cyan-500 text-black scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-900 rounded-lg border border-gray-800 animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <FilterSelect
                  label="Sort By"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    ["lastVisit", "Last Visit"],
                    ["totalVisits", "Total Visits"],
                    ["totalPurchase", "Total Purchase"],
                    ["customerName", "Name"],
                  ]}
                />
                <FilterSelect
                  label="Order"
                  value={order}
                  onChange={setOrder}
                  options={[
                    ["desc", "Descending"],
                    ["asc", "Ascending"],
                  ]}
                />
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    ["all", "All Status"],
                    ["ACTIVE", "Active"],
                    ["INACTIVE", "Inactive"],
                    ["VIP", "VIP"],
                  ]}
                />
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">
                    Min Visits
                  </label>
                  <input
                    type="number"
                    value={minVisits}
                    onChange={(e) => setMinVisits(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-500">
                    Min Spend
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 px-4 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-sm font-semibold transition-all hover:scale-105"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          {hasActiveFilters && (
            <span className="text-cyan-400 text-sm font-semibold">
              Filters Active
            </span>
          )}
        </div>

        {filteredCustomers.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      </main>

      {/* Customer Details Modal */}
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onChange={setEditingCustomer}
          onSave={handleUpdateCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}

      {/* Toast */}
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

// Sub-components
function StatCard({ icon: Icon, label, value, valueClass = "text-white" }) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 hover:border-cyan-500/30 transition-all hover:scale-105">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
      >
        {options.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CustomerCard({ customer, onView, onEdit }) {
  const daysSince = Math.floor(
    (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "VIP":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "ACTIVE":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "INACTIVE":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyan-500/30 transition-all p-4 animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{customer.customerName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-400">{customer.phoneNumber}</span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(
            customer.status
          )}`}
        >
          {customer.status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Visits</span>
          <span className="font-semibold text-cyan-400">
            {customer.totalVisits}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Spend</span>
          <span className="font-semibold text-green-400">
            ₹{customer.totalPurchase.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Avg Spend</span>
          <span className="font-semibold">
            ₹{customer.averagePurchase.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last Visit</span>
          <span className="font-semibold">
            {daysSince === 0 ? "Today" : `${daysSince}d ago`}
          </span>
        </div>
      </div>

      {customer.tags && customer.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {customer.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] rounded border border-purple-500/20"
            >
              {tag}
            </span>
          ))}
          {customer.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded">
              +{customer.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold rounded transition-all hover:scale-105"
        >
          View Details
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all hover:scale-105"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CustomerDetailsModal({ customer, onClose, onEdit }) {
  const daysSince = Math.floor(
    (new Date() - new Date(customer.lastVisit)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl animate-slideUp">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-lg font-bold">{customer.customerName}</h2>
            <p className="text-sm text-gray-400">{customer.phoneNumber}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg transition-all hover:scale-110"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                customer.status === "VIP"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : customer.status === "ACTIVE"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {customer.status}
            </span>
            {customer.status === "VIP" && (
              <Crown className="w-5 h-5 text-yellow-400" />
            )}
          </div>

          {/* Stats Grid */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Purchase Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Total Visits</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {customer.totalVisits}
                </p>
              </div>
              <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Total Spend</p>
                <p className="text-xl font-bold text-green-400">
                  ₹{customer.totalPurchase.toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Average Spend</p>
                <p className="text-xl font-bold">
                  ₹{customer.averagePurchase.toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Days Since Visit</p>
                <p className="text-2xl font-bold text-purple-400">
                  {daysSince}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Visit Timeline
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-black/50 rounded border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">First Visit</p>
                <p className="font-semibold">
                  {new Date(customer.firstVisit).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="p-3 bg-black/50 rounded border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">Last Visit</p>
                <p className="font-semibold">
                  {new Date(customer.lastVisit).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Visit History */}
          {customer.visitHistory && customer.visitHistory.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Recent Visits ({customer.visitHistory.length})
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {customer.visitHistory
                  .slice()
                  .reverse()
                  .map((visit, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-black/50 rounded border border-gray-800 hover:border-cyan-500/30 transition-all"
                    >
                      <div>
                        <p className="font-semibold text-cyan-400">
                          {visit.billNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(visit.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          ₹{visit.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Table {visit.tableNumber}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 text-sm rounded-lg border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Notes
              </h3>
              <p className="text-sm text-gray-300 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 italic">
                "{customer.notes}"
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Edit2 className="w-4 h-4" />
            Edit Customer
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            Close
          </button>
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-800 shadow-2xl animate-slideUp">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit Customer</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded transition-all hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer Info Display */}
          <div className="p-3 bg-black/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-bold text-lg">{customer.customerName}</p>
            <p className="text-sm text-gray-400">{customer.phoneNumber}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Customer Status
            </label>
            <select
              value={customer.status}
              onChange={(e) =>
                onChange({ ...customer, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="VIP">VIP</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              VIP status is automatically assigned after 10+ visits
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={localTags}
              onChange={(e) => setLocalTags(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="regular, vip, birthday-club, vegetarian"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use tags for customer segmentation and targeted marketing
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={customer.notes || ""}
              onChange={(e) =>
                onChange({ ...customer, notes: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none transition-colors"
              placeholder="Add notes about dietary preferences, special requests, allergies, etc."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportMenu({ onExport, onClose }) {
  return (
    <div className="absolute right-0 top-12 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-2 min-w-56 z-20 animate-slideDown">
      <div className="text-xs text-gray-500 px-2 py-1 mb-2 border-b border-gray-800">
        Export Customer Data
      </div>
      {[
        { value: "all", label: "All Customers" },
        { value: "repeat", label: "Repeat Customers" },
        { value: "top", label: "Top Spenders" },
        { value: "inactive", label: "Inactive Customers" },
      ].map((type) => (
        <div key={type.value} className="space-y-1 mb-2">
          <div className="text-xs text-cyan-400 px-2 py-1 font-semibold">
            {type.label}
          </div>
          <button
            onClick={() => onExport(type.value, "excel")}
            className="w-full px-3 py-2 hover:bg-gray-800 text-left text-sm rounded flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-400" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => onExport(type.value, "csv")}
            className="w-full px-3 py-2 hover:bg-gray-800 text-left text-sm rounded flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>CSV (.csv)</span>
          </button>
        </div>
      ))}
    </div>
  );
}

function ShareMenu({ onShare, onClose }) {
  return (
    <div className="absolute right-0 top-12 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-2 min-w-56 z-20 animate-slideDown">
      <div className="text-xs text-gray-500 px-2 py-1 mb-2 border-b border-gray-800">
        Copy to Clipboard
      </div>
      {[
        { value: "all", label: "All Customers" },
        { value: "repeat", label: "Repeat Customers" },
        { value: "top", label: "Top Spenders" },
        { value: "inactive", label: "Inactive Customers" },
      ].map((type) => (
        <div key={type.value} className="space-y-1 mb-2">
          <div className="text-xs text-purple-400 px-2 py-1 font-semibold">
            {type.label}
          </div>
          <button
            onClick={() => onShare(type.value, "table")}
            className="w-full px-3 py-2 hover:bg-gray-800 text-left text-sm rounded flex items-center gap-2 transition-all"
          >
            <Copy className="w-4 h-4 text-cyan-400" />
            <span>Table Format</span>
          </button>
          <button
            onClick={() => onShare(type.value, "whatsapp")}
            className="w-full px-3 py-2 hover:bg-gray-800 text-left text-sm rounded flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span>WhatsApp Format</span>
          </button>
          <button
            onClick={() => onShare(type.value, "json")}
            className="w-full px-3 py-2 hover:bg-gray-800 text-left text-sm rounded flex items-center gap-2 transition-all"
          >
            <Copy className="w-4 h-4 text-purple-400" />
            <span>JSON Format</span>
          </button>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
      <Users className="w-20 h-20 text-gray-700 mb-4" />
      {hasFilters ? (
        <>
          <p className="text-xl font-semibold mb-2">No customers match your filters</p>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or clear filters
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Clear All Filters
          </button>
        </>
      ) : (
        <>
          <p className="text-xl font-semibold mb-2">No customers found</p>
          <p className="text-gray-500">
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
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div
        className={`${bg} text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-64`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}