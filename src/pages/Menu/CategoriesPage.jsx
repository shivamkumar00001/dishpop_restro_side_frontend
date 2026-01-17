import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import menuApi from "../../api/menuApi";
import Sidebar from "../../components/Sidebar";
import ConfirmDialog from "../../components/orders/ConfirmDialog";
import Toast from "../../components/Billing/Toast";

export default function CategoriesPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [username]);

  const loadCategories = async () => {
    try {
      const response = await menuApi.getCategories(username);
      const list = response.data?.data || [];
      const safe = list.filter((c) => typeof c === "object" && c.name);
      setCategories(safe);
    } catch (error) {
      console.error("Failed to load categories:", error);
      showToast("Failed to load categories", "error");
    }
  };

  const create = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await menuApi.createCategory(username, {
        name: name.trim(),
        icon: icon || "🍽️",
      });

      setCategories((prev) => [...prev, response.data.data]);
      setName("");
      setIcon("🍽️");
      showToast("Category created successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = useCallback((category) => {
    setDeleteConfirm(category);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await menuApi.deleteCategory(username, deleteConfirm._id);
      setCategories((prev) => prev.filter((c) => c._id !== deleteConfirm._id));
      showToast("Category deleted successfully", "success");
      setDeleteConfirm(null);
    } catch (error) {
      showToast(error.response?.data?.message || "Cannot delete category", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
            <p className="text-sm text-gray-500 mt-1">
              Organize your menu with categories
            </p>
          </div>

          {/* Create Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Category
            </h2>
            <form onSubmit={create}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-20 text-center border border-gray-300 p-3 rounded-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🍔"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name (e.g., Starters, Main Course)"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              All Categories ({categories.length})
            </h2>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No categories created yet</p>
                <p className="text-sm text-gray-400">
                  Create your first category to start organizing your menu
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.icon || "🍽️"}</span>
                      <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                        {c.dishCount !== undefined && (
                          <div className="text-xs text-gray-500">
                            {c.dishCount} dish{c.dishCount !== 1 ? "es" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(c)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteConfirm.name}"? Dishes in this category will become uncategorized.`}
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