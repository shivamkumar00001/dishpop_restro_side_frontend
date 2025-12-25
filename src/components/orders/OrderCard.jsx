import React, { useState } from "react";
import { 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Package
} from "lucide-react";

const OrderCard = React.memo(({ order, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const status = order.status;

  // Status checks
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "confirmed":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  // Calculate time elapsed
  const getTimeElapsed = () => {
    if (!order.createdAt) return "";
    const elapsed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
    if (elapsed < 1) return "Just now";
    if (elapsed < 60) return `${elapsed}m ago`;
    const hours = Math.floor(elapsed / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return price ? `₹${price.toFixed(2)}` : "₹0.00";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-4 hover:border-cyan-500/30 transition-all shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500">
              #{order._id?.slice(-6) || "N/A"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {isPending && "New Order"}
              {isConfirmed && "Confirmed"}
              {isCompleted && "Completed"}
              {isCancelled && "Cancelled"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Table {order.tableNumber ?? "-"}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            {formatTime(order.createdAt)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{getTimeElapsed()}</div>
        </div>
      </div>

      {/* Customer Info */}
      {(order.customerName || order.phoneNumber) && (
        <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-800">
          {order.customerName && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User className="w-4 h-4 text-gray-500" />
              <span>{order.customerName}</span>
            </div>
          )}
          {order.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{order.phoneNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {order.description && (
        <div className="mb-3 pb-3 border-b border-gray-800">
          <p className="text-xs text-gray-400 italic line-clamp-2">
            "{order.description}"
          </p>
        </div>
      )}

      {/* Items Summary */}
      <div className="mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">
              {order.items?.length || 0} Items
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {expanded && order.items && order.items.length > 0 ? (
          <div className="mt-2 space-y-2 pl-6 max-h-48 overflow-y-auto custom-scrollbar">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between text-xs bg-gray-800/50 rounded-lg p-2 border border-gray-700/50"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-start gap-2">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-200 font-medium truncate">{item.name}</div>
                      {item.variant && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.variant.name}
                        </div>
                      )}
                      {item.addons && item.addons.length > 0 && (
                        <div className="text-xs text-cyan-400 truncate">
                          + {item.addons.length} addon{item.addons.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-gray-400 text-xs font-medium">
                    ×{item.qty || item.quantity || 1}
                  </span>
                  <span className="text-cyan-400 font-semibold min-w-[4rem] text-right">
                    {formatPrice(item.totalPrice || (item.price * (item.qty || item.quantity || 1)))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : expanded && (!order.items || order.items.length === 0) ? (
          <div className="flex items-center justify-center py-6 text-gray-500 mt-2">
            <Package className="w-5 h-5 mr-2" />
            <span className="text-sm">No items</span>
          </div>
        ) : null}
      </div>

      {/* Total */}
      {order.grandTotal > 0 && (
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <IndianRupee className="w-4 h-4 text-cyan-400" />
            <span>Grand Total</span>
          </div>
          <span className="text-xl font-bold text-cyan-400">
            {formatPrice(order.grandTotal)}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isPending && (
          <>
            <button
              onClick={() => onUpdate(order._id, "confirmed")}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={() => onUpdate(order._id, "cancelled")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}

        {isConfirmed && (
          <button
            onClick={() => onUpdate(order._id, "completed")}
            className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Complete
          </button>
        )}

        {isCompleted && (
          <div className="flex-1 text-center text-sm font-medium text-green-400 py-2.5 bg-green-500/10 rounded-lg border border-green-500/20">
            ✓ Completed
          </div>
        )}

        {isCancelled && (
          <div className="flex-1 text-center text-sm font-medium text-red-400 py-2.5 bg-red-500/10 rounded-lg border border-red-500/20">
            ✗ Cancelled
          </div>
        )}
      </div>
    </div>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;