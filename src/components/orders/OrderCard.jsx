import React from "react";
import { Clock, CheckCircle2, XCircle, User, Phone, IndianRupee } from "lucide-react";

/**
 * Enhanced Order Card with Customer Details, Prices & Total (INR)
 * Status Flow: pending → accepted → completed | rejected
 */
const OrderCard = React.memo(({ order, onUpdate }) => {
  const status = order.status;

  const isPending = status === "pending";
  const isAccepted = status === "accepted" || status === "preparing";
  const isCompleted = status === "completed" || status === "ready" || status === "served";
  const isRejected = status === "rejected" || status === "cancelled";

  // Calculate time elapsed
  const getTimeElapsed = () => {
    if (!order.createdAt) return "";
    const elapsed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
    if (elapsed < 1) return "Just now";
    if (elapsed < 60) return `${elapsed}m`;
    return `${Math.floor(elapsed / 60)}h`;
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.qty || 0);
      return total + itemTotal;
    }, 0);
  };

  const totalPrice = calculateTotal();

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white">
              Table {order.tableNumber ?? "-"}
            </span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500 font-mono">
              #{order._id.slice(-6)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{getTimeElapsed()}</span>
          </div>
        </div>

        {/* Status Badge */}
        {isPending && (
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded border border-orange-500/20">
            New
          </span>
        )}
        {isAccepted && (
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded border border-blue-500/20">
            Progress
          </span>
        )}
        {isCompleted && (
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded border border-green-500/20">
            Done
          </span>
        )}
        {isRejected && (
          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded border border-red-500/20">
            Rejected
          </span>
        )}
      </div>

      {/* Customer Details */}
      {(order.customerName || order.phoneNumber) && (
        <div className="mb-3 pb-3 border-b border-gray-800">
          <div className="space-y-1.5">
            {order.customerName && (
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{order.customerName}</span>
              </div>
            )}
            {order.phoneNumber && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{order.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items with Prices */}
      <div className="mb-3 max-h-40 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2.5">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-sm bg-gray-900/50 rounded px-2.5 py-2 border border-gray-800/50"
            >
              <div className="flex-1 min-w-0">
                <span className="text-gray-300 block truncate">{item.name}</span>
                {item.price && (
                  <span className="text-xs text-gray-500">
                    ₹{item.price.toFixed(2)} each
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 ml-2">
                <span className="text-gray-400 text-xs">×{item.qty}</span>
                {item.price && (
                  <span className="text-white font-medium text-sm min-w-[3.5rem] text-right">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Price */}
      {totalPrice > 0 && (
        <div className="mb-3 pb-3 border-t border-gray-800 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <IndianRupee className="w-4 h-4 text-green-500" />
              <span>Total</span>
            </div>
            <span className="text-lg font-bold text-white">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isPending && (
          <>
            <button
              onClick={() => onUpdate(order._id, "accepted")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept
            </button>
            <button
              onClick={() => onUpdate(order._id, "rejected")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
          </>
        )}

        {isAccepted && (
          <button
            onClick={() => onUpdate(order._id, "completed")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Complete
          </button>
        )}

        {isCompleted && (
          <div className="flex-1 text-center text-sm font-medium text-green-400 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
            Completed
          </div>
        )}

        {isRejected && (
          <div className="flex-1 text-center text-sm font-medium text-red-400 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
            Rejected
          </div>
        )}
      </div>
    </div>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;