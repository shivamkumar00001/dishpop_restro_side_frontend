import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Receipt,
  Users,
  X as XIcon,
  FileCheck,
  Hash,
  CheckCircle,
  XCircle,
  ChefHat,
  Printer,
} from "lucide-react";
import { 
  createBillFromOrders, 
  createBillFromSelectedItems,
  fetchBillById 
} from "../../api/billingApi";
import { useAuth } from "../../context/AuthContext";

const OrderCard = React.memo(({ order, onUpdate, allOrders = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [billData, setBillData] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [printBill, setPrintBill] = useState(null);
  const navigate = useNavigate();
  const { owner } = useAuth();

  const isPending = order.status === "pending";
  const isPreparing = order.status === "confirmed";
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";
  const isBilled = Boolean(order.billId || order.billed === true);

  // Filter unbilled session orders
  const sessionOrders = allOrders.filter(
    (o) =>
      o.sessionId === order.sessionId &&
      o.status === "completed" &&
      !o.billed &&
      !o.billId
  );

  const hasUnbilledSession =
    Boolean(order.sessionId) && sessionOrders.length > 0 && !isBilled;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    if (status === "confirmed") return "PREPARING";
    return status.toUpperCase();
  };

  const getTimeElapsed = () => {
    if (!order.createdAt) return "";
    const elapsed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
    if (elapsed < 1) return "now";
    if (elapsed < 60) return `${elapsed}m`;
    const hours = Math.floor(elapsed / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const formatPrice = (price) => (price ? `₹${price.toFixed(0)}` : "₹0");

  const handleBillAction = async () => {
    const username = order.username || owner?.username;
    if (!username) return;

    if (isBilled && order.billId) {
      // Fetch actual bill data from API
      setLoadingBill(true);
      try {
        const response = await fetchBillById(username, order.billId);
        
        if (response.success && response.data) {
          setBillData(response.data);
          setShowBillDetails(true);
        } else {
          console.error("Failed to fetch bill data");
        }
      } catch (error) {
        console.error("Error fetching bill:", error);
      } finally {
        setLoadingBill(false);
      }
      return;
    }

    if (hasUnbilledSession) {
      setShowBillPreview(true);
      return;
    }

    // Direct bill generation - no alert
    setGeneratingBill(true);
    try {
      const billData = {
        orderIds: [order._id],
        discount: 0,
        discountType: "NONE",
        taxes: [
          { name: "CGST", rate: 2.5 },
          { name: "SGST", rate: 2.5 },
        ],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Order #${order._id.slice(-6)}`,
      };

      await createBillFromOrders(username, billData);
      window.location.reload();
    } catch (error) {
      console.error("Failed to generate bill:", error);
    } finally {
      setGeneratingBill(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
        {/* MAIN CONTENT - CLICKABLE */}
        <div className="p-3 cursor-pointer" onClick={toggleExpand}>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-900">
                Table {order.tableNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
              {hasUnbilledSession && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {sessionOrders.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getTimeElapsed()}</span>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Customer & Items Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {order.customerName}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {order.items?.length || 0} items
            </span>
          </div>

          {/* Bill Info Row - Only if Billed */}
          {isBilled && order.billNumber && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 border border-green-200 rounded">
              <Receipt className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              <span className="text-xs font-mono text-green-700">
                {order.billNumber}
              </span>
              <FileCheck className="w-3.5 h-3.5 text-green-600 ml-auto" />
            </div>
          )}

          {/* Amount & Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(order.grandTotal)}
              </span>
            </div>

            {/* Action Buttons - Prevent card toggle when clicking */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isPending && (
                <>
                  <button
                    onClick={() => onUpdate(order._id, "confirmed")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => onUpdate(order._id, "cancelled")}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </>
              )}

              {isPreparing && (
                <button
                  onClick={() => onUpdate(order._id, "completed")}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Ready
                </button>
              )}

              {isCompleted && !isBilled && (
                <button
                  onClick={handleBillAction}
                  disabled={generatingBill}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  {generatingBill
                    ? "..."
                    : hasUnbilledSession
                    ? "Review"
                    : "Bill"}
                </button>
              )}

              {isBilled && (
                <button
                  onClick={handleBillAction}
                  disabled={loadingBill}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded transition-colors border border-green-200 flex items-center gap-1 disabled:opacity-50"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {loadingBill ? "..." : "View"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* EXPANDABLE DETAILS */}
        {expanded && (
          <div className="border-t border-gray-200 p-3 space-y-2 bg-gray-50">
            {/* Order ID */}
            <div className="flex items-center gap-2 text-xs">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono text-gray-700">
                {order._id?.slice(-8)}
              </span>
            </div>

            {/* Phone */}
            {order.phoneNumber && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-700">{order.phoneNumber}</span>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Session Info */}
            {hasUnbilledSession && (
              <div className="flex items-center gap-2 text-xs p-2 bg-purple-50 border border-purple-200 rounded">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-purple-700">
                  {sessionOrders.length} orders • ₹
                  {sessionOrders
                    .reduce((sum, o) => sum + o.grandTotal, 0)
                    .toFixed(0)}
                </span>
              </div>
            )}

            {/* Items */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <span className="text-gray-700 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-500">×{item.qty}</span>
                    <span className="text-blue-600 font-semibold">
                      ₹{item.totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {order.description && (
              <div className="text-xs text-gray-600 italic p-2 bg-blue-50 border border-blue-100 rounded">
                "{order.description}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* BILL DETAILS MODAL */}
      {showBillDetails && billData && (
        <BillDetailsModal
          bill={billData}
          onClose={() => {
            setShowBillDetails(false);
            setBillData(null);
          }}
          onPrint={(bill) => {
            setPrintBill(bill);
            setShowBillDetails(false);
            setBillData(null);
            setTimeout(() => {
              window.print();
              setTimeout(() => setPrintBill(null), 1000);
            }, 500);
          }}
          restaurantName={owner?.restaurantName}
        />
      )}

      {/* PRINT BILL */}
      {printBill && (
        <PrintBillComponent
          bill={printBill}
          restaurantName={owner?.restaurantName}
        />
      )}

      {/* SESSION BILL PREVIEW MODAL */}
      {showBillPreview && hasUnbilledSession && (
        <SessionBillPreview
          sessionOrders={sessionOrders}
          onClose={() => setShowBillPreview(false)}
          username={order.username || owner?.username}
        />
      )}
    </>
  );
});

/* ===============================
   BILL DETAILS MODAL
=============================== */
const BillDetailsModal = ({ bill, onClose, onPrint, restaurantName }) => {
  const handlePrint = () => {
    onPrint(bill);
  };

  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "FINALIZED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "PARTIAL":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{restaurantName}</h2>
            <p className="text-blue-100 text-sm">Bill Receipt</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Bill Number</p>
              <p className="font-bold text-gray-900">{bill.billNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                {bill.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-sm text-gray-900">
                {new Date(bill.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Table</p>
              <p className="text-sm text-gray-900">Table {bill.tableNumber}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{bill.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{bill.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Order Items ({bill.items?.length || 0} items)
            </h3>
            <div className="space-y-2">
              {bill.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.unitPrice} × {item.qty}
                        {item.variant?.name && ` • ${item.variant.name}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">
                    ₹{item.totalPrice.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{bill.subtotal.toFixed(0)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount{" "}
                    {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}
                  </span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              {bill.serviceCharge?.enabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Service Charge ({bill.serviceCharge.rate}%)
                  </span>
                  <span className="font-medium text-gray-900">
                    +₹{bill.serviceCharge.amount.toFixed(0)}
                  </span>
                </div>
              )}

              {bill.taxes?.map((tax, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">
                    {tax.name} ({tax.rate}%)
                  </span>
                  <span className="font-medium text-gray-900">
                    +₹{tax.amount.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <span className="text-lg font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{bill.grandTotal.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          {bill.status === "FINALIZED" && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                  <p className={`font-bold ${getPaymentColor(bill.paymentStatus)}`}>
                    {bill.paymentStatus}
                  </p>
                </div>
                {bill.paymentMethod && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900">{bill.paymentMethod}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Notes</p>
              <p className="text-sm text-gray-900">{bill.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-300"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   SESSION BILL PREVIEW
=============================== */
const SessionBillPreview = ({ sessionOrders, onClose, username }) => {
  const [selectedOrders, setSelectedOrders] = useState(
    sessionOrders.reduce(
      (acc, order) => ({
        ...acc,
        [order._id]: {
          included: true,
          items: order.items.reduce(
            (itemAcc, item, idx) => ({ ...itemAcc, [idx]: true }),
            {}
          ),
        },
      }),
      {}
    )
  );
  const [generatingBill, setGeneratingBill] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    let itemCount = 0;
    sessionOrders.forEach((order) => {
      if (selectedOrders[order._id]?.included) {
        order.items.forEach((item, idx) => {
          if (selectedOrders[order._id].items[idx]) {
            total += item.totalPrice;
            itemCount++;
          }
        });
      }
    });
    return { total, itemCount };
  };

  const { total: totalAmount, itemCount } = calculateTotal();

  const toggleOrder = (orderId) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], included: !prev[orderId].included },
    }));
  };

  const toggleItem = (orderId, itemIndex) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        items: {
          ...prev[orderId].items,
          [itemIndex]: !prev[orderId].items[itemIndex],
        },
      },
    }));
  };

  const handleGenerateBill = async () => {
    const orderItems = [];

    sessionOrders.forEach((order) => {
      if (!selectedOrders[order._id]?.included) return;

      const selectedItemIndexes = [];
      Object.entries(selectedOrders[order._id].items).forEach(
        ([index, isSelected]) => {
          if (isSelected) selectedItemIndexes.push(parseInt(index));
        }
      );

      if (selectedItemIndexes.length > 0) {
        orderItems.push({ orderId: order._id, itemIndexes: selectedItemIndexes });
      }
    });

    if (orderItems.length === 0) return;

    setGeneratingBill(true);
    try {
      const billData = {
        orderItems,
        discount: 0,
        discountType: "NONE",
        taxes: [
          { name: "CGST", rate: 2.5 },
          { name: "SGST", rate: 2.5 },
        ],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Session: ${orderItems.length} orders, ${itemCount} items`,
      };

      await createBillFromSelectedItems(username, billData);
      window.location.reload();
    } catch (error) {
      console.error("Failed to generate bill:", error);
    } finally {
      setGeneratingBill(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Session Bill
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {sessionOrders.length} orders
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Orders */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-160px)]">
          {sessionOrders.map((order) => {
            const isOrderIncluded = selectedOrders[order._id]?.included;

            return (
              <div
                key={order._id}
                className={`rounded-lg border-2 transition-all ${
                  isOrderIncluded
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                {/* Order Header */}
                <label className="flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={isOrderIncluded}
                    onChange={() => toggleOrder(order._id)}
                    className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-600">
                        #{order._id.slice(-6)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.items.length} items
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      ₹{order.grandTotal.toFixed(0)}
                    </span>
                  </div>
                </label>

                {/* Items */}
                {isOrderIncluded && (
                  <div className="p-2 space-y-1">
                    {order.items.map((item, idx) => {
                      const isItemSelected =
                        selectedOrders[order._id].items[idx];
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                            isItemSelected
                              ? "bg-white border border-purple-200"
                              : "bg-gray-100 border border-gray-200 opacity-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={() => toggleItem(order._id, idx)}
                            className="w-3 h-3 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                          />
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.unitPrice} × {item.qty}
                            </p>
                          </div>
                          <span className="text-xs text-purple-600 font-bold">
                            ₹{item.totalPrice.toFixed(0)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">Selected</p>
              <p className="text-sm font-bold text-gray-900">{itemCount} items</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{totalAmount.toFixed(0)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateBill}
              disabled={generatingBill || itemCount === 0}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              {generatingBill ? "Generating..." : `Generate (${itemCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   PRINT BILL COMPONENT
=============================== */
const PrintBillComponent = ({ bill, restaurantName }) => {
  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  return (
    <div className="print-only fixed inset-0 bg-white z-[9999]">
      <style>{`
        @media print {
          .print-only {
            display: block !important;
          }
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurantName}
          </h1>
          <p className="text-sm text-gray-600">Bill Receipt</p>
        </div>

        {/* Bill Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-600">Bill Number:</p>
            <p className="font-bold">{bill.billNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="font-medium">
              {new Date(bill.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Table:</p>
            <p className="font-medium">Table {bill.tableNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="font-medium">{bill.status}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">Customer Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{bill.customerName}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{bill.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Order Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2">
                    <p className="font-medium">{item.name}</p>
                    {item.variant?.name && (
                      <p className="text-xs text-gray-600">{item.variant.name}</p>
                    )}
                  </td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">₹{item.unitPrice.toFixed(0)}</td>
                  <td className="text-right font-medium">
                    ₹{item.totalPrice.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bill Summary */}
        <div className="border-t-2 border-gray-800 pt-4">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{bill.subtotal.toFixed(0)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount{" "}
                  {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}:
                </span>
                <span className="font-medium">-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}

            {bill.serviceCharge?.enabled && (
              <div className="flex justify-between">
                <span>Service Charge ({bill.serviceCharge.rate}%):</span>
                <span className="font-medium">
                  +₹{bill.serviceCharge.amount.toFixed(0)}
                </span>
              </div>
            )}

            {bill.taxes?.map((tax, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {tax.name} ({tax.rate}%):
                </span>
                <span className="font-medium">+₹{tax.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-lg font-bold border-t-2 border-gray-800 pt-3">
            <span>Grand Total:</span>
            <span>₹{bill.grandTotal.toFixed(0)}</span>
          </div>
        </div>

        {/* Payment Info */}
        {bill.status === "FINALIZED" && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-600">Payment Status:</p>
                <p className="font-bold">{bill.paymentStatus}</p>
              </div>
              {bill.paymentMethod && (
                <div className="text-right">
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="font-medium">{bill.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {bill.notes && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <p className="text-xs text-gray-600 mb-1">Notes:</p>
            <p className="text-sm">{bill.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            Printed on {new Date().toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

OrderCard.displayName = "OrderCard";

export default OrderCard;