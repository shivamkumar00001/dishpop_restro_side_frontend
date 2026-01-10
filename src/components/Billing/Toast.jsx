import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const TOAST_STYLES = {
  success: {
    bg: "bg-green-500/10 border-green-500/30",
    text: "text-green-400",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-500/10 border-red-500/30",
    text: "text-red-400",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-cyan-500/10 border-cyan-500/30",
    text: "text-cyan-400",
    icon: Info,
  },
};

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const style = TOAST_STYLES[type] || TOAST_STYLES.success;
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slideInRight">
      <div
        className={`${style.bg} ${style.text} border rounded-lg px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-sm min-w-[300px] max-w-md`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-all hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}