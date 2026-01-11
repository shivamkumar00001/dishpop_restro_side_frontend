import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Receipt,
  RefreshCw,
  Plus,
  Search,
  Filter,
  X,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle,
  Edit,
  ShoppingCart,
  Minus,
  ChefHat,
  Merge,
  ArrowLeft,
  Printer,
  User,
  Tag,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ✅ Import offline-capable API wrapper
import billingAPI from "../../api/billingApi";
import menuApi from "../../api/menuApi";

// ✅ Import new offline components
import OfflineIndicator from "../../components/Billing/OfflineIndicator";
import SyncStatus from "../../components/Billing/SyncStatus";
import PrinterSettings from "../../components/Billing/PrinterSettings";

// Import existing components
import BillCard from "../../components/Billing/BillCard";
import DishSearchModal from "../../components/Billing/DishSearchModal";
import Toast from "../../components/Billing/Toast";
import PrintBill from "../../components/Billing/PrintBill";

const INITIAL_FORM = {
  tableNumber: "",
  customerName: "",
  phoneNumber: "",
  items: [],
  discount: 0,
  discountType: "NONE",
  taxes: [
    { name: "CGST", rate: 2.5 },
    { name: "SGST", rate: 2.5 },
  ],
  serviceCharge: { enabled: false, rate: 10 },
  additionalCharges: [],
  notes: "",
};

export default function BillingPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { owner } = useAuth();
  const usernameToFetch = username || owner?.username;

  // Core state
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({});
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDishSearch, setShowDishSearch] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showPrinterSettings, setShowPrinterSettings] = useState(false); // ✅ NEW
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedBillsForMerge, setSelectedBillsForMerge] = useState([]);

  // Toast & Print
  const [toast, setToast] = useState(null);
  const [printBill, setPrintBill] = useState(null);

  // Form
  const [createForm, setCreateForm] = useState(INITIAL_FORM);

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ✅ Load menu with offline caching
  const loadMenu = useCallback(async () => {
    if (!usernameToFetch) return;
    try {
      setMenuLoading(true);
      
      // Try to fetch and cache menu for offline use
      await billingAPI.fetchAndCacheMenu(usernameToFetch);
      
      // Get dishes (from cache if offline)
      const res = await menuApi.getMenu(usernameToFetch);
      const menuData = res.data?.data?.menu || res.data?.menu || [];
      const allDishes = menuData.flatMap((cat) => cat.dishes || []);
      setDishes(allDishes);
    } catch (error) {
      console.error("Menu load failed:", error);
      // Try to get cached dishes if online fetch failed
      const cachedResult = await billingAPI.getCachedDishes();
      if (cachedResult.success) {
        setDishes(cachedResult.data);
        showToast("Using cached menu (offline mode)", "info");
      } else {
        setDishes([]);
      }
    } finally {
      setMenuLoading(false);
    }
  }, [usernameToFetch, showToast]);

  // ✅ Load bills with offline support
  const loadBills = useCallback(async () => {
    if (!usernameToFetch) return;
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter.toUpperCase();
      if (paymentFilter !== "all")
        filters.paymentStatus = paymentFilter.toUpperCase();

      if (dateFilter !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = { today: 0, week: 7, month: 30 };
        if (days[dateFilter] !== undefined) {
          const start = new Date(today);
          start.setDate(start.getDate() - days[dateFilter]);
          filters.startDate = start.toISOString();
        }
      }

      // ✅ Use offline-capable API
      const [billsRes, statsRes] = await Promise.all([
        billingAPI.fetchAllBills(usernameToFetch, filters),
        billingAPI.fetchBillingStats(usernameToFetch, dateFilter === "all" ? "all" : dateFilter),
      ]);

      setBills(Array.isArray(billsRes.data) ? billsRes.data : []);
      setStats(statsRes.data || {});

      // Show offline indicator if applicable
      if (billsRes.offline || statsRes.offline) {
        showToast("Showing cached data (offline mode)", "info");
      }
    } catch (error) {
      console.error("Bills load failed:", error);
      setBills([]);
      showToast("Failed to load bills", "error");
    } finally {
      setLoading(false);
    }
  }, [usernameToFetch, statusFilter, paymentFilter, dateFilter, showToast]);

  useEffect(() => {
    loadBills();
    loadMenu();
  }, [loadBills, loadMenu]);

  // Filter bills
  const filteredBills = useMemo(
    () =>
      bills.filter((bill) => {
        const search = searchTerm.toLowerCase();
        return (
          bill.billNumber.toLowerCase().includes(search) ||
          bill.customerName.toLowerCase().includes(search) ||
          bill.phoneNumber.includes(search) ||
          bill.tableNumber.toString().includes(search)
        );
      }),
    [bills, searchTerm]
  );

  // Bill form handlers
  const handleAddDish = useCallback((dish, variant) => {
    setCreateForm((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.itemId === dish._id && item.variant?.name === variant.name
      );

      if (existingIndex >= 0) {
        const updated = [...prev.items];
        updated[existingIndex].qty += 1;
        updated[existingIndex].totalPrice =
          updated[existingIndex].qty * updated[existingIndex].unitPrice;
        showToast(`${dish.name} quantity increased to ${updated[existingIndex].qty}`, "info");
        return { ...prev, items: updated };
      }

      showToast(`${dish.name} added to bill`, "success");
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            itemId: dish._id,
            name: dish.name,
            imageUrl: dish.thumbnailUrl || dish.imageUrl,
            qty: 1,
            unitPrice: variant.price,
            totalPrice: variant.price,
            variant: { name: variant.name, price: variant.price },
            addons: [],
          },
        ],
      };
    });
  }, [showToast]);

  const updateItemQty = useCallback((index, change) => {
    setCreateForm((prev) => {
      const updated = [...prev.items];
      const newQty = updated[index].qty + change;

      if (newQty <= 0) {
        const removedItem = updated[index].name;
        updated.splice(index, 1);
        showToast(`${removedItem} removed from bill`, "info");
      } else {
        updated[index].qty = newQty;
        updated[index].totalPrice = newQty * updated[index].unitPrice;
      }

      return { ...prev, items: updated };
    });
  }, [showToast]);

  const removeItem = useCallback(
    (index) => {
      const itemName = createForm.items[index].name;
      setCreateForm((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
      showToast(`${itemName} removed from bill`, "info");
    },
    [createForm.items, showToast]
  );

  // Calculate totals
  const billTotals = useMemo(() => {
    const subtotal = createForm.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount =
      createForm.discountType === "PERCENTAGE"
        ? (subtotal * createForm.discount) / 100
        : createForm.discountType === "FIXED"
        ? createForm.discount
        : 0;
    const afterDiscount = subtotal - discountAmount;
    const serviceChargeAmount = createForm.serviceCharge.enabled
      ? (afterDiscount * createForm.serviceCharge.rate) / 100
      : 0;
    const taxableAmount = afterDiscount + serviceChargeAmount;
    const taxAmount = createForm.taxes.reduce(
      (sum, tax) => sum + (taxableAmount * tax.rate) / 100,
      0
    );
    return {
      subtotal,
      discountAmount,
      serviceChargeAmount,
      taxAmount,
      grandTotal: Math.round(taxableAmount + taxAmount),
    };
  }, [createForm.items, createForm.discount, createForm.discountType, createForm.serviceCharge, createForm.taxes]);

  // ✅ Actions with offline support
  const handleCreateBill = async () => {
    if (!createForm.tableNumber || !createForm.customerName || !createForm.phoneNumber) {
      showToast("Please fill all required fields", "error");
      return;
    }
    if (createForm.items.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }

    try {
      // ✅ Use offline-capable API
      const response = await billingAPI.createBillManually(usernameToFetch, createForm);
      
      if (response.offline) {
        showToast("Bill saved offline - will sync when online", "success");
      } else {
        showToast("Bill created successfully!", "success");
      }
      
      setShowCreateModal(false);
      setCreateForm(INITIAL_FORM);
      loadBills();
    } catch (error) {
      console.error("Create bill failed:", error);
      showToast(error.response?.data?.message || "Failed to create bill", "error");
    }
  };

  const handleFinalizeBill = async (billId) => {
    const bill = bills.find((b) => b._id === billId);
    if (!bill) return;

    const paymentMethod = prompt("Payment method (CASH/CARD/UPI):", "CASH");
    if (!paymentMethod) return;

    const paidAmount = prompt(
      `Paid amount (Total: ₹${bill.grandTotal}):`,
      bill.grandTotal.toString()
    );
    if (!paidAmount) return;

    try {
      // ✅ Use offline-capable API
      const response = await billingAPI.finalizeBill(usernameToFetch, billId, {
        paymentMethod: paymentMethod.toUpperCase(),
        paidAmount: parseFloat(paidAmount),
      });

      if (response.offline) {
        showToast("Bill finalized offline - will sync when online", "success");
      } else {
        showToast("Bill finalized successfully!", "success");
      }
      
      loadBills();
    } catch (error) {
      console.error("Finalize failed:", error);
      showToast("Failed to finalize bill", "error");
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!confirm("Cancel this bill?")) return;
    const reason = prompt("Reason:", "Cancelled by user");

    try {
      // ✅ Use offline-capable API
      const response = await billingAPI.deleteBill(usernameToFetch, billId, reason);
      
      if (response.offline) {
        showToast("Bill cancelled offline - will sync when online", "success");
      } else {
        showToast("Bill cancelled successfully", "success");
      }
      
      loadBills();
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to cancel bill", "error");
    }
  };

  const handleMergeBills = async () => {
    if (selectedBillsForMerge.length < 2) {
      showToast("Please select at least 2 bills to merge", "error");
      return;
    }

    const selectedBills = bills.filter((b) =>
      selectedBillsForMerge.includes(b._id)
    );

    const highestBill = selectedBills.reduce((max, bill) =>
      bill.grandTotal > max.grandTotal ? bill : max
    );

    try {
      // ✅ Use offline-capable API
      const response = await billingAPI.mergeBills(usernameToFetch, {
        billIds: selectedBillsForMerge,
        customerName: highestBill.customerName,
        phoneNumber: highestBill.phoneNumber,
        tableNumber: highestBill.tableNumber,
      });

      if (response.success) {
        showToast("Bills merged successfully!", "success");
        setShowMergeModal(false);
        setSelectedBillsForMerge([]);
        loadBills();
      } else {
        showToast(response.message || "Cannot merge bills offline", "error");
      }
    } catch (error) {
      console.error("Merge failed:", error);
      showToast("Failed to merge bills", "error");
    }
  };

  const handlePrint = (bill) => {
  console.log('🖨️ Starting print for:', bill.billNumber);
  
  // Set the bill to print
  setPrintBill(bill);
  
  // CRITICAL: Wait for React to render AND browser to paint
  setTimeout(() => {
    console.log('📄 Triggering print dialog...');
    
    // Trigger print
    window.print();
    
    // Clean up after print dialog closes
    setTimeout(() => {
      console.log('✅ Cleaning up print state');
      setPrintBill(null);
    }, 1000);
    
  }, 500); // 500ms ensures DOM is ready
};


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading billing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 max-w-screen-2xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-all hover:scale-105 group"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Receipt className="w-6 h-6 text-cyan-400" />
                  Billing
                </h1>
                {owner && <p className="text-gray-500 text-sm mt-0.5">{owner.restaurantName}</p>}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                New Bill
              </button>
              <button
                onClick={() => setShowMergeModal(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                <Merge className="w-4 h-4" />
                Merge
              </button>
              {/* ✅ NEW: Printer Settings Button */}
              <button
                onClick={() => setShowPrinterSettings(true)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
                title="Printer Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={loadBills}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <StatCard icon={FileText} label="Total" value={stats.totalBills || 0} />
            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={`₹${(stats.totalRevenue || 0).toFixed(0)}`}
              valueClass="text-green-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg"
              value={`₹${(stats.avgBillValue || 0).toFixed(0)}`}
              valueClass="text-blue-400"
            />
            <StatCard
              icon={Edit}
              label="Draft"
              value={stats.draft || 0}
              valueClass="text-yellow-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Done"
              value={stats.finalized || 0}
              valueClass="text-green-400"
            />
            <StatCard
              icon={X}
              label="Cancelled"
              value={stats.cancelled || 0}
              valueClass="text-red-400"
            />
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                showFilters ? "bg-cyan-500 text-black scale-105" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-900 rounded-lg border border-gray-800 animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    ["all", "All Status"],
                    ["draft", "Draft"],
                    ["finalized", "Finalized"],
                    ["cancelled", "Cancelled"],
                  ]}
                />
                <FilterSelect
                  label="Payment"
                  value={paymentFilter}
                  onChange={setPaymentFilter}
                  options={[
                    ["all", "All Payments"],
                    ["pending", "Pending"],
                    ["paid", "Paid"],
                    ["partial", "Partial"],
                  ]}
                />
                <FilterSelect
                  label="Date"
                  value={dateFilter}
                  onChange={setDateFilter}
                  options={[
                    ["all", "All Time"],
                    ["today", "Today"],
                    ["week", "Last 7 Days"],
                    ["month", "Last 30 Days"],
                  ]}
                />
              </div>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setPaymentFilter("all");
                  setDateFilter("all");
                  setSearchTerm("");
                }}
                className="mt-3 px-4 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-sm font-semibold transition-all hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-screen-2xl mx-auto">
        {filteredBills.length === 0 ? (
          <EmptyState onCreateBill={() => setShowCreateModal(true)} />
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">
              Showing {filteredBills.length} of {bills.length} bills
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBills.map((bill) => (
                <BillCard
                  key={bill._id}
                  bill={bill}
                  onView={(id) => {
                    setSelectedBill(bills.find((b) => b._id === id));
                    setShowDetailsModal(true);
                  }}
                  onFinalize={handleFinalizeBill}
                  onDelete={handleDeleteBill}
                  onPrint={handlePrint}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Create Bill Modal */}
      {showCreateModal && (
        <CreateBillModal
          form={createForm}
          setForm={setCreateForm}
          totals={billTotals}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm(INITIAL_FORM);
          }}
          onSearchDishes={() => setShowDishSearch(true)}
          onCreateBill={handleCreateBill}
          updateItemQty={updateItemQty}
          removeItem={removeItem}
        />
      )}

      {/* Dish Search Modal */}
      {showDishSearch && (
        <DishSearchModal
          dishes={dishes}
          onAddDish={handleAddDish}
          onClose={() => setShowDishSearch(false)}
          loading={menuLoading}
        />
      )}

      {/* Bill Details Modal */}
      {showDetailsModal && selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBill(null);
          }}
          onPrint={handlePrint}
        />
      )}

      {/* Merge Bills Modal */}
      {showMergeModal && (
        <MergeBillsModal
          bills={bills.filter((b) => b.status === "DRAFT")}
          selectedBills={selectedBillsForMerge}
          onToggleBill={(billId) => {
            setSelectedBillsForMerge((prev) =>
              prev.includes(billId)
                ? prev.filter((id) => id !== billId)
                : [...prev, billId]
            );
          }}
          onMerge={handleMergeBills}
          onClose={() => {
            setShowMergeModal(false);
            setSelectedBillsForMerge([]);
          }}
        />
      )}

      {/* ✅ NEW: Printer Settings Modal */}
      {showPrinterSettings && (
        <PrinterSettings onClose={() => setShowPrinterSettings(false)} />
      )}

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Print Component */}
      {printBill && (
        <PrintBill bill={printBill} restaurantName={owner?.restaurantName} />
      )}

      {/* ✅ NEW: Offline & Sync Indicators */}
      <OfflineIndicator />
      <SyncStatus />
    </div>
  );
}

// Sub-components (exactly as in original)
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
      <label className="block text-xs font-semibold mb-1.5 text-gray-500">{label}</label>
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

function EmptyState({ onCreateBill }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
      <Receipt className="w-20 h-20 text-gray-700 mb-4" />
      <p className="text-xl font-semibold mb-2">No bills found</p>
      <p className="text-gray-500 mb-6">Create your first bill to get started</p>
      <button
        onClick={onCreateBill}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        <Plus className="w-5 h-5" />
        Create First Bill
      </button>
    </div>
  );
}

function CreateBillModal({
  form,
  setForm,
  totals,
  onClose,
  onSearchDishes,
  onCreateBill,
  updateItemQty,
  removeItem,
}) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-800 flex animate-slideUp shadow-2xl">
        {/* Form */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm">
            <h2 className="text-lg font-bold">New Bill</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded transition-all hover:scale-110">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Customer Details */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Customer Details
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Table Number *"
                  value={form.tableNumber}
                  onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  className="px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  Items ({form.items.length})
                </h3>
                <button
                  onClick={onSearchDishes}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold rounded-lg flex items-center gap-1 transition-all hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  Add Items
                </button>
              </div>

              {form.items.length === 0 ? (
                <div className="text-center py-12 bg-black/50 border border-gray-800 rounded-lg">
                  <ChefHat className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No items added yet</p>
                  <p className="text-gray-600 text-xs mt-1">Click "Add Items" to search dishes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-black/50 border border-gray-800 rounded-lg hover:border-cyan-500/30 transition-all animate-slideIn"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.unitPrice} {item.variant?.name && `• ${item.variant.name}`}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateItemQty(index, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded transition-all hover:scale-110"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateItemQty(index, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 rounded text-black transition-all hover:scale-110"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-cyan-400 w-16 text-right text-sm">
                        ₹{item.totalPrice}
                      </p>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1.5 hover:bg-red-500/10 text-red-400 rounded transition-all hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Discount
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="NONE">No Discount</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: parseFloat(e.target.value) || 0 })
                  }
                  disabled={form.discountType === "NONE"}
                  className="px-3 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="w-80 bg-black border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50">
            <h3 className="font-bold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-cyan-400" />
              Summary
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span className="font-semibold">₹{totals.subtotal.toFixed(0)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{totals.discountAmount.toFixed(0)}</span>
                </div>
              )}
              {totals.serviceChargeAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span>₹{totals.serviceChargeAmount.toFixed(0)}</span>
                </div>
              )}
              {form.taxes.map((tax, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">{tax.name}</span>
                  <span>
                    ₹
                    {(
                      ((totals.subtotal -
                        totals.discountAmount +
                        totals.serviceChargeAmount) *
                        tax.rate) /
                      100
                    ).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-cyan-400">₹{totals.grandTotal}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <button
              onClick={onCreateBill}
              disabled={form.items.length === 0}
              className="w-full px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Create Bill
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillDetailsModal({ bill, onClose, onPrint }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800 animate-slideUp shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-lg font-bold">{bill.billNumber}</h2>
            <p className="text-xs text-gray-500">
              {new Date(bill.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPrint(bill)}
              className="p-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg transition-all hover:scale-110"
              title="Print Bill"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded transition-all hover:scale-110">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Customer</p>
              <p className="font-semibold">{bill.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Phone</p>
              <p className="font-semibold">{bill.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Table</p>
              <p className="font-semibold">Table {bill.tableNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Status</p>
              <p className="font-semibold">{bill.status}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-1.5">
              {bill.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between p-2 bg-black/50 rounded text-sm hover:bg-black/70 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.qty} × ₹{item.unitPrice}
                    </p>
                  </div>
                  <p className="font-bold text-cyan-400">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="p-3 bg-black/50 rounded space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{bill.subtotal.toFixed(0)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-yellow-400">
                <span>Discount</span>
                <span>
                  -₹
                  {(bill.discountType === "PERCENTAGE"
                    ? (bill.subtotal * bill.discount) / 100
                    : bill.discount
                  ).toFixed(0)}
                </span>
              </div>
            )}
            {bill.taxes?.map((tax, i) => (
              <div key={i} className="flex justify-between text-gray-400">
                <span>{tax.name}</span>
                <span>₹{tax.amount.toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t border-gray-800 pt-1.5 mt-1.5 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-cyan-400">₹{bill.grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button
            onClick={() => onPrint(bill)}
            className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            Print
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

function MergeBillsModal({ bills, selectedBills, onToggleBill, onMerge, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-800 animate-slideUp shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Merge className="w-5 h-5 text-purple-400" />
            Merge Bills
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded transition-all hover:scale-110">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-500 text-sm mb-4">
            Select 2 or more DRAFT bills to merge. Only draft bills can be merged.
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bills.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Merge className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                <p>No draft bills available to merge</p>
              </div>
            ) : (
              bills.map((bill) => (
                <label
                  key={bill._id}
                  className="flex items-center gap-3 p-3 bg-black/50 border border-gray-800 rounded-lg cursor-pointer hover:border-purple-500/30 transition-all hover:scale-[1.02]"
                >
                  <input
                    type="checkbox"
                    checked={selectedBills.includes(bill._id)}
                    onChange={() => onToggleBill(bill._id)}
                    className="w-4 h-4 text-purple-500 bg-black border-gray-700 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{bill.billNumber}</p>
                      <p className="font-bold text-cyan-400">
                        ₹{bill.grandTotal.toFixed(0)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {bill.customerName} • Table {bill.tableNumber} •{" "}
                      {bill.items.length} items
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>

          {selectedBills.length > 0 && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg animate-slideIn">
              <p className="text-sm text-purple-400">
                {selectedBills.length} bills selected for merge
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onMerge}
            disabled={selectedBills.length < 2}
            className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            Merge ({selectedBills.length})
          </button>
        </div>
      </div>
    </div>
  );
}