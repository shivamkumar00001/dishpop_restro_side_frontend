import React from "react";
import { Search, X } from "lucide-react";

const DishFilterBar = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  statuses,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  clearFilters,
  dishCount,
  totalCount,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        
        {/* Search */}
        <div className="flex-1 min-w-full md:min-w-64 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-gray-800 border border-gray-700 
                       rounded-lg text-white placeholder-gray-500 
                       focus:outline-none focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:border-cyan-500 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white focus:border-cyan-500 cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg
                     text-white focus:border-cyan-500 cursor-pointer"
        >
          <option value="name-asc">Name ↑</option>
          <option value="name-desc">Name ↓</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      {/* Filter summary + clear button */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white">{dishCount}</span> of{" "}
          <span className="text-white">{totalCount}</span> dishes
        </p>

        {(searchQuery ||
          selectedCategory !== "All Categories" ||
          selectedStatus !== "All Statuses" ||
          sortBy !== "name-asc") && (
          <button
            onClick={clearFilters}
            className="text-cyan-500 hover:text-cyan-400 text-sm flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default DishFilterBar;
