import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import api from "../../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Invalid or expired reset session");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });

      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Choose a new secure password
        </p>

        <form onSubmit={handleReset} className="space-y-6">
          {/* NEW PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">New Password</label>
            <div className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-black border border-gray-700 focus-within:border-cyan-500 transition">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                required
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">Confirm Password</label>
            <div className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-black border border-gray-700 focus-within:border-cyan-500 transition">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                required
              />
            </div>
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
