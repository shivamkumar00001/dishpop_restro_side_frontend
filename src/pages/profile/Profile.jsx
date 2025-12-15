import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  LogOut,
  Building2,
  Award,
  Star,
  UtensilsCrossed,
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ dishes: 0, rating: null });
  const navigate = useNavigate();

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.user);
        setStats(data.stats || { dishes: 0, rating: null });
      } catch {
        toast.error("Session expired");
        navigate("/login");
      }
    };
    loadProfile();
  }, [navigate]);

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B10] text-gray-400">
        Loading profile…
      </div>
    );
  }

  /* ---------------- INITIALS ---------------- */
  const initials =
    user.ownerName
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "R";

  return (
    <div className="min-h-screen bg-[#090B10] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* ================= PROFILE HEADER ================= */}
        <section className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Identity Badge */}
          <div
            className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600
            flex items-center justify-center text-4xl font-bold
            shadow-[0_20px_40px_rgba(14,165,233,0.35)] ring-1 ring-white/10"
          >
            {initials}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              {user.ownerName}
            </h1>
            <p className="text-cyan-400 text-lg font-medium">
              {user.restaurantName}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {user.city && user.state && (
                <Badge
                  icon={<MapPin size={14} />}
                  text={`${user.city}, ${user.state}`}
                />
              )}
              <Badge icon={<Award size={14} />} text="Verified Restaurant" />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <ActionButton
              label="Edit Profile"
              icon={<Edit3 size={16} />}
              onClick={() => navigate("/settings/edit")}
              variant="primary"
            />
            <ActionButton
              label="Logout"
              icon={<LogOut size={16} />}
              onClick={logout}
              variant="danger"
            />
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<UtensilsCrossed />}
            label="Dishes"
            value={stats.dishes}
          />

          <StatCard
            icon={<Star />}
            label="Rating"
            value={stats.rating ?? "—"}
          />

          <StatCard icon={<Award />} label="Plan" value="Pro" />
          <StatCard icon={<User />} label="Member Since" value="2025" />
        </section>

        {/* ================= DETAILS ================= */}
        <section
          className="rounded-2xl border border-white/10 bg-white/[0.04]
          backdrop-blur-xl shadow-xl p-8 space-y-8"
        >
          <InfoSection title="Contact Information">
            <InfoRow icon={<Mail />} value={user.email} />
            <InfoRow icon={<Phone />} value={user.phone} />
          </InfoSection>

          <Divider />

          <InfoSection title="Business Details">
            <InfoRow icon={<Building2 />} value={user.restaurantName} />
            <InfoRow icon={<MapPin />} value={`${user.city}, ${user.state}`} />
            {user.pincode && (
              <InfoRow value={`Pincode: ${user.pincode}`} />
            )}
          </InfoSection>

          {user.description && (
            <>
              <Divider />
              <InfoSection title="About Restaurant">
                <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                  {user.description}
                </p>
              </InfoSection>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Badge({ icon, text }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full
    border border-white/10 bg-white/5 px-3 py-1.5
    text-xs text-gray-300">
      <span className="text-cyan-400">{icon}</span>
      {text}
    </span>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04]
    py-6 px-4 text-center shadow hover:bg-white/[0.06] transition">
      <div className="flex justify-center text-cyan-400 mb-2">{icon}</div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-300">
      {icon && <span className="text-cyan-400">{icon}</span>}
      <span>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/10" />;
}

function ActionButton({ label, icon, onClick, variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5";

  const styles = {
    primary: "bg-cyan-600 hover:bg-cyan-700 shadow shadow-cyan-500/30",
    danger: "bg-red-600 hover:bg-red-700 shadow shadow-red-500/30",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {icon}
      {label}
    </button>
  );
}
