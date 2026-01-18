 
// // import { useEffect, useState } from "react";
// // import api from "../../services/api";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-hot-toast";

// // import {
// //   User,
// //   Mail,
// //   Phone,
// //   MapPin,
// //   Edit3,
// //   LogOut,
// //   Building2,
// //   Award,
// //   Star,
// //   UtensilsCrossed,
// //   Receipt,
// // } from "lucide-react";

// // /* ================= HELPERS ================= */

// // const PLAN_LABEL = {
// //   MONTHLY: "Monthly",
// //   QUARTERLY: "Quarterly",
// //   YEARLY: "Yearly",
// // };

// // const STATUS_LABEL = {
// //   NOT_SUBSCRIBED: "Free",
// //   PENDING_AUTH: "Pending Setup",
// //   TRIALING: "Free Trial",
// //   ACTIVE: "Active",
// //   CANCELLED: "Cancelled",
// //   EXPIRED: "Expired",
// // };

// // const formatDate = (date) =>
// //   date ? new Date(date).toLocaleDateString() : "—";

// // /* ================= COMPONENT ================= */

// // export default function Profile() {
// //   const [user, setUser] = useState(null);
// //   const [stats, setStats] = useState({ dishes: 0, rating: null });
// //   const [subscription, setSubscription] = useState(null);
// //   const [billing, setBilling] = useState(null);

// //   const navigate = useNavigate();

// //   /* ---------------- LOAD PROFILE + SUBSCRIPTION + BILLING ---------------- */
// //   useEffect(() => {
// //     const loadProfile = async () => {
// //       try {
// //         const [profileRes, subRes, billingRes] = await Promise.all([
// //           api.get("/auth/profile"),
// //           api.get("/subscription-status/me"),
// //           api.get("/billing/me").catch(() => null),
// //         ]);

// //         setUser(profileRes.data.user);
// //         setStats(profileRes.data.stats || { dishes: 0, rating: null });
// //         setSubscription(subRes.data);
// //         setBilling(billingRes?.data?.billingConfig || null);
// //       } catch {
// //         toast.error("Session expired");
// //         navigate("/login");
// //       }
// //     };

// //     loadProfile();
// //   }, [navigate]);

// //   /* ---------------- LOGOUT ---------------- */
// //   const logout = async () => {
// //     try {
// //       await api.post("/auth/logout");
// //       localStorage.removeItem("token");
// //       navigate("/login");
// //     } catch {
// //       toast.error("Logout failed");
// //     }
// //   };

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
// //         Loading profile…
// //       </div>
// //     );
// //   }

// //   const initials =
// //     user.ownerName
// //       ?.split(" ")
// //       .filter(Boolean)
// //       .map((n) => n[0])
// //       .join("")
// //       .toUpperCase() || "R";

// //   return (
// //     <div className="min-h-screen bg-black text-white px-4 py-12">
// //       <div className="mx-auto max-w-6xl space-y-12">

// //         {/* ================= HEADER ================= */}
// //         <section className="flex flex-col lg:flex-row lg:items-center gap-8">
// //           <div className="flex-shrink-0">
// //             <div
// //               className="w-24 h-24 rounded-2xl
// //               bg-gradient-to-br from-cyan-500/90 to-blue-600/90
// //               flex items-center justify-center text-3xl font-bold
// //               ring-1 ring-white/10 shadow-lg"
// //             >
// //               {initials}
// //             </div>
// //           </div>

// //           <div className="flex-1 space-y-2">
// //             <h1 className="text-3xl font-semibold tracking-tight">
// //               {user.ownerName}
// //             </h1>

// //             <p className="text-cyan-400 text-base font-medium">
// //               {user.restaurantName}
// //             </p>

// //             <div className="flex flex-wrap gap-2 pt-2">
// //               {user.city && user.state && (
// //                 <Badge
// //                   icon={<MapPin size={14} />}
// //                   text={`${user.city}, ${user.state}`}
// //                 />
// //               )}
// //               <Badge icon={<Award size={14} />} text="Verified Business" />
// //             </div>
// //           </div>

// //           <div className="flex flex-col sm:flex-row gap-3">
// //             <ActionButton
// //               label="Edit Profile"
// //               icon={<Edit3 size={16} />}
// //               onClick={() => navigate("/settings/edit")}
// //               variant="primary"
// //             />
// //             <ActionButton
// //               label="Logout"
// //               icon={<LogOut size={16} />}
// //               onClick={logout}
// //               variant="danger"
// //             />
// //           </div>
// //         </section>

// //         {/* ================= STATS ================= */}
// //         <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <StatCard
// //             icon={<UtensilsCrossed />}
// //             label="Dishes"
// //             value={stats.dishes}
// //           />
// //           <StatCard
// //             icon={<Star />}
// //             label="Rating"
// //             value={stats.rating ?? "—"}
// //           />
// //           <StatCard
// //             icon={<Award />}
// //             label="Plan"
// //             value={PLAN_LABEL[subscription?.plan] || "Free"}
// //           />
// //           <StatCard
// //             icon={<User />}
// //             label="Status"
// //             value={STATUS_LABEL[subscription?.computedStatus] || "—"}
// //           />
// //         </section>

// //         {/* ================= DETAILS ================= */}
// //         <section
// //           className="rounded-2xl border border-white/10
// //           bg-white/[0.04] backdrop-blur-xl
// //           shadow-lg p-8 space-y-10"
// //         >
// //           <InfoSection title="Contact Information">
// //             <InfoRow icon={<Mail />} value={user.email} />
// //             <InfoRow icon={<Phone />} value={user.phone} />
// //           </InfoSection>

// //           <Divider />

// //           <InfoSection title="Business Details">
// //             <InfoRow icon={<Building2 />} value={user.restaurantName} />
// //             <InfoRow icon={<MapPin />} value={`${user.city}, ${user.state}`} />
// //             {user.pincode && <InfoRow value={`Pincode: ${user.pincode}`} />}
// //           </InfoSection>

// //           {/* ================= BILLING SECTION ================= */}
// //           <Divider />

// //           <InfoSection title="Billing Details">
// //             {billing ? (
// //               <>
// //                 <InfoRow icon={<Receipt />} value={`Legal Name: ${billing.legalName}`} />
// //                 <InfoRow value={`PAN: ${billing.panNumber}`} />
// //                 <InfoRow value={`GST: ${billing.gstNumber || "Not Applicable"}`} />
// //                 <InfoRow value={`Tax Type: ${billing.taxType}`} />
// //                 <InfoRow value={`Tax Rate: ${billing.taxRate}%`} />
// //                 <InfoRow
// //                   value={`Address: ${billing.address}, ${billing.state} - ${billing.pincode}`}
// //                 />
// //               </>
// //             ) : (
// //               <p className="text-sm text-gray-400">
// //                 Billing not configured yet. Required for invoices & orders.
// //               </p>
// //             )}

// //             <div className="pt-2">
// //               <ActionButton
// //                 label={billing ? "Edit Billing" : "Setup Billing"}
// //                 icon={<Receipt size={16} />}
// //                 onClick={() =>
// //                   billing
// //                     ? navigate("/billing/edit")
// //                     : navigate("/billing/setup")
// //                 }
// //                 variant="primary"
// //               />
// //             </div>
// //           </InfoSection>

// //           {subscription && subscription.computedStatus !== "NOT_SUBSCRIBED" && (
// //             <>
// //               <Divider />
// //               <InfoSection title="Subscription Details">
// //                 <InfoRow
// //                   icon={<Award />}
// //                   value={`Plan: ${PLAN_LABEL[subscription.plan]}`}
// //                 />
// //                 <InfoRow
// //                   value={`Status: ${STATUS_LABEL[subscription.computedStatus]}`}
// //                 />
// //                 {subscription.computedStatus === "TRIALING" && (
// //                   <InfoRow
// //                     value={`Trial ends on: ${formatDate(
// //                       subscription.trialEnd
// //                     )}`}
// //                   />
// //                 )}
// //                 {subscription.currentPeriodEnd && (
// //                   <InfoRow
// //                     value={`Valid till: ${formatDate(
// //                       subscription.currentPeriodEnd
// //                     )}`}
// //                   />
// //                 )}
// //               </InfoSection>
// //             </>
// //           )}

// //           {user.description && (
// //             <>
// //               <Divider />
// //               <InfoSection title="About Restaurant">
// //                 <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
// //                   {user.description}
// //                 </p>
// //               </InfoSection>
// //             </>
// //           )}
// //         </section>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ================= UI COMPONENTS ================= */

// // function Badge({ icon, text }) {
// //   return (
// //     <span
// //       className="flex items-center gap-1.5 rounded-full
// //       border border-white/10 bg-white/5
// //       px-3 py-1.5 text-xs text-gray-300"
// //     >
// //       <span className="text-cyan-400">{icon}</span>
// //       {text}
// //     </span>
// //   );
// // }

// // function StatCard({ icon, label, value }) {
// //   return (
// //     <div
// //       className="rounded-xl border border-white/10 bg-white/[0.04]
// //       py-6 px-4 text-center
// //       shadow-sm hover:bg-white/[0.06] transition"
// //     >
// //       <div className="flex justify-center text-cyan-400 mb-2">
// //         {icon}
// //       </div>
// //       <p className="text-2xl font-semibold">{value}</p>
// //       <p className="text-sm text-gray-400 mt-1">{label}</p>
// //     </div>
// //   );
// // }

// // function InfoSection({ title, children }) {
// //   return (
// //     <div className="space-y-4">
// //       <h3 className="text-base font-semibold tracking-tight">
// //         {title}
// //       </h3>
// //       <div className="space-y-3">{children}</div>
// //     </div>
// //   );
// // }

// // function InfoRow({ icon, value }) {
// //   return (
// //     <div className="flex items-center gap-3 text-sm text-gray-300">
// //       {icon && <span className="text-cyan-400">{icon}</span>}
// //       <span>{value}</span>
// //     </div>
// //   );
// // }

// // function Divider() {
// //   return <div className="h-px bg-white/10" />;
// // }

// // function ActionButton({ label, icon, onClick, variant }) {
// //   const base =
// //     "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5";

// //   const styles = {
// //     primary:
// //       "bg-cyan-600 hover:bg-cyan-700 shadow shadow-cyan-500/25",
// //     danger:
// //       "bg-red-600 hover:bg-red-700 shadow shadow-red-500/25",
// //   };

// //   return (
// //     <button onClick={onClick} className={`${base} ${styles[variant]}`}>
// //       {icon}
// //       {label}
// //     </button>
// //   );
// // }



// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import api from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Edit3,
//   LogOut,
//   Building2,
//   Award,
//   Star,
//   UtensilsCrossed,
//   Receipt,
//   CheckCircle,
//   Crown,
//   Calendar,
//   Sparkles,
// } from "lucide-react";

// /* ================= HELPERS ================= */

// const PLAN_LABEL = {
//   MONTHLY: "Monthly",
//   QUARTERLY: "Quarterly",
//   YEARLY: "Yearly",
// };

// const STATUS_LABEL = {
//   NOT_SUBSCRIBED: "Free",
//   PENDING_AUTH: "Pending Setup",
//   TRIALING: "Free Trial",
//   ACTIVE: "Active",
//   CANCELLED: "Cancelled",
//   EXPIRED: "Expired",
// };

// const formatDate = (date) =>
//   date ? new Date(date).toLocaleDateString() : "—";

// /* ================= COMPONENT ================= */

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({ dishes: 0, rating: null });
//   const [subscription, setSubscription] = useState(null);
//   const [billing, setBilling] = useState(null);

//   const navigate = useNavigate();

//   /* ---------------- LOAD PROFILE + SUBSCRIPTION + BILLING ---------------- */
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const [profileRes, subRes, billingRes] = await Promise.all([
//           api.get("/auth/profile"),
//           api.get("/subscription-status/me"),
//           api.get("/billing/me").catch(() => null),
//         ]);

//         setUser(profileRes.data.user);
//         setStats(profileRes.data.stats || { dishes: 0, rating: null });
//         setSubscription(subRes.data);
//         setBilling(billingRes?.data?.billingConfig || null);
//       } catch {
//         toast.error("Session expired");
//         navigate("/login");
//       }
//     };

//     loadProfile();
//   }, [navigate]);

//   /* ---------------- LOGOUT ---------------- */
//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } catch {
//       toast.error("Logout failed");
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center gap-3"
//         >
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-600 font-medium">Loading profile…</p>
//         </motion.div>
//       </div>
//     );
//   }

//   const initials =
//     user.ownerName
//       ?.split(" ")
//       .filter(Boolean)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase() || "R";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
//       {/* Grain Texture */}
//       <div 
//         className="fixed inset-0 opacity-[0.015] pointer-events-none"
//         style={{ 
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
//         }}
//       />

//       <div className="mx-auto max-w-6xl space-y-8 relative z-10">

//         {/* ================= HEADER ================= */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center gap-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
//         >
//           <div className="flex-shrink-0">
//             <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/30 text-white">
//               {initials}
//             </div>
//           </div>

//           <div className="flex-1 space-y-3">
//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//               {user.ownerName}
//             </h1>

//             <p className="text-lg text-blue-600 font-semibold">
//               {user.restaurantName}
//             </p>

//             <div className="flex flex-wrap gap-2 pt-2">
//               {user.city && user.state && (
//                 <Badge
//                   icon={<MapPin size={14} />}
//                   text={`${user.city}, ${user.state}`}
//                 />
//               )}
//               <Badge 
//                 icon={<CheckCircle size={14} />} 
//                 text="Verified Business"
//                 variant="success" 
//               />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <ActionButton
//               label="Edit Profile"
//               icon={<Edit3 size={16} />}
//               onClick={() => navigate("/settings/edit")}
//               variant="primary"
//             />
//             <ActionButton
//               label="Logout"
//               icon={<LogOut size={16} />}
//               onClick={logout}
//               variant="danger"
//             />
//           </div>
//         </motion.section>

//         {/* ================= STATS ================= */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-2 md:grid-cols-4 gap-4"
//         >
//           <StatCard
//             icon={<UtensilsCrossed />}
//             label="Dishes"
//             value={stats.dishes}
//             delay={0.2}
//           />
//           <StatCard
//             icon={<Star />}
//             label="Rating"
//             value={stats.rating ?? "—"}
//             delay={0.25}
//           />
//           <StatCard
//             icon={<Crown />}
//             label="Plan"
//             value={PLAN_LABEL[subscription?.plan] || "Free"}
//             delay={0.3}
//           />
//           <StatCard
//             icon={<Sparkles />}
//             label="Status"
//             value={STATUS_LABEL[subscription?.computedStatus] || "—"}
//             delay={0.35}
//           />
//         </motion.section>

//         {/* ================= DETAILS ================= */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 space-y-8"
//         >
//           <InfoSection title="Contact Information">
//             <InfoRow icon={<Mail />} value={user.email} />
//             <InfoRow icon={<Phone />} value={user.phone} />
//           </InfoSection>

//           <Divider />

//           <InfoSection title="Business Details">
//             <InfoRow icon={<Building2 />} value={user.restaurantName} />
//             <InfoRow icon={<MapPin />} value={`${user.city}, ${user.state}`} />
//             {user.pincode && <InfoRow value={`Pincode: ${user.pincode}`} />}
//           </InfoSection>

//           {/* ================= BILLING SECTION ================= */}
//           <Divider />

//           <InfoSection title="Billing Details">
//             {billing ? (
//               <>
//                 <InfoRow icon={<Receipt />} value={`Legal Name: ${billing.legalName}`} />
//                 <InfoRow value={`PAN: ${billing.panNumber}`} />
//                 <InfoRow value={`GST: ${billing.gstNumber || "Not Applicable"}`} />
//                 <InfoRow value={`Tax Type: ${billing.taxType}`} />
//                 <InfoRow value={`Tax Rate: ${billing.taxRate}%`} />
//                 <InfoRow
//                   value={`Address: ${billing.address}, ${billing.state} - ${billing.pincode}`}
//                 />
//               </>
//             ) : (
//               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
//                 <p className="text-sm text-amber-800">
//                   Billing not configured yet. Required for invoices & orders.
//                 </p>
//               </div>
//             )}

//             <div className="pt-2">
//               <ActionButton
//                 label={billing ? "Edit Billing" : "Setup Billing"}
//                 icon={<Receipt size={16} />}
//                 onClick={() =>
//                   billing
//                     ? navigate("/billing/edit")
//                     : navigate("/billing/setup")
//                 }
//                 variant="secondary"
//               />
//             </div>
//           </InfoSection>

//           {subscription && subscription.computedStatus !== "NOT_SUBSCRIBED" && (
//             <>
//               <Divider />
//               <InfoSection title="Subscription Details">
//                 <InfoRow
//                   icon={<Crown />}
//                   value={`Plan: ${PLAN_LABEL[subscription.plan]}`}
//                 />
//                 <InfoRow
//                   value={`Status: ${STATUS_LABEL[subscription.computedStatus]}`}
//                 />
//                 {subscription.computedStatus === "TRIALING" && (
//                   <InfoRow
//                     icon={<Calendar />}
//                     value={`Trial ends on: ${formatDate(subscription.trialEnd)}`}
//                   />
//                 )}
//                 {subscription.currentPeriodEnd && (
//                   <InfoRow
//                     icon={<Calendar />}
//                     value={`Valid till: ${formatDate(subscription.currentPeriodEnd)}`}
//                   />
//                 )}
//               </InfoSection>
//             </>
//           )}

//           {user.description && (
//             <>
//               <Divider />
//               <InfoSection title="About Restaurant">
//                 <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
//                   {user.description}
//                 </p>
//               </InfoSection>
//             </>
//           )}
//         </motion.section>
//       </div>
//     </div>
//   );
// }

// /* ================= UI COMPONENTS ================= */

// function Badge({ icon, text, variant = "default" }) {
//   const variants = {
//     default: "border-slate-200 bg-slate-50 text-slate-700",
//     success: "border-emerald-200 bg-emerald-50 text-emerald-700",
//   };

//   return (
//     <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${variants[variant]}`}>
//       <span className={variant === "success" ? "text-emerald-600" : "text-blue-600"}>{icon}</span>
//       {text}
//     </span>
//   );
// }

// function StatCard({ icon, label, value, delay }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay }}
//       whileHover={{ y: -4, scale: 1.02 }}
//       className="rounded-xl border border-slate-200 bg-white py-6 px-4 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
//     >
//       <div className="flex justify-center text-blue-600 mb-3">
//         {icon}
//       </div>
//       <p className="text-2xl font-bold text-slate-900">{value}</p>
//       <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
//     </motion.div>
//   );
// }

// function InfoSection({ title, children }) {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
//         {title}
//       </h3>
//       <div className="space-y-3">{children}</div>
//     </div>
//   );
// }

// function InfoRow({ icon, value }) {
//   return (
//     <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
//       {icon && <span className="text-blue-600">{icon}</span>}
//       <span className="font-medium">{value}</span>
//     </div>
//   );
// }

// function Divider() {
//   return <div className="h-px bg-slate-200" />;
// }

// function ActionButton({ label, icon, onClick, variant }) {
//   const base =
//     "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300";

//   const styles = {
//     primary:
//       "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105",
//     secondary:
//       "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
//     danger:
//       "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",
//   };

//   return (
//     <motion.button 
//       onClick={onClick} 
//       className={`${base} ${styles[variant]}`}
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       {icon}
//       {label}
//     </motion.button>
//   );
// }




import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  LogOut,
  Building2,
  Award,
  Star,
  UtensilsCrossed,
  Receipt,
  CheckCircle,
  Crown,
  Calendar,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

/* ================= HELPERS ================= */

const PLAN_LABEL = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

const STATUS_LABEL = {
  NOT_SUBSCRIBED: "Free",
  PENDING_AUTH: "Pending Setup",
  TRIALING: "Free Trial",
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "—";

/* ================= COMPONENT ================= */

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ dishes: 0, rating: null });
  const [subscription, setSubscription] = useState(null);
  const [billing, setBilling] = useState(null);

  const navigate = useNavigate();

  /* ---------------- LOAD PROFILE + SUBSCRIPTION + BILLING ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileRes, subRes, billingRes] = await Promise.all([
          api.get("/auth/profile"),
          api.get("/subscription-status/me"),
          api.get("/billing/me").catch(() => null),
        ]);

        setUser(profileRes.data.user);
        setStats(profileRes.data.stats || { dishes: 0, rating: null });
        setSubscription(subRes.data);
        setBilling(billingRes?.data?.billingConfig || null);
      } catch {
        toast.error("Session expired");
        navigate("/login");
      }
    };

    loadProfile();
  }, [navigate]);

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading profile…</p>
        </motion.div>
      </div>
    );
  }

  const initials =
    user.ownerName
      ?.split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "R";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4 py-12">
      {/* Grain Texture */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <div className="mx-auto max-w-6xl space-y-8 relative z-10">

        {/* Back Button */}
        {/* <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </motion.div> */}


        {/* Back Button */}
{/* <motion.div 
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
>
  <button
    onClick={() => {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // If no history, go to dashboard or home
        if (username) {
          navigate(`/$owner.username}/dashboard`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }}
    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
  >
    <ArrowLeft size={20} />
    Back
  </button>
</motion.div> */}

<motion.div 
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
>
  <button
    onClick={() => {
      if (user?.username) {
        navigate(`/${user.username}/dashboard`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }}
    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
  >
    <ArrowLeft size={20} />
    Back to Dashboard
  </button>
</motion.div>

        {/* ================= HEADER ================= */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center gap-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
        >
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/30 text-white">
              {initials}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {user.ownerName}
            </h1>

            <p className="text-lg text-blue-600 font-semibold">
              {user.restaurantName}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {user.city && user.state && (
                <Badge
                  icon={<MapPin size={14} />}
                  text={`${user.city}, ${user.state}`}
                />
              )}
              <Badge 
                icon={<CheckCircle size={14} />} 
                text="Verified Business"
                variant="success" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ActionButton
              label="Edit Profile"
              icon={<Edit3 size={16} />}
              onClick={() => navigate("/settings/edit")}
              variant="primary"
            />
            <ActionButton
              label="Logout"
              icon={<LogOut size={16} />}
              onClick={logout}
              variant="danger"
            />
          </div>
        </motion.section>

        {/* ================= STATS ================= */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<UtensilsCrossed />}
            label="Dishes"
            value={stats.dishes}
            delay={0.2}
          />
          <StatCard
            icon={<Star />}
            label="Rating"
            value={stats.rating ?? "—"}
            delay={0.25}
          />
          <StatCard
            icon={<Crown />}
            label="Plan"
            value={PLAN_LABEL[subscription?.plan] || "Free"}
            delay={0.3}
          />
          <StatCard
            icon={<Sparkles />}
            label="Status"
            value={STATUS_LABEL[subscription?.computedStatus] || "—"}
            delay={0.35}
          />
        </motion.section>

        {/* ================= DETAILS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 space-y-8"
        >
          <InfoSection title="Contact Information">
            <InfoRow icon={<Mail />} value={user.email} />
            <InfoRow icon={<Phone />} value={user.phone} />
          </InfoSection>

          <Divider />

          <InfoSection title="Business Details">
            <InfoRow icon={<Building2 />} value={user.restaurantName} />
            <InfoRow icon={<MapPin />} value={`${user.city}, ${user.state}`} />
            {user.pincode && <InfoRow value={`Pincode: ${user.pincode}`} />}
          </InfoSection>

          {/* ================= BILLING SECTION ================= */}
          <Divider />

          <InfoSection title="Billing Details">
            {billing ? (
              <>
                <InfoRow icon={<Receipt />} value={`Legal Name: ${billing.legalName}`} />
                <InfoRow value={`PAN: ${billing.panNumber}`} />
                <InfoRow value={`GST: ${billing.gstNumber || "Not Applicable"}`} />
                <InfoRow value={`Tax Type: ${billing.taxType}`} />
                <InfoRow value={`Tax Rate: ${billing.taxRate}%`} />
                <InfoRow
                  value={`Address: ${billing.address}, ${billing.state} - ${billing.pincode}`}
                />
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  Billing not configured yet. Required for invoices & orders.
                </p>
              </div>
            )}

            <div className="pt-2">
              <ActionButton
                label={billing ? "Edit Billing" : "Setup Billing"}
                icon={<Receipt size={16} />}
                onClick={() =>
                  billing
                    ? navigate("/billing/edit")
                    : navigate("/billing/setup")
                }
                variant="secondary"
              />
            </div>
          </InfoSection>

          {subscription && subscription.computedStatus !== "NOT_SUBSCRIBED" && (
            <>
              <Divider />
              <InfoSection title="Subscription Details">
                <InfoRow
                  icon={<Crown />}
                  value={`Plan: ${PLAN_LABEL[subscription.plan]}`}
                />
                <InfoRow
                  value={`Status: ${STATUS_LABEL[subscription.computedStatus]}`}
                />
                {subscription.computedStatus === "TRIALING" && (
                  <InfoRow
                    icon={<Calendar />}
                    value={`Trial ends on: ${formatDate(subscription.trialEnd)}`}
                  />
                )}
                {subscription.currentPeriodEnd && (
                  <InfoRow
                    icon={<Calendar />}
                    value={`Valid till: ${formatDate(subscription.currentPeriodEnd)}`}
                  />
                )}
              </InfoSection>
            </>
          )}

          {user.description && (
            <>
              <Divider />
              <InfoSection title="About Restaurant">
                <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                  {user.description}
                </p>
              </InfoSection>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Badge({ icon, text, variant = "default" }) {
  const variants = {
    default: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${variants[variant]}`}>
      <span className={variant === "success" ? "text-emerald-600" : "text-blue-600"}>{icon}</span>
      {text}
    </span>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-xl border border-slate-200 bg-white py-6 px-4 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex justify-center text-blue-600 mb-3">
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
    </motion.div>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
      {icon && <span className="text-blue-600">{icon}</span>}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-200" />;
}

function ActionButton({ label, icon, onClick, variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300";

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105",
    secondary:
      "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50",
    danger:
      "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",
  };

  return (
    <motion.button 
      onClick={onClick} 
      className={`${base} ${styles[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      {label}
    </motion.button>
  );
}