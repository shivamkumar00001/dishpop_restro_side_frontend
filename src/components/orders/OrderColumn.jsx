import React from "react";
import { Package } from "lucide-react";
import OrderCard from "./OrderCard";

export default function OrderColumn({ title, count, orders, onUpdate, color, allOrders = [] }) {
  const colorClasses = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    green: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  const headerBorder = {
    cyan: "border-cyan-500/20",
    green: "border-green-500/20",
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
      <div
        className={`px-4 py-4 border-b ${headerBorder[color]}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${colorClasses[color]}`}
          >
            {count}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-sm text-gray-400">No orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onUpdate={onUpdate}
                allOrders={allOrders} // 🔥 Pass all orders for session grouping
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}