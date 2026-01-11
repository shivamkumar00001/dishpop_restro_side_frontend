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
  Hash
} from "lucide-react";
import { createBillFromOrders, createBillFromSelectedItems } from "../../api/billingApi";
import { useAuth } from "../../context/AuthContext";

const OrderCard = React.memo(({ order, onUpdate, allOrders = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const navigate = useNavigate();
  const { owner } = useAuth();
  
  const isPending = order.status === "pending";
  const isConfirmed = order.status === "confirmed";
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";
  const isBilled = Boolean(order.billId || order.billed === true);
  
  // Filter unbilled session orders
  const sessionOrders = allOrders.filter(o => 
    o.sessionId === order.sessionId && 
    o.status === "completed" &&
    !o.billed &&
    !o.billId
  );
  
  const hasUnbilledSession = Boolean(order.sessionId) && sessionOrders.length > 0 && !isBilled;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "confirmed": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "completed": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
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

  const formatPrice = (price) => price ? `₹${price.toFixed(2)}` : "₹0.00";

  const handleAction = async () => {
    const username = order.username || owner?.username;
    if (!username) return;

    if (isBilled) {
      navigate(`/${username}/billing`);
      return;
    }

    if (hasUnbilledSession) {
      setShowBillPreview(true);
      return;
    }

    if (!confirm("Generate bill for this order?")) return;

    setGeneratingBill(true);
    try {
      const billData = {
        orderIds: [order._id],
        discount: 0,
        discountType: "NONE",
        taxes: [{ name: "CGST", rate: 2.5 }, { name: "SGST", rate: 2.5 }],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Order #${order._id.slice(-6)}`
      };

      await createBillFromOrders(username, billData);
      window.location.reload();
    } catch (error) {
      console.error("Failed to generate bill:", error);
      alert("Failed to generate bill");
    } finally {
      setGeneratingBill(false);
    }
  };

  // Toggle expand/collapse
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Compact Card - No height expansion when opened */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyan-500/30 transition-all">
        {/* Main Content - Always Visible - CLICKABLE */}
        <div 
          className="p-3 cursor-pointer"
          onClick={toggleExpand}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="text-sm font-bold text-white">T{order.tableNumber}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
              {hasUnbilledSession && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" />
                  {sessionOrders.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">{getTimeElapsed()}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          </div>

          {/* Customer & Items Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">{order.customerName}</span>
            </div>
            <span className="text-xs text-gray-500">{order.items?.length || 0} items</span>
          </div>

          {/* Bill Info Row - Only if Billed */}
          {isBilled && order.billNumber && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded">
              <Receipt className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-mono text-emerald-400">{order.billNumber}</span>
              <FileCheck className="w-3 h-3 text-emerald-400 ml-auto" />
            </div>
          )}

          {/* Amount & Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-base font-bold text-cyan-400">{formatPrice(order.grandTotal)}</span>
            </div>

            {/* Action Buttons - Prevent card toggle when clicking */}
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              {isPending && (
                <>
                  <button
                    onClick={() => onUpdate(order._id, "confirmed")}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-semibold rounded transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onUpdate(order._id, "cancelled")}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}

              {isConfirmed && (
                <button
                  onClick={() => onUpdate(order._id, "completed")}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-black text-xs font-semibold rounded transition-colors"
                >
                  Complete
                </button>
              )}

              {isCompleted && !isBilled && (
                <button
                  onClick={handleAction}
                  disabled={generatingBill}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Receipt className="w-3 h-3" />
                  {generatingBill ? "..." : hasUnbilledSession ? "Review" : "Bill"}
                </button>
              )}

              {isBilled && (
                <button
                  onClick={handleAction}
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded transition-colors border border-emerald-500/30 flex items-center gap-1"
                >
                  <FileCheck className="w-3 h-3" />
                  View
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Details - Appears BELOW card when expanded */}
        {expanded && (
          <div className="border-t border-gray-800 p-3 space-y-2 bg-black/20 animate-slideDown">
            {/* Order ID */}
            <div className="flex items-center gap-2 text-xs">
              <Hash className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono text-gray-400">{order._id?.slice(-8)}</span>
            </div>

            {/* Phone */}
            {order.phoneNumber && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400">{order.phoneNumber}</span>
              </div>
            )}

            {/* Time */}
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400">
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Session Info */}
            {hasUnbilledSession && (
              <div className="flex items-center gap-2 text-xs p-2 bg-purple-500/5 border border-purple-500/20 rounded">
                <Users className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400">{sessionOrders.length} orders • ₹{sessionOrders.reduce((sum, o) => sum + o.grandTotal, 0).toFixed(2)}</span>
              </div>
            )}

            {/* Items */}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-gray-800/30 rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                    )}
                    <span className="text-gray-300 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-500">×{item.qty}</span>
                    <span className="text-cyan-400 font-semibold">₹{item.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {order.description && (
              <div className="text-xs text-gray-400 italic p-2 bg-blue-500/5 border border-blue-500/10 rounded">
                "{order.description}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Bill Preview Modal */}
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

// Session Bill Preview Modal (unchanged)
const SessionBillPreview = ({ sessionOrders, onClose, username }) => {
  const [selectedOrders, setSelectedOrders] = useState(
    sessionOrders.reduce((acc, order) => ({
      ...acc,
      [order._id]: {
        included: true,
        items: order.items.reduce((itemAcc, item, idx) => ({ ...itemAcc, [idx]: true }), {})
      }
    }), {})
  );
  const [generatingBill, setGeneratingBill] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    let itemCount = 0;
    sessionOrders.forEach(order => {
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
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], included: !prev[orderId].included }
    }));
  };

  const toggleItem = (orderId, itemIndex) => {
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        items: { ...prev[orderId].items, [itemIndex]: !prev[orderId].items[itemIndex] }
      }
    }));
  };

  const handleGenerateBill = async () => {
    const orderItems = [];
    
    sessionOrders.forEach(order => {
      if (!selectedOrders[order._id]?.included) return;
      
      const selectedItemIndexes = [];
      Object.entries(selectedOrders[order._id].items).forEach(([index, isSelected]) => {
        if (isSelected) selectedItemIndexes.push(parseInt(index));
      });
      
      if (selectedItemIndexes.length > 0) {
        orderItems.push({ orderId: order._id, itemIndexes: selectedItemIndexes });
      }
    });

    if (orderItems.length === 0) {
      alert("Please select at least one item");
      return;
    }

    if (!confirm(`Generate bill for ${itemCount} items?`)) return;

    setGeneratingBill(true);
    try {
      const billData = {
        orderItems,
        discount: 0,
        discountType: "NONE",
        taxes: [{ name: "CGST", rate: 2.5 }, { name: "SGST", rate: 2.5 }],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Session: ${orderItems.length} orders, ${itemCount} items`
      };

      await createBillFromSelectedItems(username, billData);
      window.location.reload();
    } catch (error) {
      console.error("Failed to generate bill:", error);
      alert("Failed to generate bill");
    } finally {
      setGeneratingBill(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Session Bill
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{sessionOrders.length} orders</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Orders */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-160px)]">
          {sessionOrders.map((order) => {
            const isOrderIncluded = selectedOrders[order._id]?.included;

            return (
              <div key={order._id} className={`rounded-lg border-2 transition-all ${isOrderIncluded ? "border-purple-500 bg-purple-500/5" : "border-gray-800 bg-black/50 opacity-50"}`}>
                {/* Order Header */}
                <label className="flex items-center gap-3 p-3 cursor-pointer border-b border-gray-800">
                  <input 
                    type="checkbox" 
                    checked={isOrderIncluded} 
                    onChange={() => toggleOrder(order._id)} 
                    className="w-4 h-4 text-purple-500 bg-black border-gray-700 rounded focus:ring-purple-500" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-500">#{order._id.slice(-6)}</span>
                      <span className="text-xs text-gray-400">{order.items.length} items</span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400">₹{order.grandTotal.toFixed(2)}</span>
                  </div>
                </label>

                {/* Items */}
                {isOrderIncluded && (
                  <div className="p-2 space-y-1">
                    {order.items.map((item, idx) => {
                      const isItemSelected = selectedOrders[order._id].items[idx];
                      return (
                        <label 
                          key={idx} 
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${isItemSelected ? "bg-gray-800 border border-gray-700" : "bg-gray-900 border border-gray-800 opacity-50"}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isItemSelected} 
                            onChange={() => toggleItem(order._id, idx)} 
                            className="w-3 h-3 text-purple-500 bg-black border-gray-700 rounded focus:ring-purple-500" 
                          />
                          {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500">₹{item.unitPrice} × {item.qty}</p>
                          </div>
                          <span className="text-xs text-cyan-400 font-bold">₹{item.totalPrice.toFixed(2)}</span>
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
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">Selected</p>
              <p className="text-sm font-bold">{itemCount} items</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-bold text-purple-400">₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleGenerateBill} 
              disabled={generatingBill || itemCount === 0} 
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

OrderCard.displayName = "OrderCard";

export default OrderCard;