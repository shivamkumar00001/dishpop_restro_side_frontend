import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../services/api";

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, error }) => (
  <div className="space-y-1">
    <div
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border
        ${error ? "border-red-500" : "border-white/10"}
        focus-within:border-white/40 focus-within:bg-white/10
        transition-all duration-200
      `}
    >
      <Icon size={18} className="text-gray-300" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none"
        autoComplete={name}
      />
    </div>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({ identifier: "", password: "", general: "" });

    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = "Email or Username required";
    if (!formData.password.trim()) newErrors.password = "Password required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    setLoading(true);

    try {
      // const res = await api.post("/auth/login", formData, { withCredentials: true });
 const res = await api.post("/auth/login", formData, { withCredentials: true });


      toast.success(res.data.message || "Welcome back!");

      const username = res.data.user?.username;

      if (!username) {
        toast.error("Unexpected error: username missing");
        return;
      }

      localStorage.setItem("username", username);

      // Redirect from protected route
      let redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");

        if (!redirect.startsWith(`/${username}`)) {
          redirect = `/${username}${redirect}`;
        }

        navigate(redirect, { replace: true });
        return;
      }

      // DEFAULT REDIRECT
      navigate(`/${username}/dashboard`, { replace: true });

    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const backendMessage = err.response?.data?.message;

      if (backendErrors) {
        setErrors(prev => ({ ...prev, ...backendErrors }));
      } else if (backendMessage) {
        setErrors(prev => ({ ...prev, general: backendMessage }));
      }

      toast.error(backendMessage || "Login failed");
      setFormData(prev => ({ ...prev, password: "" }));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050509] text-white px-4">

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-72 w-72 rounded-full bg-[#4f46e5]/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#22c55e]/10 blur-[110px]" />
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[28px] shadow-[0_24px_120px_rgba(0,0,0,0.8)] p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-xs text-gray-400 mt-1">Login to continue</p>
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
          />

          {errors.general && (
            <p className="text-red-500 text-xs text-center">{errors.general}</p>
          )}

          <div className="text-right">
            <Link to="/forget" className="text-[11px] text-gray-300 hover:text-white">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-2xl text-sm font-semibold bg-white text-black
              border border-white/10
              hover:bg-[#f2f2f2] hover:border-white/30
              active:scale-[0.99]
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-[11px] mt-6">
          New to DishPop?{" "}
          <Link
            to="/register"
            className="text-gray-100 underline underline-offset-2 decoration-white/30 hover:decoration-white"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
