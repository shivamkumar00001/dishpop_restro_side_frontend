import React, { useState, memo, useRef } from "react";
import { Edit2, Trash2, Loader2, ChefHat } from "lucide-react";
import { STATUS_COLORS } from "../../utils/constants";

const DishCard = ({ dish, onToggleAvailability, onEdit, onDelete }) => {
  if (!dish) return null;

  const {
    _id,
    name,
    description,
    imageUrl,
    category,
    price,
    available,
    status,
  } = dish;

  const safeCategory = category || "Uncategorized";
  const safePrice = typeof price === "number" ? price : 0;
  const statusColor = status ? STATUS_COLORS[status] : null;

  /* ================= TOGGLE STATE ================= */
  const [toggling, setToggling] = useState(false);
  const debounceRef = useRef(null);

  const handleToggle = () => {
    if (toggling) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setToggling(true);
      try {
        await onToggleAvailability(_id);
      } finally {
        setTimeout(() => setToggling(false), 300);
      }
    }, 120);
  };

  return (
    <div
      className={`relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6
      transition-all hover:border-indigo-600/60 hover:shadow-xl
      ${!available ? "opacity-80" : ""}`}
    >
      <div className="flex gap-6">
        {/* IMAGE */}
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-[#232A37]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Status Badge */}
          {status && statusColor && (
            <span
              className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
              ${statusColor.bg} ${statusColor.text}`}
            >
              {status}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-200 mb-1">
              {name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <ChefHat className="w-4 h-4" />
              {safeCategory}
            </div>

            <p className="text-gray-400 text-sm line-clamp-2">
              {description || "No description available"}
            </p>
          </div>

          {/* ACTION BAR */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1F2532]">
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-lg bg-[#12151D]
                border border-[#232A37] text-gray-300
                hover:border-indigo-600 hover:text-indigo-400"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(_id)}
                className="px-4 py-2 rounded-lg bg-[#12151D]
                border border-[#232A37] text-gray-300
                hover:border-red-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* PRICE */}
            <div className="text-right">
              <div className="text-sm text-gray-400">Price</div>
              <div className="text-2xl font-semibold text-indigo-500">
                ₹{safePrice.toFixed(2)}
              </div>
            </div>

            {/* AVAILABILITY TOGGLE */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-300">Availability</div>
                <div
                  className={`text-xs font-medium
                  ${available ? "text-green-400" : "text-gray-500"}`}
                >
                  {available ? "Available" : "Unavailable"}
                </div>
              </div>

              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-16 h-8 rounded-full transition-all
                ${available
                  ? "bg-indigo-600 shadow-indigo-600/30"
                  : "bg-[#232A37] border border-[#3A4255] shadow-inner"
                }
                ${toggling ? "opacity-70" : ""}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all
                  ${available ? "translate-x-8" : ""}`}
                >
                  {toggling && (
                    <Loader2 className="w-4 h-4 m-auto animate-spin text-gray-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DishCard);