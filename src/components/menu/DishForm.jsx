import { useEffect, useState, useCallback } from "react";
import { X, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import menuApi from "../../api/menuApi";

const FOOD_TYPES = [
  { value: "veg", label: "Vegetarian", color: "green" },
  { value: "non-veg", label: "Non-Vegetarian", color: "red" },
  { value: "egg", label: "Egg", color: "yellow" },
  { value: "vegan", label: "Vegan", color: "green" },
];

const SPICE_LEVELS = [
  { value: "none", label: "No Spice" },
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "hot", label: "Hot" },
  { value: "extra-hot", label: "Extra Hot" },
];

const UNITS = ["plate", "bowl", "cup", "piece", "g", "kg", "ml", "l"];

const TAG_COLORS = {
  red: "bg-red-50 text-red-700 border-red-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  green: "bg-green-50 text-green-700 border-green-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
};

export default function DishForm({ mode = "add", initial = {}, username, dishId, onSuccess }) {
  // Basic info
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [foodType, setFoodType] = useState(initial.foodType || "veg");
  const [categoryId, setCategoryId] = useState(initial.categoryId?._id || initial.categoryId || "");
  const [preparationTime, setPreparationTime] = useState(initial.preparationTime || 15);
  const [spiceLevel, setSpiceLevel] = useState(initial.spiceLevel || "none");

  // Variants
  const [variants, setVariants] = useState(
    initial.variants || [
      { label: "Regular", unit: "plate", quantity: 1, price: "", isDefault: true, isAvailable: true },
    ]
  );

  // Meta data
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initial.tags || []);
  const [addOnGroups, setAddOnGroups] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState(
    initial.addOnGroups?.map((g) => g._id || g) || []
  );

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial.imageUrl || initial.thumbnailUrl || null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Load metadata
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, tagsRes, addOnsRes] = await Promise.all([
          menuApi.getCategories(username),
          menuApi.getTags(),
          menuApi.getAddOnGroups(username),
        ]);

        setCategories(categoriesRes.data.data || []);
        setAvailableTags(tagsRes.data.data || []);
        setAddOnGroups(addOnsRes.data.data || []);
      } catch (err) {
        console.error("Failed to load metadata:", err);
      } finally {
        setLoadingMeta(false);
      }
    };

    loadData();
  }, [username]);

  // Image handler
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  // Variant management
  const addVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      { label: "", unit: "plate", quantity: 1, price: "", isDefault: false, isAvailable: true },
    ]);
  }, []);

  const updateVariant = useCallback((index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const removeVariant = useCallback((index) => {
    setVariants((prev) => {
      if (prev.length === 1) {
        alert("At least one variant is required");
        return prev;
      }

      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].isDefault && updated.length > 0) {
        updated[0].isDefault = true;
      }
      return updated;
    });
  }, []);

  const setDefaultVariant = useCallback((index) => {
    setVariants((prev) =>
      prev.map((v, i) => ({ ...v, isDefault: i === index }))
    );
  }, []);

  // Tag toggle
  const toggleTag = useCallback((tagKey) => {
    setSelectedTags((prev) =>
      prev.includes(tagKey) ? prev.filter((k) => k !== tagKey) : [...prev, tagKey]
    );
  }, []);

  // Add-on toggle
  const toggleAddOn = useCallback((groupId) => {
    setSelectedAddOns((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  }, []);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Dish name is required");
      return;
    }

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    for (const variant of variants) {
      if (!variant.label || !variant.price) {
        alert("All variants must have a label and price");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("foodType", foodType);
      formData.append("preparationTime", preparationTime);
      formData.append("spiceLevel", spiceLevel);

      const variantsForApi = variants.map((v) => ({
        name: v.label,
        unit: v.unit,
        quantity: v.quantity,
        price: v.price,
        isDefault: v.isDefault,
        isAvailable: v.isAvailable,
      }));

      formData.append("variants", JSON.stringify(variantsForApi));
      formData.append("tags", JSON.stringify(selectedTags));
      formData.append("addOnGroups", JSON.stringify(selectedAddOns));

      if (image) {
        formData.append("image", image);
      }

      if (mode === "add") {
        await menuApi.createDish(username, formData);
      } else {
        await menuApi.updateDish(username, dishId, formData);
      }

      onSuccess?.();
    } catch (err) {
      console.error("Failed to save dish:", err);
      alert(err?.response?.data?.message || "Failed to save dish");
    } finally {
      setLoading(false);
    }
  };

  if (loadingMeta) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* BASIC INFO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {mode === "add" ? "Add New Dish" : "Edit Dish"}
        </h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dish Image</label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Image</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Max 5MB • JPEG, PNG, WebP</p>
        </div>

        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Butter Chicken"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the dish..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Food Type, Prep Time, Spice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Type *</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FOOD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
            <input
              type="number"
              value={preparationTime}
              onChange={(e) => setPreparationTime(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SPICE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VARIANTS */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Price Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <input
                type="text"
                value={variant.label}
                onChange={(e) => updateVariant(index, "label", e.target.value)}
                placeholder="Label (e.g., Regular)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={variant.unit}
                onChange={(e) => updateVariant(index, "unit", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={variant.quantity}
                onChange={(e) => updateVariant(index, "quantity", Number(e.target.value))}
                min="0.01"
                step="0.01"
                placeholder="Qty"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                min="0"
                step="0.01"
                placeholder="Price"
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setDefaultVariant(index)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  variant.isDefault
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-blue-600"
                }`}
              >
                {variant.isDefault ? "Default" : "Set Default"}
              </button>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TAGS */}
      {availableTags.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags (Optional)</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedTags.includes(tag.key)
                    ? TAG_COLORS[tag.color] || "bg-gray-100 text-gray-900 border-gray-300"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="text-lg">{tag.icon}</span>
                <span className="text-sm font-medium">{tag.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ADD-ONS */}
      {addOnGroups.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-on Groups (Optional)</h3>
          <div className="space-y-2">
            {addOnGroups.map((group) => (
              <label
                key={group._id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(group._id)}
                  onChange={() => toggleAddOn(group._id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-xs text-gray-500">
                    {group.addOns?.length || 0} add-ons
                    {group.required && <span className="ml-2 text-red-600">• Required</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : mode === "add" ? (
            "Create Dish"
          ) : (
            "Update Dish"
          )}
        </button>
      </div>
    </form>
  );
}