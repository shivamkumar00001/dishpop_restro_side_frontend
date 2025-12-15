import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/AxiosClient";

function makeSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddDishPage() {
  const { username } = useParams();   // IMPORTANT
  const navigate = useNavigate();

  const RESTAURANT_ID = username;     // MUST MATCH BACKEND

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    available: true,
    isVeg: false,
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Auto slug generator
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForm((prev) => ({ ...prev, slug: makeSlug(prev.name) }));
    }, 200);
    return () => clearTimeout(timeout);
  }, [form.name]);

  // Fetch categories
  useEffect(() => {
    if (!RESTAURANT_ID) return;

    (async () => {
      try {
        // FIXED — remove "/api/v1"
        const res = await axiosClient.get(`/restaurants/${RESTAURANT_ID}/menu`);

        const dishes = res.data?.data?.dishes ?? [];
        const unique = [...new Set(dishes.map((d) => d.category || "Uncategorized"))];

        setCategories(unique);
      } catch (err) {
        console.log("Category fetch failed:", err);
      }
    })();
  }, [RESTAURANT_ID]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  function validate() {
    const e = {};

    if (!form.name || form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }

    if (!form.price || Number(form.price) <= 0) {
      e.price = "Enter valid price.";
    }

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) e.image = "Only images allowed.";
      if (imageFile.size > 5 * 1024 * 1024)
        e.image = "Max file size is 5MB.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSelectFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErrors({ image: "Only images allowed" });
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image must be < 5MB" });
      return;
    }

    setErrors({});
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const finalCategory =
      newCategory.trim() !== "" ? newCategory : form.category;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", finalCategory);
    fd.append("available", form.available);
    fd.append("isVeg", form.isVeg);
    if (imageFile) fd.append("image", imageFile);

    try {
      setSubmitting(true);
      setToast({ type: "info", message: "Uploading..." });

      // FIXED — remove /api/v1 (axiosClient adds it automatically)
      await axiosClient.post(
        `/restaurants/${RESTAURANT_ID}/menu`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (p) => {
            const percent = Math.round((p.loaded * 100) / (p.total || 1));
            setProgress(percent);
          },
        }
      );

      setToast({ type: "success", message: "Dish added successfully!" });
      setTimeout(() => navigate(-1), 700);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Upload failed",
      });
    }

    setSubmitting(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setErrors({});
  };

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click();
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Add New Dish</h1>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              toast.type === "error"
                ? "bg-red-900/30 text-red-300 border border-red-800/50"
                : toast.type === "success"
                ? "bg-green-900/30 text-green-300 border border-green-800/50"
                : "bg-blue-900/30 text-blue-300 border border-blue-800/50"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <form onSubmit={handleSubmit}>
            
            {/* BASIC DETAILS */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Dish Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white"
                    value={form.name}
                    onChange={onChange}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white"
                    value={form.price}
                    onChange={onChange}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-400 mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white"
                    value={form.category}
                    onChange={onChange}
                  >
                    <option value="">Choose category</option>
                    {categories.map((c, index) => (
                      <option key={index} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* New Category */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Or Create New Category
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white"
                  value={form.description}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-4">
                Dish Image
              </h2>

              {!previewUrl ? (
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center cursor-pointer"
                >
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                  />
                  <p className="text-white">Click to upload image</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    className="w-full max-w-sm h-48 object-cover rounded"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded"
                  >
                    X
                  </button>

                  {submitting && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {errors.image && (
                <p className="text-xs text-red-400 mt-2">{errors.image}</p>
              )}
            </div>

            {/* TOGGLES */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-8">
                {/* Available */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-11 h-6 rounded-full ${
                      form.available ? "bg-blue-600" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full ${
                        form.available ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm text-zinc-300">Available</span>
                </label>

                {/* Veg */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div
                    className={`relative w-11 h-6 rounded-full ${
                      form.isVeg ? "bg-green-600" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full ${
                        form.isVeg ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm text-zinc-300">Vegetarian</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white"
              >
                {submitting ? "Saving..." : "Save Dish"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
