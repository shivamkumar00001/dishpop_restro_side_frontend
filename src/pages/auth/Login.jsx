// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { toast } from "react-hot-toast";
// import api from "../../services/api";
// import { useAuth } from "../../context/AuthContext";

// /* =========================
//    INPUT FIELD
// ========================= */
// const InputField = ({
//   icon: Icon,
//   type,
//   name,
//   placeholder,
//   value,
//   onChange,
//   error,
//   showToggle = false,
// }) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const actualType =
//     type === "password" && showToggle
//       ? showPassword
//         ? "text"
//         : "password"
//       : type;

//   return (
//     <div className="space-y-1">
//       <div
//         className={`
//           flex items-center gap-3 px-4 py-3 rounded-xl
//           bg-black border transition-all
//           ${error ? "border-red-500" : "border-gray-700"}
//           focus-within:border-cyan-500
//         `}
//       >
//         <Icon size={18} className="text-gray-400" />

//         <input
//           type={actualType}
//           name={name}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none"
//           autoComplete={name}
//         />

//         {type === "password" && showToggle && (
//           <button
//             type="button"
//             onClick={() => setShowPassword((p) => !p)}
//             className="text-gray-400 hover:text-cyan-400 transition"
//             aria-label={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         )}
//       </div>

//       {error && <p className="text-red-400 text-xs">{error}</p>}
//     </div>
//   );
// };

// /* =========================
//    LOGIN PAGE
// ========================= */
// export default function Login() {
//   const navigate = useNavigate();
//   const { setOwner } = useAuth();

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({
//     identifier: "",
//     password: "",
//     general: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
//     setErrors((p) => ({ ...p, [e.target.name]: "", general: "" }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const newErrors = {};
//   //   if (!formData.identifier.trim())
//   //     newErrors.identifier = "Email or Username required";
//   //   if (!formData.password.trim())
//   //     newErrors.password = "Password required";

//   //   if (Object.keys(newErrors).length) {
//   //     setErrors((p) => ({ ...p, ...newErrors }));
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const res = await api.post("/auth/login", formData);
//   //     toast.success(res.data.message || "Welcome back!");

//   //     const me = await api.get("/auth/me");
//   //     setOwner(me.data.user);

//   //     const username = me.data.user?.username;
//   //     if (!username) throw new Error("Username missing");

//   //     localStorage.setItem("username", username);

//   //     let redirect = localStorage.getItem("redirectAfterLogin");
//   //     if (redirect) {
//   //       localStorage.removeItem("redirectAfterLogin");
//   //       if (!redirect.startsWith(`/${username}`)) {
//   //         redirect = `/${username}${redirect}`;
//   //       }
//   //       navigate(redirect, { replace: true });
//   //       return;
//   //     }

//   //     navigate(`/${username}/dashboard`, { replace: true });
//   //   } catch (err) {
//   //     const msg = err.response?.data?.message || "Login failed";
//   //     setErrors((p) => ({ ...p, general: msg }));
//   //     toast.error(msg);
//   //     setFormData((p) => ({ ...p, password: "" }));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const newErrors = {};
//   if (!formData.identifier.trim())
//     newErrors.identifier = "Email or Username required";
//   if (!formData.password.trim())
//     newErrors.password = "Password required";

//   if (Object.keys(newErrors).length) {
//     setErrors((p) => ({ ...p, ...newErrors }));
//     return;
//   }

//   try {
//     setLoading(true);

//     // ✅ 1️⃣ Login (cookies are set by backend)
//     const res = await api.post("/auth/login", formData);

//     toast.success(res.data.message || "Welcome back!");

//     // ✅ 2️⃣ Use user from login response (NO /auth/me here)
//     const user = res.data.user;
//     if (!user?.username) {
//       throw new Error("Invalid login response");
//     }

//     setOwner(user);

//     localStorage.setItem("username", user.username);

//     // ✅ 3️⃣ Redirect
//     let redirect = localStorage.getItem("redirectAfterLogin");
//     if (redirect) {
//       localStorage.removeItem("redirectAfterLogin");
//       if (!redirect.startsWith(`/${user.username}`)) {
//         redirect = `/${user.username}${redirect}`;
//       }
//       navigate(redirect, { replace: true });
//       return;
//     }

//     navigate(`/${user.username}/dashboard`, { replace: true });

//   } catch (err) {
//     const msg = err.response?.data?.message || "Login failed";
//     setErrors((p) => ({ ...p, general: msg }));
//     toast.error(msg);
//     setFormData((p) => ({ ...p, password: "" }));
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
//       {/* Ambient Glow */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
//         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
//       </div>

//       <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-10 shadow-2xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold">
//             Welcome back to <span className="text-cyan-400">DishPop</span>
//           </h1>
//           <p className="text-gray-400 text-sm mt-2">
//             Sign in to manage your restaurant
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <InputField
//             icon={Mail}
//             type="text"
//             name="identifier"
//             placeholder="Email or Username"
//             value={formData.identifier}
//             onChange={handleChange}
//             error={errors.identifier}
//           />

//           <InputField
//             icon={Lock}
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             error={errors.password}
//             showToggle
//           />

//           {errors.general && (
//             <p className="text-red-400 text-xs text-center">
//               {errors.general}
//             </p>
//           )}

//           <div className="text-right">
//             <Link
//               to="/forget-password"
//               className="text-xs text-gray-400 hover:text-cyan-400 transition"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`
//               w-full py-3 rounded-xl font-semibold transition-all
//               ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-cyan-500 hover:bg-cyan-600"
//               }
//             `}
//           >
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>

//         <p className="text-center text-gray-400 text-xs mt-6">
//           New to DishPop?{" "}
//           <Link to="/register" className="text-cyan-400 hover:underline">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

/* =========================
   INPUT FIELD
========================= */
const InputField = ({
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  showToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const actualType =
    type === "password" && showToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-1.5">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          bg-white border transition-all
          ${error ? "border-red-500 ring-2 ring-red-100" : "border-slate-200"}
          focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100
        `}
      >
        <Icon size={18} className="text-slate-400" />

        <input
          type={actualType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none"
          autoComplete={name}
        />

        {type === "password" && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-slate-400 hover:text-blue-600 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-xs ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* =========================
   LOGIN PAGE
========================= */
export default function Login() {
  const navigate = useNavigate();
  const { setOwner } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "", general: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.identifier.trim())
      newErrors.identifier = "Email or Username required";
    if (!formData.password.trim())
      newErrors.password = "Password required";

    if (Object.keys(newErrors).length) {
      setErrors((p) => ({ ...p, ...newErrors }));
      return;
    }

    try {
      setLoading(true);

      // ✅ 1️⃣ Login (cookies are set by backend)
      const res = await api.post("/auth/login", formData);

      toast.success(res.data.message || "Welcome back!");

      // ✅ 2️⃣ Use user from login response (NO /auth/me here)
      const user = res.data.user;
      if (!user?.username) {
        throw new Error("Invalid login response");
      }

      setOwner(user);

      localStorage.setItem("username", user.username);

      // ✅ 3️⃣ Redirect
      let redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        if (!redirect.startsWith(`/${user.username}`)) {
          redirect = `/${user.username}${redirect}`;
        }
        navigate(redirect, { replace: true });
        return;
      }

      navigate(`/${user.username}/dashboard`, { replace: true });

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setErrors((p) => ({ ...p, general: msg }));
      toast.error(msg);
      setFormData((p) => ({ ...p, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- SUBTLE FILM GRAIN --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Ambient Gradient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[140px]" />
      </div>

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
            to="/register"
            className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600"
          >
            Register
          </Link>
        </div>
      </nav>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT - INFO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase w-fit">
              <Sparkles className="w-3 h-3" />
              Welcome Back
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Sign in to <br />
              <GradientText>DishPop</GradientText>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Access your restaurant dashboard and manage everything from menus to analytics in one place.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Quick Access</div>
                  <div className="text-sm text-slate-500">Manage your restaurant instantly</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Secure Platform</div>
                  <div className="text-sm text-slate-500">Your data is encrypted & protected</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 md:p-10 shadow-xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in to manage your restaurant
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                icon={Mail}
                type="text"
                name="identifier"
                placeholder="Email or Username"
                value={formData.identifier}
                onChange={handleChange}
                error={errors.identifier}
              />

              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                showToggle
              />

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <p className="text-red-700 text-sm font-medium text-center">
                    {errors.general}
                  </p>
                </motion.div>
              )}

              <div className="text-right">
                <Link
                  to="/forget-password"
                  className="text-xs text-slate-500 hover:text-blue-600 transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                  ${
                    loading
                      ? "bg-slate-300 cursor-not-allowed text-slate-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                  }
                `}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-center text-slate-600 text-sm">
                New to DishPop?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}