// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function SubscriptionPage() {
//   const [loading, setLoading] = useState(false);
//   const [subscriptionStatus, setSubscriptionStatus] = useState(null);
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const [trialEnd, setTrialEnd] = useState(null);

//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:5001/api/subscription/status",
//           { withCredentials: true }
//         );

//         if (data.subscription) {
//           setSubscriptionStatus(data.subscription.status);
//           setCurrentPlan(data.subscription.plan);
//           setTrialEnd(data.subscription.trialEnd);
//         }
//       } catch (err) {
//         console.error("Failed to fetch subscription info:", err);
//       }
//     };

//     fetchSubscription();
//   }, []);

//   const handleSubscribe = async (plan) => {
//     if (loading) return; // 🔒 prevent double click
//     setLoading(true);

//     try {
//       const { data } = await axios.post(
//         "http://localhost:5001/api/subscription/create",
//         { plan },
//         { withCredentials: true }
//       );

//       const { subscriptionId, razorpayKey, trialEnd } = data;

//       setTrialEnd(trialEnd);
//       setCurrentPlan(plan);
//       setSubscriptionStatus("TRIALING");

//       const loaded = await loadRazorpayScript();
//       if (!loaded) {
//         alert("Razorpay SDK failed to load");
//         return;
//       }

//       const options = {
//         key: razorpayKey,
//         subscription_id: subscriptionId,
//         name: "DishPop Restaurant",
//         description: `${plan} Plan Subscription`,
//         handler: function (response) {
//           console.log("Razorpay Response:", response);
//           alert("Subscription initiated successfully!");
//           window.location.reload();
//         },
//         theme: { color: "#3399cc" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error("Subscription error:", error);

//       const msg =
//         error.response?.data?.message ||
//         error.response?.data?.razorpay?.description ||
//         "Failed to initiate subscription";

//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Choose a Subscription Plan</h2>

//       {["MONTHLY", "QUARTERLY", "YEARLY"].map((plan) => (
//         <div key={plan} style={{ margin: "1rem 0" }}>
//           <button
//             onClick={() => handleSubscribe(plan)}
//             disabled={loading || ["TRIALING", "ACTIVE"].includes(subscriptionStatus)}
//           >
//             {loading ? "Processing..." : `Subscribe ${plan}`}
//           </button>
//         </div>
//       ))}

//       {subscriptionStatus && trialEnd && (
//         <div style={{ marginTop: "2rem", color: "green" }}>
//           <p>Status: <strong>{subscriptionStatus}</strong></p>
//           <p>Current Plan: <strong>{currentPlan}</strong></p>
//           <p>Trial ends on: <strong>{new Date(trialEnd).toLocaleDateString()}</strong></p>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import api from "../../lib/api"; // adjust path if needed


export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [trialEnd, setTrialEnd] = useState(null);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // 🔄 Always fetch status from backend
  const fetchSubscription = async () => {
    try {
      const { data } = await api.get(
        "/api/subscription/status",
        { withCredentials: true }
      );

      if (data.subscription) {
        setSubscriptionStatus(data.subscription.status);
        setCurrentPlan(data.subscription.plan || null);
        setTrialEnd(data.subscription.trialEnd || null);
      }
    } catch (err) {
      console.error("Failed to fetch subscription info:", err);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan) => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await api.post(
        "/api/subscription/create",
        { plan },
        { withCredentials: true }
      );

      const { subscriptionId, razorpayKey } = data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: "DishPop Restaurant",
        description: `${plan} Plan Subscription`,
        handler: function () {
          alert("Autopay setup completed. Status will update shortly.");
          setTimeout(fetchSubscription, 2000);
        },
        modal: {
          ondismiss: function () {
            // 🔥 User closed popup → no status change
            setTimeout(fetchSubscription, 1000);
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.razorpay?.description ||
        "Failed to initiate subscription";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Choose a Subscription Plan</h2>

      {["MONTHLY", "QUARTERLY", "YEARLY"].map((plan) => (
        <div key={plan} style={{ margin: "1rem 0" }}>
          <button
            onClick={() => handleSubscribe(plan)}
            disabled={
              loading ||
              ["TRIALING", "ACTIVE"].includes(subscriptionStatus)
            }
          >
            {loading ? "Processing..." : `Subscribe ${plan}`}
          </button>
        </div>
      ))}

      {/* 🔔 Status messages */}
     {subscriptionStatus === "PENDING_AUTH" && (
  <p style={{ color: "orange" }}>
    Autopay setup incomplete. Please retry payment to activate your subscription.
  </p>
)}


      {subscriptionStatus === "TRIALING" && (
        <p style={{ color: "green" }}>
          Free trial active
          {trialEnd && (
            <> · Ends on {new Date(trialEnd).toLocaleDateString()}</>
          )}
        </p>
      )}

      {subscriptionStatus === "ACTIVE" && (
        <p style={{ color: "green" }}>
          Subscription active ({currentPlan})
        </p>
      )}

      {subscriptionStatus === "EXPIRED" && (
        <p style={{ color: "red" }}>
          Subscription expired due to payment failure.
        </p>
      )}
    </div>
  );
}
