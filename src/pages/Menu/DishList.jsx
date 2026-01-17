import React, { useState, useMemo, useCallback } from "react";
import { Plus, Search, X, Filter, ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DishCard from "../../components/menu/DishCard";
import useMenu from "../../hooks/useMenu";
import Sidebar from "../../components/Sidebar";
import ConfirmDialog from "../../components/orders/ConfirmDialog";
import Toast from "../../components/Billing/Toast";

export default function DishList() {
  const navigate = useNavigate();
  const { username } = useParams();

  const {
    dishes,
    filteredDishes,
    categories,
    loading,
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

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Quick Stats
  const stats = useMemo(() => {
    return {
      total: dishes.length,
      available: dishes.filter((d) => d.isAvailable).length,
      unavailable: dishes.filter((d) => !d.isAvailable).length,
      categories: new Set(dishes.map((d) => d.categoryId?.name)).size,
    };
  }, [dishes]);

  // Handlers
  const handleAddDish = useCallback(() => {
    navigate(`/${username}/menu/add`);
  }, [navigate, username]);

  const handleEditDish = useCallback(
    (dish) => {
      navigate(`/${username}/dish/${dish._id}/edit`);
    },
    [navigate, username]
  );

  const handleDeleteClick = useCallback((dishId) => {
    const dish = dishes.find((d) => d._id === dishId);
    setDeleteConfirm({ dishId, dishName: dish?.name });
  }, [dishes]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;

    try {
      await deleteDish(deleteConfirm.dishId);
      showToast("Dish deleted successfully", "success");
      setDeleteConfirm(null);
    } catch (error) {
      showToast("Failed to delete dish", "error");
    }
  }, [deleteConfirm, deleteDish, showToast]);

  const handleToggleAvailability = useCallback(
    async (dishId) => {
      try {
        await toggleAvailability(dishId);
        showToast("Availability updated", "success");
      } catch (error) {
        showToast("Failed to update availability", "error");
      }
    },
    [toggleAvailability, showToast]
  );

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    sortBy !== "name-asc";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* Left: Title & Back */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Menu</h1>
                  <p className="text-xs text-gray-500">
                    {filteredDishes.length} of {dishes.length} dishes
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/${username}/categories`)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Categories
                </button>

                <button
                  onClick={() => navigate(`/${username}/addons`)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Add-ons
                </button>

                <button
                  onClick={handleAddDish}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Dish</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold text-gray-900">{stats.total}</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Available:</span>
                <span className="font-semibold text-green-600">
                  {stats.available}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Unavailable:</span>
                <span className="font-semibold text-orange-600">
                  {stats.unavailable}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Categories:</span>
                <span className="font-semibold text-gray-900">
                  {stats.categories}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="px-6 pb-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes by name, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low-High)</option>
                  <option value="price-desc">Price (High-Low)</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No dishes found
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                {dishes.length === 0
                  ? "Get started by adding your first dish to the menu"
                  : "Try adjusting your search or filters"}
              </p>
              {dishes.length === 0 ? (
                <button
                  onClick={handleAddDish}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Add Your First Dish
                </button>
              ) : (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onToggleAvailability={handleToggleAvailability}
                  onEdit={() => handleEditDish(dish)}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Dish"
          message={`Are you sure you want to delete "${deleteConfirm.dishName}"? This action cannot be undone.`}
          type="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}