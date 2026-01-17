// import { Star, TrendingUp, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import  api  from "../../services/api";

// export default function FeedbackSummary({ username }) {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!username) return;

//     console.log("FEEDBACK USERNAME (FRONTEND):", username);

//     const fetchSummary = async () => {
//       try {
//         const res = await api.get("/feedback/summary", {
//           params: { username },
//         });

//         console.log("FEEDBACK API RESPONSE:", res.data);

//         setSummary(res.data.summary);
//       } catch (err) {
//         console.error("Failed to load feedback summary", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [username]);

//   if (loading) {
//     return (
//       <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 text-gray-500">
//         Loading feedback...
//       </div>
//     );
//   }

//   if (!summary) {
//     return (
//       <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 text-gray-500">
//         No feedback data found.
//       </div>
//     );
//   }

//   const stats = [
//     { label: "Excellent", value: summary.excellent, className: "text-blue-400" },
//     { label: "Average", value: summary.average, className: "text-yellow-400" },
//     { label: "Poor", value: summary.poor, className: "text-red-400" },
//   ];

//   return (
//     <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-sm font-semibold text-gray-200">
//             Feedback Summary
//           </h2>
//           <p className="text-[11px] text-gray-500 mt-1">
//             Customer sentiments performance
//           </p>
//         </div>
//         <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
//           <Star className="w-4 h-4 text-blue-400" />
//         </div>
//       </div>

//       {/* Rating */}
//       <div className="mt-6 space-y-2">
//         <div className="flex items-end gap-2">
//           <p className="text-5xl font-extrabold text-blue-400">
//             {summary.avgRating}
//           </p>
//           <span className="text-xs text-gray-500 mb-1">/5</span>
//         </div>

//         <div className="w-full h-2 bg-[#1A1F2B] rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
//             style={{ width: `${summary.positivePercent}%` }}
//           />
//         </div>

//         <div className="flex items-center gap-1 text-[11px] text-gray-400">
//           <TrendingUp className="w-3 h-3 text-green-400" />
//           {summary.positivePercent}% overall positive rating
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-3 mt-6">
//         {stats.map((item, i) => (
//           <div
//             key={i}
//             className="bg-[#12151D] border border-[#232A37] rounded-lg py-3 text-center"
//           >
//             <p className="text-[11px] text-gray-500">{item.label}</p>
//             <p className={`text-sm font-bold ${item.className}`}>
//               {item.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-500">
//         <Users className="w-3.5 h-3.5" />
//         {summary.totalReviews} Responses Counted
//       </div>
//     </div>
//   );
// }



import { Star, TrendingUp, Users, MessageSquare, ThumbsUp, Meh, ThumbsDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

export default function FeedbackSummary({ username }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!username) return;

    console.log("FEEDBACK USERNAME (FRONTEND):", username);

    const fetchSummary = async () => {
      try {
        const res = await api.get("/feedback/summary", {
          params: { username },
        });

        console.log("FEEDBACK API RESPONSE:", res.data);
        setSummary(res.data.summary);
      } catch (err) {
        console.error("Failed to load feedback summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [username]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="h-full p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */
  if (!summary) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Feedback Summary
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Customer satisfaction overview
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      </div>
    );
  }

  /* =========================
     MAIN RENDER
  ========================= */
  const stats = [
    { 
      label: "Excellent", 
      value: summary.excellent, 
      icon: ThumbsUp,
      color: "emerald",
      gradient: "from-emerald-500 to-green-500"
    },
    { 
      label: "Average", 
      value: summary.average, 
      icon: Meh,
      color: "amber",
      gradient: "from-amber-500 to-yellow-500"
    },
    { 
      label: "Poor", 
      value: summary.poor, 
      icon: ThumbsDown,
      color: "red",
      gradient: "from-red-500 to-rose-500"
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-slate-900">
                Feedback Summary
              </h2>
              {summary.avgRating >= 4 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-700">Top Rated</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Customer satisfaction overview
            </p>
          </div>

          <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 pt-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {/* RATING SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              {/* Big Rating Number */}
              <div className="flex items-end gap-3 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {summary.avgRating}
                  </span>
                  <span className="text-2xl text-slate-500 font-bold">/5</span>
                </motion.div>
                
                {/* Star Rating Visual */}
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i < Math.round(summary.avgRating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-3">
                <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${summary.positivePercent}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {summary.positivePercent}% Positive
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {summary.totalReviews} Reviews
                  </div>
                </div>
              </div>

              {/* Quality Badge */}
              {summary.positivePercent >= 80 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">Excellent Performance</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* SENTIMENT BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Sentiment Breakdown
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {stats.map((item, i) => (
                <StatCard key={i} {...item} index={i} total={summary.totalReviews} />
              ))}
            </div>
          </div>

          {/* INSIGHTS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-slate-50 border border-slate-100 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Performance Insight
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {summary.positivePercent >= 80 
                    ? "Outstanding! Your customers love the experience. Keep up the great work!"
                    : summary.positivePercent >= 60
                    ? "Good performance! There's room for improvement in customer satisfaction."
                    : "Focus on improving service quality to boost customer satisfaction."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD COMPONENT
========================= */
function StatCard({ label, value, icon: Icon, color, gradient, index, total }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const colorClasses = {
    emerald: {
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    amber: {
      bg: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    red: {
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-3 text-center transition-shadow hover:shadow-md`}
    >
      <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
        <Icon className={`w-4 h-4 ${colors.iconColor}`} />
      </div>
      
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-xl font-bold ${colors.text}`}>{value}</span>
        <span className="text-[10px] text-slate-400 font-medium">({percentage}%)</span>
      </div>
    </motion.div>
  );
}

/* =========================
   LOADING SKELETON
========================= */
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded-lg mb-2" />
          <div className="h-3 w-40 bg-slate-100 rounded-lg" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      </div>

      {/* Rating Card */}
      <div className="bg-slate-100 rounded-2xl p-6">
        <div className="h-12 w-32 bg-slate-200 rounded-lg mb-4" />
        <div className="h-3 w-full bg-slate-200 rounded-full mb-2" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-xl h-24" />
        ))}
      </div>
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">
        No Feedback Yet
      </h3>
      <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
        Customer reviews will appear here once they start providing feedback
      </p>
    </motion.div>
  );
}