 
 
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { User, Mail, Phone, MapPin, Lock, Building2 } from "lucide-react";
// import { State, City } from "country-state-city";
// import api from "../../services/api";

// /* =========================
//    REGISTER PAGE
// ========================= */
// export default function Register() {
//   const navigate = useNavigate();
//   const debounceRef = useRef(null);

//   const [formData, setFormData] = useState({
//     username: "",
//     restaurantName: "",
//     ownerName: "",
//     email: "",
//     phone: "",
//     state: "",
//     city: "",
//     pincode: "",
//     restaurantType: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   const [usernameStatus, setUsernameStatus] = useState("idle"); 
//   // idle | checking | available | taken | error

//   /* =========================
//      LOAD STATES
//   ========================= */
//   useEffect(() => {
//     setStates(State.getStatesOfCountry("IN"));
//   }, []);

//   /* =========================
//      USERNAME CHECK (DEBOUNCED)
//   ========================= */
//   useEffect(() => {
//     if (!formData.username.trim()) {
//       setUsernameStatus("idle");
//       return;
//     }

//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(async () => {
//       setUsernameStatus("checking");
//       try {
//         const res = await api.get("/auth/check-username", {
//           params: { username: formData.username },
//         });

//         setUsernameStatus(res.data.available ? "available" : "taken");
//       } catch (err) {
//         console.error("Username check error:", err);
//         setUsernameStatus("error");
//       }
//     }, 500);

//     return () => clearTimeout(debounceRef.current);
//   }, [formData.username]);

//   /* =========================
//      INPUT CHANGE
//   ========================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "username") {
//       const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, "");
//       setFormData((p) => ({ ...p, username: cleaned }));
//       setErrors((p) => ({ ...p, username: "" }));
//       return;
//     }

//     if (name === "state") {
//       setCities(City.getCitiesOfState("IN", value));
//       setFormData((p) => ({ ...p, state: value, city: "" }));
//       return;
//     }

//     setFormData((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   /* =========================
//      REGISTER SUBMIT
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (usernameStatus === "taken") {
//       toast.error("Username already taken");
//       return;
//     }

//     const newErrors = {};
//     Object.entries(formData).forEach(([k, v]) => {
//       if (!v.trim()) newErrors[k] = "Required";
//     });

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       toast.error("Fix the highlighted fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await api.post("/auth/register", formData);
//       toast.success(res.data?.message || "Registered successfully");
//       navigate("/login");
//     } catch (err) {
//       const msg =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Registration failed";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <div className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">
//       <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
//         <div className="grid md:grid-cols-2">
//           <LeftPanel />

//           <div className="p-8">
//             <h2 className="text-xl font-semibold mb-6">Create your account</h2>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {inputs.map((input) => (
//                   <FormField
//                     key={input.name}
//                     input={input}
//                     value={formData[input.name]}
//                     error={errors[input.name]}
//                     onChange={handleChange}
//                     states={states}
//                     cities={cities}
//                     usernameStatus={usernameStatus}
//                   />
//                 ))}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
//               >
//                 {loading ? "Creating account..." : "Create account"}
//               </button>

//               <p className="text-center text-xs text-gray-400">
//                 Already have an account?{" "}
//                 <Link to="/login" className="underline text-white">
//                   Login
//                 </Link>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    LEFT PANEL
// ========================= */
// function LeftPanel() {
//   return (
//     <div className="hidden md:flex flex-col justify-between p-8 border-r border-white/10">
//       <h1 className="text-2xl font-semibold">
//         Grow your restaurant
//         <span className="block text-sm text-gray-400 mt-2">
//           One dashboard. Full control.
//         </span>
//       </h1>
//     </div>
//   );
// }

// /* =========================
//    INPUT CONFIG
// ========================= */
// const inputs = [
//   { label: "Username", name: "username", icon: <User size={16} />, type: "text" },
//   { label: "Restaurant name", name: "restaurantName", icon: <Building2 size={16} />, type: "text" },
//   { label: "Owner name", name: "ownerName", icon: <User size={16} />, type: "text" },
//   { label: "Email", name: "email", icon: <Mail size={16} />, type: "email" },
//   { label: "Phone", name: "phone", icon: <Phone size={16} />, type: "text" },
//   { label: "State", name: "state", icon: <MapPin size={16} />, type: "select" },
//   { label: "City", name: "city", icon: <MapPin size={16} />, type: "select" },
//   { label: "Pincode", name: "pincode", icon: <MapPin size={16} />, type: "text" },
//   { label: "Password", name: "password", icon: <Lock size={16} />, type: "password" },
//   { label: "Confirm password", name: "confirmPassword", icon: <Lock size={16} />, type: "password" },
// ];

// /* =========================
//    FORM FIELD (NO DOM WARNINGS)
// ========================= */
// function FormField({ input, value, onChange, error, states, cities, usernameStatus }) {
//   const { label, name, type, icon } = input;

//   return (
//     <div className="space-y-1">
//       <label className="text-xs text-gray-300">{label}</label>

//       {type === "select" ? (
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
//         >
//           <option value="">Select {label}</option>
//           {name === "state" &&
//             states.map((s) => (
//               <option key={s.isoCode} value={s.isoCode}>
//                 {s.name}
//               </option>
//             ))}
//           {name === "city" &&
//             cities.map((c) => (
//               <option key={c.name} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//         </select>
//       ) : (
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             {icon}
//           </span>
//           <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             className="w-full bg-black border border-white/10 rounded-lg px-9 py-2 text-sm"
//           />
//         </div>
//       )}

//       {name === "username" && (
//         <div className="text-[11px]">
//           {usernameStatus === "checking" && <span className="text-gray-400">Checking...</span>}
//           {usernameStatus === "available" && <span className="text-green-400">✔ Available</span>}
//           {usernameStatus === "taken" && <span className="text-red-500">✖ Taken</span>}
//           {usernameStatus === "error" && <span className="text-red-400">Error checking</span>}
//         </div>
//       )}

//       {error && <div className="text-[11px] text-red-500">{error}</div>}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Lock, Building2 } from "lucide-react";
import { State, City } from "country-state-city";
import api from "../../services/api";

/* =========================
   REGISTER PAGE
========================= */
export default function Register() {
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    restaurantType: "", // ✅ FIXED
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [usernameStatus, setUsernameStatus] = useState("idle");

  /* =========================
     LOAD STATES
  ========================= */
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  /* =========================
     USERNAME CHECK (DEBOUNCED)
  ========================= */
  useEffect(() => {
    if (!formData.username.trim()) {
      setUsernameStatus("idle");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        const res = await api.get("/auth/check-username", {
          params: { username: formData.username },
        });

        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch (err) {
        setUsernameStatus("error");
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [formData.username]);

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, "");
      setFormData((p) => ({ ...p, username: cleaned }));
      setErrors((p) => ({ ...p, username: "" }));
      return;
    }

    if (name === "state") {
      setCities(City.getCitiesOfState("IN", value));
      setFormData((p) => ({ ...p, state: value, city: "" }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* =========================
     REGISTER SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameStatus === "taken") {
      toast.error("Username already taken");
      return;
    }

    const newErrors = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (!v.trim()) newErrors[k] = "Required";
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      toast.error("Fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", formData);
      toast.success(res.data?.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <LeftPanel />

          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">Create your account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {inputs.map((input) => (
                  <FormField
                    key={input.name}
                    input={input}
                    value={formData[input.name]}
                    error={errors[input.name]}
                    onChange={handleChange}
                    states={states}
                    cities={cities}
                    usernameStatus={usernameStatus}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-center text-xs text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="underline text-white">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   LEFT PANEL
========================= */
function LeftPanel() {
  return (
    <div className="hidden md:flex flex-col justify-between p-8 border-r border-white/10">
      <h1 className="text-2xl font-semibold">
        Grow your restaurant
        <span className="block text-sm text-gray-400 mt-2">
          One dashboard. Full control.
        </span>
      </h1>
    </div>
  );
}

/* =========================
   INPUT CONFIG
========================= */
const inputs = [
  { label: "Username", name: "username", icon: <User size={16} />, type: "text" },
  { label: "Restaurant name", name: "restaurantName", icon: <Building2 size={16} />, type: "text" },
  { label: "Owner name", name: "ownerName", icon: <User size={16} />, type: "text" },
  { label: "Email", name: "email", icon: <Mail size={16} />, type: "email" },
  { label: "Phone", name: "phone", icon: <Phone size={16} />, type: "text" },
  { label: "State", name: "state", icon: <MapPin size={16} />, type: "select" },
  { label: "City", name: "city", icon: <MapPin size={16} />, type: "select" },
  { label: "Pincode", name: "pincode", icon: <MapPin size={16} />, type: "text" },

  // ✅ FIXED FIELD
  { label: "Restaurant Type", name: "restaurantType", icon: <Building2 size={16} />, type: "select" },

  { label: "Password", name: "password", icon: <Lock size={16} />, type: "password" },
  { label: "Confirm password", name: "confirmPassword", icon: <Lock size={16} />, type: "password" },
];

/* =========================
   FORM FIELD
========================= */
function FormField({ input, value, onChange, error, states, cities, usernameStatus }) {
  const { label, name, type, icon } = input;

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-300">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select {label}</option>

          {name === "state" &&
            states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}

          {name === "city" &&
            cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}

          {name === "restaurantType" &&
            ["Cafe", "Fast Food", "Fine Dining", "Cloud Kitchen", "Bakery"].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              )
            )}
        </select>
      ) : (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-black border border-white/10 rounded-lg px-9 py-2 text-sm"
          />
        </div>
      )}

      {name === "username" && (
        <div className="text-[11px]">
          {usernameStatus === "checking" && <span className="text-gray-400">Checking...</span>}
          {usernameStatus === "available" && <span className="text-green-400">✔ Available</span>}
          {usernameStatus === "taken" && <span className="text-red-500">✖ Taken</span>}
          {usernameStatus === "error" && <span className="text-red-400">Error checking</span>}
        </div>
      )}

      {error && <div className="text-[11px] text-red-500">{error}</div>}
    </div>
  );
}
