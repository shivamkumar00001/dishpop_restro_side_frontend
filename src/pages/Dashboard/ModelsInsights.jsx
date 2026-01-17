// import { useEffect, useState } from "react";
// import  api  from "../../services/api";
// import { TrendingUp } from "lucide-react";

// export default function ModelInsights({ restaurantId }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     if (!restaurantId) return;

//     api
//       .get("/ar-stats/top", {
//         params: { restaurantId, limit: 10 },
//       })
//       .then((res) => setItems(res.data.topItems || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [restaurantId]);

//   /* ---------------- LOADING ---------------- */
//   if (loading) {
//     return (
//       <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 animate-pulse">
//         <div className="h-4 w-40 bg-[#1A1F2B] rounded mb-2" />
//         <div className="h-3 w-52 bg-[#1A1F2B] rounded mb-6" />

//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="flex items-center gap-4 mb-4">
//             <div className="w-11 h-11 bg-[#1A1F2B] rounded-xl" />
//             <div className="flex-1 space-y-2">
//               <div className="h-3 w-32 bg-[#1A1F2B] rounded" />
//               <div className="h-2 w-24 bg-[#1A1F2B] rounded" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
//       {/* ---------------- HEADER ---------------- */}
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h2 className="text-sm font-semibold text-gray-200">
//             AR Model Insights
//           </h2>
//           <p className="text-[11px] text-gray-500 mt-1">
//             Top performing AR dishes
//           </p>
//         </div>

//         <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
//           <TrendingUp className="w-4 h-4 text-blue-400" />
//         </div>
//       </div>

//       {/* ---------------- CONTENT ---------------- */}
//       {items.length === 0 ? (
//         <p className="text-xs text-gray-500">No AR data yet.</p>
//       ) : (
//         <div
//           className="
//             space-y-3
//             h-[260px]
//             overflow-y-auto
//             pr-1
//             hide-scrollbar
//           "
//         >
//           {items.map((item, i) => (
//             <div
//               key={i}
//               className="
//                 group flex items-center gap-4
//                 bg-[#12151D] border border-[#232A37]
//                 rounded-xl p-3
//                 transition-all duration-300
//                 hover:border-blue-400/40
//                 hover:-translate-y-[1px]
//                 hover:shadow-[0_0_16px_-6px_rgba(59,130,246,0.35)]
//               "
//             >
//               {/* Image */}
//               <div className="relative">
//                 <img
//                   src={item.imageUrl}
//                   alt={item._id}
//                   className="w-11 h-11 rounded-xl object-cover"
//                 />

//                 {i === 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-600 text-white">
//                     Top
//                   </span>
//                 )}
//               </div>

//               {/* Text */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-medium text-gray-100 truncate">
//                   {item._id}
//                 </p>
//                 <p className="text-[10px] text-gray-400 mt-0.5">
//                   {item.totalClicks} AR views
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../../services/api";
// import { TrendingUp, Eye, Sparkles, Award } from "lucide-react";

// export default function ModelInsights({ restaurantId }) {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      FETCH DATA
//   ========================= */
//   useEffect(() => {
//     if (!restaurantId) return;

//     api
//       .get("/ar-stats/top", {
//         params: { restaurantId, limit: 10 },
//       })
//       .then((res) => setItems(res.data.topItems || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [restaurantId]);

//   /* =========================
//      LOADING STATE
//   ========================= */
//   if (loading) {
//     return (
//       <div className="h-full p-6">
//         <div className="animate-pulse space-y-4">
//           {/* Header Skeleton */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <div className="h-5 w-32 bg-slate-200 rounded-lg mb-2" />
//               <div className="h-3 w-40 bg-slate-100 rounded-lg" />
//             </div>
//             <div className="w-10 h-10 bg-slate-100 rounded-xl" />
//           </div>

//           {/* Items Skeleton */}
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
//               <div className="w-12 h-12 bg-slate-200 rounded-xl" />
//               <div className="flex-1 space-y-2">
//                 <div className="h-3 w-24 bg-slate-200 rounded" />
//                 <div className="h-2 w-16 bg-slate-100 rounded" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   /* =========================
//      MAIN RENDER
//   ========================= */
//   return (
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       <div className="p-6 pb-4 border-b border-slate-100">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-2">
//               <h2 className="text-lg font-bold text-slate-900">
//                 AR Model Insights
//               </h2>
//               <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full">
//                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
//                   Live
//                 </span>
//               </div>
//             </div>
//             <p className="text-sm text-slate-500 font-medium">
//               Top performing dishes in AR view
//             </p>
//           </div>

//           <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
//             <TrendingUp className="w-5 h-5 text-blue-600" />
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="flex-1 p-6 pt-4 overflow-hidden">
//         {items.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="h-full overflow-y-auto pr-2 space-y-2 custom-scrollbar">
//             <AnimatePresence mode="popLayout">
//               {items.map((item, i) => (
//                 <DishCard
//                   key={item._id + i}
//                   item={item}
//                   rank={i + 1}
//                   index={i}
//                 />
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =========================
//    DISH CARD COMPONENT
// ========================= */
// function DishCard({ item, rank, index }) {
//   const isTopThree = rank <= 3;

//   const getRankBadge = () => {
//     if (rank === 1) return { icon: "🥇", bg: "from-amber-500 to-yellow-500", text: "Champion" };
//     if (rank === 2) return { icon: "🥈", bg: "from-slate-400 to-slate-500", text: "Runner-up" };
//     if (rank === 3) return { icon: "🥉", bg: "from-amber-700 to-orange-600", text: "3rd Place" };
//     return null;
//   };

//   const badge = getRankBadge();

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{
//         delay: index * 0.05,
//         duration: 0.4,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       whileHover={{ scale: 1.02, y: -2 }}
//       className={`
//         group relative
//         flex items-center gap-4
//         p-3 rounded-xl
//         border transition-all duration-300
//         cursor-pointer
//         ${
//           isTopThree
//             ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
//             : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-md"
//         }
//       `}
//     >
//       {/* Rank Number */}
//       <div className="flex-shrink-0 w-6 text-center">
//         <span className={`
//           text-sm font-bold
//           ${isTopThree ? "text-blue-600" : "text-slate-400"}
//         `}>
//           {rank}
//         </span>
//       </div>

//       {/* Image Container */}
//       <div className="relative flex-shrink-0">
//         <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
//           <img
//             src={item.imageUrl}
//             alt={item._id}
//             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           />
//         </div>

//         {/* Top Badge */}
//         {badge && (
//           <div className={`
//             absolute -top-1.5 -right-1.5
//             px-1.5 py-0.5 rounded-md
//             bg-gradient-to-r ${badge.bg}
//             text-white text-[9px] font-bold
//             shadow-lg flex items-center gap-0.5
//           `}>
//             <span>{badge.icon}</span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
//           {item._id}
//         </h3>
//         <div className="flex items-center gap-2 mt-1">
//           <div className="flex items-center gap-1">
//             <Eye className="w-3 h-3 text-slate-400" />
//             <span className="text-xs text-slate-500 font-medium">
//               {item.totalClicks.toLocaleString()}
//             </span>
//           </div>
//           {isTopThree && (
//             <>
//               <span className="text-slate-300">•</span>
//               <Sparkles className="w-3 h-3 text-blue-500" />
//             </>
//           )}
//         </div>
//       </div>

//       {/* Hover Arrow */}
//       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//         <svg
//           className="w-4 h-4 text-blue-600"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </div>

//       {/* Gradient Shine Effect */}
//       {isTopThree && (
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
//       )}
//     </motion.div>
//   );
// }

// /* =========================
//    EMPTY STATE
// ========================= */
// function EmptyState() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="flex flex-col items-center justify-center h-full text-center py-8"
//     >
//       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
//         <TrendingUp className="w-8 h-8 text-slate-400" />
//       </div>
//       <h3 className="text-sm font-semibold text-slate-900 mb-2">
//         No AR Data Yet
//       </h3>
//       <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
//         Start getting AR views on your dishes to see insights here
//       </p>
//     </motion.div>
//   );
// }

// /* =========================
//    CUSTOM SCROLLBAR STYLES
// ========================= */
// const styles = `
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 6px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: transparent;
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background: #cbd5e1;
//     border-radius: 10px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background: #94a3b8;
//   }
// `;

// // Inject styles
// if (typeof document !== 'undefined') {
//   const styleSheet = document.createElement("style");
//   styleSheet.textContent = styles;
//   document.head.appendChild(styleSheet);
// }






import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { TrendingUp, Eye, Sparkles, Award } from "lucide-react";

export default function ModelInsights({ restaurantId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!restaurantId) return;

    api
      .get("/ar-stats/top", {
        params: { restaurantId, limit: 10 },
      })
      .then((res) => setItems(res.data.topItems || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="animate-pulse space-y-4">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-5 w-32 bg-slate-200 rounded-lg mb-2" />
              <div className="h-3 w-40 bg-slate-100 rounded-lg" />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          </div>

          {/* Items Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-2 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     MAIN RENDER
  ========================= */
  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-slate-900">
                AR Model Insights
              </h2>
              <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Top performing dishes in AR view
            </p>
          </div>

          <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 pt-4 overflow-hidden">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div 
            className="overflow-y-auto pr-2 space-y-2 custom-scrollbar"
            style={{ maxHeight: "280px" }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <DishCard
                  key={item._id + i}
                  item={item}
                  rank={i + 1}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   DISH CARD COMPONENT
========================= */
function DishCard({ item, rank, index }) {
  const isTopThree = rank <= 3;

  const getRankBadge = () => {
    if (rank === 1) return { icon: "🥇", bg: "from-amber-500 to-yellow-500", text: "Champion" };
    if (rank === 2) return { icon: "🥈", bg: "from-slate-400 to-slate-500", text: "Runner-up" };
    if (rank === 3) return { icon: "🥉", bg: "from-amber-700 to-orange-600", text: "3rd Place" };
    return null;
  };

  const badge = getRankBadge();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        group relative
        flex items-center gap-4
        p-3 rounded-xl
        border transition-all duration-300
        cursor-pointer
        ${
          isTopThree
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
            : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-md"
        }
      `}
    >
      {/* Rank Number */}
      <div className="flex-shrink-0 w-6 text-center">
        <span className={`
          text-sm font-bold
          ${isTopThree ? "text-blue-600" : "text-slate-400"}
        `}>
          {rank}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
          <img
            src={item.imageUrl}
            alt={item._id}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Top Badge */}
        {badge && (
          <div className={`
            absolute -top-1.5 -right-1.5
            px-1.5 py-0.5 rounded-md
            bg-gradient-to-r ${badge.bg}
            text-white text-[9px] font-bold
            shadow-lg flex items-center gap-0.5
          `}>
            <span>{badge.icon}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
          {item._id}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">
              {item.totalClicks.toLocaleString()}
            </span>
          </div>
          {isTopThree && (
            <>
              <span className="text-slate-300">•</span>
              <Sparkles className="w-3 h-3 text-blue-500" />
            </>
          )}
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Gradient Shine Effect */}
      {isTopThree && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      )}
    </motion.div>
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
      className="flex flex-col items-center justify-center h-full text-center py-8"
    >
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">
        No AR Data Yet
      </h3>
      <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
        Start getting AR views on your dishes to see insights here
      </p>
    </motion.div>
  );
}

/* =========================
   CUSTOM SCROLLBAR STYLES
========================= */
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}