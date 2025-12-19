import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import menuApi from "../../api/menuApi";

export default function CategoriesPage() {
  const { username } = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [username]);

  const loadCategories = async () => {
    try {
      const response = await menuApi.getCategories(username);
      const list = response.data?.data || [];

      // Safety filter
      const safe = list.filter((c) => typeof c === "object" && c.name);
      setCategories(safe);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const create = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await menuApi.createCategory(username, {
        name,
        icon: icon || "🍽️",
      });

      setCategories((prev) => [...prev, response.data.data]);
      setName("");
      setIcon("🍽️");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await menuApi.deleteCategory(username, id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Cannot delete category");
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Manage Categories
          </h2>

          {/* CREATE FORM */}
          <form onSubmit={create} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-20 text-center bg-[#12151D] border border-[#232A37] p-3 rounded-lg text-white focus:border-indigo-600 focus:outline-none"
                placeholder="🍔"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-[#12151D] border border-[#232A37] p-3 rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
                placeholder="Category name"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>

          {/* LIST */}
          <div className="space-y-2">
            {categories.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No categories created yet
              </p>
            )}

            {categories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between p-4 bg-[#12151D] border border-[#232A37] rounded-lg hover:border-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon || "🍽️"}</span>
                  <div>
                    <div className="text-white font-medium">{c.name}</div>
                    {c.dishCount !== undefined && (
                      <div className="text-xs text-gray-400">
                        {c.dishCount} dish(es)
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => remove(c._id)}
                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}