import { useEffect, useState } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
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

// Color mapping for tags
const TAG_COLORS = {
  red: "bg-red-500/20 text-red-400 border-red-500/50",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  lime: "bg-lime-500/20 text-lime-400 border-lime-500/50",
  green: "bg-green-500/20 text-green-400 border-green-500/50",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  teal: "bg-teal-500/20 text-teal-400 border-teal-500/50",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50",
  violet: "bg-violet-500/20 text-violet-400 border-violet-500/50",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/50",
  rose: "bg-rose-500/20 text-rose-400 border-rose-500/50",
};

export default function DishForm({
  mode = "add",
  initial = {},
  username,
  dishId,
  onSuccess,
}) {
  // Basic info
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [foodType, setFoodType] = useState(initial.foodType || "veg");
  const [categoryId, setCategoryId] = useState(
    initial.categoryId?._id || initial.categoryId || ""
  );
  const [preparationTime, setPreparationTime] = useState(
    initial.preparationTime || 15
  );
  const [spiceLevel, setSpiceLevel] = useState(initial.spiceLevel || "none");

  // Variants
  const [variants, setVariants] = useState(
    initial.variants || [
      {
        label: "Regular",
        unit: "plate",
        quantity: 1,
        price: "",
        isDefault: true,
        isAvailable: true,
      },
    ]
  );

  // Categories, tags, and add-ons
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initial.tags || []);
  const [addOnGroups, setAddOnGroups] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState(
    initial.addOnGroups?.map((g) => g._id || g) || []
  );

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initial.imageUrl || initial.thumbnailUrl || null
  );

  // UI state
  const [loading, setLoading] = useState(false);

  // Load meta data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("menuApi:", menuApi);
        console.log("menuApi keys:", Object.keys(menuApi));
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
      }
    };

    loadData();
  }, [username]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    }
  };

  // Variant management
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        label: "",
        unit: "plate",
        quantity: 1,
        price: "",
        isDefault: false,
        isAvailable: true,
      },
    ]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      alert("At least one variant is required");
      return;
    }

    const updated = variants.filter((_, i) => i !== index);

    if (variants[index].isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }

    setVariants(updated);
  };

  const setDefaultVariant = (index) => {
    setVariants(
      variants.map((v, i) => ({
        ...v,
        isDefault: i === index,
      }))
    );
  };

  // Tag management
  const toggleTag = (tagKey) => {
    setSelectedTags((prev) =>
      prev.includes(tagKey)
        ? prev.filter((key) => key !== tagKey)
        : [...prev, tagKey]
    );
  };

  // Toggle add-on group selection
  const toggleAddOnGroup = (groupId) => {
    setSelectedAddOns((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {mode === "add" ? "Add New Dish" : "Edit Dish"}
        </h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dish Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-32 rounded overflow-hidden border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-black border border-gray-700 rounded text-gray-300 hover:border-cyan-500">
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Max file size: 5MB. Formats: JPEG, PNG, WebP
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dish Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Butter Chicken"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
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

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the dish..."
            rows={3}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Food Type *
            </label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
            >
              {FOOD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preparation Time (min)
            </label>
            <input
              type="number"
              value={preparationTime}
              onChange={(e) => setPreparationTime(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spice Level
            </label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
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

      {/* Tags Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Tags (Optional)
        </h3>

        {availableTags.length === 0 ? (
          <p className="text-gray-400 text-sm">No tags available</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedTags.includes(tag.key)
                    ? TAG_COLORS[tag.color] || "bg-gray-700 text-white border-gray-600"
                    : "bg-black border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <span className="text-lg">{tag.icon}</span>
                <span className="text-sm font-medium">{tag.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Variants */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Price Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-black border border-gray-800 rounded"
            >
              <input
                type="text"
                value={variant.label}
                onChange={(e) => updateVariant(index, "label", e.target.value)}
                placeholder="Label (e.g., Regular)"
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />

              <select
                value={variant.unit}
                onChange={(e) => updateVariant(index, "unit", e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
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
                onChange={(e) =>
                  updateVariant(index, "quantity", Number(e.target.value))
                }
                min="0.01"
                step="0.01"
                placeholder="Qty"
                className="w-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
              />

              <input
                type="number"
                value={variant.price}
                onChange={(e) =>
                  updateVariant(index, "price", Number(e.target.value))
                }
                min="0"
                step="0.01"
                placeholder="Price"
                className="w-28 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-cyan-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setDefaultVariant(index)}
                className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${
                  variant.isDefault
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-900 border border-gray-700 text-gray-400 hover:border-cyan-500"
                }`}
              >
                {variant.isDefault ? "Default" : "Set Default"}
              </button>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add-on Groups */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Add-on Groups (Optional)
        </h3>

        {addOnGroups.length === 0 ? (
          <p className="text-gray-400 text-sm">No add-on groups available</p>
        ) : (
          <div className="space-y-2">
            {addOnGroups.map((group) => (
              <label
                key={group._id}
                className="flex items-center gap-3 p-3 bg-black border border-gray-800 rounded cursor-pointer hover:border-cyan-500"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(group._id)}
                  onChange={() => toggleAddOnGroup(group._id)}
                  className="w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 rounded focus:ring-cyan-500"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{group.name}</div>
                  <div className="text-xs text-gray-400">
                    {group.addOns?.length || 0} add-ons
                    {group.required && (
                      <span className="ml-2 text-red-400">• Required</span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-cyan-500 text-white rounded font-semibold hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : mode === "add"
            ? "Create Dish"
            : "Update Dish"}
        </button>
      </div>
    </form>
  );
}