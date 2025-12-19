import React, { useState, useRef } from "react";
import { Edit2, Trash2, Loader2, ChefHat, Clock, Flame } from "lucide-react";

const FOOD_TYPE_COLORS = {
  veg: "bg-green-500",
  "non-veg": "bg-red-500",
  egg: "bg-yellow-500",
  vegan: "bg-green-600",
};

const SPICE_LEVEL_ICONS = {
  none: null,
  mild: <Flame className="w-3 h-3 text-orange-400" />,
  medium: (
    <>
      <Flame className="w-3 h-3 text-orange-500" />
      <Flame className="w-3 h-3 text-orange-500" />
    </>
  ),
  hot: (
    <>
      <Flame className="w-3 h-3 text-red-500" />
      <Flame className="w-3 h-3 text-red-500" />
      <Flame className="w-3 h-3 text-red-500" />
    </>
  ),
  "extra-hot": (
    <>
      <Flame className="w-3 h-3 text-red-600" />
      <Flame className="w-3 h-3 text-red-600" />
      <Flame className="w-3 h-3 text-red-600" />
      <Flame className="w-3 h-3 text-red-600" />
    </>
  ),
};

export default function DishCard({
  dish,
  onToggleAvailability,
  onEdit,
  onDelete,
}) {
  const [toggling, setToggling] = useState(false);
  const debounceRef = useRef(null);

  const defaultVariant =
    dish.variants?.find((v) => v.isDefault) || dish.variants?.[0];
  const price = defaultVariant?.price || 0;

  const handleToggle = () => {
    if (toggling) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setToggling(true);
      try {
        await onToggleAvailability(dish._id);
      } finally {
        setTimeout(() => setToggling(false), 300);
      }
    }, 120);
  };

  return (
    <div
      className={`relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6
      transition-all hover:border-indigo-600/60 hover:shadow-xl
      ${!dish.isAvailable ? "opacity-60" : ""}`}
    >
      <div className="flex gap-6">
        {/* IMAGE */}
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-[#232A37] flex-shrink-0">
          {dish.imageUrl || dish.thumbnailUrl ? (
            <img
              src={dish.thumbnailUrl || dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#12151D] flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Food Type Badge */}
          <div
            className={`absolute top-2 left-2 w-6 h-6 rounded-md ${
              FOOD_TYPE_COLORS[dish.foodType]
            } border-2 border-white`}
          />

          {/* Featured Badge */}
          {dish.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-semibold text-gray-200 truncate">
                  {dish.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    {dish.categoryId?.name || "Uncategorized"}
                  </div>

                  {dish.preparationTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {dish.preparationTime} min
                    </div>
                  )}

                  {dish.spiceLevel && dish.spiceLevel !== "none" && (
                    <div className="flex items-center gap-1">
                      {SPICE_LEVEL_ICONS[dish.spiceLevel]}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {dish.tags && dish.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-2">
                  {dish.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag._id}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
              {dish.description || "No description available"}
            </p>

            {/* Variants Preview */}
            {dish.variants && dish.variants.length > 1 && (
              <div className="text-xs text-gray-500">
                {dish.variants.length} variants available
              </div>
            )}

            {/* Add-ons Preview */}
            {dish.addOnGroups && dish.addOnGroups.length > 0 && (
              <div className="text-xs text-indigo-400">
                {dish.addOnGroups.length} add-on group(s)
              </div>
            )}
          </div>

          {/* ACTION BAR */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1F2532]">
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-lg bg-[#12151D]
                border border-[#232A37] text-gray-300
                hover:border-indigo-600 hover:text-indigo-400
                transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(dish._id)}
                className="px-4 py-2 rounded-lg bg-[#12151D]
                border border-[#232A37] text-gray-300
                hover:border-red-500 hover:text-red-400
                transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* PRICE */}
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {defaultVariant?.label || "Price"}
              </div>
              <div className="text-2xl font-semibold text-indigo-500">
                ₹{price.toFixed(2)}
              </div>
            </div>

            {/* AVAILABILITY TOGGLE */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-300">Availability</div>
                <div
                  className={`text-xs font-medium ${
                    dish.isAvailable ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {dish.isAvailable ? "Available" : "Unavailable"}
                </div>
              </div>

              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-16 h-8 rounded-full transition-all ${
                  dish.isAvailable
                    ? "bg-indigo-600 shadow-indigo-600/30"
                    : "bg-[#232A37] border border-[#3A4255] shadow-inner"
                } ${toggling ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center ${
                    dish.isAvailable ? "translate-x-8" : ""
                  }`}
                >
                  {toggling && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}