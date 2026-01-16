import React from "react";
import { Check, Cloud, Wifi, WifiOff } from "lucide-react";

export default function SaveIndicator({ status }) {
  if (!status) return null;

  const indicators = {
    saving: {
      icon: Cloud,
      text: "Saving...",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    saved: {
      icon: Check,
      text: "Saved",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    offline: {
      icon: WifiOff,
      text: "Offline - Will sync",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    syncing: {
      icon: Wifi,
      text: "Syncing...",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  const config = indicators[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`fixed top-20 right-6 ${config.bgColor} ${config.borderColor} border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 animate-slideDown z-40`}
    >
      <Icon
        className={`w-4 h-4 ${config.color} ${
          status === "saving" || status === "syncing" ? "animate-pulse" : ""
        }`}
      />
      <span className={`text-sm font-semibold ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
}