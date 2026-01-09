 
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { User, Mail, Phone, MapPin, Lock, Building2 } from "lucide-react";
// import { State, City } from "country-state-city";
// import api from "../../services/api";
// import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";


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

//   useEffect(() => {
//     setStates(State.getStatesOfCountry("IN"));
//   }, []);

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
//       } catch {
//         setUsernameStatus("error");
//       }
//     }, 500);

//     return () => clearTimeout(debounceRef.current);
//   }, [formData.username]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "username") {
//       const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, "");
//       setFormData((p) => ({ ...p, username: cleaned }));
//       return;
//     }

//     if (name === "state") {
//       setCities(City.getCitiesOfState("IN", value));
//       setFormData((p) => ({ ...p, state: value, city: "" }));
//       return;
//     }

//     setFormData((p) => ({ ...p, [name]: value }));
//   };

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
//       toast.error("Fix highlighted fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.post("/auth/register", formData);
//       toast.success("Registered successfully");
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
//       <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10">

//         {/* LEFT INFO */}
//         <div className="hidden md:flex flex-col justify-center space-y-6">
//           <h1 className="text-5xl font-bold">
//             Register your <span className="text-cyan-400">Restaurant</span>
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Manage menus, orders, QR codes & analytics — all from one dashboard.
//           </p>
//         </div>

//         {/* FORM */}
//         <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
//           <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="grid sm:grid-cols-2 gap-4">
//               {inputs.map((input) => (
//                 <FormField
//                   key={input.name}
//                   input={input}
//                   value={formData[input.name]}
//                   onChange={handleChange}
//                   error={errors[input.name]}
//                   states={states}
//                   cities={cities}
//                   usernameStatus={usernameStatus}
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg font-semibold transition
//                 ${loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-cyan-500 hover:bg-cyan-600"
//                 }`}
//             >
//               {loading ? "Creating account..." : "Create Account"}
//             </button>

//             <p className="text-center text-sm text-gray-400">
//               Already registered?{" "}
//               <Link to="/login" className="text-cyan-400 hover:underline">
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* INPUT CONFIG */
// const inputs = [
//   { label: "Username", name: "username", icon: <User size={16} />, type: "text" },
//   { label: "Restaurant Name", name: "restaurantName", icon: <Building2 size={16} />, type: "text" },
//   { label: "Owner Name", name: "ownerName", icon: <User size={16} />, type: "text" },
//   { label: "Email", name: "email", icon: <Mail size={16} />, type: "email" },
//   { label: "Phone", name: "phone", icon: <Phone size={16} />, type: "text" },
//   { label: "State", name: "state", icon: <MapPin size={16} />, type: "select" },
//   { label: "City", name: "city", icon: <MapPin size={16} />, type: "select" },
//   { label: "Pincode", name: "pincode", icon: <MapPin size={16} />, type: "text" },
//   { label: "Restaurant Type", name: "restaurantType", icon: <Building2 size={16} />, type: "select" },
//   { label: "Password", name: "password", icon: <Lock size={16} />, type: "password" },
//   { label: "Confirm Password", name: "confirmPassword", icon: <Lock size={16} />, type: "password" },
// ];

// function FormField({ input, value, onChange, error, states, cities, usernameStatus }) {
//   const { label, name, type, icon } = input;

//   return (
//     <div>
//       <label className="text-xs text-gray-400">{label}</label>

//       {type === "select" ? (
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-cyan-500"
//         >
//           <option value="">Select {label}</option>

//           {name === "state" &&
//             states.map((s) => (
//               <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
//             ))}

//           {name === "city" &&
//             cities.map((c) => (
//               <option key={c.name} value={c.name}>{c.name}</option>
//             ))}

//           {name === "restaurantType" &&
//             ["Cafe", "Fast Food", "Fine Dining", "Cloud Kitchen", "Bakery", "Other"].map(
//               (t) => <option key={t}>{t}</option>
//             )}
//         </select>
//       ) : (
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//             {icon}
//           </span>
//           <input
//             type={type}
//             name={name}
//             value={value}
//             onChange={onChange}
//             className="w-full bg-black border border-gray-700 rounded-lg px-9 py-2 text-sm focus:border-cyan-500"
//           />
//         </div>
//       )}

//       {name === "username" && (
//         <p className="text-xs mt-1">
//           {usernameStatus === "checking" && <span className="text-gray-400">Checking...</span>}
//           {usernameStatus === "available" && <span className="text-green-400">✔ Available</span>}
//           {usernameStatus === "taken" && <span className="text-red-400">✖ Taken</span>}
//         </p>
//       )}

//       {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Building2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { State, City } from "country-state-city";
import api from "../../services/api";

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
    restaurantType: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState("idle");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= LOAD STATES ================= */
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  /* ================= USERNAME CHECK ================= */
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
      } catch {
        setUsernameStatus("error");
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [formData.username]);

  /* ================= PASSWORD RULES ================= */
  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const passwordStrengthCount = Object.values(passwordRules).filter(Boolean)
    .length;

  const passwordStrengthLabel =
    passwordStrengthCount <= 1
      ? "Weak"
      : passwordStrengthCount === 2
      ? "Medium"
      : passwordStrengthCount === 3
      ? "Good"
      : "Strong";

  const isPasswordValid = passwordStrengthCount === 4;
  const isConfirmValid =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, "");
      setFormData((p) => ({ ...p, username: cleaned }));
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(
        "Password must be 8+ characters with uppercase, lowercase & number"
      );
      return;
    }

    if (!isConfirmValid) {
      toast.error("Passwords do not match");
      return;
    }

    if (usernameStatus === "taken") {
      toast.error("Username already taken");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const disableSubmit =
    loading ||
    !isPasswordValid ||
    !isConfirmValid ||
    usernameStatus === "taken";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-bold">
            Register your <span className="text-cyan-400">Restaurant</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage menus, orders, QR codes & analytics — all from one dashboard.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {inputs.map((input) => (
                <FormField
                  key={input.name}
                  input={input}
                  value={formData[input.name]}
                  onChange={handleChange}
                  states={states}
                  cities={cities}
                  usernameStatus={usernameStatus}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  passwordRules={passwordRules}
                  passwordStrengthLabel={passwordStrengthLabel}
                  isConfirmValid={isConfirmValid}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={disableSubmit}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${
                  disableSubmit
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600"
                }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already registered?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT CONFIG ================= */
const inputs = [
  { label: "Username", name: "username", icon: <User size={16} />, type: "text" },
  { label: "Restaurant Name", name: "restaurantName", icon: <Building2 size={16} />, type: "text" },
  { label: "Owner Name", name: "ownerName", icon: <User size={16} />, type: "text" },
  { label: "Email", name: "email", icon: <Mail size={16} />, type: "email" },
  { label: "Phone", name: "phone", icon: <Phone size={16} />, type: "text" },
  { label: "State", name: "state", icon: <MapPin size={16} />, type: "select" },
  { label: "City", name: "city", icon: <MapPin size={16} />, type: "select" },
  { label: "Pincode", name: "pincode", icon: <MapPin size={16} />, type: "text" },
  { label: "Restaurant Type", name: "restaurantType", icon: <Building2 size={16} />, type: "select" },
  { label: "Password", name: "password", icon: <Lock size={16} />, type: "password" },
  { label: "Confirm Password", name: "confirmPassword", icon: <Lock size={16} />, type: "confirm" },
];

/* ================= FORM FIELD ================= */
function FormField({
  input,
  value,
  onChange,
  states,
  cities,
  usernameStatus,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordRules,
  passwordStrengthLabel,
  isConfirmValid,
}) {
  const { label, name, type, icon } = input;
  const isPassword = name === "password";
  const isConfirm = name === "confirmPassword";

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-cyan-500"
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
            ["Cafe", "Fast Food", "Fine Dining", "Cloud Kitchen", "Bakery", "Other"].map(
              (t) => <option key={t}>{t}</option>
            )}
        </select>
      ) : (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>

          <input
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : isConfirm
                ? showConfirmPassword
                  ? "text"
                  : "password"
                : type
            }
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-black border border-gray-700 rounded-lg px-9 py-2 text-sm focus:border-cyan-500"
          />

          {(isPassword || isConfirm) && (
            <button
              type="button"
              onClick={() =>
                isPassword
                  ? setShowPassword(!showPassword)
                  : setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {(isPassword && showPassword) ||
              (isConfirm && showConfirmPassword) ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          )}
        </div>
      )}

      {name === "username" && (
        <p className="text-xs">
          {usernameStatus === "checking" && <span className="text-gray-400">Checking…</span>}
          {usernameStatus === "available" && <span className="text-green-400">✔ Available</span>}
          {usernameStatus === "taken" && <span className="text-red-400">✖ Taken</span>}
        </p>
      )}

      {isPassword && value && (
        <div className="mt-2 text-xs space-y-1">
          <p className="text-gray-400">
            Strength:{" "}
            <span
              className={
                passwordStrengthLabel === "Strong"
                  ? "text-green-400"
                  : passwordStrengthLabel === "Good"
                  ? "text-blue-400"
                  : passwordStrengthLabel === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {passwordStrengthLabel}
            </span>
          </p>

          {[
            ["8+ characters", passwordRules.length],
            ["Uppercase letter", passwordRules.uppercase],
            ["Lowercase letter", passwordRules.lowercase],
            ["Number", passwordRules.number],
          ].map(([text, ok]) => (
            <div key={text} className="flex items-center gap-2">
              {ok ? (
                <CheckCircle size={14} className="text-green-400" />
              ) : (
                <XCircle size={14} className="text-gray-500" />
              )}
              <span className={ok ? "text-green-400" : "text-gray-400"}>
                {text}
              </span>
            </div>
          ))}
        </div>
      )}

      {isConfirm && value && (
        <p className={`text-xs ${isConfirmValid ? "text-green-400" : "text-red-400"}`}>
          {isConfirmValid ? "Passwords match" : "Passwords do not match"}
        </p>
      )}
    </div>
  );
}
