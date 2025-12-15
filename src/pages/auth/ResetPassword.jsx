import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

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
    if (password !== confirmPassword) return toast.error("Passwords do not match!");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/reset-password",
        { email, otp, password, confirmPassword },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password reset successfully!");
      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Reset Your Password 🔐
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
