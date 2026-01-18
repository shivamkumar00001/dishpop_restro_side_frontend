import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { gsap } from "gsap";

const MagneticButton = ({ children, className, onClick, variant = "primary" }) => {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(currentTarget, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  const baseStyles = "relative z-10 px-8 py-3 rounded-xl font-bold transition-all duration-300 border border-transparent";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-white border border-slate-200 text-blue-600 hover:border-blue-500 hover:bg-blue-50",
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default function NotFound() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        if (data?.user?.username) {
          setUsername(data.user.username);
        }
      } catch {
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleGoBack = () => {
    if (username) {
      navigate(`/${username}/dashboard`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      
      {/* Subtle Film Grain */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Animated 404 Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Pulsing Background Circle */}
            <motion.div
              className="absolute inset-0 bg-blue-600/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Icon Container */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            404
          </h1>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Page Not Found
            </h2>
            <p className="text-slate-500 text-lg max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off the menu.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton
            onClick={handleGoBack}
            variant="primary"
          >
            <Home className="w-5 h-5 inline mr-2" />
            {loading ? 'Loading...' : username ? 'Go to Dashboard' : 'Go to Home'}
          </MagneticButton>

          {/* <MagneticButton
            onClick={() => navigate(-1)}
            variant="secondary"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Go Back
          </MagneticButton> */}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Lost in the digital kitchen?
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-6 px-6 bg-white/80 backdrop-blur-sm border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
            <span className="font-bold text-slate-900 tracking-tight">DISHPOP</span>
          </div>
        </div>
      </footer>

    </div>
  );
}