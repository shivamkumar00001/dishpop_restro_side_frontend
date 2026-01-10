import React, { useState, useMemo } from "react";
import { Search, X, Plus, ChefHat, Flame, Tag } from "lucide-react";

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
};

export default function DishSearchModal({ dishes, onAddDish, onClose, loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFoodType, setSelectedFoodType] = useState("all");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    dishes.forEach(dish => {
      if (dish.categoryId?.name) {
        cats.add(dish.categoryId.name);
      }
    });
    return ["all", ...Array.from(cats)];
  }, [dishes]);

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      if (!dish.isAvailable) return false;

      const matchesSearch = 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === "all" || 
        dish.categoryId?.name === selectedCategory;

      const matchesFoodType = 
        selectedFoodType === "all" || 
        dish.foodType === selectedFoodType;

      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [dishes, searchQuery, selectedCategory, selectedFoodType]);

  const handleSelectDish = (dish, variant) => {
    onAddDish(dish, variant);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* HEADER */}
        <div className="bg-gray-900 border-b border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-cyan-400" />
              Search Dishes
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={selectedFoodType}
              onChange={(e) => setSelectedFoodType(e.target.value)}
              className="flex-1 px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="egg">Egg</option>
              <option value="vegan">Vegan</option>
            </select>

            {(searchQuery || selectedCategory !== "all" || selectedFoodType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedFoodType("all");
                }}
                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-3">
            {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''} available
          </p>
        </div>

        {/* DISHES GRID */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading dishes...</p>
              </div>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ChefHat className="w-20 h-20 text-gray-700 mb-4" />
              <p className="text-xl font-semibold mb-2">No dishes found</p>
              <p className="text-gray-400">
                {searchQuery || selectedCategory !== "all" || selectedFoodType !== "all"
                  ? "Try adjusting your filters"
                  : "No available dishes"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onSelect={handleSelectDish}
                />
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-900 border-t border-gray-800 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Dish Card Component
function DishCard({ dish, onSelect }) {
  const [selectedVariant, setSelectedVariant] = useState(
    dish.variants?.find(v => v.isDefault) || dish.variants?.[0]
  );

  const handleAdd = () => {
    if (selectedVariant) {
      onSelect(dish, selectedVariant);
    }
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4 hover:border-cyan-500/30 transition-all group">
      <div className="flex gap-4">
        {/* IMAGE */}
        <div className="relative w-24 h-24 rounded overflow-hidden border border-gray-700 flex-shrink-0">
          {dish.thumbnailUrl || dish.imageUrl ? (
            <img
              src={dish.thumbnailUrl || dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-gray-600" />
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
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-1 py-0.5 rounded">
              ⭐
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="font-semibold text-white truncate mb-1">{dish.name}</h3>
            
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{dish.categoryId?.name || "Uncategorized"}</span>
              {dish.spiceLevel && dish.spiceLevel !== "none" && (
                <span className="flex items-center gap-0.5">
                  {SPICE_ICONS[dish.spiceLevel]}
                </span>
              )}
              {dish.preparationTime && (
                <span>{dish.preparationTime}m</span>
              )}
            </div>

            {/* Description */}
            {dish.description && (
              <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                {dish.description}
              </p>
            )}

            {/* Tags */}
            {dish.tags && dish.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {dish.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] rounded border border-cyan-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* VARIANTS */}
          {dish.variants && dish.variants.length > 0 && (
            <div className="space-y-2">
              {dish.variants.length === 1 ? (
                // Single variant - just show price and add button
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-cyan-400">
                    ₹{dish.variants[0].price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => onSelect(dish, dish.variants[0])}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold rounded flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              ) : (
                // Multiple variants - show selector
                <>
                  <div className="flex gap-1 flex-wrap">
                    {dish.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedVariant === variant
                            ? "bg-cyan-500 text-black font-semibold"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-cyan-400">
                      ₹{selectedVariant?.price.toFixed(2)}
                    </div>
                    <button
                      onClick={handleAdd}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold rounded flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}