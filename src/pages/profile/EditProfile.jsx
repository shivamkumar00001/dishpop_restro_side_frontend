import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  User,
  Phone,
  MapPin,
  Save,
  Building2,
  UtensilsCrossed,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

import { State, City } from "country-state-city";

export default function EditProfile() {
  const navigate = useNavigate();
  const profileFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    restaurantType: "",
    description: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Profile photo state
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

  // 🔥 Gallery images state
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        const user = data.user;

        setStates(State.getStatesOfCountry("IN"));

        setForm({
          restaurantName: user.restaurantName ?? "",
          ownerName: user.ownerName ?? "",
          phone: user.phone ?? "",
          state: user.state ?? "",
          city: user.city ?? "",
          pincode: user.pincode ?? "",
          restaurantType: user.restaurantType ?? "",
          description: user.description ?? "",
        });

        // Set current profile photo
        if (user.profilePhoto) {
          setCurrentProfilePhoto(user.profilePhoto);
          setProfilePhotoPreview(user.profilePhoto);
        }

        // 🔥 Set current gallery images
        if (user.galleryImages && user.galleryImages.length > 0) {
          setCurrentGalleryImages(user.galleryImages);
        }

        if (user.state) {
          setCities(City.getCitiesOfState("IN", user.state));
        }
      } catch {
        toast.error("Unable to load profile");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleStateChange = (e) => {
    const iso = e.target.value;
    setForm((p) => ({ ...p, state: iso, city: "" }));
    setCities(City.getCitiesOfState("IN", iso));
  };

  // Handle profile photo selection
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setProfilePhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove profile photo
  const handleRemoveProfilePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(currentProfilePhoto);
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
  };

  // 🔥 Handle gallery images selection
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    // Check total count (existing + new)
    const totalCount = currentGalleryImages.length + galleryFiles.length + files.length;
    if (totalCount > 3) {
      toast.error("Maximum 3 gallery images allowed");
      return;
    }

    // Validate each file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image size should be less than 5MB`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setGalleryFiles((prev) => [...prev, ...validFiles]);

    // Reset file input
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = "";
    }
  };

  // 🔥 Remove new gallery image (not yet uploaded)
  const handleRemoveNewGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 Delete existing gallery image from server
  const handleDeleteExistingGalleryImage = async (imageId) => {
    try {
      await api.delete(`/auth/profile/gallery/${imageId}`);
      setCurrentGalleryImages((prev) =>
        prev.filter((img) => img._id !== imageId)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all form fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append profile photo if selected
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      // 🔥 Append gallery images if selected
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }

      await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
      navigate("/settings");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B10] text-gray-400">
        Loading profile…
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#090B10] px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Edit Profile
          </h1>
          <p className="text-gray-400">
            Update your restaurant and contact information
          </p>
        </header>

        {/* Card */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-xl">
          {/* Card Header */}
          <div className="border-b border-white/10 px-8 py-6">
            <p className="text-lg font-medium">{form.restaurantName}</p>
            <p className="text-sm text-gray-400">Owned by {form.ownerName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">
            {/* Profile Photo Upload Section */}
            <Section title="Restaurant Profile Photo">
              <div className="flex items-center gap-8">
                {/* Photo Preview */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Restaurant"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  {profilePhotoFile && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1 space-y-2">
                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                    id="profile-photo-upload"
                  />
                  <label
                    htmlFor="profile-photo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg cursor-pointer transition"
                  >
                    <Upload size={18} />
                    Upload Profile Photo
                  </label>
                  <p className="text-sm text-gray-400">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </Section>

            {/* 🔥 Gallery Images Upload Section */}
            <Section title="Restaurant Gallery (Max 3 Images)">
              <div className="space-y-4">
                {/* Current Images */}
                {currentGalleryImages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-3">
                      Current Gallery Images
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {currentGalleryImages.map((image) => (
                        <div key={image._id} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            <img
                              src={image.url}
                              alt="Gallery"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteExistingGalleryImage(image._id)
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {galleryPreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-3">
                      New Images to Upload
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {currentGalleryImages.length + galleryFiles.length < 3 && (
                  <div className="space-y-2">
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                      id="gallery-images-upload"
                      multiple
                    />
                    <label
                      htmlFor="gallery-images-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition"
                    >
                      <ImageIcon size={18} />
                      Add Gallery Images
                    </label>
                    <p className="text-sm text-gray-400">
                      {3 - currentGalleryImages.length - galleryFiles.length}{" "}
                      more image(s) can be added. JPG, PNG or WebP. Max 5MB
                      each.
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* Basic Info */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Restaurant Name"
                  icon={<Building2 />}
                  name="restaurantName"
                  value={form.restaurantName}
                  onChange={handleChange}
                />
                <Field
                  label="Owner Name"
                  icon={<User />}
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                />
                <Field
                  label="Phone"
                  icon={<Phone />}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Field
                  label="Restaurant Type"
                  icon={<UtensilsCrossed />}
                  name="restaurantType"
                  value={form.restaurantType}
                  onChange={handleChange}
                />
              </div>
            </Section>

            {/* Location */}
            <Section title="Location Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropdown
                  label="State"
                  icon={<MapPin />}
                  value={form.state}
                  onChange={handleStateChange}
                  options={states.map((s) => ({
                    label: s.name,
                    value: s.isoCode,
                  }))}
                />
                <Dropdown
                  label="City"
                  icon={<MapPin />}
                  name="city"
                  value={form.city}
                  disabled={!form.state}
                  onChange={handleChange}
                  options={cities.map((c) => ({
                    label: c.name,
                    value: c.name,
                  }))}
                />
                <Field
                  label="Pincode"
                  icon={<MapPin />}
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>
            </Section>

            {/* Description */}
            <Section title="Description">
              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell customers about your restaurant"
                className="w-full rounded-xl bg-white/[0.04] border border-white/10
                px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 transition resize-none"
              />
            </Section>

            {/* Save */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 rounded-xl bg-cyan-600
                px-6 py-3 font-medium hover:bg-cyan-700 transition
                shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {uploading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, icon, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 focus-within:border-cyan-500">
        {icon}
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none text-white"
        />
      </div>
    </div>
  );
}

function Dropdown({ label, icon, name, value, onChange, options, disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div
        className={`flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 ${
          disabled && "opacity-40"
        }`}
      >
        {icon}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-white"
        >
          <option value="" className="text-black">
            Select {label}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-black">
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}