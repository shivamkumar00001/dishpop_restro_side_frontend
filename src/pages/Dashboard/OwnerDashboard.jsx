// // import React, { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { toast } from "react-hot-toast";

// // import Sidebar from "../../components/Sidebar";
// // import ARViewStatistics from "./ArViewStatistics";
// // import FeedbackSummary from "./FeedbackSummary";
// // import ModelInsights from "./ModelsInsights";
// // import LiveOrdersPanel from "./LiveOrderPanel";

// // import api from "../../services/api";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const { username } = useParams();

// //   const [user, setUser] = useState(null);
// //   const [restaurant, setRestaurant] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   /* ===============================
// //      LOAD DASHBOARD DATA
// //   =============================== */
// //   useEffect(() => {
// //     async function loadData() {
// //       try {
// //         const [resUser, resRestaurant] = await Promise.all([
// //           api.get("/auth/profile", { withCredentials: true }),
// //           api.get(`/v1/restaurant/${username}`, { withCredentials: true }),
// //         ]);

// //         setUser(resUser.data.user);
// //         setRestaurant(resRestaurant.data);

// //         localStorage.setItem("uname", resUser.data.user.username);
// //         localStorage.setItem("rid", resRestaurant.data._id);
// //       } catch (err) {
// //         const msg = err.response?.data?.message || "Failed to load dashboard";
// //         toast.error(msg);

// //         if (err.response?.status === 404) {
// //           navigate("/404", { replace: true });
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadData();
// //   }, [username, navigate]);

 
// //   /* ===============================
// //      LOGOUT
// //   =============================== */
// //   const handleLogout = async () => {
// //     try {
// //       await api.get("/auth/logout", { withCredentials: true });
// //       localStorage.clear();
// //       toast.success("Logged out successfully");
// //       navigate("/login", { replace: true });
// //     } catch {
// //       toast.error("Logout failed");
// //     }
// //   };

// //   /* ===============================
// //      LOADING / ERROR STATES
// //   =============================== */
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
// //         <div className="flex flex-col items-center gap-3">
// //           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
// //           <p className="text-gray-400">Loading dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!user || !restaurant) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
// //         <div className="text-center">
// //           <p className="text-red-400 mb-4">Error loading dashboard</p>
// //           <button
// //             onClick={() => navigate("/login")}
// //             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
// //           >
// //             Go to Login
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ===============================
// //      UI
// //   =============================== */
// //   return (
// //     <div className="min-h-screen bg-[#0c0f14] text-white flex relative">
// //       <Sidebar user={user} onLogout={handleLogout} />

// //       <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
// //         {/* HEADER */}
// //         <div className="flex items-center justify-between mb-6">
// //           <div>
// //             <h1 className="text-lg lg:text-2xl font-bold">
// //               Dashboard – {user.restaurantName}
// //             </h1>
// //             <p className="text-sm text-gray-400 mt-1">
// //               Welcome back, {user.name || user.username}
// //             </p>
// //           </div>

// //           {/* Quick Actions */}
// //           <div className="hidden lg:flex items-center gap-3">
// //             <button
// //               onClick={() => navigate(`/${username}/orders`)}
// //               className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-sm"
// //             >
// //               All Orders
// //             </button>
          
// //           </div>
// //         </div>

// //         {/* TOP STATS */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
// //           <div className="lg:col-span-2">
// //             <ARViewStatistics restaurantId={username} />
// //           </div>

// //           <div className="lg:col-span-1">
// //             <ModelInsights restaurantId={username} />
// //           </div>
// //         </div>

// //         {/* LIVE ORDERS + FEEDBACK */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
// //           {/* 🆕 LIVE ORDERS PANEL - Real-time order notifications */}
// //           <LiveOrdersPanel username={username} />

// //           {/* FEEDBACK SUMMARY */}
// //           <FeedbackSummary username={user.username} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   TrendingUp, 
//   Package, 
//   Users, 
//   DollarSign,
//   ArrowUpRight,
//   Sparkles,
//   Activity
// } from "lucide-react";

// import Sidebar from "../../components/Sidebar";
// import ARViewStatistics from "./ArViewStatistics";
// import FeedbackSummary from "./FeedbackSummary";
// import ModelInsights from "./ModelsInsights";
// import LiveOrdersPanel from "./LiveOrderPanel";

// import api from "../../services/api";

// /* =========================
//    PREMIUM UI COMPONENTS
// ========================= */

// const GradientText = ({ children, className = "" }) => (
//   <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 ${className}`}>
//     {children}
//   </span>
// );

// const StatCard = ({ title, value, change, icon: Icon, trend = "up", delay = 0 }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//       className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-500 overflow-hidden"
//     >
//       {/* Background Gradient on Hover */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-4">
//           <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 group-hover:bg-blue-100 transition-colors duration-300">
//             <Icon className="w-5 h-5 text-blue-600" />
//           </div>
          
//           {change && (
//             <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
//               trend === 'up' 
//                 ? 'bg-emerald-50 text-emerald-700' 
//                 : 'bg-red-50 text-red-700'
//             }`}>
//               <ArrowUpRight className={`w-3 h-3 ${trend === 'down' ? 'rotate-90' : ''}`} />
//               {change}
//             </div>
//           )}
//         </div>
        
//         <h3 className="text-sm font-medium text-slate-500 mb-2">{title}</h3>
//         <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
//       </div>
//     </motion.div>
//   );
// };

// const QuickActionButton = ({ onClick, children, variant = "primary" }) => {
//   const variants = {
//     primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
//     secondary: "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
//   };

//   return (
//     <motion.button
//       onClick={onClick}
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${variants[variant]}`}
//     >
//       {children}
//     </motion.button>
//   );
// };

// /* =========================
//    MAIN DASHBOARD COMPONENT
// ========================= */

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { username } = useParams();

//   /* =========================
//      STATE MANAGEMENT
//   ========================= */
//   const [user, setUser] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   /* =========================
//      DATA LOADING
//   ========================= */
//   useEffect(() => {
//     async function loadDashboardData() {
//       try {
//         const [resUser, resRestaurant] = await Promise.all([
//           api.get("/auth/profile", { withCredentials: true }),
//           api.get(`/v1/restaurant/${username}`, { withCredentials: true }),
//         ]);

//         setUser(resUser.data.user);
//         setRestaurant(resRestaurant.data);

//         localStorage.setItem("uname", resUser.data.user.username);
//         localStorage.setItem("rid", resRestaurant.data._id);
//       } catch (err) {
//         handleLoadError(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadDashboardData();
//   }, [username, navigate]);

//   /* =========================
//      REAL-TIME CLOCK
//   ========================= */
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   /* =========================
//      ERROR HANDLING
//   ========================= */
//   const handleLoadError = (err) => {
//     const msg = err.response?.data?.message || "Failed to load dashboard";
//     toast.error(msg);

//     if (err.response?.status === 404) {
//       navigate("/404", { replace: true });
//     }
//   };

//   /* =========================
//      LOGOUT HANDLER
//   ========================= */
//   const handleLogout = async () => {
//     try {
//       await api.get("/auth/logout", { withCredentials: true });
//       localStorage.clear();
//       toast.success("Logged out successfully");
//       navigate("/login", { replace: true });
//     } catch {
//       toast.error("Logout failed");
//     }
//   };

//   /* =========================
//      NAVIGATION HANDLERS
//   ========================= */
//   const handleNavigateToOrders = () => navigate(`/${username}/orders`);
//   const handleNavigateToMenu = () => navigate(`/${username}/dishes`);
//   const handleNavigateToAnalytics = () => navigate(`/${username}/analytics`);

//   /* =========================
//      LOADING STATE
//   ========================= */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="flex flex-col items-center gap-4"
//         >
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//             <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
//           </div>
//           <p className="text-slate-600 font-medium">Loading your dashboard...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   /* =========================
//      ERROR STATE
//   ========================= */
//   if (!user || !restaurant) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-200"
//         >
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-3xl">⚠️</span>
//           </div>
//           <p className="text-red-600 mb-6 font-semibold">Error loading dashboard</p>
//           <QuickActionButton onClick={() => navigate("/login")}>
//             Go to Login
//           </QuickActionButton>
//         </motion.div>
//       </div>
//     );
//   }

//   /* =========================
//      MAIN RENDER
//   ========================= */
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex">
//       {/* Subtle grain texture overlay */}
//       <div 
//         className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
//         style={{ 
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
//         }}
//       />

//       {/* SIDEBAR */}
//       <Sidebar user={user} onLogout={handleLogout} />

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-y-auto relative z-10">
//         <div className="p-6 lg:p-10 max-w-[1800px] mx-auto">
          
//           {/* PREMIUM HEADER */}
//           <DashboardHeader
//             userName={user.name || user.username}
//             restaurantName={user.restaurantName}
//             currentTime={currentTime}
//             onNavigateToOrders={handleNavigateToOrders}
//             onNavigateToMenu={handleNavigateToMenu}
//           />

//           {/* QUICK STATS CARDS */}
//           <QuickStats delay={0.1} />

//           {/* MAIN STATISTICS GRID */}
//           <StatisticsGrid username={username} />

//           {/* ACTIVITY GRID */}
//           <ActivityGrid username={username} userName={user.username} />
//         </div>
//       </main>
//     </div>
//   );
// }

// /* =========================
//    HEADER COMPONENT
// ========================= */
// function DashboardHeader({ userName, restaurantName, currentTime, onNavigateToOrders, onNavigateToMenu }) {
//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long',
//       month: 'long', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//       className="mb-10"
//     >
//       <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
//         <div className="flex-1">
//           {/* Status Badge */}
//           <motion.div 
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-4"
//           >
//             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
//             <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Dashboard</span>
//           </motion.div>

//           {/* Main Title */}
//           <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
//             Welcome back, <GradientText>{userName}</GradientText>
//           </h1>
          
//           {/* Subtitle with Restaurant & Time */}
//           <div className="flex flex-wrap items-center gap-4 text-slate-500">
//             <div className="flex items-center gap-2">
//               <Sparkles className="w-4 h-4 text-blue-500" />
//               <span className="font-medium">{restaurantName}</span>
//             </div>
//             <span className="text-slate-300">•</span>
//             <div className="flex items-center gap-2">
//               <Activity className="w-4 h-4 text-blue-500" />
//               <span className="font-mono text-sm">{formatTime(currentTime)}</span>
//             </div>
//             <span className="text-slate-300 hidden lg:inline">•</span>
//             <span className="text-sm hidden lg:inline">{formatDate(currentTime)}</span>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="flex flex-wrap gap-3">
//           <QuickActionButton onClick={onNavigateToOrders}>
//             View Orders
//           </QuickActionButton>
//           <QuickActionButton onClick={onNavigateToMenu} variant="secondary">
//             Manage Menu
//           </QuickActionButton>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* =========================
//    QUICK STATS
// ========================= */
// function QuickStats({ delay }) {
//   const stats = [
//     { title: "Total Revenue", value: "₹45,231", change: "+12.5%", icon: DollarSign, trend: "up" },
//     { title: "Active Orders", value: "23", change: "+5", icon: Package, trend: "up" },
//     { title: "Today's Visitors", value: "156", change: "+8.3%", icon: Users, trend: "up" },
//     { title: "AR Views", value: "89", change: "+15.2%", icon: TrendingUp, trend: "up" },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
//       {stats.map((stat, index) => (
//         <StatCard 
//           key={index}
//           {...stat}
//           delay={delay + index * 0.1}
//         />
//       ))}
//     </div>
//   );
// }

// /* =========================
//    STATISTICS GRID
// ========================= */
// function StatisticsGrid({ username }) {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.5, duration: 0.6 }}
//       className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
//     >
//       {/* AR View Statistics - Takes 2 columns */}
//       <div className="lg:col-span-2">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
//           <ARViewStatistics restaurantId={username} />
//         </div>
//       </div>

//       {/* Model Insights - Takes 1 column */}
//       <div className="lg:col-span-1">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
//           <ModelInsights restaurantId={username} />
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /* =========================
//    ACTIVITY GRID
// ========================= */
// function ActivityGrid({ username, userName }) {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.7, duration: 0.6 }}
//       className="grid grid-cols-1 lg:grid-cols-2 gap-6"
//     >
//       {/* Live Orders Panel */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
//         <LiveOrdersPanel username={username} />
//       </div>

//       {/* Feedback Summary */}
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
//         <FeedbackSummary username={userName} />
//       </div>
//     </motion.div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  Sparkles,
  Activity
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import ARViewStatistics from "./ArViewStatistics";
import FeedbackSummary from "./FeedbackSummary";
import ModelInsights from "./ModelsInsights";
import LiveOrdersPanel from "./LiveOrderPanel";

import api from "../../services/api";

/* =========================
   PREMIUM UI COMPONENTS
========================= */

const GradientText = ({ children, className = "" }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 ${className}`}>
    {children}
  </span>
);

const QuickActionButton = ({ onClick, children, variant = "primary" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${variants[variant]}`}
    >
      {children}
    </motion.button>
  );
};

/* =========================
   MAIN DASHBOARD COMPONENT
========================= */

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useParams();

  /* =========================
     STATE MANAGEMENT
  ========================= */
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  /* =========================
     DATA LOADING
  ========================= */
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [resUser, resRestaurant] = await Promise.all([
          api.get("/auth/profile", { withCredentials: true }),
          api.get(`/v1/restaurant/${username}`, { withCredentials: true }),
        ]);

        setUser(resUser.data.user);
        setRestaurant(resRestaurant.data);

        localStorage.setItem("uname", resUser.data.user.username);
        localStorage.setItem("rid", resRestaurant.data._id);
      } catch (err) {
        handleLoadError(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [username, navigate]);

  /* =========================
     REAL-TIME CLOCK
  ========================= */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* =========================
     ERROR HANDLING
  ========================= */
  const handleLoadError = (err) => {
    const msg = err.response?.data?.message || "Failed to load dashboard";
    toast.error(msg);

    if (err.response?.status === 404) {
      navigate("/404", { replace: true });
    }
  };

  /* =========================
     LOGOUT HANDLER
  ========================= */
  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  /* =========================
     NAVIGATION HANDLERS
  ========================= */
  const handleNavigateToOrders = () => navigate(`/${username}/orders`);
  const handleNavigateToMenu = () => navigate(`/${username}/dishes`);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (!user || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-200"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 mb-6 font-semibold">Error loading dashboard</p>
          <QuickActionButton onClick={() => navigate("/login")}>
            Go to Login
          </QuickActionButton>
        </motion.div>
      </div>
    );
  }

  /* =========================
     MAIN RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex">
      {/* Subtle grain texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* SIDEBAR */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 lg:p-10 max-w-[1800px] mx-auto">
          
          {/* PREMIUM HEADER */}
          <DashboardHeader
            userName={user.name || user.username}
            restaurantName={user.restaurantName}
            currentTime={currentTime}
            onNavigateToOrders={handleNavigateToOrders}
            onNavigateToMenu={handleNavigateToMenu}
          />

          {/* MAIN STATISTICS GRID */}
          <StatisticsGrid username={username} />

          {/* ACTIVITY GRID */}
          <ActivityGrid username={username} userName={user.username} />
        </div>
      </main>
    </div>
  );
}

/* =========================
   HEADER COMPONENT
========================= */
function DashboardHeader({ userName, restaurantName, currentTime, onNavigateToOrders, onNavigateToMenu }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-4"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Dashboard</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Welcome back, <GradientText>{userName}</GradientText>
          </h1>
          
          {/* Subtitle with Restaurant & Time */}
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{restaurantName}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="font-mono text-sm">{formatTime(currentTime)}</span>
            </div>
            <span className="text-slate-300 hidden lg:inline">•</span>
            <span className="text-sm hidden lg:inline">{formatDate(currentTime)}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <QuickActionButton onClick={onNavigateToOrders}>
            View Orders
          </QuickActionButton>
          <QuickActionButton onClick={onNavigateToMenu} variant="secondary">
            Manage Menu
          </QuickActionButton>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
   STATISTICS GRID
========================= */
function StatisticsGrid({ username }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* AR View Statistics - Takes 2 columns */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
          <ARViewStatistics restaurantId={username} />
        </div>
      </div>

      {/* Model Insights - Takes 1 column */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
          <ModelInsights restaurantId={username} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================
   ACTIVITY GRID
========================= */
function ActivityGrid({ username, userName }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Live Orders Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
        <LiveOrdersPanel username={username} />
      </div>

      {/* Feedback Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
        <FeedbackSummary username={userName} />
      </div>
    </motion.div>
  );
}