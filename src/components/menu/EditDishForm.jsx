import React, { useEffect, useRef, useState } from "react";
import useAutosave from "../../hooks/useAutoSave";
import { compressImage } from "../../utils/CompressImage";
import menuApi from "../../api/menuApi";

export default function DishForm({
  mode = "add",
  initial = {},
  restaurantId,
  dishId,
  autosaveKey = null,
  onSuccess = null,
}) {
  const fileRef = useRef(null);

  /* ===================== STATE ===================== */
  const [form, setForm] = useState({
    name: initial.name || "",
    slug: initial.slug || "",
    description: initial.description || "",
    price: initial.price != null ? String(initial.price) : "",
    category: initial.category || "",
    available: initial.available ?? true,
    isVeg: initial.isVeg ?? false,
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [existingImage, setExistingImage] = useState(
    initial.thumbnailUrl || initial.imageUrl || null
  );

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* ===================== AUTOSAVE ===================== */
  useAutosave(autosaveKey, form, { debounceMs: 800 });

  /* ===================== SLUG ===================== */
  useEffect(() => {
    const t = setTimeout(() => {
      setForm((s) => ({ ...s, slug: makeSlug(s.name) }));
    }, 200);
    return () => clearTimeout(t);
  }, [form.name]);

  /* ===================== LOAD CATEGORIES ===================== */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await menuApi.getMenu(restaurantId);
        const dishes = res.data?.data?.dishes ?? [];
        const unique = [
          ...new Set(dishes.map((d) => d.category || "Uncategorized")),
        ];
        if (!cancelled) setCategories(unique);
      } catch {}
    })();

    return () => (cancelled = true);
  }, [restaurantId]);

  /* ===================== CLEANUP PREVIEW ===================== */
  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  /* ===================== TOAST TIMEOUT ===================== */
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* ===================== HANDLERS ===================== */
  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate() {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Dish name must be at least 2 characters";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Please enter a valid price";
    if (!form.category) e.category = "Please select or enter a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFileSelect(files) {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) {
      setToast({ type: "error", message: "Please select a valid image file" });
      return;
    }

    try {
      const compressed = await compressImage(f, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.78,
      });
      setImageFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  }

  function removeImage() {
    previewUrl && URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    setExistingImage(null);
  }

  function triggerFileInput() {
    fileRef.current?.click();
  }

  /* ===================== SUBMIT ===================== */
  async function submit(e) {
    e?.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setProgress(0);
    setToast({
      type: "info",
      message: mode === "add" ? "Creating dish..." : "Updating dish...",
    });

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("description", form.description || "");
      fd.append("price", form.price);
      fd.append("available", form.available ? "true" : "false");
      fd.append("isVeg", form.isVeg ? "true" : "false");
      if (form.category) fd.append("category", form.category);
      if (imageFile) fd.append("image", imageFile);

      let res;
      if (mode === "add") {
        res = await menuApi.createDish(restaurantId, fd);
      } else {
        res = await menuApi.updateDish(restaurantId, dishId, fd);
      }

      autosaveKey && localStorage.removeItem(autosaveKey);
      setToast({
        type: "success",
        message:
          mode === "add"
            ? "Dish created successfully"
            : "Dish updated successfully",
      });
      onSuccess?.(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save dish";
      setToast({ type: "error", message: msg });
      setErrors((p) => ({ ...p, submit: msg }));
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  }

  /* ===================== UI ===================== */
  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : toast.type === "error"
              ? "bg-red-900/30 text-red-400 border border-red-800"
              : "bg-blue-900/30 text-blue-400 border border-blue-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toast.type === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toast.type === "info" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-xl">
        <form onSubmit={submit}>
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">
              {mode === "add" ? "Add New Dish" : "Edit Dish"}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {mode === "add"
                ? "Create a new dish for your menu"
                : "Update dish information"}
            </p>
          </div>

          {/* Basic Information Section */}
          <div className="p-6 space-y-5 border-b border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Dish Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dish Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="e.g., Margherita Pizza"
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.name ? "border-red-500" : "border-zinc-800"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    ₹
                  </span>
                  <input
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2.5 bg-black border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                      errors.price ? "border-red-500" : "border-zinc-800"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.price}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category === "new" || !categories.includes(form.category) ? "new" : form.category}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setForm((s) => ({ ...s, category: "" }));
                    } else {
                      onChange(e);
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500" : "border-zinc-800"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                
                {(form.category === "" || !categories.includes(form.category)) && (
                  <input
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    placeholder="Enter new category name"
                    className={`w-full px-4 py-2.5 bg-black border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all mt-2 ${
                      errors.category ? "border-red-500" : "border-zinc-800"
                    }`}
                  />
                )}
                
                {errors.category && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Add a detailed description of the dish..."
                  rows="4"
                  className="w-full px-4 py-2.5 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  Include ingredients, allergens, or special preparation methods
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="p-6 border-b border-zinc-800">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Dish Image
            </label>

            {!previewUrl && !existingImage ? (
              <div
                onClick={triggerFileInput}
                className="relative border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-800/50 transition-all"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-12 h-12 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-zinc-300 font-medium">
                      Click to upload image
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-zinc-800">
                <img
                  src={previewUrl || existingImage}
                  alt="Dish preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Options Section */}
          <div className="p-6 border-b border-zinc-800">
            <label className="block text-sm font-medium text-zinc-300 mb-4">
              Options
            </label>
            <div className="flex flex-wrap gap-6">
              {/* Available Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={onChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    Available
                  </span>
                  <p className="text-xs text-zinc-500">
                    Show on the menu
                  </p>
                </div>
              </label>

              {/* Vegetarian Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={onChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-green-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <div>
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    Vegetarian
                  </span>
                  <p className="text-xs text-zinc-500">
                    Mark as veg
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Section */}
          <div className="p-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {mode === "add" ? "Saving..." : "Updating..."}
                </span>
              ) : (
                mode === "add" ? "Create Dish" : "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== UTIL ===================== */
function makeSlug(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}