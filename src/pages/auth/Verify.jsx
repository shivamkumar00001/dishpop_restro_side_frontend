import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { KeyRound, ArrowRight, Sparkles, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

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

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Invalid session");
      return;
    }

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- SUBTLE FILM GRAIN --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Ambient Gradient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[140px]" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-full shadow-sm flex items-center gap-8 transition-all hover:bg-white">
          <Link to="/" className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" /> DISHPOP
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          </div>
          <Link 
            to="/login"
            className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT - INFO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase w-fit">
              <Sparkles className="w-3 h-3" />
              Verification
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Verify Your <br />
              <GradientText>Identity</GradientText>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              We've sent a one-time password to your email. Enter it below to verify your identity and proceed with password reset.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Check Your Email</div>
                  <div className="text-sm text-slate-500">OTP sent to {email || "your email"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Secure Verification</div>
                  <div className="text-sm text-slate-500">One-time code expires in 10 minutes</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 md:p-10 shadow-xl"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-slate-500 text-sm">
                Enter the OTP sent to your email
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP INPUT */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  One-Time Password
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <KeyRound size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none tracking-widest text-center font-mono text-lg"
                    maxLength={6}
                    required
                  />
                </div>
                
                {email && (
                  <p className="text-xs text-slate-500 mt-2">
                    Code sent to: <span className="font-medium text-slate-700">{email}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`
                  w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                  ${
                    loading || otp.length !== 6
                      ? "bg-slate-300 cursor-not-allowed text-slate-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                  }
                `}
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Didn't receive the code? <span className="text-blue-600 hover:underline">Resend OTP</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-center text-slate-600 text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
            >
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Security Tip:</strong> Never share your OTP with anyone. 
                Our team will never ask for your verification code.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;