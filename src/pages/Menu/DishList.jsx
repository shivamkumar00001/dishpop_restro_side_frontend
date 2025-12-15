import React, { useState } from "react";
import { Plus, Menu, Utensils, X, Sparkles, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DishCard from "../../components/menu/DishCard.jsx";
import DishFilterBar from "../../components/menu/DishFilterBar.jsx";
import useMenu from "../../hooks/useMenu.js";
import Sidebar from "../../components/Sidebar.jsx";

const DishList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();

  const {
    dishes,
    filteredDishes,
    categories,
    statuses,
    statistics,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  } = useMenu();

  const handleAddNewDish = () => {
    navigate(`/${username}/menu/add`);
  };

  const handleEdit = (dish) => {
    navigate(`/${username}/dish/${dish._id}/edit`);
  };

  const handleRefresh = () => {
    alert("Refresh feature coming soon");
  };

  return (
    <div className="min-h-screen bg-[#080B10]">
      {/* HEADER */}
      <header className="backdrop-blur-xl bg-[#0D1017]/80 border-b border-[#1F2532] sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-3">
          {/* Left Section - Mobile Menu + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 lg:hidden active:scale-95 border border-[#1F2532]"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Dishpop
                </h1>
                <p className="text-[10px] text-gray-500 font-medium leading-none">
                  Menu Manager
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#12151D] border border-[#232A37] rounded-xl text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Section - Dish Count + Add Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center px-3 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/30">
              <span className="text-sm font-semibold text-gray-300">
                {filteredDishes.length} {filteredDishes.length === 1 ? 'Dish' : 'Dishes'}
              </span>
            </div>

            <button
              onClick={handleAddNewDish}
              className="group relative px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Dish</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#12151D] border border-[#232A37] rounded-xl text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 transform
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-200 hover:bg-[#12151D] rounded-lg transition-all duration-200 lg:hidden z-10 border border-[#1F2532]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 relative">
          {/* Statistics Bar + Filters */}
          <div className="px-4 md:px-8 lg:px-10 pt-6">
            {/* Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-4 shadow-lg hover:border-blue-500/30 transition-all duration-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Total Dishes
                </p>
                <p className="text-2xl font-bold text-gray-200">
                  {dishes.length}
                </p>
              </div>
              
              <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-4 shadow-lg hover:border-green-500/30 transition-all duration-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Available
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {dishes.filter(d => d.available).length}
                </p>
              </div>
              
              <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-4 shadow-lg hover:border-blue-500/30 transition-all duration-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Categories
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {categories.length}
                </p>
              </div>
              
              <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-4 shadow-lg hover:border-indigo-500/30 transition-all duration-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Filtered
                </p>
                <p className="text-2xl font-bold text-indigo-400">
                  {filteredDishes.length}
                </p>
              </div>
            </div>

            {/* Compact Filter Bar (without search) */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 bg-[#12151D] border border-[#232A37] rounded-xl text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2.5 bg-[#12151D] border border-[#232A37] rounded-xl text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-[#12151D] border border-[#232A37] rounded-xl text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="name">Sort: Name</option>
                  <option value="price">Sort: Price</option>
                  <option value="category">Sort: Category</option>
                </select>

                {/* Clear Filters Button */}
                {(selectedCategory || selectedStatus || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 bg-[#12151D] hover:bg-red-500/10 border border-[#232A37] hover:border-red-500/50 rounded-xl text-gray-400 hover:text-red-400 text-sm font-medium transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Dish List */}
          <div className="px-4 md:px-8 lg:px-10 pb-10">
            <div className="space-y-4">
              {filteredDishes.length === 0 ? (
                <div className="text-center py-20 bg-[#0D1017] border-2 border-dashed border-[#1F2532] rounded-2xl shadow-lg">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#12151D] to-[#1A1F2B] rounded-full flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">
                    No dishes found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or add a new dish to get started
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[#12151D] hover:bg-[#1A1F2B] text-gray-200 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-[#232A37]"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredDishes.map((dish, index) => (
                  <div
                    key={dish._id}
                    className="animate-[fadeInUp_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                  >
                    <DishCard
                      dish={dish}
                      onToggleAvailability={toggleAvailability}
                      onEdit={() => handleEdit(dish)}
                      onDelete={deleteDish}
                      onRefresh={() => handleRefresh(dish._id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DishList;