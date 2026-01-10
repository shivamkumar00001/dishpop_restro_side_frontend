import React, { memo, useState } from "react";
import {
  Receipt,
  Eye,
  CheckCircle,
  Trash2,
  MapPin,
  User,
  Phone,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_STYLES = {
  DRAFT: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  FINALIZED: "bg-green-500/10 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
};

const PAYMENT_STYLES = {
  PAID: "text-green-400",
  PENDING: "text-yellow-400",
  PARTIAL: "text-orange-400",
  CANCELLED: "text-red-400",
};

function BillCard({ bill, onView, onFinalize, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-cyan-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5">
      {/* Compact Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">{bill.billNumber}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                  STATUS_STYLES[bill.status]
                }`}
              >
                {bill.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Table {bill.tableNumber}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {bill.customerName}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              ₹{bill.grandTotal.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-gray-500 text-xs">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          {/* Customer Info */}
          <div className="py-3 space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-400">{bill.phoneNumber}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1 pb-3 text-xs border-b border-gray-800">
            <div className="flex justify-between text-gray-400">
              <span>{bill.items.length} items</span>
              <span>₹{bill.subtotal.toFixed(0)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-yellow-400">
                <span>
                  Discount{" "}
                  {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}
                </span>
                <span>-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}

            {bill.serviceCharge?.enabled && (
              <div className="flex justify-between text-gray-400">
                <span>Service ({bill.serviceCharge.rate}%)</span>
                <span>+₹{bill.serviceCharge.amount.toFixed(0)}</span>
              </div>
            )}

            {bill.taxes?.map((tax, i) => (
              <div key={i} className="flex justify-between text-gray-400">
                <span>
                  {tax.name} ({tax.rate}%)
                </span>
                <span>+₹{tax.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>

          {/* Payment Info (Finalized) */}
          {bill.status === "FINALIZED" && (
            <div className="my-3 p-2 bg-green-500/5 rounded border border-green-500/20">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Payment</span>
                <span className={`font-semibold ${PAYMENT_STYLES[bill.paymentStatus]}`}>
                  {bill.paymentStatus}
                </span>
              </div>
              {bill.paymentMethod && (
                <div className="text-xs text-green-400 mt-1">{bill.paymentMethod}</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(bill._id);
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <Eye className="w-4 h-4" />
              View
            </button>

            {bill.status === "DRAFT" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFinalize(bill._id);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Pay
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bill._id);
                  }}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Notes */}
          {bill.notes && (
            <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded text-xs text-gray-400">
              {bill.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(BillCard);