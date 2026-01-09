import React, { useState, useRef } from "react";
import { Edit2, Trash2, Loader2, ChefHat, Clock, Flame, Box } from "lucide-react";

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
  onARModel,
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

  const hasARModel = dish.arModel?.isAvailable && (dish.arModel?.glb || dish.arModel?.usdz);

  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg p-4 ${
        !dish.isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="relative w-32 h-32 rounded overflow-hidden border border-gray-700 flex-shrink-0">
          {dish.imageUrl || dish.thumbnailUrl ? (
            <img
              src={dish.thumbnailUrl || dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <ChefHat className="w-10 h-10 text-gray-600" />
            </div>
          )}

          {/* Food Type Badge */}
          <div
            className={`absolute top-2 left-2 w-5 h-5 rounded ${
              FOOD_TYPE_COLORS[dish.foodType]
            } border-2 border-white`}
          />

          {/* Featured Badge */}
          {dish.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
              ⭐
            </div>
          )}

          {/* AR Model Badge */}
          {hasARModel && (
            <div className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
              <Box className="w-3 h-3" />
              AR
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {dish.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
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
                    {SPICE_LEVEL_ICONS[dish.spiceLevel]}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-semibold text-cyan-400">
                ₹{price.toFixed(2)}
              </div>
              {defaultVariant?.label && (
                <div className="text-xs text-gray-400">{defaultVariant.label}</div>
              )}
            </div>
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-gray-400 text-sm line-clamp-1 mb-2">
              {dish.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            {dish.variants && dish.variants.length > 1 && (
              <span>{dish.variants.length} variants</span>
            )}
            {dish.addOnGroups && dish.addOnGroups.length > 0 && (
              <span className="text-cyan-400">
                {dish.addOnGroups.length} add-on group(s)
              </span>
            )}
            {dish.tags && dish.tags.length > 0 && (
              <span>{dish.tags.length} tag(s)</span>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 rounded bg-black border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => onARModel(dish)}
                className={`px-3 py-1.5 rounded bg-black border text-sm flex items-center gap-1 ${
                  hasARModel
                    ? "border-purple-600 text-purple-400 hover:border-purple-500"
                    : "border-gray-700 text-gray-300 hover:border-purple-600 hover:text-purple-400"
                }`}
                title={hasARModel ? "Update AR Model" : "Add AR Model"}
              >
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AR</span>
              </button>

              <button
                onClick={() => onDelete(dish._id)}
                className="px-3 py-1.5 rounded bg-black border border-gray-700 text-gray-300 hover:border-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>

            {/* Right: Availability Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  dish.isAvailable ? "text-green-400" : "text-gray-500"
                }`}
              >
                {dish.isAvailable ? "Available" : "Unavailable"}
              </span>
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`relative w-12 h-6 rounded-full flex-shrink-0 ${
                  dish.isAvailable
                    ? "bg-cyan-500"
                    : "bg-gray-700 border border-gray-600"
                } ${toggling ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all flex items-center justify-center ${
                    dish.isAvailable ? "translate-x-6" : ""
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