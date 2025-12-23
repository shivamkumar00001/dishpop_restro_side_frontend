import React from "react";
import { Clock, CheckCircle2, XCircle, User, Phone, IndianRupee, Package } from "lucide-react";

/**
 * Enhanced Order Card Component
 */

const OrderCard = React.memo(({ order, onUpdate }) => {
  const status = order.status;

  // Status checks
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";

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

  // Format price
  const formatPrice = (price) => {
    return price ? `₹${price.toFixed(2)}` : "₹0.00";
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-white">
              Table {order.tableNumber ?? "-"}
            </span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500 font-mono">
              #{order._id?.slice(-6) || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{getTimeElapsed()}</span>
          </div>
        </div>

        {/* Status Badge */}
        {isPending && (
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded-md border border-orange-500/20 whitespace-nowrap">
            New Order
          </span>
        )}
        {isConfirmed && (
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-md border border-blue-500/20 whitespace-nowrap">
            Confirmed
          </span>
        )}
        {isCompleted && (
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-md border border-green-500/20 whitespace-nowrap">
            Completed
          </span>
        )}
        {isCancelled && (
          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-md border border-red-500/20 whitespace-nowrap">
            Cancelled
          </span>
        )}
      </div>

      {/* Customer Details */}
      {(order.customerName || order.phoneNumber) && (
        <div className="mb-3 pb-3 border-b border-gray-800">
          <div className="space-y-1.5">
            {order.customerName && (
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-300 truncate">{order.customerName}</span>
              </div>
            )}
            {order.phoneNumber && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-300">{order.phoneNumber}</span>
              </div>
            )}
          </div>
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

      {/* Items */}
      <div className="mb-3 max-h-48 overflow-y-auto custom-scrollbar">
        {order.items && order.items.length > 0 ? (
          <ul className="space-y-2">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between text-sm bg-gray-900/50 rounded-md px-3 py-2.5 border border-gray-800/50"
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
                      <span className="text-gray-200 block truncate font-medium">
                        {item.name}
                      </span>
                      {item.variant && (
                        <span className="text-xs text-gray-500 block truncate">
                          {item.variant.name}
                        </span>
                      )}
                      {item.addons && item.addons.length > 0 && (
                        <span className="text-xs text-blue-400 block truncate">
                          + {item.addons.length} addon{item.addons.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-gray-400 text-xs font-medium">
                    ×{item.qty}
                  </span>
                  <span className="text-white font-semibold text-sm min-w-[4rem] text-right">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-6 text-gray-500">
            <Package className="w-5 h-5 mr-2" />
            <span className="text-sm">No items</span>
          </div>
        )}
      </div>

      {/* Total */}
      {order.grandTotal > 0 && (
        <div className="mb-3 pb-3 border-t border-gray-800 pt-3">
          <div className="flex items-center justify-between bg-gray-900/50 rounded-md px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <IndianRupee className="w-4 h-4 text-green-500" />
              <span>Grand Total</span>
            </div>
            <span className="text-xl font-bold text-white">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isPending && (
          <>
            <button
              onClick={() => onUpdate(order._id, "confirmed")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={() => onUpdate(order._id, "cancelled")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}

        {isConfirmed && (
          <button
            onClick={() => onUpdate(order._id, "completed")}
            className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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