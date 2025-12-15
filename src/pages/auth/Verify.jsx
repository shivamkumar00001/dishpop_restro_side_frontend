import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP");

    setLoading(true);
    try {
     const res = await axios.post(
  "http://localhost:5001/api/auth/verify-forgot-otp", // corrected endpoint
  { email, otp },
  { withCredentials: true }
);

      toast.success(res.data.message || "OTP verified!");
      navigate("/reset-password", { state: { email, otp } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Verify OTP 🔐
        </h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP sent to email"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
