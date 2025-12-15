import React from "react";
import OrderCard from "./OrderCard";

const OrderColumn = ({ title, orders, onUpdate }) => {
  return (
    <div className="flex-1 bg-[#11151C] p-4 rounded-xl min-w-[300px]">
      <h2 className="text-[#E6E9EF] font-semibold mb-3">
        {title} ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <p className="text-xs text-[#9AA0A6]">No orders</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} onUpdate={onUpdate} />
        ))
      )}
    </div>
  );
};

export default OrderColumn;
