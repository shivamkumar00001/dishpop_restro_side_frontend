import React, { useState, useRef, useCallback } from "react";
import { Edit2, Trash2, Loader2, ChefHat, Clock, Flame } from "lucide-react";

const FOOD_TYPE_COLORS = {
  veg: "bg-green-500",
  "non-veg": "bg-red-500",
  egg: "bg-yellow-500",
  vegan: "bg-green-600",
};

const SPICE_ICONS = {
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

export default function DishCard({ dish, onToggleAvailability, onEdit, onDelete }) {
  const [toggling, setToggling] = useState(false);
  const debounceRef = useRef(null);

  const defaultVariant = dish.variants?.find((v) => v.isDefault) || dish.variants?.[0];
  const price = defaultVariant?.price || 0;

  const handleToggle = useCallback(() => {
    if (toggling) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setToggling(true);
      try {
        await onToggleAvailability(dish._id);
      } finally {
        setTimeout(() => setToggling(false), 300);
      }
    }, 150);
  }, [toggling, onToggleAvailability, dish._id]);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all ${
        !dish.isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="p-4 flex gap-4">
        {/* IMAGE */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          {dish.imageUrl || dish.thumbnailUrl ? (
            <img
              src={dish.thumbnailUrl || dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* Food Type Badge */}
          <div
            className={`absolute top-2 left-2 w-4 h-4 rounded ${
              FOOD_TYPE_COLORS[dish.foodType]
            } border-2 border-white`}
          />

          {/* Featured Badge */}
          {dish.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              ⭐
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {dish.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  {dish.categoryId?.name || "Uncategorized"}
                </span>
                {dish.preparationTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dish.preparationTime}m
                  </span>
                )}
                {dish.spiceLevel && dish.spiceLevel !== "none" && (
                  <span className="flex items-center gap-0.5">
                    {SPICE_ICONS[dish.spiceLevel]}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-gray-900">
                ₹{price.toFixed(0)}
              </div>
              {defaultVariant?.label && (
                <div className="text-xs text-gray-500">{defaultVariant.label}</div>
              )}
            </div>
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-gray-600 text-sm line-clamp-1 mb-2">
              {dish.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            {dish.variants && dish.variants.length > 1 && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                {dish.variants.length} variants
              </span>
            )}
            {dish.addOnGroups && dish.addOnGroups.length > 0 && (
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                {dish.addOnGroups.length} add-ons
              </span>
            )}
            {dish.tags && dish.tags.length > 0 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                {dish.tags.length} tags
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>

              <button
                onClick={() => onDelete(dish._id)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>

            {/* Right: Availability Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  dish.isAvailable ? "text-green-600" : "text-gray-500"
                }`}
              >
                {dish.isAvailable ? "Available" : "Unavailable"}
              </span>
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  dish.isAvailable ? "bg-green-500" : "bg-gray-300"
                } ${toggling ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all flex items-center justify-center ${
                    dish.isAvailable ? "translate-x-5" : ""
                  }`}
                >
                  {toggling && (
                    <Loader2 className="w-3 h-3 animate-spin text-gray-600" />
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