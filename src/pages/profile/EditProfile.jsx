// import { useEffect, useState, useRef } from "react";
// import { motion } from "framer-motion";
// import api from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import {
//   User,
//   Phone,
//   MapPin,
//   Save,
//   Building2,
//   UtensilsCrossed,
//   Camera,
//   Upload,
//   X,
//   Image as ImageIcon,
//   ArrowLeft,
// } from "lucide-react";

// import { State, City } from "country-state-city";

// export default function EditProfile() {
//   const navigate = useNavigate();
//   const profileFileInputRef = useRef(null);
//   const galleryFileInputRef = useRef(null);

//   /* ---------------- FORM STATE ---------------- */
//   const [form, setForm] = useState({
//     restaurantName: "",
//     ownerName: "",
//     phone: "",
//     state: "",
//     city: "",
//     pincode: "",
//     restaurantType: "",
//     description: "",
//   });

//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   // Profile photo state
//   const [profilePhotoFile, setProfilePhotoFile] = useState(null);
//   const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
//   const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

//   // Gallery images state
//   const [galleryFiles, setGalleryFiles] = useState([]);
//   const [galleryPreviews, setGalleryPreviews] = useState([]);
//   const [currentGalleryImages, setCurrentGalleryImages] = useState([]);

//   /* ---------------- LOAD PROFILE ---------------- */
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const { data } = await api.get("/auth/profile");
//         const user = data.user;

//         setStates(State.getStatesOfCountry("IN"));

//         setForm({
//           restaurantName: user.restaurantName ?? "",
//           ownerName: user.ownerName ?? "",
//           phone: user.phone ?? "",
//           state: user.state ?? "",
//           city: user.city ?? "",
//           pincode: user.pincode ?? "",
//           restaurantType: user.restaurantType ?? "",
//           description: user.description ?? "",
//         });

//         if (user.profilePhoto) {
//           setCurrentProfilePhoto(user.profilePhoto);
//           setProfilePhotoPreview(user.profilePhoto);
//         }

//         if (user.galleryImages && user.galleryImages.length > 0) {
//           setCurrentGalleryImages(user.galleryImages);
//         }

//         if (user.state) {
//           setCities(City.getCitiesOfState("IN", user.state));
//         }
//       } catch {
//         toast.error("Unable to load profile");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, [navigate]);

//   /* ---------------- HANDLERS ---------------- */
//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleStateChange = (e) => {
//     const iso = e.target.value;
//     setForm((p) => ({ ...p, state: iso, city: "" }));
//     setCities(City.getCitiesOfState("IN", iso));
//   };

//   const handleProfilePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Only JPEG, PNG, and WebP images are allowed");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     setProfilePhotoFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setProfilePhotoPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveProfilePhoto = () => {
//     setProfilePhotoFile(null);
//     setProfilePhotoPreview(currentProfilePhoto);
//     if (profileFileInputRef.current) {
//       profileFileInputRef.current.value = "";
//     }
//   };

//   const handleGalleryImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const totalCount = currentGalleryImages.length + galleryFiles.length + files.length;
//     if (totalCount > 3) {
//       toast.error("Maximum 3 gallery images allowed");
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//     const validFiles = [];
//     const newPreviews = [];

//     files.forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`${file.name}: Only JPEG, PNG, and WebP images are allowed`);
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name}: Image size should be less than 5MB`);
//         return;
//       }

//       validFiles.push(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         newPreviews.push(reader.result);
//         if (newPreviews.length === validFiles.length) {
//           setGalleryPreviews((prev) => [...prev, ...newPreviews]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });

//     setGalleryFiles((prev) => [...prev, ...validFiles]);

//     if (galleryFileInputRef.current) {
//       galleryFileInputRef.current.value = "";
//     }
//   };

//   const handleRemoveNewGalleryImage = (index) => {
//     setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
//     setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleDeleteExistingGalleryImage = async (imageId) => {
//     try {
//       await api.delete(`/auth/profile/gallery/${imageId}`);
//       setCurrentGalleryImages((prev) =>
//         prev.filter((img) => img._id !== imageId)
//       );
//       toast.success("Image deleted successfully");
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete image");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       const formData = new FormData();

//       Object.keys(form).forEach((key) => {
//         formData.append(key, form[key]);
//       });

//       if (profilePhotoFile) {
//         formData.append("profilePhoto", profilePhotoFile);
//       }

//       if (galleryFiles.length > 0) {
//         galleryFiles.forEach((file) => {
//           formData.append("galleryImages", file);
//         });
//       }

//       await api.put("/auth/profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Profile updated successfully");
//       navigate("/settings");
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error.response?.data?.message || "Update failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center gap-3"
//         >
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-600 font-medium">Loading profile…</p>
//         </motion.div>
//       </div>
//     );
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
//       {/* Grain Texture */}
//       <div 
//         className="fixed inset-0 opacity-[0.015] pointer-events-none"
//         style={{ 
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
//         }}
//       />

//       <div className="mx-auto max-w-4xl space-y-8 relative z-10">
//         {/* Header */}
//         <motion.header 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-4"
//         >
//           <button
//             onClick={() => navigate("/settings")}
//             className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
//           >
//             <ArrowLeft size={20} />
//             <span className="font-medium">Back to Profile</span>
//           </button>
//           <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//             Edit Profile
//           </h1>
//           <p className="text-slate-600">
//             Update your restaurant and contact information
//           </p>
//         </motion.header>

//         {/* Card */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="rounded-2xl border border-slate-200 bg-white shadow-sm"
//         >
//           {/* Card Header */}
//           <div className="border-b border-slate-200 px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
//             <p className="text-lg font-bold text-slate-900">{form.restaurantName}</p>
//             <p className="text-sm text-slate-600">Owned by {form.ownerName}</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">
//             {/* Profile Photo Upload Section */}
//             <Section title="Restaurant Profile Photo">
//               <div className="flex items-center gap-8">
//                 <div className="relative">
//                   <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
//                     {profilePhotoPreview ? (
//                       <img
//                         src={profilePhotoPreview}
//                         alt="Restaurant"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Camera className="w-12 h-12 text-slate-400" />
//                     )}
//                   </div>
//                   {profilePhotoFile && (
//                     <button
//                       type="button"
//                       onClick={handleRemoveProfilePhoto}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg"
//                     >
//                       <X size={14} />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex-1 space-y-2">
//                   <input
//                     ref={profileFileInputRef}
//                     type="file"
//                     accept="image/jpeg,image/jpg,image/png,image/webp"
//                     onChange={handleProfilePhotoChange}
//                     className="hidden"
//                     id="profile-photo-upload"
//                   />
//                   <label
//                     htmlFor="profile-photo-upload"
//                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-500/30 font-semibold"
//                   >
//                     <Upload size={18} />
//                     Upload Profile Photo
//                   </label>
//                   <p className="text-sm text-slate-500">
//                     JPG, PNG or WebP. Max 5MB.
//                   </p>
//                 </div>
//               </div>
//             </Section>

//             {/* Gallery Images Upload Section */}
//             <Section title="Restaurant Gallery (Max 3 Images)">
//               <div className="space-y-4">
//                 {currentGalleryImages.length > 0 && (
//                   <div>
//                     <p className="text-sm text-slate-600 mb-3 font-medium">
//                       Current Gallery Images
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {currentGalleryImages.map((image) => (
//                         <div key={image._id} className="relative group">
//                           <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
//                             <img
//                               src={image.url}
//                               alt="Gallery"
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleDeleteExistingGalleryImage(image._id)
//                             }
//                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {galleryPreviews.length > 0 && (
//                   <div>
//                     <p className="text-sm text-slate-600 mb-3 font-medium">
//                       New Images to Upload
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {galleryPreviews.map((preview, index) => (
//                         <div key={index} className="relative group">
//                           <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-blue-200">
//                             <img
//                               src={preview}
//                               alt={`New ${index + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveNewGalleryImage(index)}
//                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {currentGalleryImages.length + galleryFiles.length < 3 && (
//                   <div className="space-y-2">
//                     <input
//                       ref={galleryFileInputRef}
//                       type="file"
//                       accept="image/jpeg,image/jpg,image/png,image/webp"
//                       onChange={handleGalleryImagesChange}
//                       className="hidden"
//                       id="gallery-images-upload"
//                       multiple
//                     />
//                     <label
//                       htmlFor="gallery-images-upload"
//                       className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl cursor-pointer transition-all font-semibold"
//                     >
//                       <ImageIcon size={18} />
//                       Add Gallery Images
//                     </label>
//                     <p className="text-sm text-slate-500">
//                       {3 - currentGalleryImages.length - galleryFiles.length} more image(s) can be added. JPG, PNG or WebP. Max 5MB each.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </Section>

//             {/* Basic Info */}
//             <Section title="Basic Information">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field
//                   label="Restaurant Name"
//                   icon={<Building2 />}
//                   name="restaurantName"
//                   value={form.restaurantName}
//                   onChange={handleChange}
//                 />
//                 <Field
//                   label="Owner Name"
//                   icon={<User />}
//                   name="ownerName"
//                   value={form.ownerName}
//                   onChange={handleChange}
//                 />
//                 <Field
//                   label="Phone"
//                   icon={<Phone />}
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                 />
//                 <Field
//                   label="Restaurant Type"
//                   icon={<UtensilsCrossed />}
//                   name="restaurantType"
//                   value={form.restaurantType}
//                   onChange={handleChange}
//                 />
//               </div>
//             </Section>

//             {/* Location */}
//             <Section title="Location Details">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Dropdown
//                   label="State"
//                   icon={<MapPin />}
//                   value={form.state}
//                   onChange={handleStateChange}
//                   options={states.map((s) => ({
//                     label: s.name,
//                     value: s.isoCode,
//                   }))}
//                 />
//                 <Dropdown
//                   label="City"
//                   icon={<MapPin />}
//                   name="city"
//                   value={form.city}
//                   disabled={!form.state}
//                   onChange={handleChange}
//                   options={cities.map((c) => ({
//                     label: c.name,
//                     value: c.name,
//                   }))}
//                 />
//                 <Field
//                   label="Pincode"
//                   icon={<MapPin />}
//                   name="pincode"
//                   value={form.pincode}
//                   onChange={handleChange}
//                 />
//               </div>
//             </Section>

//             {/* Description */}
//             <Section title="Description">
//               <textarea
//                 rows={4}
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 placeholder="Tell customers about your restaurant"
//                 className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none outline-none"
//               />
//             </Section>

//             {/* Save */}
//             <div className="flex justify-end pt-6 border-t border-slate-200">
//               <motion.button
//                 type="submit"
//                 disabled={uploading}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Save size={18} />
//                 {uploading ? "Saving..." : "Save Changes"}
//               </motion.button>
//             </div>
//           </form>
//         </motion.section>
//       </div>
//     </div>
//   );
// }

// /* ---------------- REUSABLE UI ---------------- */

// function Section({ title, children }) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-bold text-slate-900">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Field({ label, icon, name, value, onChange }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-medium text-slate-700">{label}</label>
//       <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
//         <span className="text-blue-600">{icon}</span>
//         <input
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
//         />
//       </div>
//     </div>
//   );
// }

// function Dropdown({ label, icon, name, value, onChange, options, disabled }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-medium text-slate-700">{label}</label>
//       <div
//         className={`flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition ${
//           disabled && "opacity-50"
//         }`}
//       >
//         <span className="text-blue-600">{icon}</span>
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           className="flex-1 bg-transparent outline-none text-slate-900"
//         >
//           <option value="">Select {label}</option>
//           {options.map((o) => (
//             <option key={o.value} value={o.value}>
//               {o.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
  ArrowLeft,
  Plus,
  Star,
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

  // Gallery images state
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);

  // 🔥 NEW: Delivery phones state
  const [deliveryPhones, setDeliveryPhones] = useState([]);

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

        if (user.profilePhoto) {
          setCurrentProfilePhoto(user.profilePhoto);
          setProfilePhotoPreview(user.profilePhoto);
        }

        if (user.galleryImages && user.galleryImages.length > 0) {
          setCurrentGalleryImages(user.galleryImages);
        }

        // 🔥 Load delivery phones
        if (user.deliveryPhones && user.deliveryPhones.length > 0) {
          setDeliveryPhones(user.deliveryPhones);
        } else {
          // Initialize with primary phone if no delivery phones exist
          setDeliveryPhones([
            { number: user.phone, label: "Primary", isPrimary: true },
          ]);
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

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setProfilePhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(currentProfilePhoto);
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const totalCount =
      currentGalleryImages.length + galleryFiles.length + files.length;
    if (totalCount > 3) {
      toast.error("Maximum 3 gallery images allowed");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name}: Only JPEG, PNG, and WebP images are allowed`
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Image size should be less than 5MB`);
        return;
      }

      validFiles.push(file);

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

    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = "";
    }
  };

  const handleRemoveNewGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

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

  // 🔥 NEW: Delivery phone handlers
  const handleAddDeliveryPhone = () => {
    setDeliveryPhones([
      ...deliveryPhones,
      { number: "", label: "", isPrimary: false },
    ]);
  };

  const handleDeliveryPhoneChange = (index, field, value) => {
    const updated = [...deliveryPhones];
    updated[index][field] = value;
    setDeliveryPhones(updated);
  };

  const handleSetPrimaryPhone = (index) => {
    const updated = deliveryPhones.map((phone, i) => ({
      ...phone,
      isPrimary: i === index,
    }));
    setDeliveryPhones(updated);
    toast.success("Primary phone updated");
  };

  const handleRemoveDeliveryPhone = (index) => {
    if (deliveryPhones[index].isPrimary && deliveryPhones.length > 1) {
      toast.error("Cannot remove primary phone. Set another phone as primary first.");
      return;
    }
    if (deliveryPhones.length === 1) {
      toast.error("At least one delivery phone is required");
      return;
    }
    setDeliveryPhones(deliveryPhones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Validate delivery phones
      const phoneRegex = /^[0-9]{10}$/;
      for (const phone of deliveryPhones) {
        if (!phone.number.trim()) {
          toast.error("All phone numbers must be filled");
          setUploading(false);
          return;
        }
        if (!phoneRegex.test(phone.number)) {
          toast.error(`Invalid phone number: ${phone.number}. Must be 10 digits.`);
          setUploading(false);
          return;
        }
        if (!phone.label.trim()) {
          toast.error("All phone labels must be filled");
          setUploading(false);
          return;
        }
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // 🔥 Add delivery phones as JSON string
      formData.append("deliveryPhones", JSON.stringify(deliveryPhones));

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading profile…</p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
      {/* Grain Texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Profile</span>
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Edit Profile
          </h1>
          <p className="text-slate-600">
            Update your restaurant and contact information
          </p>
        </motion.header>

        {/* Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Card Header */}
          <div className="border-b border-slate-200 px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-lg font-bold text-slate-900">
              {form.restaurantName}
            </p>
            <p className="text-sm text-slate-600">Owned by {form.ownerName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">
            {/* Profile Photo Upload Section */}
            <Section title="Restaurant Profile Photo">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Restaurant"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  {profilePhotoFile && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

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
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-500/30 font-semibold"
                  >
                    <Upload size={18} />
                    Upload Profile Photo
                  </label>
                  <p className="text-sm text-slate-500">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </Section>

            {/* Gallery Images Upload Section */}
            <Section title="Restaurant Gallery (Max 3 Images)">
              <div className="space-y-4">
                {currentGalleryImages.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">
                      Current Gallery Images
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {currentGalleryImages.map((image) => (
                        <div key={image._id} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
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
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {galleryPreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">
                      New Images to Upload
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-blue-200">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl cursor-pointer transition-all font-semibold"
                    >
                      <ImageIcon size={18} />
                      Add Gallery Images
                    </label>
                    <p className="text-sm text-slate-500">
                      {3 -
                        currentGalleryImages.length -
                        galleryFiles.length}{" "}
                      more image(s) can be added. JPG, PNG or WebP. Max 5MB
                      each.
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* 🔥 NEW: Delivery Phone Numbers Section */}
            <Section title="Delivery Phone Numbers">
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Add multiple phone numbers for delivery coordination. These
                  numbers will be available in a dropdown during order delivery.
                </p>

                {deliveryPhones.length > 0 && (
                  <div className="space-y-3">
                    {deliveryPhones.map((phone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                      >
                        <div className="flex flex-col md:flex-row gap-3">
                          {/* Phone Number Input */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                              <Phone
                                className="text-blue-600 flex-shrink-0"
                                size={18}
                              />
                              <input
                                type="tel"
                                value={phone.number}
                                onChange={(e) =>
                                  handleDeliveryPhoneChange(
                                    index,
                                    "number",
                                    e.target.value
                                  )
                                }
                                placeholder="10-digit phone number"
                                className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
                                maxLength={10}
                              />
                            </div>
                          </div>

                          {/* Label Input */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                              <Building2
                                className="text-blue-600 flex-shrink-0"
                                size={18}
                              />
                              <input
                                type="text"
                                value={phone.label}
                                onChange={(e) =>
                                  handleDeliveryPhoneChange(
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="Label (e.g., Manager, Kitchen)"
                                className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400"
                                maxLength={30}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhone(index)}
                              className={`flex-shrink-0 rounded-lg w-10 h-10 flex items-center justify-center transition ${
                                phone.isPrimary
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-slate-50 text-slate-400 hover:bg-yellow-50 hover:text-yellow-500"
                              }`}
                              title="Set as primary"
                            >
                              <Star
                                size={18}
                                fill={phone.isPrimary ? "currentColor" : "none"}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDeliveryPhone(index)}
                              disabled={deliveryPhones.length === 1}
                              className="flex-shrink-0 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg w-10 h-10 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove phone"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                        {phone.isPrimary && (
                          <p className="text-xs text-yellow-600 mt-1 ml-1 font-medium">
                            ⭐ Primary delivery number
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddDeliveryPhone}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all font-semibold"
                >
                  <Plus size={18} />
                  Add Phone Number
                </button>
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
                  label="Primary Phone"
                  icon={<Phone />}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled
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
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none outline-none"
              />
            </Section>

            {/* Save */}
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <motion.button
                type="submit"
                disabled={uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {uploading ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, icon, name, value, onChange, disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div
        className={`flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition ${
          disabled && "opacity-50 cursor-not-allowed"
        }`}
      >
        <span className="text-blue-600">{icon}</span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

function Dropdown({ label, icon, name, value, onChange, options, disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div
        className={`flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition ${
          disabled && "opacity-50"
        }`}
      >
        <span className="text-blue-600">{icon}</span>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-slate-900"
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
            ))}
        </select>
      </div>
    </div>
  );
}