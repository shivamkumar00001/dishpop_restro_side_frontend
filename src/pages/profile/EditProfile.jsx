import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  User,
  Phone,
  MapPin,
  Save,
  Building2,
  UtensilsCrossed,
} from "lucide-react";

import { State, City } from "country-state-city";

export default function EditProfile() {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile", form);
      toast.success("Profile updated successfully");
      navigate("/settings");
    } catch {
      toast.error("Update failed");
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
        <section className="rounded-2xl border border-white/10 bg-white/[0.04]
        backdrop-blur-xl shadow-xl">

          {/* Card Header */}
          <div className="border-b border-white/10 px-8 py-6">
            <p className="text-lg font-medium">{form.restaurantName}</p>
            <p className="text-sm text-gray-400">Owned by {form.ownerName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">

            {/* Basic Info */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Restaurant Name" icon={<Building2 />} name="restaurantName" value={form.restaurantName} onChange={handleChange} />
                <Field label="Owner Name" icon={<User />} name="ownerName" value={form.ownerName} onChange={handleChange} />
                <Field label="Phone" icon={<Phone />} name="phone" value={form.phone} onChange={handleChange} />
                <Field label="Restaurant Type" icon={<UtensilsCrossed />} name="restaurantType" value={form.restaurantType} onChange={handleChange} />
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
                  options={states.map((s) => ({ label: s.name, value: s.isoCode }))}
                />
                <Dropdown
                  label="City"
                  icon={<MapPin />}
                  name="city"
                  value={form.city}
                  disabled={!form.state}
                  onChange={handleChange}
                  options={cities.map((c) => ({ label: c.name, value: c.name }))}
                />
                <Field label="Pincode" icon={<MapPin />} name="pincode" value={form.pincode} onChange={handleChange} />
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
                className="flex items-center gap-2 rounded-xl bg-cyan-600
                px-6 py-3 font-medium hover:bg-cyan-700 transition
                shadow-lg shadow-cyan-500/25"
              >
                <Save size={18} />
                Save Changes
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
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.04]
      border border-white/10 px-4 py-3 focus-within:border-cyan-500">
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
      <div className={`flex items-center gap-3 rounded-xl bg-white/[0.04]
      border border-white/10 px-4 py-3 ${disabled && "opacity-40"}`}>
        {icon}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-white"
        >
          <option value="" className="text-black">Select {label}</option>
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
