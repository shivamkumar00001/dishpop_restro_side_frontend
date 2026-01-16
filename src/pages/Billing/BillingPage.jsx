import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Receipt,
  Plus,
  Search,
  ShoppingCart,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Printer,
  X,
  Edit2,
  Trash2,
  ChevronRight,
  Settings,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import API services
import billingAPI from "../../api/billingApi";
import menuApi from "../../api/menuApi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

// Import components
import OfflineIndicator from "../../components/Billing/OfflineIndicator";
import SyncStatus from "../../components/Billing/SyncStatus";
import PrinterSettings from "../../components/Billing/PrinterSettings";
import DishSearchModal from "../../components/Billing/DishSearchModal";
import PaymentModal from "../../components/Billing/PaymentModal";
import CancelBillModal from "../../components/Billing/CancelBillModal";
import SaveIndicator from "../../components/Billing/SaveIndicator";
import Toast from "../../components/Billing/Toast";
import PrintBill from "../../components/Billing/PrintBill";

const API_URL = API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

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
  const [billingConfig, setBillingConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);

  // Active bill creation
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [createForm, setCreateForm] = useState(INITIAL_FORM);
  const [selectedBill, setSelectedBill] = useState(null);

  // Modals
  const [showDishSearch, setShowDishSearch] = useState(false);
  const [showPrinterSettings, setShowPrinterSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billToFinalize, setBillToFinalize] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billToCancel, setBillToCancel] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  // Toast & Print
  const [toast, setToast] = useState(null);
  const [printBill, setPrintBill] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Generate taxes from config
  const generateTaxesFromConfig = useCallback((config) => {
    if (!config || !config.taxRate || config.taxType === "NO_GST") {
      return [];
    }

    switch (config.taxType) {
      case "CGST_SGST":
        const halfRate = config.taxRate / 2;
        return [
          { name: "CGST", rate: halfRate },
          { name: "SGST", rate: halfRate },
        ];

      case "IGST":
        return [{ name: "IGST", rate: config.taxRate }];

      case "INCLUSIVE_GST":
        return [{ name: "GST (Incl.)", rate: config.taxRate }];

      default:
        return [{ name: "Tax", rate: config.taxRate }];
    }
  }, []);

  // Load billing configuration
  const loadBillingConfig = useCallback(async () => {
    if (!usernameToFetch) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/billing/config/${usernameToFetch}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        }
      );

      if (response.data?.success && response.data?.data) {
        setBillingConfig(response.data.data);
        const generatedTaxes = generateTaxesFromConfig(response.data.data);
        if (generatedTaxes.length > 0) {
          setCreateForm((prev) => ({
            ...prev,
            taxes: generatedTaxes,
          }));
        }
      }
    } catch (error) {
      console.warn("Billing config not found or failed to load");
    }
  }, [usernameToFetch, generateTaxesFromConfig]);

  // Load menu
  const loadMenu = useCallback(async () => {
    if (!usernameToFetch) return;
    try {
      setMenuLoading(true);
      await billingAPI.fetchAndCacheMenu(usernameToFetch);
      const res = await menuApi.getMenu(usernameToFetch);
      const menuData = res.data?.data?.menu || res.data?.menu || [];
      const allDishes = menuData.flatMap((cat) => cat.dishes || []);
      setDishes(allDishes);
    } catch (error) {
      console.error("Menu load failed:", error);
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

  // Load bills
  const loadBills = useCallback(async () => {
    if (!usernameToFetch) return;
    try {
      setLoading(true);
      const filters = {};

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

      const [billsRes, statsRes] = await Promise.all([
        billingAPI.fetchAllBills(usernameToFetch, filters),
        billingAPI.fetchBillingStats(
          usernameToFetch,
          dateFilter === "all" ? "all" : dateFilter
        ),
      ]);

      setBills(Array.isArray(billsRes.data) ? billsRes.data : []);
      setStats(statsRes.data || {});

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
  }, [usernameToFetch, dateFilter, showToast]);

  useEffect(() => {
    loadBillingConfig();
    loadBills();
    loadMenu();
  }, [loadBillingConfig, loadBills, loadMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + N: New Bill
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        startNewBill();
      }
      
      // Ctrl/Cmd + R: Refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        setIsSyncing(true);
        loadBills().finally(() => setIsSyncing(false));
      }

      // Escape: Close modals/cancel creation
      if (e.key === 'Escape') {
        if (isCreatingBill) {
          setIsCreatingBill(false);
          setSelectedBill(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCreatingBill, loadBills]);

  // Separate draft and finalized bills
  const { draftBills, finalizedBills } = useMemo(() => {
    const drafts = bills.filter((b) => b.status === "DRAFT");
    const finalized = bills.filter((b) => b.status === "FINALIZED");

    const filterBySearch = (bill) => {
      const search = searchTerm.toLowerCase();
      return (
        bill.billNumber.toLowerCase().includes(search) ||
        bill.customerName.toLowerCase().includes(search) ||
        bill.phoneNumber.includes(search) ||
        bill.tableNumber.toString().includes(search)
      );
    };

    return {
      draftBills: drafts.filter(filterBySearch),
      finalizedBills: finalized.filter(filterBySearch),
    };
  }, [bills, searchTerm]);

  // Add dish to bill
  const handleAddDish = useCallback(
    (dish, variant) => {
      setCreateForm((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) =>
            item.itemId === dish._id && item.variant?.name === variant.name
        );

        if (existingIndex >= 0) {
          const updated = [...prev.items];
          updated[existingIndex].qty += 1;
          updated[existingIndex].totalPrice =
            updated[existingIndex].qty * updated[existingIndex].unitPrice;
          
          // Visual feedback without toast to reduce clutter
          return { ...prev, items: updated };
        }

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
    },
    []
  );

  // Update item quantity
  const updateItemQty = useCallback((index, newQty) => {
    setCreateForm((prev) => {
      const updated = [...prev.items];
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].qty = newQty;
        updated[index].totalPrice = newQty * updated[index].unitPrice;
      }
      return { ...prev, items: updated };
    });
  }, []);

  // Calculate totals
  const billTotals = useMemo(() => {
    const subtotal = createForm.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
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
  }, [
    createForm.items,
    createForm.discount,
    createForm.discountType,
    createForm.serviceCharge,
    createForm.taxes,
  ]);

  // Create bill (save as draft)
  const handleSaveDraft = async () => {
    if (!createForm.tableNumber || !createForm.customerName) {
      showToast("Table number and customer name required", "error");
      return;
    }
    if (createForm.items.length === 0) {
      showToast("Add at least one item", "error");
      return;
    }

    setSaveStatus("saving");

    try {
      const response = await billingAPI.createBillManually(
        usernameToFetch,
        createForm
      );

      if (response.offline) {
        setSaveStatus("offline");
        showToast("Bill saved offline - will sync when online", "success");
      } else {
        setSaveStatus("saved");
        showToast("Bill saved as draft", "success");
      }

      // Clear save indicator after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);

      // Optimistic update - add bill to local state immediately
      if (response.data) {
        setBills((prev) => [response.data, ...prev]);
        setStats((prev) => ({
          ...prev,
          draft: (prev.draft || 0) + 1,
          totalBills: (prev.totalBills || 0) + 1,
        }));
      }

      setIsCreatingBill(false);
      setCreateForm({
        ...INITIAL_FORM,
        taxes: billingConfig
          ? generateTaxesFromConfig(billingConfig)
          : INITIAL_FORM.taxes,
      });

      // Only reload in background if online
      if (!response.offline) {
        setTimeout(() => loadBills(), 500);
      }
    } catch (error) {
      console.error("Create bill failed:", error);
      setSaveStatus(null);
      showToast(
        error.response?.data?.message || "Failed to create bill",
        "error"
      );
    }
  };

  // Finalize bill (complete payment)
  const handleFinalizeBill = async (billId) => {
    const bill = bills.find((b) => b._id === billId);
    if (!bill) return;

    setBillToFinalize(bill);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentData) => {
    if (!billToFinalize) return;

    try {
      const response = await billingAPI.finalizeBill(
        usernameToFetch,
        billToFinalize._id,
        paymentData
      );

      if (response.offline) {
        showToast("Bill finalized offline - will sync when online", "success");
      } else {
        showToast("Payment completed successfully!", "success");
      }

      // Optimistic update - update bill status locally
      setBills((prev) =>
        prev.map((bill) =>
          bill._id === billToFinalize._id
            ? {
                ...bill,
                status: "FINALIZED",
                paymentStatus: "PAID",
                paymentMethod: paymentData.paymentMethod,
                paidAmount: paymentData.paidAmount,
              }
            : bill
        )
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        draft: Math.max((prev.draft || 0) - 1, 0),
        finalized: (prev.finalized || 0) + 1,
        totalRevenue: (prev.totalRevenue || 0) + billToFinalize.grandTotal,
      }));

      setShowPaymentModal(false);
      setBillToFinalize(null);

      // Background refresh
      if (!response.offline) {
        setTimeout(() => loadBills(), 500);
      }
    } catch (error) {
      console.error("Finalize failed:", error);
      showToast("Failed to finalize bill", "error");
    }
  };

  // Delete bill
  const handleDeleteBill = async (billId) => {
    const bill = bills.find((b) => b._id === billId);
    if (!bill) return;

    setBillToCancel(bill);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    if (!billToCancel) return;

    try {
      const response = await billingAPI.deleteBill(
        usernameToFetch,
        billToCancel._id,
        reason
      );

      if (response.offline) {
        showToast("Bill cancelled offline - will sync when online", "success");
      } else {
        showToast("Bill cancelled successfully", "success");
      }

      // Optimistic update - remove bill from local state
      setBills((prev) => prev.filter((bill) => bill._id !== billToCancel._id));

      // Update stats
      setStats((prev) => ({
        ...prev,
        draft: Math.max((prev.draft || 0) - 1, 0),
        cancelled: (prev.cancelled || 0) + 1,
        totalBills: Math.max((prev.totalBills || 0) - 1, 0),
      }));

      setShowCancelModal(false);
      setBillToCancel(null);

      // Background refresh
      if (!response.offline) {
        setTimeout(() => loadBills(), 500);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to cancel bill", "error");
    }
  };

  // Print bill
  const handlePrint = (bill) => {
    setPrintBill(bill);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintBill(null), 1000);
    }, 500);
  };

  // Start new bill
  const startNewBill = () => {
    setIsCreatingBill(true);
    setSelectedBill(null);
    setCreateForm({
      ...INITIAL_FORM,
      taxes: billingConfig
        ? generateTaxesFromConfig(billingConfig)
        : INITIAL_FORM.taxes,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading billing system...</p>
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
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Billing</h1>
              <p className="text-xs text-gray-500">{owner?.restaurantName}</p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Draft</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.draft || 0}
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
                  {stats.finalized || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Today's Revenue</p>
                <p className="text-sm font-bold text-green-600">
                  ₹{(stats.totalRevenue || 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={() => {
              setIsSyncing(true);
              loadBills().finally(() => setIsSyncing(false));
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="Refresh"
            disabled={isSyncing}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowPrinterSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={startNewBill}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Bill
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - DRAFT BILLS */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Draft Bills
                <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {draftBills.length}
                </span>
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {draftBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Clock className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No draft bills</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create a new bill to get started
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {draftBills.map((bill) => (
                  <DraftBillCard
                    key={bill._id}
                    bill={bill}
                    isSelected={selectedBill?._id === bill._id}
                    onClick={() => setSelectedBill(bill)}
                    onFinalize={handleFinalizeBill}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANEL - BILL CREATION/EDITING */}
        <div className="flex-1 flex flex-col bg-white">
          {isCreatingBill || selectedBill ? (
            <BillCreationPanel
              form={createForm}
              setForm={setCreateForm}
              totals={billTotals}
              onAddItems={() => setShowDishSearch(true)}
              onSaveDraft={handleSaveDraft}
              onCancel={() => {
                setIsCreatingBill(false);
                setSelectedBill(null);
              }}
              updateItemQty={updateItemQty}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Create a Bill
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Click "New Bill" to start creating a bill, or select a draft bill from the left panel to continue editing.
                </p>
                <button
                  onClick={startNewBill}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-3 mx-auto transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                  <Plus className="w-6 h-6" />
                  Create New Bill
                </button>
                <p className="text-sm text-gray-400 mt-6">
                  💡 Tip: Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl+N</kbd> to quickly create a new bill
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - COMPLETED BILLS */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Completed
              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {finalizedBills.length}
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {finalizedBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <CheckCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No completed bills</p>
                <p className="text-xs text-gray-400 mt-1">
                  Completed bills will appear here
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {finalizedBills.map((bill) => (
                  <CompletedBillCard
                    key={bill._id}
                    bill={bill}
                    onPrint={handlePrint}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showDishSearch && (
        <DishSearchModal
          dishes={dishes}
          onAddDish={handleAddDish}
          onClose={() => setShowDishSearch(false)}
          loading={menuLoading}
        />
      )}

      {showPrinterSettings && (
        <PrinterSettings onClose={() => setShowPrinterSettings(false)} />
      )}

      {showPaymentModal && billToFinalize && (
        <PaymentModal
          bill={billToFinalize}
          onConfirm={handlePaymentConfirm}
          onClose={() => {
            setShowPaymentModal(false);
            setBillToFinalize(null);
          }}
        />
      )}

      {showCancelModal && billToCancel && (
        <CancelBillModal
          bill={billToCancel}
          onConfirm={handleCancelConfirm}
          onClose={() => {
            setShowCancelModal(false);
            setBillToCancel(null);
          }}
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

      {/* SAVE INDICATOR */}
      <SaveIndicator status={saveStatus} />

      {/* PRINT */}
      {printBill && (
        <PrintBill
          bill={printBill}
          restaurantName={owner?.restaurantName}
          billingConfig={billingConfig}
        />
      )}

      {/* OFFLINE & SYNC */}
      <OfflineIndicator />
      <SyncStatus />
    </div>
  );
}

// DRAFT BILL CARD
function DraftBillCard({ bill, isSelected, onClick, onFinalize, onDelete }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {bill.billNumber}
          </p>
          <p className="text-xs text-gray-500">Table {bill.tableNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-blue-600">₹{bill.grandTotal}</p>
          <p className="text-xs text-gray-500">{bill.items.length} items</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900">{bill.customerName}</p>
        <p className="text-xs text-gray-500">{bill.phoneNumber}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFinalize(bill._id);
          }}
          className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
        >
          Complete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bill._id);
          }}
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// COMPLETED BILL CARD
function CompletedBillCard({ bill, onPrint }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {bill.billNumber}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(bill.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600">₹{bill.grandTotal}</p>
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
            {bill.paymentMethod}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900">{bill.customerName}</p>
        <p className="text-xs text-gray-500">
          Table {bill.tableNumber} • {bill.items.length} items
        </p>
      </div>

      <button
        onClick={() => onPrint(bill)}
        className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
      >
        <Printer className="w-3.5 h-3.5" />
        Print Bill
      </button>
    </div>
  );
}

// BILL CREATION PANEL
function BillCreationPanel({
  form,
  setForm,
  totals,
  onAddItems,
  onSaveDraft,
  onCancel,
  updateItemQty,
}) {
  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">New Bill</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Customer Details Form */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <input
            type="text"
            placeholder="Table Number *"
            value={form.tableNumber}
            onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Customer Name *"
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Items Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {form.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No items added yet</p>
            <button
              onClick={onAddItems}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Items
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Add Items Button */}
            <button
              onClick={onAddItems}
              className="w-full px-4 py-3 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
            >
              <Plus className="w-5 h-5" />
              Add More Items
            </button>

            {/* Items List */}
            {form.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.unitPrice} {item.variant?.name && `• ${item.variant.name}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItemQty(index, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold">{item.qty}</span>
                  <button
                    onClick={() => updateItemQty(index, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-blue-600 w-20 text-right">
                  ₹{item.totalPrice}
                </p>

                <button
                  onClick={() => updateItemQty(index, 0)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Bill Summary */}
      {form.items.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{totals.subtotal.toFixed(0)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{totals.discountAmount.toFixed(0)}</span>
              </div>
            )}
            {form.taxes.map((tax, i) => (
              <div key={i} className="flex justify-between text-gray-600">
                <span>{tax.name} ({tax.rate}%)</span>
                <span>
                  ₹
                  {(
                    ((totals.subtotal - totals.discountAmount) * tax.rate) /
                    100
                  ).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{totals.grandTotal}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSaveDraft}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
              Save as Draft
            </button>
          </div>
        </div>
      )}
    </>
  );
}