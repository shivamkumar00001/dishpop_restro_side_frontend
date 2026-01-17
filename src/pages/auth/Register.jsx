 
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Lock,
//   Building2,
//   Eye,
//   EyeOff,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { State, City } from "country-state-city";
// import api from "../../services/api";

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

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   /* ================= LOAD STATES ================= */
//   useEffect(() => {
//     setStates(State.getStatesOfCountry("IN"));
//   }, []);

//   /* ================= USERNAME CHECK ================= */
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

//   /* ================= PASSWORD RULES ================= */
//   const passwordRules = {
//     length: formData.password.length >= 8,
//     uppercase: /[A-Z]/.test(formData.password),
//     lowercase: /[a-z]/.test(formData.password),
//     number: /\d/.test(formData.password),
//   };

//   const passwordStrengthCount = Object.values(passwordRules).filter(Boolean)
//     .length;

//   const passwordStrengthLabel =
//     passwordStrengthCount <= 1
//       ? "Weak"
//       : passwordStrengthCount === 2
//       ? "Medium"
//       : passwordStrengthCount === 3
//       ? "Good"
//       : "Strong";

//   const isPasswordValid = passwordStrengthCount === 4;
//   const isConfirmValid =
//     formData.password &&
//     formData.confirmPassword &&
//     formData.password === formData.confirmPassword;

//   /* ================= HANDLE CHANGE ================= */
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
//     setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isPasswordValid) {
//       toast.error(
//         "Password must be 8+ characters with uppercase, lowercase & number"
//       );
//       return;
//     }

//     if (!isConfirmValid) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (usernameStatus === "taken") {
//       toast.error("Username already taken");
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

//   const disableSubmit =
//     loading ||
//     !isPasswordValid ||
//     !isConfirmValid ||
//     usernameStatus === "taken";

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
//       <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10">
//         {/* LEFT */}
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
//                   states={states}
//                   cities={cities}
//                   usernameStatus={usernameStatus}
//                   showPassword={showPassword}
//                   setShowPassword={setShowPassword}
//                   showConfirmPassword={showConfirmPassword}
//                   setShowConfirmPassword={setShowConfirmPassword}
//                   passwordRules={passwordRules}
//                   passwordStrengthLabel={passwordStrengthLabel}
//                   isConfirmValid={isConfirmValid}
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={disableSubmit}
//               className={`w-full py-3 rounded-lg font-semibold transition
//                 ${
//                   disableSubmit
//                     ? "bg-gray-600 cursor-not-allowed"
//                     : "bg-cyan-500 hover:bg-cyan-600"
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

// /* ================= INPUT CONFIG ================= */
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
//   { label: "Confirm Password", name: "confirmPassword", icon: <Lock size={16} />, type: "confirm" },
// ];

// /* ================= FORM FIELD ================= */
// function FormField({
//   input,
//   value,
//   onChange,
//   states,
//   cities,
//   usernameStatus,
//   showPassword,
//   setShowPassword,
//   showConfirmPassword,
//   setShowConfirmPassword,
//   passwordRules,
//   passwordStrengthLabel,
//   isConfirmValid,
// }) {
//   const { label, name, type, icon } = input;
//   const isPassword = name === "password";
//   const isConfirm = name === "confirmPassword";

//   return (
//     <div className="space-y-1">
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
//             type={
//               isPassword
//                 ? showPassword
//                   ? "text"
//                   : "password"
//                 : isConfirm
//                 ? showConfirmPassword
//                   ? "text"
//                   : "password"
//                 : type
//             }
//             name={name}
//             value={value}
//             onChange={onChange}
//             className="w-full bg-black border border-gray-700 rounded-lg px-9 py-2 text-sm focus:border-cyan-500"
//           />

//           {(isPassword || isConfirm) && (
//             <button
//               type="button"
//               onClick={() =>
//                 isPassword
//                   ? setShowPassword(!showPassword)
//                   : setShowConfirmPassword(!showConfirmPassword)
//               }
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             >
//               {(isPassword && showPassword) ||
//               (isConfirm && showConfirmPassword) ? (
//                 <EyeOff size={16} />
//               ) : (
//                 <Eye size={16} />
//               )}
//             </button>
//           )}
//         </div>
//       )}

//       {name === "username" && (
//         <p className="text-xs">
//           {usernameStatus === "checking" && <span className="text-gray-400">Checking…</span>}
//           {usernameStatus === "available" && <span className="text-green-400">✔ Available</span>}
//           {usernameStatus === "taken" && <span className="text-red-400">✖ Taken</span>}
//         </p>
//       )}

//       {isPassword && value && (
//         <div className="mt-2 text-xs space-y-1">
//           <p className="text-gray-400">
//             Strength:{" "}
//             <span
//               className={
//                 passwordStrengthLabel === "Strong"
//                   ? "text-green-400"
//                   : passwordStrengthLabel === "Good"
//                   ? "text-blue-400"
//                   : passwordStrengthLabel === "Medium"
//                   ? "text-yellow-400"
//                   : "text-red-400"
//               }
//             >
//               {passwordStrengthLabel}
//             </span>
//           </p>

//           {[
//             ["8+ characters", passwordRules.length],
//             ["Uppercase letter", passwordRules.uppercase],
//             ["Lowercase letter", passwordRules.lowercase],
//             ["Number", passwordRules.number],
//           ].map(([text, ok]) => (
//             <div key={text} className="flex items-center gap-2">
//               {ok ? (
//                 <CheckCircle size={14} className="text-green-400" />
//               ) : (
//                 <XCircle size={14} className="text-gray-500" />
//               )}
//               <span className={ok ? "text-green-400" : "text-gray-400"}>
//                 {text}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}

//       {isConfirm && value && (
//         <p className={`text-xs ${isConfirmValid ? "text-green-400" : "text-red-400"}`}>
//           {isConfirmValid ? "Passwords match" : "Passwords do not match"}
//         </p>
//       )}
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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { State, City } from "country-state-city";
import { motion } from "framer-motion";
import api from "../../services/api";

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- SUBTLE FILM GRAIN --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-full shadow-sm flex items-center gap-8 transition-all hover:bg-white">
          <Link to="/" className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" /> DISHPOP
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          </div>
          <Link 
            to="/login"
            className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT - INFO */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col justify-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase w-fit">
              <Sparkles className="w-3 h-3" />
              Get Started
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Register your <br />
              <GradientText>Restaurant</GradientText>
            </h1>
            
            <p className="text-slate-600 text-lg leading-relaxed">
              Manage menus, orders, QR codes & analytics — all from one intuitive dashboard.
            </p>

            <div className="space-y-3 pt-4">
              {[
                "AR Menu Visualization",
                "Real-time Analytics",
                "Order Management",
                "QR Code Generation"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">Create Account</h2>
            <p className="text-slate-500 text-sm mb-6">Fill in your details to get started</p>

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
                className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                  ${
                    disableSubmit
                      ? "bg-slate-300 cursor-not-allowed text-slate-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                  }`}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already registered?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </motion.div>
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
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-700">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          {(isPassword || isConfirm) && (
            <button
              type="button"
              onClick={() =>
                isPassword
                  ? setShowPassword(!showPassword)
                  : setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
        <p className="text-xs mt-1">
          {usernameStatus === "checking" && <span className="text-slate-500">Checking…</span>}
          {usernameStatus === "available" && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Available</span>}
          {usernameStatus === "taken" && <span className="text-red-600 flex items-center gap-1"><XCircle size={12} /> Taken</span>}
        </p>
      )}

      {isPassword && value && (
        <div className="mt-2 text-xs space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-slate-600">
            Strength:{" "}
            <span
              className={`font-semibold ${
                passwordStrengthLabel === "Strong"
                  ? "text-green-600"
                  : passwordStrengthLabel === "Good"
                  ? "text-blue-600"
                  : passwordStrengthLabel === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
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
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <XCircle size={14} className="text-slate-300" />
              )}
              <span className={ok ? "text-green-600" : "text-slate-500"}>
                {text}
              </span>
            </div>
          ))}
        </div>
      )}

      {isConfirm && value && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${isConfirmValid ? "text-green-600" : "text-red-600"}`}>
          {isConfirmValid ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {isConfirmValid ? "Passwords match" : "Passwords do not match"}
        </p>
      )}
    </div>
  );
}