// // import { useEffect, useRef, useState, useCallback } from "react";
// // import { updateOrderStatus, fetchOrders } from "../../api/orderApi";
// // import useLiveOrders from "../../hooks/useLiveOrders";
// // import { toast } from "react-hot-toast";
// // import { useNavigate } from "react-router-dom";
// // import { ChevronRight, Bell, BellRing, Clock, User, Phone } from "lucide-react";
// // import { startContinuousRinging, stopRinging, isRinging } from "../../utils/soundManager";

// // const STORAGE_KEY = "dashboard-live-orders";

// // export default function LiveOrdersPanel({ username }) {
// //   const navigate = useNavigate();
// //   const hasStartedRingingRef = useRef(new Set());

// //   const [orders, setOrders] = useState(() => {
// //     try {
// //       const cached = localStorage.getItem(STORAGE_KEY);
// //       return cached ? JSON.parse(cached) : [];
// //     } catch {
// //       return [];
// //     }
// //   });

// //   const [isLoading, setIsLoading] = useState(true);
// //   const [actionLoading, setActionLoading] = useState({});
// //   const [ringingOrderId, setRingingOrderId] = useState(null);

// //   /* ===============================
// //      INITIAL FETCH
// //   =============================== */
// //   useEffect(() => {
// //     if (!username) return;

// //     (async () => {
// //       try {
// //         setIsLoading(true);
// //         const res = await fetchOrders(username);

// //         const latestPending = (res.data || [])
// //           .filter((o) => o.status === "pending")
// //           .slice(0, 3);

// //         setOrders(latestPending);
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPending));

// //         if (latestPending.length > 0 && !hasStartedRingingRef.current.has(latestPending[0]._id)) {
// //           startContinuousRinging(latestPending[0]._id, 3000);
// //           setRingingOrderId(latestPending[0]._id);
// //           hasStartedRingingRef.current.add(latestPending[0]._id);
// //         }
// //       } catch (err) {
// //         console.warn("LiveOrders fallback fetch failed:", err);
// //         toast.error("Failed to load live orders", {
// //           position: "top-right",
// //           style: {
// //             background: "#2e1a1a",
// //             color: "#fff",
// //             border: "1px solid #ef4444",
// //           },
// //         });
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     })();
// //   }, [username]);

// //   useEffect(() => {
// //     return () => {
// //       stopRinging();
// //     };
// //   }, []);

// //   /* ===============================
// //      SOCKET EVENTS
// //   =============================== */
// //   const handleLiveOrder = useCallback((type, order) => {
// //     console.log("📦 Live order event:", type, order);

// //     if (type === "created" && order.status === "pending") {
// //       setOrders((prev) => {
// //         if (prev.some((o) => o._id === order._id)) return prev;
        
// //         const updated = [order, ...prev].slice(0, 3);
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
// //         toast.success(`New order from ${order.customerName || "Guest"} - Table ${order.tableNumber}`, {
// //           icon: "🔔",
// //           duration: 5000,
// //         });
        
// //         return updated;
// //       });

// //       if (!hasStartedRingingRef.current.has(order._id)) {
// //         console.log("🔔 Starting continuous ringing for order:", order._id);
// //         startContinuousRinging(order._id, 3000);
// //         setRingingOrderId(order._id);
// //         hasStartedRingingRef.current.add(order._id);
        
// //         if (hasStartedRingingRef.current.size > 50) {
// //           const arr = Array.from(hasStartedRingingRef.current);
// //           hasStartedRingingRef.current = new Set(arr.slice(-50));
// //         }
// //       }
// //     }

// //     if (type === "updated" || type === "replaced") {
// //       setOrders((prev) => {
// //         const updated = prev.filter((o) => o._id !== order._id);
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
// //         if (order._id === ringingOrderId) {
// //           console.log("🔇 Stopping ringing - order updated");
// //           stopRinging();
// //           setRingingOrderId(null);
// //         }
        
// //         return updated;
// //       });
// //     }

// //     if (type === "deleted") {
// //       setOrders((prev) => {
// //         const updated = prev.filter((o) => o._id !== order._id);
// //         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
// //         if (order._id === ringingOrderId) {
// //           console.log("🔇 Stopping ringing - order deleted");
// //           stopRinging();
// //           setRingingOrderId(null);
// //         }
        
// //         return updated;
// //       });
// //     }
// //   }, [ringingOrderId]);

// //   useLiveOrders(username, handleLiveOrder);

// //   /* ===============================
// //      ACTIONS
// //   =============================== */
// //   const handleAction = useCallback(
// //     async (orderId, status) => {
// //       try {
// //         setActionLoading((prev) => ({ ...prev, [orderId]: status }));

// //         console.log("🔇 Stopping ringing - user action:", status);
// //         stopRinging();
// //         setRingingOrderId(null);

// //         await updateOrderStatus(username, orderId, status);
        
// //         toast.success(
// //           status === "confirmed" 
// //             ? "✅ Order accepted successfully!" 
// //             : "❌ Order rejected",
// //           {
// //             duration: 3000,
// //             position: "top-right",
// //             style: {
// //               background: status === "confirmed" ? "#1a2e1a" : "#2e1a1a",
// //               color: "#fff",
// //               border: status === "confirmed" ? "1px solid #22c55e" : "1px solid #ef4444",
// //             },
// //           }
// //         );

// //         setOrders((prev) => {
// //           const updated = prev.filter((o) => o._id !== orderId);
// //           localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          
// //           if (updated.length > 0) {
// //             const nextOrder = updated[0];
// //             if (!hasStartedRingingRef.current.has(nextOrder._id)) {
// //               setTimeout(() => {
// //                 console.log("🔔 Starting ringing for next order:", nextOrder._id);
// //                 startContinuousRinging(nextOrder._id, 3000);
// //                 setRingingOrderId(nextOrder._id);
// //                 hasStartedRingingRef.current.add(nextOrder._id);
// //               }, 500);
// //             }
// //           }
          
// //           return updated;
// //         });
// //       } catch (err) {
// //         console.error("Failed to update order:", err);
// //         toast.error("Failed to update order. Please try again.", {
// //           position: "top-right",
// //           style: {
// //             background: "#2e1a1a",
// //             color: "#fff",
// //             border: "1px solid #ef4444",
// //           },
// //         });
// //       } finally {
// //         setActionLoading((prev) => {
// //           const newState = { ...prev };
// //           delete newState[orderId];
// //           return newState;
// //         });
// //       }
// //     },
// //     [username]
// //   );

// //   const formatTime = (date) => {
// //     if (!date) return "";
// //     const d = new Date(date);
// //     return d.toLocaleTimeString("en-US", {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   /* ===============================
// //      UI
// //   =============================== */
// //   return (
// //     <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
// //       {/* HEADER */}
// //       <div className="flex items-center justify-between mb-5">
// //         <div>
// //           <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
// //             {isRinging() ? (
// //               <BellRing className="w-4 h-4 text-orange-400 animate-bounce" />
// //             ) : (
// //               <Bell className="w-4 h-4 text-blue-400" />
// //             )}
// //             Live Orders
// //             {isRinging() && (
// //               <span className="ml-2 px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] rounded-full animate-pulse">
// //                 RINGING
// //               </span>
// //             )}
// //           </h2>
// //           <p className="text-[11px] text-gray-500 mt-1">
// //             {isRinging() ? "🔔 Bell ringing for new order..." : "Real-time incoming orders"}
// //           </p>
// //         </div>

// //         <div className="flex items-center gap-3">
// //           {orders.length > 0 && (
// //             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
// //               <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
// //               <span className="text-xs text-blue-400 font-medium">
// //                 {orders.length} pending
// //               </span>
// //             </div>
// //           )}

// //           {orders.length >= 3 && (
// //             <button
// //               onClick={() => navigate(`/${username}/orders`)}
// //               className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
// //             >
// //               View all
// //               <ChevronRight className="w-3 h-3" />
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* CONTENT */}
// //       {isLoading ? (
// //         <div className="flex items-center justify-center py-8">
// //           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
// //         </div>
// //       ) : orders.length === 0 ? (
// //         <div className="text-center py-8">
// //           <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
// //             <Bell className="w-6 h-6 text-gray-600" />
// //           </div>
// //           <p className="text-xs text-gray-500">No new orders right now</p>
// //           <p className="text-[10px] text-gray-600 mt-1">
// //             Orders will appear here in real-time
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="space-y-3">
// //           {orders.map((order) => {
// //             const isProcessing = actionLoading[order._id];
// //             const isThisOrderRinging = ringingOrderId === order._id;
            
// //             return (
// //               <div
// //                 key={order._id}
// //                 className={`bg-[#12151D] border rounded-xl p-4 transition relative overflow-hidden ${
// //                   isThisOrderRinging 
// //                     ? "border-orange-500/60 animate-pulse" 
// //                     : "border-[#232A37] hover:border-blue-400/40"
// //                 }`}
// //               >
// //                 {/* Processing overlay - 🔧 FIXED HERE! */}
// //                 {isProcessing && (
// //                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
// //                     <div className="flex items-center gap-2 text-white">
// //                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// //                       <span className="text-sm">
// //                         {/* ✅ Fixed: Check actual status value */}
// //                         {isProcessing === "confirmed" ? "Accepting..." : "Rejecting..."}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Ringing indicator */}
// //                 {isThisOrderRinging && (
// //                   <div className="absolute top-2 right-2 z-20">
// //                     <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full">
// //                       <BellRing className="w-3 h-3 text-orange-400 animate-bounce" />
// //                       <span className="text-[10px] text-orange-400 font-medium">
// //                         RINGING
// //                       </span>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Order header */}
// //                 <div className="flex justify-between items-start mb-3 gap-2 pt-8">
// //                   <div className="flex-1 min-w-0">
// //                     <div className="flex items-center gap-2 mb-1">
// //                       <User className="w-3.5 h-3.5 text-gray-400" />
// //                       <span className="font-medium text-gray-200 text-sm truncate">
// //                         {order.customerName || "Guest"}
// //                       </span>
// //                     </div>
                    
// //                     {order.phoneNumber && (
// //                       <div className="flex items-center gap-2">
// //                         <Phone className="w-3 h-3 text-gray-500" />
// //                         <span className="text-xs text-gray-400 truncate">
// //                           {order.phoneNumber}
// //                         </span>
// //                       </div>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col items-end gap-1 flex-shrink-0 min-w-[80px]">
// //                     <div className="flex items-center gap-1.5 text-xs text-gray-400">
// //                       <Clock className="w-3 h-3" />
// //                       <span className="whitespace-nowrap">{formatTime(order.createdAt)}</span>
// //                     </div>
// //                     <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded text-[10px] font-medium whitespace-nowrap">
// //                       Table {order.tableNumber || "-"}
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {/* Order items */}
// //                 <div className="mb-3 bg-[#0D1017] rounded-lg p-2.5">
// //                   <ul className="text-xs text-gray-300 space-y-1">
// //                     {order.items.slice(0, 2).map((item, idx) => (
// //                       <li key={idx} className="flex justify-between">
// //                         <span>
// //                           {item.name} × {item.qty}
// //                         </span>
// //                         <span className="text-gray-500">
// //                           ₹{item.totalPrice || item.unitPrice * item.qty}
// //                         </span>
// //                       </li>
// //                     ))}
// //                     {order.items.length > 2 && (
// //                       <li className="text-gray-500 text-[11px] italic">
// //                         +{order.items.length - 2} more items
// //                       </li>
// //                     )}
// //                   </ul>
                  
// //                   {/* Total */}
// //                   <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
// //                     <span className="text-xs text-gray-400 font-medium">Total</span>
// //                     <span className="text-sm text-green-400 font-bold">
// //                       ₹{order.grandTotal}
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {/* Description */}
// //                 {order.description && (
// //                   <div className="mb-3 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
// //                     <p className="text-[11px] text-yellow-400/80">
// //                       Note: {order.description}
// //                     </p>
// //                   </div>
// //                 )}

// //                 {/* Actions */}
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => handleAction(order._id, "confirmed")}
// //                     disabled={isProcessing}
// //                     className="flex-1 bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 rounded-lg transition font-medium"
// //                   >
// //                     {/* ✅ Fixed: Check for "confirmed" status */}
// //                     {isProcessing === "confirmed" ? "Accepting..." : "✓ Accept Order"}
// //                   </button>

// //                   <button
// //                     onClick={() => handleAction(order._id, "cancelled")}
// //                     disabled={isProcessing}
// //                     className="flex-1 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 rounded-lg transition font-medium"
// //                   >
// //                     {/* ✅ Fixed: Check for "cancelled" status */}
// //                     {isProcessing === "cancelled" ? "Rejecting..." : "✕ Reject"}
// //                   </button>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }





// import { useEffect, useRef, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { updateOrderStatus, fetchOrders } from "../../api/orderApi";
// import useLiveOrders from "../../hooks/useLiveOrders";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { 
//   ChevronRight, 
//   Bell, 
//   BellRing, 
//   Clock, 
//   User, 
//   Phone,
//   Package,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Sparkles
// } from "lucide-react";
// import { startContinuousRinging, stopRinging, isRinging } from "../../utils/soundManager";

// const STORAGE_KEY = "dashboard-live-orders";

// export default function LiveOrdersPanel({ username }) {
//   const navigate = useNavigate();
//   const hasStartedRingingRef = useRef(new Set());

//   /* =========================
//      STATE MANAGEMENT
//   ========================= */
//   const [orders, setOrders] = useState(() => {
//     try {
//       const cached = localStorage.getItem(STORAGE_KEY);
//       return cached ? JSON.parse(cached) : [];
//     } catch {
//       return [];
//     }
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState({});
//   const [ringingOrderId, setRingingOrderId] = useState(null);

//   /* =========================
//      INITIAL FETCH
//   ========================= */
//   useEffect(() => {
//     if (!username) return;

//     (async () => {
//       try {
//         setIsLoading(true);
//         const res = await fetchOrders(username);

//         const latestPending = (res.data || [])
//           .filter((o) => o.status === "pending")
//           .slice(0, 3);

//         setOrders(latestPending);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPending));

//         if (latestPending.length > 0 && !hasStartedRingingRef.current.has(latestPending[0]._id)) {
//           startContinuousRinging(latestPending[0]._id, 3000);
//           setRingingOrderId(latestPending[0]._id);
//           hasStartedRingingRef.current.add(latestPending[0]._id);
//         }
//       } catch (err) {
//         console.warn("LiveOrders fallback fetch failed:", err);
//         toast.error("Failed to load live orders");
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [username]);

//   useEffect(() => {
//     return () => {
//       stopRinging();
//     };
//   }, []);

//   /* =========================
//      SOCKET EVENTS
//   ========================= */
//   const handleLiveOrder = useCallback((type, order) => {
//     console.log("📦 Live order event:", type, order);

//     if (type === "created" && order.status === "pending") {
//       setOrders((prev) => {
//         if (prev.some((o) => o._id === order._id)) return prev;
        
//         const updated = [order, ...prev].slice(0, 3);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
//         toast.success(`New order from ${order.customerName || "Guest"} - Table ${order.tableNumber}`, {
//           icon: "🔔",
//           duration: 5000,
//         });
        
//         return updated;
//       });

//       if (!hasStartedRingingRef.current.has(order._id)) {
//         console.log("🔔 Starting continuous ringing for order:", order._id);
//         startContinuousRinging(order._id, 3000);
//         setRingingOrderId(order._id);
//         hasStartedRingingRef.current.add(order._id);
        
//         if (hasStartedRingingRef.current.size > 50) {
//           const arr = Array.from(hasStartedRingingRef.current);
//           hasStartedRingingRef.current = new Set(arr.slice(-50));
//         }
//       }
//     }

//     if (type === "updated" || type === "replaced") {
//       setOrders((prev) => {
//         const updated = prev.filter((o) => o._id !== order._id);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
//         if (order._id === ringingOrderId) {
//           console.log("🔇 Stopping ringing - order updated");
//           stopRinging();
//           setRingingOrderId(null);
//         }
        
//         return updated;
//       });
//     }

//     if (type === "deleted") {
//       setOrders((prev) => {
//         const updated = prev.filter((o) => o._id !== order._id);
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
//         if (order._id === ringingOrderId) {
//           console.log("🔇 Stopping ringing - order deleted");
//           stopRinging();
//           setRingingOrderId(null);
//         }
        
//         return updated;
//       });
//     }
//   }, [ringingOrderId]);

//   useLiveOrders(username, handleLiveOrder);

//   /* =========================
//      ACTIONS
//   ========================= */
//   const handleAction = useCallback(
//     async (orderId, status) => {
//       try {
//         setActionLoading((prev) => ({ ...prev, [orderId]: status }));

//         console.log("🔇 Stopping ringing - user action:", status);
//         stopRinging();
//         setRingingOrderId(null);

//         await updateOrderStatus(username, orderId, status);
        
//         toast.success(
//           status === "confirmed" 
//             ? "✅ Order accepted successfully!" 
//             : "❌ Order rejected",
//           { duration: 3000 }
//         );

//         setOrders((prev) => {
//           const updated = prev.filter((o) => o._id !== orderId);
//           localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          
//           if (updated.length > 0) {
//             const nextOrder = updated[0];
//             if (!hasStartedRingingRef.current.has(nextOrder._id)) {
//               setTimeout(() => {
//                 console.log("🔔 Starting ringing for next order:", nextOrder._id);
//                 startContinuousRinging(nextOrder._id, 3000);
//                 setRingingOrderId(nextOrder._id);
//                 hasStartedRingingRef.current.add(nextOrder._id);
//               }, 500);
//             }
//           }
          
//           return updated;
//         });
//       } catch (err) {
//         console.error("Failed to update order:", err);
//         toast.error("Failed to update order. Please try again.");
//       } finally {
//         setActionLoading((prev) => {
//           const newState = { ...prev };
//           delete newState[orderId];
//           return newState;
//         });
//       }
//     },
//     [username]
//   );

//   /* =========================
//      HELPERS
//   ========================= */
//   const formatTime = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return d.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

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
//                 Live Orders
//               </h2>
              
//               {/* Status Badge */}
//               {isRinging() ? (
//                 <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full animate-pulse">
//                   <BellRing className="w-3 h-3 text-orange-500 animate-bounce" />
//                   <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
//                     Ringing
//                   </span>
//                 </div>
//               ) : orders.length > 0 ? (
//                 <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
//                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                   <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
//                     {orders.length} Active
//                   </span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 rounded-full">
//                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
//                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
//                     Idle
//                   </span>
//                 </div>
//               )}
//             </div>
            
//             <p className="text-sm text-slate-500 font-medium">
//               {isRinging() 
//                 ? "🔔 Bell ringing for new order..." 
//                 : "Real-time incoming orders"}
//             </p>
//           </div>

//           {/* Icon Container */}
//           <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
//             <Package className="w-5 h-5 text-blue-600" />
//           </div>
//         </div>

//         {/* View All Link */}
//         {orders.length >= 3 && (
//           <motion.button
//             whileHover={{ x: 4 }}
//             onClick={() => navigate(`/${username}/orders`)}
//             className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold mt-3 transition-colors"
//           >
//             View all orders
//             <ChevronRight className="w-3 h-3" />
//           </motion.button>
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="flex-1 p-6 pt-4 overflow-hidden">
//         {isLoading ? (
//           <LoadingSkeleton />
//         ) : orders.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="h-full overflow-y-auto space-y-3 custom-scrollbar pr-2">
//             <AnimatePresence mode="popLayout">
//               {orders.map((order, index) => (
//                 <OrderCard
//                   key={order._id}
//                   order={order}
//                   index={index}
//                   isRinging={ringingOrderId === order._id}
//                   isProcessing={actionLoading[order._id]}
//                   onAccept={() => handleAction(order._id, "confirmed")}
//                   onReject={() => handleAction(order._id, "cancelled")}
//                   formatTime={formatTime}
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
//    ORDER CARD COMPONENT
// ========================= */
// function OrderCard({ order, index, isRinging, isProcessing, onAccept, onReject, formatTime }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       transition={{
//         delay: index * 0.05,
//         duration: 0.4,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className={`
//         relative bg-white border rounded-xl overflow-hidden
//         transition-all duration-300
//         ${isRinging 
//           ? "border-orange-300 shadow-lg shadow-orange-100 ring-2 ring-orange-200" 
//           : "border-slate-200 hover:border-blue-200 hover:shadow-md"
//         }
//       `}
//     >
//       {/* Processing Overlay */}
//       <AnimatePresence>
//         {isProcessing && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <span className="text-sm font-semibold text-slate-900">
//                 {isProcessing === "confirmed" ? "Accepting order..." : "Rejecting order..."}
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Ringing Badge */}
//       {isRinging && (
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="absolute top-3 right-3 z-10"
//         >
//           <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full">
//             <BellRing className="w-3 h-3 text-orange-500 animate-bounce" />
//             <span className="text-[9px] font-bold text-orange-700 uppercase tracking-wider">
//               Ringing
//             </span>
//           </div>
//         </motion.div>
//       )}

//       {/* Card Content */}
//       <div className="p-4">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-3 gap-3">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="p-1.5 bg-blue-50 rounded-lg">
//                 <User className="w-3.5 h-3.5 text-blue-600" />
//               </div>
//               <span className="font-semibold text-slate-900 text-sm truncate">
//                 {order.customerName || "Guest"}
//               </span>
//             </div>
            
//             {order.phoneNumber && (
//               <div className="flex items-center gap-2 text-xs text-slate-500">
//                 <Phone className="w-3 h-3" />
//                 <span className="truncate">{order.phoneNumber}</span>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
//             <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
//               <Clock className="w-3 h-3 text-slate-500" />
//               <span className="text-xs font-medium text-slate-700">
//                 {formatTime(order.createdAt)}
//               </span>
//             </div>
//             <div className="px-2 py-1 bg-orange-50 border border-orange-200 rounded-lg">
//               <span className="text-xs font-semibold text-orange-700">
//                 Table {order.tableNumber || "-"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="mb-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
//           <div className="space-y-2">
//             {order.items.slice(0, 2).map((item, idx) => (
//               <div key={idx} className="flex justify-between items-center text-xs">
//                 <span className="text-slate-700 font-medium">
//                   {item.name} × {item.qty}
//                 </span>
//                 <span className="text-slate-500 font-medium">
//                   ₹{item.totalPrice || item.unitPrice * item.qty}
//                 </span>
//               </div>
//             ))}
//             {order.items.length > 2 && (
//               <div className="text-xs text-slate-400 italic flex items-center gap-1">
//                 <Sparkles className="w-3 h-3" />
//                 +{order.items.length - 2} more items
//               </div>
//             )}
//           </div>
          
//           {/* Total */}
//           <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
//             <span className="text-xs text-slate-600 font-semibold">Total Amount</span>
//             <span className="text-base text-emerald-600 font-bold">
//               ₹{order.grandTotal}
//             </span>
//           </div>
//         </div>

//         {/* Special Instructions */}
//         {order.description && (
//           <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
//               <p className="text-xs text-amber-800 leading-relaxed">
//                 <span className="font-semibold">Note:</span> {order.description}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-2">
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={onAccept}
//             disabled={isProcessing}
//             className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md"
//           >
//             <CheckCircle className="w-4 h-4" />
//             {isProcessing === "confirmed" ? "Accepting..." : "Accept"}
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={onReject}
//             disabled={isProcessing}
//             className="flex-1 flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5 rounded-lg transition-all font-semibold"
//           >
//             <XCircle className="w-4 h-4" />
//             {isProcessing === "cancelled" ? "Rejecting..." : "Reject"}
//           </motion.button>
//         </div>
//       </div>

//       {/* Ringing Pulse Effect */}
//       {isRinging && (
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-transparent to-orange-200/20 animate-pulse" />
//         </div>
//       )}
//     </motion.div>
//   );
// }

// /* =========================
//    LOADING SKELETON
// ========================= */
// function LoadingSkeleton() {
//   return (
//     <div className="animate-pulse space-y-3">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-slate-200 rounded-lg" />
//               <div className="h-4 w-24 bg-slate-200 rounded" />
//             </div>
//             <div className="h-6 w-16 bg-slate-200 rounded-lg" />
//           </div>
//           <div className="space-y-2 mb-3">
//             <div className="h-3 w-full bg-slate-200 rounded" />
//             <div className="h-3 w-3/4 bg-slate-200 rounded" />
//           </div>
//           <div className="flex gap-2">
//             <div className="flex-1 h-9 bg-slate-200 rounded-lg" />
//             <div className="flex-1 h-9 bg-slate-200 rounded-lg" />
//           </div>
//         </div>
//       ))}
//     </div>
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
//       className="flex flex-col items-center justify-center h-full text-center py-12"
//     >
//       <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
//         <Bell className="w-10 h-10 text-slate-400" />
//       </div>
//       <h3 className="text-base font-bold text-slate-900 mb-2">
//         All Clear!
//       </h3>
//       <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed">
//         No pending orders right now. New orders will appear here in real-time.
//       </p>
//       <div className="mt-4 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
//         <span className="text-xs text-blue-600 font-semibold">Listening for orders...</span>
//       </div>
//     </motion.div>
//   );
// }


import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateOrderStatus, fetchOrders } from "../../api/orderApi";
import useLiveOrders from "../../hooks/useLiveOrders";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Bell, 
  BellRing, 
  Clock, 
  User, 
  Phone,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { startContinuousRinging, stopRinging, isRinging } from "../../utils/soundManager";

const STORAGE_KEY = "dashboard-live-orders";

export default function LiveOrdersPanel({ username }) {
  const navigate = useNavigate();
  const hasStartedRingingRef = useRef(new Set());

  /* =========================
     STATE MANAGEMENT
  ========================= */
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [ringingOrderId, setRingingOrderId] = useState(null);

  /* =========================
     INITIAL FETCH
  ========================= */
  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchOrders(username);

        const latestPending = (res.data || [])
          .filter((o) => o.status === "pending")
          .slice(0, 3);

        setOrders(latestPending);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPending));

        if (latestPending.length > 0 && !hasStartedRingingRef.current.has(latestPending[0]._id)) {
          startContinuousRinging(latestPending[0]._id, 3000);
          setRingingOrderId(latestPending[0]._id);
          hasStartedRingingRef.current.add(latestPending[0]._id);
        }
      } catch (err) {
        console.warn("LiveOrders fallback fetch failed:", err);
        toast.error("Failed to load live orders");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [username]);

  useEffect(() => {
    return () => {
      stopRinging();
    };
  }, []);

  /* =========================
     SOCKET EVENTS
  ========================= */
  const handleLiveOrder = useCallback((type, order) => {
    console.log("📦 Live order event:", type, order);

    if (type === "created" && order.status === "pending") {
      setOrders((prev) => {
        if (prev.some((o) => o._id === order._id)) return prev;
        
        const updated = [order, ...prev].slice(0, 3);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        toast.success(`New order from ${order.customerName || "Guest"} - Table ${order.tableNumber}`, {
          icon: "🔔",
          duration: 5000,
        });
        
        return updated;
      });

      if (!hasStartedRingingRef.current.has(order._id)) {
        console.log("🔔 Starting continuous ringing for order:", order._id);
        startContinuousRinging(order._id, 3000);
        setRingingOrderId(order._id);
        hasStartedRingingRef.current.add(order._id);
        
        if (hasStartedRingingRef.current.size > 50) {
          const arr = Array.from(hasStartedRingingRef.current);
          hasStartedRingingRef.current = new Set(arr.slice(-50));
        }
      }
    }

    if (type === "updated" || type === "replaced") {
      setOrders((prev) => {
        const updated = prev.filter((o) => o._id !== order._id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        if (order._id === ringingOrderId) {
          console.log("🔇 Stopping ringing - order updated");
          stopRinging();
          setRingingOrderId(null);
        }
        
        return updated;
      });
    }

    if (type === "deleted") {
      setOrders((prev) => {
        const updated = prev.filter((o) => o._id !== order._id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        
        if (order._id === ringingOrderId) {
          console.log("🔇 Stopping ringing - order deleted");
          stopRinging();
          setRingingOrderId(null);
        }
        
        return updated;
      });
    }
  }, [ringingOrderId]);

  useLiveOrders(username, handleLiveOrder);

  /* =========================
     ACTIONS
  ========================= */
  const handleAction = useCallback(
    async (orderId, status) => {
      try {
        setActionLoading((prev) => ({ ...prev, [orderId]: status }));

        console.log("🔇 Stopping ringing - user action:", status);
        stopRinging();
        setRingingOrderId(null);

        await updateOrderStatus(username, orderId, status);
        
        toast.success(
          status === "confirmed" 
            ? "✅ Order accepted successfully!" 
            : "❌ Order rejected",
          { duration: 3000 }
        );

        setOrders((prev) => {
          const updated = prev.filter((o) => o._id !== orderId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          
          if (updated.length > 0) {
            const nextOrder = updated[0];
            if (!hasStartedRingingRef.current.has(nextOrder._id)) {
              setTimeout(() => {
                console.log("🔔 Starting ringing for next order:", nextOrder._id);
                startContinuousRinging(nextOrder._id, 3000);
                setRingingOrderId(nextOrder._id);
                hasStartedRingingRef.current.add(nextOrder._id);
              }, 500);
            }
          }
          
          return updated;
        });
      } catch (err) {
        console.error("Failed to update order:", err);
        toast.error("Failed to update order. Please try again.");
      } finally {
        setActionLoading((prev) => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
      }
    },
    [username]
  );

  /* =========================
     HELPERS
  ========================= */
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                Live Orders
              </h2>
              
              {/* Status Badge */}
              {isRinging() ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full animate-pulse">
                  <BellRing className="w-3 h-3 text-orange-500 animate-bounce" />
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    Ringing
                  </span>
                </div>
              ) : orders.length > 0 ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {orders.length} Active
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Idle
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-slate-500 font-medium">
              {isRinging() 
                ? "🔔 Bell ringing for new order..." 
                : "Real-time incoming orders"}
            </p>
          </div>

          {/* Icon Container */}
          <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* View All Link */}
        {orders.length >= 3 && (
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate(`/${username}/orders`)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold mt-3 transition-colors"
          >
            View all orders
            <ChevronRight className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 pt-4 overflow-hidden">
        {isLoading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-full overflow-y-auto space-y-3 custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  isRinging={ringingOrderId === order._id}
                  isProcessing={actionLoading[order._id]}
                  onAccept={() => handleAction(order._id, "confirmed")}
                  onReject={() => handleAction(order._id, "cancelled")}
                  formatTime={formatTime}
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
   ORDER CARD COMPONENT
========================= */
function OrderCard({ order, index, isRinging, isProcessing, onAccept, onReject, formatTime }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative bg-white border rounded-xl overflow-hidden
        transition-all duration-300
        ${isRinging 
          ? "border-orange-300 shadow-lg shadow-orange-100 ring-2 ring-orange-200" 
          : "border-slate-200 hover:border-blue-200 hover:shadow-md"
        }
      `}
    >
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-900">
                {isProcessing === "confirmed" ? "Accepting..." : "Rejecting..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ringing Badge */}
      {isRinging && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 z-10"
        >
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded-full">
            <BellRing className="w-2.5 h-2.5 text-orange-500 animate-bounce" />
            <span className="text-[8px] font-bold text-orange-700 uppercase tracking-wider">
              Ring
            </span>
          </div>
        </motion.div>
      )}

      {/* Card Content */}
      <div className="p-3">
        {/* Header - More Compact */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1 bg-blue-50 rounded-md">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <span className="font-semibold text-slate-900 text-xs truncate">
                {order.customerName || "Guest"}
              </span>
            </div>
            
            {order.phoneNumber && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500 ml-5">
                <Phone className="w-2.5 h-2.5" />
                <span className="truncate">{order.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded-md">
              <Clock className="w-2.5 h-2.5 text-slate-500" />
              <span className="text-[10px] font-medium text-slate-700">
                {formatTime(order.createdAt)}
              </span>
            </div>
            <div className="px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded-md">
              <span className="text-[10px] font-semibold text-orange-700">
                T{order.tableNumber || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items - Compact */}
        <div className="mb-2 bg-slate-50 border border-slate-100 rounded-lg p-2">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px]">
                <span className="text-slate-700 font-medium truncate mr-2">
                  {item.name} × {item.qty}
                </span>
                <span className="text-slate-500 font-medium whitespace-nowrap">
                  ₹{item.totalPrice || item.unitPrice * item.qty}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-[9px] text-slate-400 italic flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                +{order.items.length - 2} more
              </div>
            )}
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
            <span className="text-[10px] text-slate-600 font-semibold">Total</span>
            <span className="text-sm text-emerald-600 font-bold">
              ₹{order.grandTotal}
            </span>
          </div>
        </div>

        {/* Special Instructions - Compact */}
        {order.description && (
          <div className="mb-2 p-1.5 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed">
                <span className="font-semibold">Note:</span> {order.description}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="flex gap-1.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAccept}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isProcessing === "confirmed" ? "Accepting..." : "Accept"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReject}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 rounded-lg transition-all font-semibold"
          >
            <XCircle className="w-3.5 h-3.5" />
            {isProcessing === "cancelled" ? "Rejecting..." : "Reject"}
          </motion.button>
        </div>
      </div>

      {/* Ringing Pulse Effect */}
      {isRinging && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-transparent to-orange-200/20 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}

/* =========================
   LOADING SKELETON
========================= */
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-lg" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-lg" />
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-3 w-3/4 bg-slate-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-slate-200 rounded-lg" />
            <div className="flex-1 h-9 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
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
      className="flex flex-col items-center justify-center h-full text-center py-12"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <Bell className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2">
        All Clear!
      </h3>
      <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed">
        No pending orders right now. New orders will appear here in real-time.
      </p>
      <div className="mt-4 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
        <span className="text-xs text-blue-600 font-semibold">Listening for orders...</span>
      </div>
    </motion.div>
  );
}