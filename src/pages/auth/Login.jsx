import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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
    <div className="space-y-1">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          bg-black border transition-all
          ${error ? "border-red-500" : "border-gray-700"}
          focus-within:border-cyan-500
        `}
      >
        <Icon size={18} className="text-gray-400" />

        <input
          type={actualType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none"
          autoComplete={name}
        />

        {type === "password" && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-gray-400 hover:text-cyan-400 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
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

  //     const res = await api.post("/auth/login", formData);
  //     toast.success(res.data.message || "Welcome back!");

  //     const me = await api.get("/auth/me");
  //     setOwner(me.data.user);

  //     const username = me.data.user?.username;
  //     if (!username) throw new Error("Username missing");

  //     localStorage.setItem("username", username);

  //     let redirect = localStorage.getItem("redirectAfterLogin");
  //     if (redirect) {
  //       localStorage.removeItem("redirectAfterLogin");
  //       if (!redirect.startsWith(`/${username}`)) {
  //         redirect = `/${username}${redirect}`;
  //       }
  //       navigate(redirect, { replace: true });
  //       return;
  //     }

  //     navigate(`/${username}/dashboard`, { replace: true });
  //   } catch (err) {
  //     const msg = err.response?.data?.message || "Login failed";
  //     setErrors((p) => ({ ...p, general: msg }));
  //     toast.error(msg);
  //     setFormData((p) => ({ ...p, password: "" }));
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back to <span className="text-cyan-400">DishPop</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sign in to manage your restaurant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-red-400 text-xs text-center">
              {errors.general}
            </p>
          )}

          <div className="text-right">
            <Link
              to="/forget-password"
              className="text-xs text-gray-400 hover:text-cyan-400 transition"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-xl font-semibold transition-all
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }
            `}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          New to DishPop?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
