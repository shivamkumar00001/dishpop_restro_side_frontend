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

export default function DishForm({
  mode = "add",
  initial = {},
  username,
  dishId,
  onSuccess,
}) {
  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [categoryId, setCategoryId] = useState("");
  const [preparationTime, setPreparationTime] = useState(15);
  const [spiceLevel, setSpiceLevel] = useState("none");

  // Variants - ✅ Using "name" field
  const [variants, setVariants] = useState([
    {
      name: "Regular",  // ✅ Changed from "label" to "name"
      unit: "plate",
      quantity: 1,
      price: "",
      isDefault: true,
      isAvailable: true,
    },
  ]);

  // Categories and add-ons
  const [categories, setCategories] = useState([]);
  const [addOnGroups, setAddOnGroups] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);

  // Initialize form data when in edit mode
  useEffect(() => {
    if (mode === "edit" && initial && Object.keys(initial).length > 0) {
      console.log("Initializing edit form with data:", initial);

      // Set basic fields
      setName(initial.name || "");
      setDescription(initial.description || "");
      setFoodType(initial.foodType || "veg");
      setCategoryId(initial.categoryId?._id || initial.categoryId || "");
      setPreparationTime(initial.preparationTime || 15);
      setSpiceLevel(initial.spiceLevel || "none");

      // ✅ Set variants - using "name" field
      if (initial.variants && Array.isArray(initial.variants) && initial.variants.length > 0) {
        const loadedVariants = initial.variants.map((v) => ({
          name: v.name || "",  // ✅ Using "name"
          unit: v.unit || "plate",
          quantity: v.quantity || 1,
          price: v.price || "",
          isDefault: v.isDefault || false,
          isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
        }));
        console.log("Loading variants:", loadedVariants);
        setVariants(loadedVariants);
      }

      // Set add-on groups
      if (initial.addOnGroups) {
        const addonIds = initial.addOnGroups.map((g) => g._id || g);
        setSelectedAddOns(addonIds);
      }

      // Set image preview
      if (initial.imageUrl || initial.thumbnailUrl) {
        setImagePreview(initial.imageUrl || initial.thumbnailUrl);
      }
    }
  }, [mode, initial]);

  // Load meta data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, addOnsRes] = await Promise.all([
          menuApi.getCategories(username),
          menuApi.getAddOnGroups(username),
        ]);

        // Handle different response structures
        let categoryList = [];
        if (categoriesRes.data?.data) {
          categoryList = categoriesRes.data.data;
        } else if (categoriesRes.data?.categories) {
          categoryList = categoriesRes.data.categories;
        } else if (Array.isArray(categoriesRes.data)) {
          categoryList = categoriesRes.data;
        }

        let addonList = [];
        if (addOnsRes.data?.data) {
          addonList = addOnsRes.data.data;
        } else if (Array.isArray(addOnsRes.data)) {
          addonList = addOnsRes.data;
        }

        setCategories(categoryList || []);
        setAddOnGroups(addonList || []);
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
        name: "",  // ✅ Using "name"
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

    // ✅ Validate variants - using "name" field
    for (const variant of variants) {
      if (!variant.name || !variant.price) {
        alert("All variants must have a name and price");
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
      formData.append("variants", JSON.stringify(variants));
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
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {mode === "add" ? "Add New Dish" : "Edit Dish"}
        </h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dish Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#232A37]">
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
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-gray-300 hover:border-indigo-600 transition-colors">
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
              className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
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
              className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
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
            className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none resize-none"
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
              className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
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
              className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spice Level
            </label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-4 py-3 bg-[#12151D] border border-[#232A37] rounded-lg text-white focus:border-indigo-600 focus:outline-none"
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

      {/* Variants */}
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Price Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-[#12151D] border border-[#232A37] rounded-lg"
            >
              {/* ✅ Using variant.name */}
              <input
                type="text"
                value={variant.name}
                onChange={(e) => updateVariant(index, "name", e.target.value)}
                placeholder="Name (e.g., Regular, Half, Full)"
                className="flex-1 px-3 py-2 bg-[#0D1017] border border-[#232A37] rounded text-white placeholder-gray-500 focus:border-indigo-600 focus:outline-none"
              />

              <select
                value={variant.unit}
                onChange={(e) => updateVariant(index, "unit", e.target.value)}
                className="px-3 py-2 bg-[#0D1017] border border-[#232A37] rounded text-white focus:border-indigo-600 focus:outline-none"
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
                className="w-20 px-3 py-2 bg-[#0D1017] border border-[#232A37] rounded text-white focus:border-indigo-600 focus:outline-none"
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
                className="w-28 px-3 py-2 bg-[#0D1017] border border-[#232A37] rounded text-white focus:border-indigo-600 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setDefaultVariant(index)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  variant.isDefault
                    ? "bg-indigo-600 text-white"
                    : "bg-[#0D1017] border border-[#232A37] text-gray-400 hover:border-indigo-600"
                }`}
              >
                {variant.isDefault ? "Default" : "Set Default"}
              </button>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-2 text-red-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add-on Groups */}
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Add-on Groups (Optional)
        </h3>

        {addOnGroups.length === 0 ? (
          <p className="text-gray-400 text-sm">No add-on groups available</p>
        ) : (
          <div className="space-y-2">
            {addOnGroups.map((group) => (
              <label
                key={group._id}
                className="flex items-center gap-3 p-3 bg-[#12151D] border border-[#232A37] rounded-lg cursor-pointer hover:border-indigo-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(group._id)}
                  onChange={() => toggleAddOnGroup(group._id)}
                  className="w-4 h-4 text-indigo-600 bg-[#0D1017] border-gray-600 rounded focus:ring-indigo-600"
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
          className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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