import React, { useState } from "react";
import { CreditCard, Banknote, Smartphone, X, Check } from "lucide-react";

export default function PaymentModal({ bill, onConfirm, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paidAmount, setPaidAmount] = useState(bill.grandTotal.toString());
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: "CASH", label: "Cash", icon: Banknote, color: "green" },
    { id: "CARD", label: "Card", icon: CreditCard, color: "blue" },
    { id: "UPI", label: "UPI", icon: Smartphone, color: "purple" },
  ];

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm({
      paymentMethod,
      paidAmount: parseFloat(paidAmount),
    });
    setIsProcessing(false);
  };

  const change = parseFloat(paidAmount) - bill.grandTotal;
  const isValidAmount = parseFloat(paidAmount) >= bill.grandTotal;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            {bill.billNumber} • Table {bill.tableNumber}
          </p>
        </div>

        <div className="p-6">
          {/* Bill Total */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 font-semibold mb-1">
              Total Amount
            </p>
            <p className="text-4xl font-bold text-blue-900">
              ₹{bill.grandTotal.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {bill.items.length} items • {bill.customerName}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${method.color}-500 bg-${method.color}-50`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 ${
                        isSelected
                          ? `text-${method.color}-600`
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-semibold ${
                        isSelected
                          ? `text-${method.color}-700`
                          : "text-gray-600"
                      }`}
                    >
                      {method.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Paid Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Received
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                ₹
              </span>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                  isValidAmount
                    ? "border-gray-300 focus:border-blue-500"
                    : "border-red-300 focus:border-red-500 bg-red-50"
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {!isValidAmount && (
              <p className="text-red-500 text-sm mt-2 font-semibold">
                Amount must be at least ₹{bill.grandTotal.toFixed(2)}
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setPaidAmount(bill.grandTotal.toString())}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Exact
              </button>
              <button
                onClick={() =>
                  setPaidAmount(
                    (Math.ceil(bill.grandTotal / 100) * 100).toString()
                  )
                }
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Round ₹100
              </button>
              <button
                onClick={() =>
                  setPaidAmount(
                    (Math.ceil(bill.grandTotal / 500) * 500).toString()
                  )
                }
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Round ₹500
              </button>
            </div>
          </div>

          {/* Change Display */}
          {isValidAmount && change > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700">
                  Change to Return
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{change.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount || isProcessing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}