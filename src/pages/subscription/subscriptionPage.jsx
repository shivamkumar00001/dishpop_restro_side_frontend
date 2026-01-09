import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
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
        theme: { color: "#22d3ee" },
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

  // Trial still valid
  if (
    subscriptionStatus === "TRIALING" &&
    trialEnd &&
    now < new Date(trialEnd)
  ) {
    return true;
  }

  // Paid subscription still valid
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
    <div className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-bold">
          Choose Your <span className="text-cyan-400">Plan</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Simple pricing. No hidden charges. Cancel anytime.
        </p>
      </div>

      {/* ================= PLANS ================= */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`relative bg-gradient-to-br from-gray-900 to-black 
              border rounded-2xl p-8 transition-all
              ${
                plan.popular
                  ? "border-cyan-500 scale-105"
                  : "border-gray-800"
              }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-6 bg-cyan-500 text-black px-3 py-1 text-sm font-semibold rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-semibold mb-2">
              {plan.title}
            </h3>

            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold">
                ₹{plan.price}
              </span>
              <span className="text-gray-400 line-through">
                ₹{plan.original}
              </span>
            </div>

            <span className="inline-block mb-6 text-green-400 font-semibold">
              {plan.off}% OFF
            </span>

            <ul className="space-y-3 text-gray-300 mb-8">
              {[
                "Unlimited Orders",
                "Live Order Management",
                "AR Menu Support",
                "Customer Feedback",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="text-cyan-400" size={18} />
                  {f}
                </li>
              ))}
            </ul>

           <button
  onClick={() => {
    if (hasActiveSubscription()) {
      alert("You already have an active subscription.");
      return;
    }
    handleSubscribe(plan.key);
  }}
  disabled={loadingPlan !== null}
  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all
    ${
      loadingPlan === plan.key
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-cyan-500 hover:bg-cyan-600 text-black"
    }
  `}
>
  {loadingPlan === plan.key ? (
    <>
      <Loader2 className="animate-spin" size={18} />
      Processing...
    </>
  ) : hasActiveSubscription() ? (
    "Already Subscribed"
  ) : (
    `Subscribe ${plan.title}`
  )}
</button>

          </div>
        ))}
      </div>

      
    {/* ================= STATUS ================= */}
          <div className="max-w-3xl mx-auto mt-12 text-center space-y-4">

            {subscriptionStatus === "PENDING_AUTH" && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-400 font-semibold">
                  Autopay setup pending
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Please complete the mandate approval to activate your subscription.
                </p>
              </div>
            )}

            {subscriptionStatus === "TRIALING" && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-semibold text-lg">
                  ✅ You’re on a Free Trial
                </p>
                {trialEnd && (
                  <p className="text-gray-300 mt-1">
                    Trial ends on{" "}
                    <span className="font-semibold">
                      {new Date(trialEnd).toLocaleDateString()}
                    </span>{" "}
                    · {getDaysLeft(trialEnd)} days left
                  </p>
                )}
              </div>
            )}

            {subscriptionStatus === "ACTIVE" && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-semibold text-lg">
                  🎉 You’re Subscribed ({currentPlan})
                </p>
                {currentPeriodEnd && (
                  <p className="text-gray-300 mt-1">
                    Subscription valid until{" "}
                    <span className="font-semibold">
                      {new Date(currentPeriodEnd).toLocaleDateString()}
                    </span>{" "}
                    · {getDaysLeft(currentPeriodEnd)} days left
                  </p>
                )}
              </div>
            )}

            {subscriptionStatus === "EXPIRED" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 font-semibold">
                  Subscription expired
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Please renew to continue using premium features.
                </p>
              </div>
            )}

          </div>

    </div>
  );
}
