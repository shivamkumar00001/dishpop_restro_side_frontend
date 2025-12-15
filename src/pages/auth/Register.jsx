import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, Building2 } from "lucide-react";
import { State, City } from "country-state-city";

export default function Register() {
  const navigate = useNavigate();

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
  const [cityOptions, setCityOptions] = useState([]);

  const [usernameMsg, setUsernameMsg] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Load states
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  // Username check debounce
  useEffect(() => {
    if (!formData.username.trim()) {
      setUsernameMsg("");
      return;
    }
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const checkUsername = async () => {
    const username = formData.username.trim();
    if (!username) return;

    setCheckingUsername(true);
    setUsernameMsg("");

    try {
      const { data } = await axios.get(
        `http://localhost:5001/api/auth/check-username?username=${username}`
      );

      if (data.available) setUsernameMsg("available");
      else {
        setUsernameMsg("taken");
        setErrors((prev) => ({
          ...prev,
          username: "Username already taken",
        }));
      }
    } catch {
      setUsernameMsg("error");
    } finally {
      setCheckingUsername(false);
    }
  };

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const pwd = formData.password;
    if (!pwd) return setPasswordStrength("");

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[@$!%*?&#]/.test(pwd)) score++;
    if (pwd.length >= 12) score++;

    if (score <= 1) setPasswordStrength("weak");
    else if (score === 2) setPasswordStrength("medium");
    else if (score === 3) setPasswordStrength("strong");
    else setPasswordStrength("very-strong");
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Username cleanup
    if (name === "username") {
      const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, "");
      setFormData((prev) => ({ ...prev, username: cleaned }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // State → load cities dynamically
    if (name === "state") {
      const cities = City.getCitiesOfState("IN", value);
      setCityOptions(cities);
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (usernameMsg === "taken") {
      toast.error("Username already taken.");
      return;
    }

    const newErrors = {};
    const payload = { ...formData };

    // Required fields
    Object.entries(payload).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });

    if (payload.password !== payload.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!payload.state) newErrors.state = "Choose a state";
    if (!payload.city) newErrors.city = "Choose a city";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5001/api/auth/register",
        payload,
        { withCredentials: true }
      );

      toast.success(data.message || "Registered Successfully!");
      navigate("/login");
    } catch (err) {
      const res = err.response?.data;

      if (res?.message) return toast.error(res.message);
      if (res?.error) return toast.error(res.error);

      if (res?.errors) {
        const firstError = Object.values(res.errors)[0];
        toast.error(firstError);
        setErrors(res.errors);
        return;
      }

      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">

      {/* BG Lights */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-80 w-80 rounded-full bg-[#4f46e5]/20 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#22c55e]/10 blur-[110px]" />
      </div>

      <div className="w-full max-w-5xl rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_24px_120px_rgba(0,0,0,0.75)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT PANEL */}
          <LeftPanel />

          {/* RIGHT PANEL */}
          <div className="p-7 md:p-10 bg-black/40">
            <div className="mb-6 md:hidden text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
              <p className="text-xs text-gray-400 mt-1">
                Join DishPop and connect with more customers.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-7">

              {/* TOP FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inputs.slice(0, 8).map((input, idx) => (
                  <FormField
                    key={idx}
                    input={input}
                    value={formData[input.name]}
                    error={errors[input.name]}
                    onChange={handleChange}
                    usernameMsg={usernameMsg}
                    checkingUsername={checkingUsername}
                    passwordStrength={passwordStrength}
                    states={states}
                    cityOptions={cityOptions}
                  />
                ))}
              </div>

              {/* BOTTOM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inputs.slice(8).map((input, idx) => (
                  <FormField
                    key={idx}
                    input={input}
                    value={formData[input.name]}
                    error={errors[input.name]}
                    onChange={handleChange}
                    passwordStrength={passwordStrength}
                    cityOptions={cityOptions}
                    states={states}
                  />
                ))}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white text-black text-sm font-semibold py-3.5 hover:bg-gray-100 transition-all"
              >
                {loading ? "Creating your account..." : "Create account"}
              </button>

              <p className="text-center text-[11px] text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-gray-100 underline">
                  Log in
                </Link>
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

/* LEFT PANEL COMPONENT */
function LeftPanel() {
  return (
    <div className="relative hidden md:flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/0 p-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] tracking-wide text-gray-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          DishPop for Restaurants
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Grow your restaurant
          <span className="block text-sm font-normal text-gray-400 mt-3">
            Manage orders, visibility & customers with one elegant dashboard.
          </span>
        </h1>
      </div>

      <div className="space-y-3 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>Trusted by restaurant owners</span>
          <span className="text-gray-300 font-medium">India · 2025</span>
        </div>
        <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
        <p className="text-[11px] leading-relaxed">
          Secure onboarding, verified profiles, and premium tools tailored for modern dining brands.
        </p>
      </div>
    </div>
  );
}

/* INPUT CONFIG */
const inputs = [
  { label: "Username", name: "username", icon: <User size={16} />, type: "text" },
  { label: "Restaurant name", name: "restaurantName", icon: <Building2 size={16} />, type: "text" },
  { label: "Owner name", name: "ownerName", icon: <User size={16} />, type: "text" },
  { label: "Email address", name: "email", icon: <Mail size={16} />, type: "email" },
  { label: "Phone number", name: "phone", icon: <Phone size={16} />, type: "text" },

  { label: "State", name: "state", icon: <MapPin size={16} />, type: "select" },
  { label: "City", name: "city", icon: <MapPin size={16} />, type: "select" },

  { label: "Pincode", name: "pincode", icon: <MapPin size={16} />, type: "text" },

  {
    label: "Restaurant type",
    name: "restaurantType",
    icon: <Building2 size={16} />,
    type: "select",
    options: ["Restaurant", "Cafe", "Bakery", "Cloud Kitchen"],
  },

  { label: "Password", name: "password", icon: <Lock size={16} />, type: "password" },
  { label: "Confirm password", name: "confirmPassword", icon: <Lock size={16} />, type: "password" },
];

/* FORM FIELD COMPONENT */
function FormField({
  input,
  value,
  onChange,
  error,
  usernameMsg,
  checkingUsername,
  passwordStrength,
  states,
  cityOptions,
}) {
  const { label, name, type, icon, options } = input;

  const baseClasses =
    "w-full bg-transparent text-[13px] text-white placeholder-gray-500 outline-none";

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      case "strong":
        return "bg-blue-500";
      case "very-strong":
        return "bg-green-500";
      default:
        return "bg-transparent";
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium text-gray-300 tracking-wide">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-white/5 px-3.5 py-2.5 border-white/10 
        ${error ? "border-red-500/80" : "focus-within:bg-white/10 focus-within:border-white/40"}`}
      >
        <span className="text-gray-400">{icon}</span>

        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseClasses} cursor-pointer`}
          >
            <option value="" className="text-black text-xs">
              Select {label.toLowerCase()}
            </option>

            {/* Dynamic states */}
            {name === "state" &&
              states?.map((s) => (
                <option key={s.isoCode} value={s.isoCode} className="text-black text-xs">
                  {s.name}
                </option>
              ))}

            {/* Dynamic cities */}
            {name === "city" &&
              cityOptions?.map((c, idx) => (
                <option key={idx} value={c.name} className="text-black text-xs">
                  {c.name}
                </option>
              ))}

            {/* Static */}
            {options &&
              name !== "state" &&
              name !== "city" &&
              options.map((opt, idx) => (
                <option key={idx} value={opt} className="text-black text-xs">
                  {opt}
                </option>
              ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={baseClasses}
            autoComplete="off"
          />
        )}
      </div>

      {/* Username availability */}
      {name === "username" && (
        <p className="text-[11px] mt-1">
          {checkingUsername && <span className="text-gray-400">Checking…</span>}
          {!checkingUsername && usernameMsg === "available" && (
            <span className="text-green-400">✔ Username available</span>
          )}
          {!checkingUsername && usernameMsg === "taken" && (
            <span className="text-red-500">✖ Username taken</span>
          )}
        </p>
      )}

      {/* Password strength */}
      {name === "password" && passwordStrength && (
        <div className="mt-1 space-y-1">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStrengthColor()} transition-all duration-300`}
              style={{
                width:
                  passwordStrength === "weak"
                    ? "25%"
                    : passwordStrength === "medium"
                    ? "50%"
                    : passwordStrength === "strong"
                    ? "75%"
                    : "100%",
              }}
            />
          </div>
          <p className="text-[11px] text-gray-300">
            Password Strength: <span className="font-medium">{passwordStrength}</span>
          </p>
        </div>
      )}

      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
