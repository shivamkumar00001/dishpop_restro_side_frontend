import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message || "OTP sent to your email!");
      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-neutral-800">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Forgot Password 🔐
        </h2>
        <form onSubmit={handleForgot} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
