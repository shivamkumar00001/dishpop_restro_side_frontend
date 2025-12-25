import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { KeyRound } from "lucide-react";
import api from "../../services/api";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Invalid or expired session");
      return;
    }

    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-forgot-otp", {
        email,
        otp,
      });

      toast.success(data.message || "OTP verified!");
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
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
          Verify OTP
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP INPUT */}
          <div>
            <label className="text-xs text-gray-400">OTP</label>
            <div className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-black border border-gray-700 focus-within:border-cyan-500 transition">
              <KeyRound size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-transparent text-white text-sm placeholder-gray-500 outline-none tracking-widest"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
