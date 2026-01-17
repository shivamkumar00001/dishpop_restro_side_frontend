import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", { email });

      toast.success(data.message || "OTP sent to your email!");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
              Account Recovery
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Reset Your <br />
              <GradientText>Password</GradientText>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Don't worry! It happens. We'll send you a secure OTP to reset your password and get you back on track.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Secure Process</div>
                  <div className="text-sm text-slate-500">Industry-standard encryption</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Quick Recovery</div>
                  <div className="text-sm text-slate-500">Get back in minutes</div>
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
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-slate-500 text-sm">
                We'll send an OTP to reset your password
              </p>
            </div>

            <form onSubmit={handleForgot} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Email Address
                </label>

                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2
                  ${
                    loading
                      ? "bg-slate-300 cursor-not-allowed text-slate-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                  }
                `}
              >
                {loading ? (
                  "Sending OTP..."
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

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
                <strong className="text-slate-900">Note:</strong> The OTP will be valid for 10 minutes. 
                If you don't receive it, please check your spam folder.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;