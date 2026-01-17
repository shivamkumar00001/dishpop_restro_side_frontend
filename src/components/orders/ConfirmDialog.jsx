import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export default function ConfirmDialog({ title, message, type = "warning", onConfirm, onCancel }) {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <XCircle className="w-12 h-12 text-red-500" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "info":
        return <Info className="w-12 h-12 text-blue-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getButtonColors = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-yellow-600 hover:bg-yellow-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-slideIn">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            {getIcon()}
            <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 ${getButtonColors()} text-white text-sm font-semibold rounded-lg transition-colors`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}