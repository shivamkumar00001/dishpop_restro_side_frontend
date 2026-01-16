import React, { useState, useMemo } from "react";
import { Search, X, Plus, ChefHat, Check } from "lucide-react";

export default function DishSearchModal({
  dishes,
  onAddDish,
  onClose,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    dishes.forEach((dish) => {
      if (dish.categoryId?.name) {
        cats.add(dish.categoryId.name);
      }
    });
    return ["all", ...Array.from(cats)];
  }, [dishes]);

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (!dish.isAvailable) return false;

      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || dish.categoryId?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [dishes, searchQuery, selectedCategory]);

  const handleQuickAdd = (dish, variant) => {
    onAddDish(dish, variant);

    // Visual feedback
    const key = `${dish._id}-${variant.name}`;
    setRecentlyAdded((prev) => [...prev, key]);

    setTimeout(() => {
      setRecentlyAdded((prev) => prev.filter((k) => k !== key));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-blue-600" />
              Add Items
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {filteredDishes.length} dish{filteredDishes.length !== 1 ? "es" : ""}{" "}
            available
          </p>
        </div>

        {/* DISHES GRID */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dishes...</p>
              </div>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                No dishes found
              </p>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "No available dishes"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDishes.map((dish) => (
                <QuickDishCard
                  key={dish._id}
                  dish={dish}
                  onAdd={handleQuickAdd}
                  recentlyAdded={recentlyAdded}
                />
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// QUICK DISH CARD - Single click to add
function QuickDishCard({ dish, onAdd, recentlyAdded }) {
  const [selectedVariant, setSelectedVariant] = useState(
    dish.variants?.find((v) => v.isDefault) || dish.variants?.[0]
  );

  const isRecentlyAdded = recentlyAdded.includes(
    `${dish._id}-${selectedVariant?.name}`
  );

  const handleClick = () => {
    if (selectedVariant && !isRecentlyAdded) {
      onAdd(dish, selectedVariant);
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden transition-all ${
        isRecentlyAdded
          ? "border-green-500 shadow-lg shadow-green-500/20"
          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
      }`}
    >
      <div className="flex gap-3 p-3">
        {/* IMAGE */}
        <div className="relative w-20 h-20 rounded overflow-hidden border border-gray-200 flex-shrink-0">
          {dish.thumbnailUrl || dish.imageUrl ? (
            <img
              src={dish.thumbnailUrl || dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-gray-300" />
            </div>
          )}

          {/* Food Type Indicator */}
          <div
            className={`absolute top-1 left-1 w-3 h-3 rounded-full border-2 border-white ${
              dish.foodType === "veg"
                ? "bg-green-500"
                : dish.foodType === "non-veg"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          />

          {/* Recently Added Badge */}
          {isRecentlyAdded && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <div className="bg-green-500 text-white rounded-full p-1.5">
                <Check className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate mb-0.5">
            {dish.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {dish.categoryId?.name || "Uncategorized"}
          </p>

          {/* VARIANTS - Horizontal Pills */}
          {dish.variants && dish.variants.length > 1 ? (
            <div className="flex gap-1 mb-2 flex-wrap">
              {dish.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    selectedVariant === variant
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          ) : null}

          {/* PRICE & ADD BUTTON */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600">
              ₹{selectedVariant?.price || dish.variants?.[0]?.price}
            </span>
            <button
              onClick={handleClick}
              disabled={isRecentlyAdded}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 ${
                isRecentlyAdded
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isRecentlyAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}