// import { useState, useEffect } from "react";
// import { Check, Loader2 } from "lucide-react";
// import api from "../../services/api";
// import { useNavigate } from "react-router-dom";

// const PLANS = [
//   {
//     key: "MONTHLY",
//     title: "Monthly",
//     original: 3000,
//     price: 1190,
//     off: 60,
//   },
//   {
//     key: "QUARTERLY",
//     title: "Quarterly",
//     original: 9000,
//     price: 2790,
//     off: 69,
    
//   },
//   {
//     key: "YEARLY",
//     title: "Yearly",
//     original: 36000,
//     price: 7900,
//     off: 78,
//     popular: true,
//   },
// ];

// export default function SubscriptionPage() {
//   const [loadingPlan, setLoadingPlan] = useState(null);
//   const [subscriptionStatus, setSubscriptionStatus] = useState(null);
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [trialEnd, setTrialEnd] = useState(null);
//   const [currentPeriodEnd, setCurrentPeriodEnd] = useState(null);
//   const navigate = useNavigate();

//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   const fetchSubscription = async () => {
//     try {
//       const { data } = await api.get("/subscription/status");
//       if (data.subscription) {
//         setSubscriptionStatus(data.subscription.status);
//         setCurrentPlan(data.subscription.plan);
//         setTrialEnd(data.subscription.trialEnd);
//         setCurrentPeriodEnd(data.subscription.currentPeriodEnd);
// }

//     } catch (err) {
//       console.error("Subscription fetch failed", err);
//     }
//   };

//   useEffect(() => {
//     fetchSubscription();
//   }, []);

//   const handleSubscribe = async (plan) => {
//     if (loadingPlan) return;
//     setLoadingPlan(plan);

//     try {
//       const { data } = await api.post("/subscription/create", { plan });
//       const { subscriptionId, razorpayKey } = data;

//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         alert("Razorpay failed to load");
//         return;
//       }

//       const rzp = new window.Razorpay({
//         key: razorpayKey,
//         subscription_id: subscriptionId,
//         name: "DishPop Restaurant",
//         description: `${plan} Plan`,
//         handler: () => {
//           alert("Autopay setup completed");
//           setTimeout(fetchSubscription, 2000);
//         },
//         modal: {
//           ondismiss: () => setTimeout(fetchSubscription, 1000),
//         },
//         theme: { color: "#22d3ee" },
//       });

//       rzp.open();
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Failed to initiate subscription"
//       );
//     } finally {
//       setLoadingPlan(null);
//     }
//   };
   
//   const getDaysLeft = (endDate) => {
//   if (!endDate) return null;
//   const now = new Date();
//   const end = new Date(endDate);
//   const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
//   return diff > 0 ? diff : 0;
// };


// const hasActiveSubscription = () => {
//   const now = new Date();

//   // Trial still valid
//   if (
//     subscriptionStatus === "TRIALING" &&
//     trialEnd &&
//     now < new Date(trialEnd)
//   ) {
//     return true;
//   }

//   // Paid subscription still valid
//   if (
//     ["ACTIVE", "CANCELLED"].includes(subscriptionStatus) &&
//     currentPeriodEnd &&
//     now < new Date(currentPeriodEnd)
//   ) {
//     return true;
//   }

//   return false;
// };

//   return (
//     <div className="bg-black text-white min-h-screen px-4 py-20">
//       <div className="max-w-6xl mx-auto mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition"
//         >
//           ← Back
//         </button>
//       </div>

//       <div className="max-w-6xl mx-auto text-center mb-14">
//         <h1 className="text-5xl font-bold">
//           Choose Your <span className="text-cyan-400">Plan</span>
//         </h1>
//         <p className="text-gray-400 mt-4 text-lg">
//           Simple pricing. No hidden charges. Cancel anytime.
//         </p>
//       </div>

//       {/* ================= PLANS ================= */}
//       <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//         {PLANS.map((plan) => (
//           <div
//             key={plan.key}
//             className={`relative bg-gradient-to-br from-gray-900 to-black 
//               border rounded-2xl p-8 transition-all
//               ${
//                 plan.popular
//                   ? "border-cyan-500 scale-105"
//                   : "border-gray-800"
//               }`}
//           >
//             {plan.popular && (
//               <span className="absolute -top-3 right-6 bg-cyan-500 text-black px-3 py-1 text-sm font-semibold rounded-full">
//                 Most Popular
//               </span>
//             )}

//             <h3 className="text-2xl font-semibold mb-2">
//               {plan.title}
//             </h3>

//             <div className="flex items-end gap-2 mb-3">
//               <span className="text-4xl font-bold">
//                 ₹{plan.price}
//               </span>
//               <span className="text-gray-400 line-through">
//                 ₹{plan.original}
//               </span>
//             </div>

//             <span className="inline-block mb-6 text-green-400 font-semibold">
//               {plan.off}% OFF
//             </span>

//             <ul className="space-y-3 text-gray-300 mb-8">
//               {[
//                 "Unlimited Orders",
//                 "Live Order Management",
//                 "AR Menu Support",
//                 "Customer Feedback",
//               ].map((f) => (
//                 <li key={f} className="flex gap-2">
//                   <Check className="text-cyan-400" size={18} />
//                   {f}
//                 </li>
//               ))}
//             </ul>

//            <button
//   onClick={() => {
//     if (hasActiveSubscription()) {
//       alert("You already have an active subscription.");
//       return;
//     }
//     handleSubscribe(plan.key);
//   }}
//   disabled={loadingPlan !== null}
//   className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all
//     ${
//       loadingPlan === plan.key
//         ? "bg-gray-600 cursor-not-allowed"
//         : "bg-cyan-500 hover:bg-cyan-600 text-black"
//     }
//   `}
// >
//   {loadingPlan === plan.key ? (
//     <>
//       <Loader2 className="animate-spin" size={18} />
//       Processing...
//     </>
//   ) : hasActiveSubscription() ? (
//     "Already Subscribed"
//   ) : (
//     `Subscribe ${plan.title}`
//   )}
// </button>

//           </div>
//         ))}
//       </div>

      
//     {/* ================= STATUS ================= */}
//           <div className="max-w-3xl mx-auto mt-12 text-center space-y-4">

//             {subscriptionStatus === "PENDING_AUTH" && (
//               <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
//                 <p className="text-orange-400 font-semibold">
//                   Autopay setup pending
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   Please complete the mandate approval to activate your subscription.
//                 </p>
//               </div>
//             )}

//             {subscriptionStatus === "TRIALING" && (
//               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
//                 <p className="text-green-400 font-semibold text-lg">
//                   ✅ You’re on a Free Trial
//                 </p>
//                 {trialEnd && (
//                   <p className="text-gray-300 mt-1">
//                     Trial ends on{" "}
//                     <span className="font-semibold">
//                       {new Date(trialEnd).toLocaleDateString()}
//                     </span>{" "}
//                     · {getDaysLeft(trialEnd)} days left
//                   </p>
//                 )}
//               </div>
//             )}

//             {subscriptionStatus === "ACTIVE" && (
//               <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
//                 <p className="text-green-400 font-semibold text-lg">
//                   🎉 You’re Subscribed ({currentPlan})
//                 </p>
//                 {currentPeriodEnd && (
//                   <p className="text-gray-300 mt-1">
//                     Subscription valid until{" "}
//                     <span className="font-semibold">
//                       {new Date(currentPeriodEnd).toLocaleDateString()}
//                     </span>{" "}
//                     · {getDaysLeft(currentPeriodEnd)} days left
//                   </p>
//                 )}
//               </div>
//             )}

//             {subscriptionStatus === "EXPIRED" && (
//               <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
//                 <p className="text-red-400 font-semibold">
//                   Subscription expired
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">
//                   Please renew to continue using premium features.
//                 </p>
//               </div>
//             )}

//           </div>

//     </div>
//   );
// }






import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowLeft, Crown, Zap, Shield, Star, Sparkles } from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    key: "MONTHLY",
    title: "Monthly",
    original: 3000,
    price: 1190,
    off: 60,
  },
  {
    key: "QUARTERLY",
    title: "Quarterly",
    original: 9000,
    price: 2790,
    off: 69,
  },
  {
    key: "YEARLY",
    title: "Yearly",
    original: 36000,
    price: 7900,
    off: 78,
    popular: true,
  },
];

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [trialEnd, setTrialEnd] = useState(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState(null);
  const navigate = useNavigate();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const fetchSubscription = async () => {
    try {
      const { data } = await api.get("/subscription/status");
      if (data.subscription) {
        setSubscriptionStatus(data.subscription.status);
        setCurrentPlan(data.subscription.plan);
        setTrialEnd(data.subscription.trialEnd);
        setCurrentPeriodEnd(data.subscription.currentPeriodEnd);
      }
    } catch (err) {
      console.error("Subscription fetch failed", err);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan) => {
    if (loadingPlan) return;
    setLoadingPlan(plan);

    try {
      const { data } = await api.post("/subscription/create", { plan });
      const { subscriptionId, razorpayKey } = data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay failed to load");
        return;
      }

      const rzp = new window.Razorpay({
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: "DishPop Restaurant",
        description: `${plan} Plan`,
        handler: () => {
          alert("Autopay setup completed");
          setTimeout(fetchSubscription, 2000);
        },
        modal: {
          ondismiss: () => setTimeout(fetchSubscription, 1000),
        },
        theme: { color: "#3b82f6" },
      });

      rzp.open();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to initiate subscription"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const hasActiveSubscription = () => {
    const now = new Date();

    if (
      subscriptionStatus === "TRIALING" &&
      trialEnd &&
      now < new Date(trialEnd)
    ) {
      return true;
    }

    if (
      ["ACTIVE", "CANCELLED"].includes(subscriptionStatus) &&
      currentPeriodEnd &&
      now < new Date(currentPeriodEnd)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
      {/* Grain Texture */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            PREMIUM PLANS
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
            Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Plan</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Simple pricing. No hidden charges. Cancel anytime.
          </p>
        </motion.div>

        {/* STATUS BANNER */}
        {subscriptionStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <StatusBanner 
              status={subscriptionStatus}
              currentPlan={currentPlan}
              trialEnd={trialEnd}
              currentPeriodEnd={currentPeriodEnd}
              getDaysLeft={getDaysLeft}
            />
          </motion.div>
        )}

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {PLANS.map((plan, index) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              index={index}
              loadingPlan={loadingPlan}
              hasActiveSubscription={hasActiveSubscription()}
              onSubscribe={() => {
                if (hasActiveSubscription()) {
                  alert("You already have an active subscription.");
                  return;
                }
                handleSubscribe(plan.key);
              }}
            />
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Zap className="w-5 h-5" />, text: "Unlimited Orders & Transactions" },
              { icon: <Shield className="w-5 h-5" />, text: "Live Order Management System" },
              { icon: <Star className="w-5 h-5" />, text: "Advanced AR Menu Support" },
              { icon: <Crown className="w-5 h-5" />, text: "Customer Feedback & Analytics" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <span className="text-slate-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= PLAN CARD ================= */
function PlanCard({ plan, index, loadingPlan, hasActiveSubscription, onSubscribe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`relative bg-white border rounded-2xl p-8 transition-all duration-300 ${
        plan.popular
          ? "border-blue-500 shadow-xl shadow-blue-500/20 scale-105"
          : "border-slate-200 shadow-sm hover:shadow-lg"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 text-sm font-bold rounded-full shadow-lg">
            <Crown className="w-3.5 h-3.5" />
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {plan.title}
        </h3>
        
        <div className="flex items-end justify-center gap-2 mb-3">
          <span className="text-5xl font-bold text-slate-900">
            ₹{plan.price}
          </span>
          <span className="text-slate-400 line-through text-lg mb-2">
            ₹{plan.original}
          </span>
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-bold">
          Save {plan.off}%
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {[
          "Unlimited Orders",
          "Live Order Management",
          "AR Menu Support",
          "Customer Feedback",
        ].map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-slate-600 font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        onClick={onSubscribe}
        disabled={loadingPlan !== null}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
          loadingPlan === plan.key
            ? "bg-slate-300 cursor-not-allowed text-slate-600"
            : plan.popular
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
            : "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`}
      >
        {loadingPlan === plan.key ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </>
        ) : hasActiveSubscription ? (
          "Already Subscribed"
        ) : (
          `Subscribe ${plan.title}`
        )}
      </motion.button>
    </motion.div>
  );
}

/* ================= STATUS BANNER ================= */
function StatusBanner({ status, currentPlan, trialEnd, currentPeriodEnd, getDaysLeft }) {
  const configs = {
    PENDING_AUTH: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: "⏳",
      title: "Autopay setup pending",
      message: "Please complete the mandate approval to activate your subscription.",
    },
    TRIALING: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "✨",
      title: "You're on a Free Trial",
      message: trialEnd ? (
        <>
          Trial ends on <span className="font-bold">{new Date(trialEnd).toLocaleDateString()}</span>
          {" · "}{getDaysLeft(trialEnd)} days left
        </>
      ) : null,
    },
    ACTIVE: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "🎉",
      title: `You're Subscribed (${currentPlan})`,
      message: currentPeriodEnd ? (
        <>
          Valid until <span className="font-bold">{new Date(currentPeriodEnd).toLocaleDateString()}</span>
          {" · "}{getDaysLeft(currentPeriodEnd)} days left
        </>
      ) : null,
    },
    EXPIRED: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "⚠️",
      title: "Subscription expired",
      message: "Please renew to continue using premium features.",
    },
  };

  const config = configs[status];
  if (!config) return null;

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-6`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <p className={`${config.text} font-bold text-lg mb-1`}>
            {config.title}
          </p>
          {config.message && (
            <p className={`${config.text} text-sm`}>
              {config.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}