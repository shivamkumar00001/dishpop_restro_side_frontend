import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function CancelBillModal({ bill, onConfirm, onClose }) {
  const [reason, setReason] = useState("Customer cancelled order");
  const [isProcessing, setIsProcessing] = useState(false);

  const commonReasons = [
    "Customer cancelled order",
    "Wrong items selected",
    "Duplicate bill",
    "Customer left",
    "Other",
  ];

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm(reason);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cancel Bill</h2>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Bill Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600 font-semibold mb-1">
              {bill.billNumber}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{bill.customerName}</p>
                <p className="text-sm text-gray-600">
                  Table {bill.tableNumber} • {bill.items.length} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  ₹{bill.grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Cancellation Reason
            </label>
            <div className="space-y-2">
              {commonReasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    reason === r
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span
                    className={`text-sm font-medium ${
                      reason === r ? "text-red-700" : "text-gray-700"
                    }`}
                  >
                    {r}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {reason === "Other" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specify Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500 resize-none"
                rows="3"
              />
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 text-sm mb-1">
                  Warning
                </p>
                <p className="text-xs text-yellow-700">
                  This bill will be marked as cancelled and removed from the draft
                  list. You can view cancelled bills in the reports section.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Bill
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !reason.trim()}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </div>
              ) : (
                "Cancel Bill"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}