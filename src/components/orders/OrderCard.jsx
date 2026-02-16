// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Clock,
//   User,
//   Phone,
//   MapPin,
//   ChevronDown,
//   ChevronUp,
//   IndianRupee,
//   Receipt,
//   Users,
//   X as XIcon,
//   FileCheck,
//   Hash,
//   CheckCircle,
//   XCircle,
//   ChefHat,
//   Printer,
//   WifiOff,
//   CloudOff,
//   RefreshCw,
//   Package,
//   Truck,
// } from "lucide-react";
// import { 
//   createBillFromOrders, 
//   createBillFromSelectedItems,
//   fetchBillById,
//   onSyncEvent,
// } from "../../api/billingApi";
// import { useAuth } from "../../context/AuthContext";
// import offlineDB from "../../services/offlineDB";

// // Detect Electron environment
// const isElectron = () => {
//   try {
//     return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
//   } catch {
//     return false;
//   }
// };

// // Online status hook
// const useOnlineStatus = () => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   return isOnline;
// };

// const OrderCard = React.memo(({ order, onUpdate, allOrders = [], onBillGenerated }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [generatingBill, setGeneratingBill] = useState(false);
//   const [showBillPreview, setShowBillPreview] = useState(false);
//   const [showBillDetails, setShowBillDetails] = useState(false);
//   const [billData, setBillData] = useState(null);
//   const [loadingBill, setLoadingBill] = useState(false);
//   const [printBill, setPrintBill] = useState(null);
//   const [error, setError] = useState(null);
//   const [syncStatus, setSyncStatus] = useState(null);
//   const navigate = useNavigate();
//   const { owner } = useAuth();
//   const isOnline = useOnlineStatus();

//   const isPending = order.status === "pending";
//   const isPreparing = order.status === "confirmed";
//   const isCompleted = order.status === "completed";
//   const isCancelled = order.status === "cancelled";
//   const isBilled = Boolean(order.billId || order.billed === true);

//   // Get order type
//   const orderType = order.orderType || "DINE_IN"; // Default to DINE_IN for backward compatibility

//   // Filter unbilled session orders (DINE_IN only)
//   const sessionOrders = orderType === "DINE_IN" 
//     ? allOrders.filter(
//         (o) =>
//           o.sessionId === order.sessionId &&
//           o.status === "completed" &&
//           !o.billed &&
//           !o.billId
//       )
//     : [];

//   const hasUnbilledSession =
//     orderType === "DINE_IN" && Boolean(order.sessionId) && sessionOrders.length > 0 && !isBilled;

//   // Listen for sync events
//   useEffect(() => {
//     const unsubscribe = onSyncEvent((event) => {
//       if (event.type === 'bill_synced' && event.serverBill) {
//         const billOrderIds = event.serverBill.orderIds || [];
//         if (billOrderIds.includes(order._id)) {
//           console.log('🔄 Bill synced for this order:', event.serverBill.billNumber);
//           setSyncStatus('synced');
          
//           if (onBillGenerated) {
//             onBillGenerated(event.serverBill, billOrderIds);
//           }
          
//           setTimeout(() => setSyncStatus(null), 3000);
//         }
//       } else if (event.type === 'sync_completed') {
//         setTimeout(() => setSyncStatus(null), 1000);
//       }
//     });

//     return () => unsubscribe();
//   }, [order._id, onBillGenerated]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-orange-50 text-orange-700 border-orange-200";
//       case "confirmed":
//         return "bg-blue-50 text-blue-700 border-blue-200";
//       case "completed":
//         return "bg-green-50 text-green-700 border-green-200";
//       case "cancelled":
//         return "bg-red-50 text-red-700 border-red-200";
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200";
//     }
//   };

//   const getStatusLabel = (status) => {
//     if (status === "confirmed") return "PREPARING";
//     return status.toUpperCase();
//   };

//   const getTimeElapsed = () => {
//     try {
//       if (!order.createdAt) return "";
//       const elapsed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
//       if (elapsed < 1) return "now";
//       if (elapsed < 60) return `${elapsed}m`;
//       const hours = Math.floor(elapsed / 60);
//       if (hours < 24) return `${hours}h`;
//       return `${Math.floor(hours / 24)}d`;
//     } catch {
//       return "";
//     }
//   };

//   const formatPrice = (price) => {
//     try {
//       return price ? `₹${price.toFixed(0)}` : "₹0";
//     } catch {
//       return "₹0";
//     }
//   };

//   // Handle bill generation with offline support
//   const handleBillAction = useCallback(async () => {
//     const username = order.username || owner?.username;
//     if (!username) {
//       setError("Username not available");
//       return;
//     }

//     setError(null);

//     try {
//       if (isBilled && order.billId) {
//         setLoadingBill(true);
        
//         try {
//           let bill = await offlineDB.getBillById(order.billId);
          
//           if (!bill && isOnline) {
//             const response = await fetchBillById(username, order.billId);
//             if (response.success && response.data) {
//               bill = response.data;
//               await offlineDB.saveBill(bill);
//             }
//           }
          
//           if (bill) {
//             setBillData(bill);
//             setShowBillDetails(true);
//           } else {
//             setError("Bill not found");
//           }
//         } catch (error) {
//           console.error("Error fetching bill:", error);
//           setError(isOnline ? "Failed to fetch bill" : "Bill not available offline");
//         } finally {
//           setLoadingBill(false);
//         }
//         return;
//       }

//       if (hasUnbilledSession) {
//         setShowBillPreview(true);
//         return;
//       }

//       // Generate new bill
//       setGeneratingBill(true);
//       setSyncStatus('creating');
      
//       const billData = {
//         orderIds: [order._id],
//         discount: 0,
//         discountType: "NONE",
//         taxes: [
//           { name: "CGST", rate: 2.5 },
//           { name: "SGST", rate: 2.5 },
//         ],
//         serviceCharge: { enabled: false, rate: 0 },
//         additionalCharges: [],
//         notes: `Order #${order._id.slice(-6)}`,
//       };

//       try {
//         const response = await createBillFromOrders(username, billData);
        
//         if (response.success && response.data) {
//           console.log('✅ Bill created:', response.data.billNumber);
          
//           await offlineDB.saveBill(response.data);
          
//           await offlineDB.updateOrder(order._id, {
//             billed: true,
//             billedAt: new Date().toISOString(),
//             billId: response.data._id,
//             billNumber: response.data.billNumber,
//           });
          
//           if (response.offline) {
//             setSyncStatus('pending');
//           } else {
//             setSyncStatus('synced');
//             setTimeout(() => setSyncStatus(null), 3000);
//           }
          
//           if (onBillGenerated) {
//             onBillGenerated(response.data, [order._id]);
//           }
//         } else {
//           throw new Error(response.message || "Failed to generate bill");
//         }
//       } catch (error) {
//         console.error("Bill generation error:", error);
//         setError(
//           isOnline 
//             ? "Failed to generate bill. Please try again." 
//             : "Bill saved offline. Will sync when online."
//         );
//         setSyncStatus(null);
//       } finally {
//         setGeneratingBill(false);
//       }
//     } catch (error) {
//       console.error("Unexpected error in handleBillAction:", error);
//       setError("An unexpected error occurred");
//       setGeneratingBill(false);
//       setLoadingBill(false);
//       setSyncStatus(null);
//     }
//   }, [order, owner, isBilled, hasUnbilledSession, isOnline, onBillGenerated]);

//   const toggleExpand = useCallback(() => {
//     setExpanded(prev => !prev);
//   }, []);

//   // Cleanup effect
//   useEffect(() => {
//     return () => {
//       setBillData(null);
//       setPrintBill(null);
//       setError(null);
//       setSyncStatus(null);
//     };
//   }, []);

//   // Auto-dismiss errors
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   return (
//     <>
//       {/* CARD */}
//       <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 relative">
//         {/* Offline indicator */}
//         {!isOnline && (
//           <div className="absolute top-2 right-2 z-10">
//             <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
//               <WifiOff className="w-3 h-3 text-yellow-600" />
//               <span className="text-xs text-yellow-700 font-medium">Offline</span>
//             </div>
//           </div>
//         )}

//         {/* Sync status indicator */}
//         {syncStatus === 'pending' && (
//           <div className="absolute top-2 right-20 z-10">
//             <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
//               <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
//               <span className="text-xs text-blue-700 font-medium">Syncing...</span>
//             </div>
//           </div>
//         )}

//         {syncStatus === 'synced' && (
//           <div className="absolute top-2 right-20 z-10">
//             <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
//               <CheckCircle className="w-3 h-3 text-green-600" />
//               <span className="text-xs text-green-700 font-medium">Synced</span>
//             </div>
//           </div>
//         )}

//         {/* Error banner */}
//         {error && (
//           <div className="px-3 py-2 bg-red-50 border-b border-red-200">
//             <div className="flex items-center gap-2">
//               <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
//               <p className="text-xs text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* MAIN CONTENT - CLICKABLE */}
//         <div className="p-3 cursor-pointer" onClick={toggleExpand}>
//           {/* Header Row */}
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2 flex-1 min-w-0">
//               {/* Order Type Badge */}
//               {orderType === "DINE_IN" && (
//                 <>
//                   <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
//                   <span className="text-sm font-bold text-gray-900">
//                     Table {order.tableNumber}
//                   </span>
//                 </>
//               )}
//               {orderType === "TAKEAWAY" && (
//                 <>
//                   <Package className="w-4 h-4 text-orange-600 flex-shrink-0" />
//                   <span className="text-sm font-bold text-gray-900">
//                     Takeaway
//                   </span>
//                 </>
//               )}
//               {orderType === "ONLINE" && (
//                 <>
//                   <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
//                   <span className="text-sm font-bold text-gray-900">
//                     Delivery
//                   </span>
//                 </>
//               )}
              
//               {/* Status Badge */}
//               <span
//                 className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
//                   order.status
//                 )}`}
//               >
//                 {getStatusLabel(order.status)}
//               </span>
              
//               {/* Session Badge (DINE_IN only) */}
//               {hasUnbilledSession && (
//                 <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
//                   <Users className="w-3 h-3" />
//                   {sessionOrders.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">{getTimeElapsed()}</span>
//               {expanded ? (
//                 <ChevronUp className="w-4 h-4 text-gray-400" />
//               ) : (
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               )}
//             </div>
//           </div>

//           {/* Customer & Items Row */}
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2 flex-1 min-w-0">
//               <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
//               <span className="text-sm text-gray-700 truncate">
//                 {order.customerName}
//               </span>
//             </div>
//             <span className="text-xs text-gray-500">
//               {order.items?.length || 0} items
//             </span>
//           </div>

//           {/* Bill Info Row - Only if Billed */}
//           {isBilled && order.billNumber && (
//             <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 border border-green-200 rounded">
//               <Receipt className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
//               <span className="text-xs font-mono text-green-700">
//                 {order.billNumber}
//               </span>
//               <FileCheck className="w-3.5 h-3.5 text-green-600 ml-auto" />
//             </div>
//           )}

//           {/* Amount & Action Row */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1">
//               <IndianRupee className="w-4 h-4 text-blue-600" />
//               <span className="text-lg font-bold text-gray-900">
//                 {formatPrice(order.grandTotal)}
//               </span>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
//               {isPending && (
//                 <>
//                   <button
//                     onClick={() => onUpdate(order._id, "confirmed")}
//                     className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
//                     disabled={!isOnline}
//                   >
//                     <CheckCircle className="w-3.5 h-3.5" />
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => onUpdate(order._id, "cancelled")}
//                     className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
//                     disabled={!isOnline}
//                   >
//                     <XCircle className="w-3.5 h-3.5" />
//                     Reject
//                   </button>
//                 </>
//               )}

//               {isPreparing && (
//                 <button
//                   onClick={() => onUpdate(order._id, "completed")}
//                   className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
//                   disabled={!isOnline}
//                 >
//                   <CheckCircle className="w-3.5 h-3.5" />
//                   Ready
//                 </button>
//               )}

//               {isCompleted && !isBilled && (
//                 <button
//                   onClick={handleBillAction}
//                   disabled={generatingBill}
//                   className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
//                 >
//                   {generatingBill ? (
//                     <RefreshCw className="w-3.5 h-3.5 animate-spin" />
//                   ) : !isOnline ? (
//                     <CloudOff className="w-3.5 h-3.5" />
//                   ) : (
//                     <Receipt className="w-3.5 h-3.5" />
//                   )}
//                   {generatingBill
//                     ? "..."
//                     : hasUnbilledSession
//                     ? "Review"
//                     : "Bill"}
//                 </button>
//               )}

//               {isBilled && (
//                 <button
//                   onClick={handleBillAction}
//                   disabled={loadingBill}
//                   className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded transition-colors border border-green-200 flex items-center gap-1 disabled:opacity-50"
//                 >
//                   <FileCheck className="w-3.5 h-3.5" />
//                   {loadingBill ? "..." : "View"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* EXPANDABLE DETAILS */}
//         {expanded && (
//           <div className="border-t border-gray-200 p-3 space-y-2 bg-gray-50">
//             {/* Order ID */}
//             <div className="flex items-center gap-2 text-xs">
//               <Hash className="w-3.5 h-3.5 text-gray-400" />
//               <span className="text-gray-500">Order ID:</span>
//               <span className="font-mono text-gray-700">
//                 {order._id?.slice(-8)}
//               </span>
//             </div>

//             {/* Order Type Details */}
//             {orderType === "ONLINE" && order.deliveryAddress && (
//               <div className="flex items-start gap-2 text-xs p-2 bg-green-50 border border-green-200 rounded">
//                 <Truck className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="font-medium text-green-700 mb-1">Delivery Address</p>
//                   <p className="text-gray-700">
//                     {order.deliveryAddress.line1}
//                     {order.deliveryAddress.line2 && `, ${order.deliveryAddress.line2}`}
//                   </p>
//                   <p className="text-gray-600">
//                     {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
//                   </p>
//                   {order.deliveryAddress.landmark && (
//                     <p className="text-gray-600 italic">Near: {order.deliveryAddress.landmark}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Phone */}
//             {order.phoneNumber && (
//               <div className="flex items-center gap-2 text-xs">
//                 <Phone className="w-3.5 h-3.5 text-gray-400" />
//                 <span className="text-gray-700">{order.phoneNumber}</span>
//               </div>
//             )}

//             {/* Time */}
//             <div className="flex items-center gap-2 text-xs">
//               <Clock className="w-3.5 h-3.5 text-gray-400" />
//               <span className="text-gray-700">
//                 {new Date(order.createdAt).toLocaleString("en-IN", {
//                   day: "2-digit",
//                   month: "short",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             </div>

//             {/* Session Info (DINE_IN only) */}
//             {hasUnbilledSession && (
//               <div className="flex items-center gap-2 text-xs p-2 bg-purple-50 border border-purple-200 rounded">
//                 <Users className="w-3.5 h-3.5 text-purple-600" />
//                 <span className="text-purple-700">
//                   {sessionOrders.length} orders • ₹
//                   {sessionOrders
//                     .reduce((sum, o) => sum + o.grandTotal, 0)
//                     .toFixed(0)}
//                 </span>
//               </div>
//             )}

//             {/* Items */}
//             <div className="space-y-1 max-h-40 overflow-y-auto">
//               {order.items?.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200"
//                 >
//                   <div className="flex items-center gap-2 flex-1 min-w-0">
//                     {item.imageUrl && (
//                       <img
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="w-8 h-8 rounded object-cover flex-shrink-0"
//                         onError={(e) => { e.target.style.display = 'none'; }}
//                       />
//                     )}
//                     <span className="text-gray-700 truncate">{item.name}</span>
//                   </div>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <span className="text-gray-500">×{item.qty}</span>
//                     <span className="text-blue-600 font-semibold">
//                       ₹{item.totalPrice.toFixed(0)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Description */}
//             {order.description && (
//               <div className="text-xs text-gray-600 italic p-2 bg-blue-50 border border-blue-100 rounded">
//                 "{order.description}"
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* BILL DETAILS MODAL */}
//       {showBillDetails && billData && (
//         <BillDetailsModal
//           bill={billData}
//           onClose={() => {
//             setShowBillDetails(false);
//             setBillData(null);
//           }}
//           onPrint={(bill) => {
//             if (isElectron()) {
//               const printContent = document.getElementById('print-bill-content');
//               if (printContent) {
//                 window.print();
//               } else {
//                 setPrintBill(bill);
//                 setTimeout(() => {
//                   window.print();
//                   setTimeout(() => {
//                     setPrintBill(null);
//                     setShowBillDetails(false);
//                     setBillData(null);
//                   }, 1000);
//                 }, 100);
//               }
//             } else {
//               setPrintBill(bill);
//               setShowBillDetails(false);
//               setBillData(null);
//               setTimeout(() => {
//                 window.print();
//                 setTimeout(() => setPrintBill(null), 1000);
//               }, 500);
//             }
//           }}
//           restaurantName={owner?.restaurantName}
//           isOnline={isOnline}
//         />
//       )}

//       {/* PRINT BILL */}
//       {printBill && (
//         <PrintBillComponent
//           bill={printBill}
//           restaurantName={owner?.restaurantName}
//         />
//       )}

//       {/* SESSION BILL PREVIEW MODAL */}
//       {showBillPreview && hasUnbilledSession && (
//         <SessionBillPreview
//           sessionOrders={sessionOrders}
//           onClose={() => setShowBillPreview(false)}
//           username={order.username || owner?.username}
//           onBillGenerated={onBillGenerated}
//           isOnline={isOnline}
//         />
//       )}
//     </>
//   );
// });

// /* ===============================
//    BILL DETAILS MODAL
// =============================== */
// const BillDetailsModal = ({ bill, onClose, onPrint, restaurantName, isOnline }) => {
//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   const handlePrint = () => {
//     onPrint(bill);
//   };

//   const discountAmount =
//     bill.discountType === "PERCENTAGE"
//       ? (bill.subtotal * bill.discount) / 100
//       : bill.discountType === "FIXED"
//       ? bill.discount
//       : 0;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "DRAFT":
//         return "bg-yellow-50 text-yellow-700 border-yellow-200";
//       case "FINALIZED":
//         return "bg-green-50 text-green-700 border-green-200";
//       case "CANCELLED":
//         return "bg-red-50 text-red-700 border-red-200";
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200";
//     }
//   };

//   const getPaymentColor = (status) => {
//     switch (status) {
//       case "PAID":
//         return "text-green-600";
//       case "PENDING":
//         return "text-yellow-600";
//       case "PARTIAL":
//         return "text-orange-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//       style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
//     >
//       <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold mb-1">{restaurantName}</h2>
//             <p className="text-blue-100 text-sm flex items-center gap-2">
//               Bill Receipt
//               {!isOnline && (
//                 <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-400/30 rounded text-xs">
//                   Offline Mode
//                 </span>
//               )}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <XIcon className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
//           {/* Bill Info */}
//           <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Bill Number</p>
//               <p className="font-bold text-gray-900">{bill.billNumber}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Status</p>
//               <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
//                 {bill.status}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Date</p>
//               <p className="text-sm text-gray-900">
//                 {new Date(bill.createdAt).toLocaleString("en-IN", {
//                   day: "2-digit",
//                   month: "short",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Table</p>
//               <p className="text-sm text-gray-900">Table {bill.tableNumber}</p>
//             </div>
//           </div>

//           {/* Customer Info */}
//           <div className="mb-6 pb-6 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <User className="w-4 h-4 text-blue-600" />
//               Customer Details
//             </h3>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Name</p>
//                 <p className="font-medium text-gray-900">{bill.customerName}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Phone</p>
//                 <p className="font-medium text-gray-900">{bill.phoneNumber || "N/A"}</p>
//               </div>
//             </div>
//           </div>

//           {/* Items */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <Receipt className="w-4 h-4 text-blue-600" />
//               Order Items ({bill.items?.length || 0} items)
//             </h3>
//             <div className="space-y-2">
//               {bill.items?.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center gap-3 flex-1">
//                     {item.imageUrl && (
//                       <img
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="w-12 h-12 rounded object-cover"
//                         onError={(e) => { e.target.style.display = 'none'; }}
//                       />
//                     )}
//                     <div>
//                       <p className="font-medium text-gray-900">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         ₹{item.unitPrice} × {item.qty}
//                         {item.variant?.name && ` • ${item.variant.name}`}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-semibold text-blue-600">
//                     ₹{item.totalPrice.toFixed(0)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bill Summary */}
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
//             <div className="space-y-2 text-sm mb-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-medium text-gray-900">
//                   ₹{bill.subtotal.toFixed(0)}
//                 </span>
//               </div>

//               {discountAmount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>
//                     Discount{" "}
//                     {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}
//                   </span>
//                   <span>-₹{discountAmount.toFixed(0)}</span>
//                 </div>
//               )}

//               {bill.serviceCharge?.enabled && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">
//                     Service Charge ({bill.serviceCharge.rate}%)
//                   </span>
//                   <span className="font-medium text-gray-900">
//                     +₹{bill.serviceCharge.amount.toFixed(0)}
//                   </span>
//                 </div>
//               )}

//               {bill.taxes?.map((tax, i) => (
//                 <div key={i} className="flex justify-between">
//                   <span className="text-gray-600">
//                     {tax.name} ({tax.rate}%)
//                   </span>
//                   <span className="font-medium text-gray-900">
//                     +₹{tax.amount.toFixed(0)}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center pt-3 border-t border-blue-200">
//               <span className="text-lg font-bold text-gray-900">Grand Total</span>
//               <span className="text-2xl font-bold text-blue-600">
//                 ₹{bill.grandTotal.toFixed(0)}
//               </span>
//             </div>
//           </div>

//           {/* Payment Info */}
//           {bill.status === "FINALIZED" && (
//             <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-xs text-gray-600 mb-1">Payment Status</p>
//                   <p className={`font-bold ${getPaymentColor(bill.paymentStatus)}`}>
//                     {bill.paymentStatus}
//                   </p>
//                 </div>
//                 {bill.paymentMethod && (
//                   <div className="text-right">
//                     <p className="text-xs text-gray-600 mb-1">Payment Method</p>
//                     <p className="font-medium text-gray-900">{bill.paymentMethod}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Notes */}
//           {bill.notes && (
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
//               <p className="text-xs text-gray-600 mb-1">Notes</p>
//               <p className="text-sm text-gray-900">{bill.notes}</p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-300"
//           >
//             Close
//           </button>
//           <button
//             onClick={handlePrint}
//             className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
//           >
//             <Printer className="w-4 h-4" />
//             Print Bill
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===============================
//    SESSION BILL PREVIEW
// =============================== */
// const SessionBillPreview = ({ sessionOrders, onClose, username, onBillGenerated, isOnline }) => {
//   const [selectedOrders, setSelectedOrders] = useState(
//     sessionOrders.reduce(
//       (acc, order) => ({
//         ...acc,
//         [order._id]: {
//           included: true,
//           items: order.items.reduce(
//             (itemAcc, item, idx) => ({ ...itemAcc, [idx]: true }),
//             {}
//           ),
//         },
//       }),
//       {}
//     )
//   );
//   const [generatingBill, setGeneratingBill] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   const calculateTotal = () => {
//     let total = 0;
//     let itemCount = 0;
//     sessionOrders.forEach((order) => {
//       if (selectedOrders[order._id]?.included) {
//         order.items.forEach((item, idx) => {
//           if (selectedOrders[order._id].items[idx]) {
//             total += item.totalPrice;
//             itemCount++;
//           }
//         });
//       }
//     });
//     return { total, itemCount };
//   };

//   const { total: totalAmount, itemCount } = calculateTotal();

//   const toggleOrder = (orderId) => {
//     setSelectedOrders((prev) => ({
//       ...prev,
//       [orderId]: { ...prev[orderId], included: !prev[orderId].included },
//     }));
//   };

//   const toggleItem = (orderId, itemIndex) => {
//     setSelectedOrders((prev) => ({
//       ...prev,
//       [orderId]: {
//         ...prev[orderId],
//         items: {
//           ...prev[orderId].items,
//           [itemIndex]: !prev[orderId].items[itemIndex],
//         },
//       },
//     }));
//   };

//   const handleGenerateBill = async () => {
//     const orderItems = [];
//     const affectedOrderIds = [];

//     sessionOrders.forEach((order) => {
//       if (!selectedOrders[order._id]?.included) return;

//       const selectedItemIndexes = [];
//       Object.entries(selectedOrders[order._id].items).forEach(
//         ([index, isSelected]) => {
//           if (isSelected) selectedItemIndexes.push(parseInt(index));
//         }
//       );

//       if (selectedItemIndexes.length > 0) {
//         orderItems.push({ orderId: order._id, itemIndexes: selectedItemIndexes });
//         affectedOrderIds.push(order._id);
//       }
//     });

//     if (orderItems.length === 0) return;

//     setGeneratingBill(true);
//     setError(null);

//     try {
//       const billData = {
//         orderItems,
//         discount: 0,
//         discountType: "NONE",
//         taxes: [
//           { name: "CGST", rate: 2.5 },
//           { name: "SGST", rate: 2.5 },
//         ],
//         serviceCharge: { enabled: false, rate: 0 },
//         additionalCharges: [],
//         notes: `Session: ${orderItems.length} orders, ${itemCount} items`,
//       };

//       const response = await createBillFromSelectedItems(username, billData);
      
//       if (response.success && response.data) {
//         console.log('✅ Session bill created:', response.data.billNumber);
        
//         await offlineDB.saveBill(response.data);
        
//         for (const orderId of affectedOrderIds) {
//           await offlineDB.updateOrder(orderId, {
//             billed: true,
//             billedAt: new Date().toISOString(),
//             billId: response.data._id,
//             billNumber: response.data.billNumber,
//           });
//         }
        
//         if (onBillGenerated) {
//           onBillGenerated(response.data, affectedOrderIds);
//         }
        
//         onClose();
//       } else {
//         throw new Error(response.message || "Failed to generate bill");
//       }
//     } catch (error) {
//       console.error("Failed to generate bill:", error);
      
//       if (error.message && error.message.includes('offline')) {
//         onClose();
//       } else {
//         setError(
//           isOnline 
//             ? "Failed to generate bill. Please try again." 
//             : "Bill saved offline. Will sync when online."
//         );
//       }
//     } finally {
//       setGeneratingBill(false);
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//       style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
//     >
//       <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200 shadow-2xl">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <Users className="w-5 h-5 text-purple-600" />
//               Session Bill
//             </h2>
//             <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
//               {sessionOrders.length} orders
//               {!isOnline && (
//                 <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
//                   Offline
//                 </span>
//               )}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-gray-100 rounded transition-colors"
//           >
//             <XIcon className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Error banner */}
//         {error && (
//           <div className="px-4 py-3 bg-red-50 border-b border-red-200">
//             <div className="flex items-center gap-2">
//               <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Orders */}
//         <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-200px)]">
//           {sessionOrders.map((order) => {
//             const isOrderIncluded = selectedOrders[order._id]?.included;

//             return (
//               <div
//                 key={order._id}
//                 className={`rounded-lg border-2 transition-all ${
//                   isOrderIncluded
//                     ? "border-purple-500 bg-purple-50"
//                     : "border-gray-200 bg-gray-50 opacity-50"
//                 }`}
//               >
//                 {/* Order Header */}
//                 <label className="flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200">
//                   <input
//                     type="checkbox"
//                     checked={isOrderIncluded}
//                     onChange={() => toggleOrder(order._id)}
//                     className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-0.5">
//                       <span className="text-xs font-mono text-gray-600">
//                         #{order._id.slice(-6)}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {order.items.length} items
//                       </span>
//                     </div>
//                     <span className="text-sm font-bold text-purple-600">
//                       ₹{order.grandTotal.toFixed(0)}
//                     </span>
//                   </div>
//                 </label>

//                 {/* Items */}
//                 {isOrderIncluded && (
//                   <div className="p-2 space-y-1">
//                     {order.items.map((item, idx) => {
//                       const isItemSelected =
//                         selectedOrders[order._id].items[idx];
//                       return (
//                         <label
//                           key={idx}
//                           className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
//                             isItemSelected
//                               ? "bg-white border border-purple-200"
//                               : "bg-gray-100 border border-gray-200 opacity-50"
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={isItemSelected}
//                             onChange={() => toggleItem(order._id, idx)}
//                             className="w-3 h-3 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
//                           />
//                           {item.imageUrl && (
//                             <img
//                               src={item.imageUrl}
//                               alt={item.name}
//                               className="w-8 h-8 rounded object-cover"
//                               onError={(e) => { e.target.style.display = 'none'; }}
//                             />
//                           )}
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs font-semibold text-gray-900 truncate">
//                               {item.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               ₹{item.unitPrice} × {item.qty}
//                             </p>
//                           </div>
//                           <span className="text-xs text-purple-600 font-bold">
//                             ₹{item.totalPrice.toFixed(0)}
//                           </span>
//                         </label>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <div className="bg-white border-t border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <p className="text-xs text-gray-500">Selected</p>
//               <p className="text-sm font-bold text-gray-900">{itemCount} items</p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-500">Total</p>
//               <p className="text-2xl font-bold text-purple-600">
//                 ₹{totalAmount.toFixed(0)}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleGenerateBill}
//               disabled={generatingBill || itemCount === 0}
//               className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {generatingBill ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Receipt className="w-4 h-4" />
//               )}
//               {generatingBill ? "Generating..." : `Generate (${itemCount})`}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===============================
//    PRINT BILL COMPONENT
// =============================== */
// const PrintBillComponent = ({ bill, restaurantName }) => {
//   const discountAmount =
//     bill.discountType === "PERCENTAGE"
//       ? (bill.subtotal * bill.discount) / 100
//       : bill.discountType === "FIXED"
//       ? bill.discount
//       : 0;

//   return (
//     <div id="print-bill-content" className="print-only fixed inset-0 bg-white z-[99999]">
//       <style>{`
//         @media print {
//           .print-only {
//             display: block !important;
//           }
//           body * {
//             visibility: hidden;
//           }
//           .print-only, .print-only * {
//             visibility: visible;
//           }
//           .print-only {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//         }
//         @media screen {
//           .print-only {
//             display: none;
//           }
//         }
//       `}</style>

//       <div className="max-w-2xl mx-auto p-8">
//         {/* Header */}
//         <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {restaurantName}
//           </h1>
//           <p className="text-sm text-gray-600">Bill Receipt</p>
//         </div>

//         {/* Bill Info */}
//         <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
//           <div>
//             <p className="text-gray-600">Bill Number:</p>
//             <p className="font-bold">{bill.billNumber}</p>
//           </div>
//           <div>
//             <p className="text-gray-600">Date:</p>
//             <p className="font-medium">
//               {new Date(bill.createdAt).toLocaleString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-600">Table:</p>
//             <p className="font-medium">Table {bill.tableNumber}</p>
//           </div>
//           <div>
//             <p className="text-gray-600">Status:</p>
//             <p className="font-medium">{bill.status}</p>
//           </div>
//         </div>

//         {/* Customer Info */}
//         <div className="mb-6 pb-4 border-b border-gray-300">
//           <h3 className="font-bold mb-2">Customer Details</h3>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <p className="text-gray-600">Name:</p>
//               <p className="font-medium">{bill.customerName}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Phone:</p>
//               <p className="font-medium">{bill.phoneNumber || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Items */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-3">Order Items</h3>
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-300">
//                 <th className="text-left py-2">Item</th>
//                 <th className="text-center py-2">Qty</th>
//                 <th className="text-right py-2">Price</th>
//                 <th className="text-right py-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bill.items?.map((item, idx) => (
//                 <tr key={idx} className="border-b border-gray-200">
//                   <td className="py-2">
//                     <p className="font-medium">{item.name}</p>
//                     {item.variant?.name && (
//                       <p className="text-xs text-gray-600">{item.variant.name}</p>
//                     )}
//                   </td>
//                   <td className="text-center">{item.qty}</td>
//                   <td className="text-right">₹{item.unitPrice.toFixed(0)}</td>
//                   <td className="text-right font-medium">
//                     ₹{item.totalPrice.toFixed(0)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Bill Summary */}
//         <div className="border-t-2 border-gray-800 pt-4">
//           <div className="space-y-2 text-sm mb-4">
//             <div className="flex justify-between">
//               <span>Subtotal:</span>
//               <span className="font-medium">₹{bill.subtotal.toFixed(0)}</span>
//             </div>

//             {discountAmount > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>
//                   Discount{" "}
//                   {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}:
//                 </span>
//                 <span className="font-medium">-₹{discountAmount.toFixed(0)}</span>
//               </div>
//             )}

//             {bill.serviceCharge?.enabled && (
//               <div className="flex justify-between">
//                 <span>Service Charge ({bill.serviceCharge.rate}%):</span>
//                 <span className="font-medium">
//                   +₹{bill.serviceCharge.amount.toFixed(0)}
//                 </span>
//               </div>
//             )}

//             {bill.taxes?.map((tax, i) => (
//               <div key={i} className="flex justify-between">
//                 <span>
//                   {tax.name} ({tax.rate}%):
//                 </span>
//                 <span className="font-medium">+₹{tax.amount.toFixed(0)}</span>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between items-center text-lg font-bold border-t-2 border-gray-800 pt-3">
//             <span>Grand Total:</span>
//             <span>₹{bill.grandTotal.toFixed(0)}</span>
//           </div>
//         </div>

//         {/* Payment Info */}
//         {bill.status === "FINALIZED" && (
//           <div className="mt-6 pt-4 border-t border-gray-300">
//             <div className="flex justify-between text-sm">
//               <div>
//                 <p className="text-gray-600">Payment Status:</p>
//                 <p className="font-bold">{bill.paymentStatus}</p>
//               </div>
//               {bill.paymentMethod && (
//                 <div className="text-right">
//                   <p className="text-gray-600">Payment Method:</p>
//                   <p className="font-medium">{bill.paymentMethod}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Notes */}
//         {bill.notes && (
//           <div className="mt-6 p-3 bg-gray-100 rounded">
//             <p className="text-xs text-gray-600 mb-1">Notes:</p>
//             <p className="text-sm">{bill.notes}</p>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
//           <p>Thank you for your business!</p>
//           <p className="mt-1">
//             Printed on {new Date().toLocaleString("en-IN")}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// OrderCard.displayName = "OrderCard";

// export default OrderCard;









import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Receipt,
  Users,
  X as XIcon,
  FileCheck,
  Hash,
  CheckCircle,
  XCircle,
  ChefHat,
  Printer,
  WifiOff,
  CloudOff,
  RefreshCw,
  Package,
  Truck,
} from "lucide-react";
import { 
  createBillFromOrders, 
  createBillFromSelectedItems,
  fetchBillById,
  onSyncEvent,
} from "../../api/billingApi";
import { useAuth } from "../../context/AuthContext";
import offlineDB from "../../services/offlineDB";
import { io } from "socket.io-client";
import.meta.env

const isElectron = () => {
  try {
    return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  } catch {
    return false;
  }
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const OrderCard = React.memo(({ order, onUpdate, allOrders = [], onBillGenerated }) => {
  const [expanded, setExpanded] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [billData, setBillData] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [printBill, setPrintBill] = useState(null);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [showDeliveryAssign, setShowDeliveryAssign] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [assigningDelivery, setAssigningDelivery] = useState(false);
  const [socket, setSocket] = useState(null);
const navigate = useNavigate();
const { owner } = useAuth();
const isOnline = useOnlineStatus();

useEffect(() => {
  console.log("🔎 OWNER OBJECT:", owner);
  console.log("📦 DELIVERY PHONES:", owner?.deliveryPhones);
}, [owner]);

  const isPending = order.status === "pending";
  const isPreparing = order.status === "confirmed";
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";
  const isBilled = Boolean(order.billId || order.billed === true);

  const orderType = order.orderType || "DINE_IN";
  const isOnlineOrder = orderType === "ONLINE";
  const deliveryStatus = order.delivery?.status || "not_assigned";

  const sessionOrders = orderType === "DINE_IN" 
    ? allOrders.filter(
        (o) =>
          o.sessionId === order.sessionId &&
          o.status === "completed" &&
          !o.billed &&
          !o.billId
      )
    : [];

  const hasUnbilledSession =
    orderType === "DINE_IN" && Boolean(order.sessionId) && sessionOrders.length > 0 && !isBilled;

  useEffect(() => {
    if (!owner?.username) return;

    // const socketUrl = process.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected for delivery updates");
      newSocket.emit("restaurant:join", { username: owner.username });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [owner?.username]);

  useEffect(() => {
    const unsubscribe = onSyncEvent((event) => {
      if (event.type === 'bill_synced' && event.serverBill) {
        const billOrderIds = event.serverBill.orderIds || [];
        if (billOrderIds.includes(order._id)) {
          console.log('🔄 Bill synced for this order:', event.serverBill.billNumber);
          setSyncStatus('synced');
          
          if (onBillGenerated) {
            onBillGenerated(event.serverBill, billOrderIds);
          }
          
          setTimeout(() => setSyncStatus(null), 3000);
        }
      } else if (event.type === 'sync_completed') {
        setTimeout(() => setSyncStatus(null), 1000);
      }
    });

    return () => unsubscribe();
  }, [order._id, onBillGenerated]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "not_assigned":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "assigned":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "out_for_delivery":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  
  const getStatusLabel = (status) => {
    if (status === "confirmed") return "PREPARING";
    return status.toUpperCase();
  };

  const getTimeElapsed = () => {
    try {
      if (!order.createdAt) return "";
      const elapsed = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
      if (elapsed < 1) return "now";
      if (elapsed < 60) return `${elapsed}m`;
      const hours = Math.floor(elapsed / 60);
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
    } catch {
      return "";
    }
  };

  const formatPrice = (price) => {
    try {
      return price ? `₹${price.toFixed(0)}` : "₹0";
    } catch {
      return "₹0";
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedDeliveryBoy || !socket) return;

    // const deliveryBoy = owner.deliveryPhones?.find(d => d.phone === selectedDeliveryBoy);

    const deliveryBoy = owner.deliveryPhones?.find(d => d.number === selectedDeliveryBoy);

    if (!deliveryBoy) {
      setError("Delivery boy not found");
      return;
    }

    setAssigningDelivery(true);
    setError(null);

    try {
      socket.emit("restaurant:order:assign-delivery", {
        orderId: order._id,
        username: order.username || owner.username,
        // boyName: deliveryBoy.name,
        boyName: deliveryBoy.label || "Delivery Partner",

        // boyPhone: deliveryBoy.phone,
        boyPhone: deliveryBoy.number,

      });

      socket.once("delivery:assigned:success", () => {
        console.log("✅ Delivery assigned successfully");
        setShowDeliveryAssign(false);
        setSelectedDeliveryBoy("");
        setAssigningDelivery(false);
      });

      socket.once("error", (errorData) => {
        console.error("❌ Delivery assignment error:", errorData);
        setError(errorData.message || "Failed to assign delivery");
        setAssigningDelivery(false);
      });
    } catch (error) {
      console.error("❌ Delivery assignment error:", error);
      setError("Failed to assign delivery");
      setAssigningDelivery(false);
    }
  };

  const handleUpdateDeliveryStatus = async (newStatus) => {
    if (!socket) return;

    try {
      socket.emit("restaurant:order:update-delivery-status", {
        orderId: order._id,
        username: order.username || owner.username,
        status: newStatus,
      });

      socket.once("delivery:status:updated:success", () => {
        console.log(`✅ Delivery status updated to ${newStatus}`);
      });

      socket.once("error", (errorData) => {
        console.error("❌ Delivery status update error:", errorData);
        setError(errorData.message || "Failed to update delivery status");
      });
    } catch (error) {
      console.error("❌ Delivery status update error:", error);
      setError("Failed to update delivery status");
    }
  };

  const handleBillAction = useCallback(async () => {
    const username = order.username || owner?.username;
    if (!username) {
      setError("Username not available");
      return;
    }

    setError(null);

    try {
      if (isBilled && order.billId) {
        setLoadingBill(true);
        
        try {
          let bill = await offlineDB.getBillById(order.billId);
          
          if (!bill && isOnline) {
            const response = await fetchBillById(username, order.billId);
            if (response.success && response.data) {
              bill = response.data;
              await offlineDB.saveBill(bill);
            }
          }
          
          if (bill) {
            setBillData(bill);
            setShowBillDetails(true);
          } else {
            setError("Bill not found");
          }
        } catch (error) {
          console.error("Error fetching bill:", error);
          setError(isOnline ? "Failed to fetch bill" : "Bill not available offline");
        } finally {
          setLoadingBill(false);
        }
        return;
      }

      if (hasUnbilledSession) {
        setShowBillPreview(true);
        return;
      }

      setGeneratingBill(true);
      setSyncStatus('creating');
      
      const billData = {
        orderIds: [order._id],
        discount: 0,
        discountType: "NONE",
        taxes: [
          { name: "CGST", rate: 2.5 },
          { name: "SGST", rate: 2.5 },
        ],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Order #${order._id.slice(-6)}`,
      };

      try {
        const response = await createBillFromOrders(username, billData);
        
        if (response.success && response.data) {
          console.log('✅ Bill created:', response.data.billNumber);
          
          await offlineDB.saveBill(response.data);
          
          await offlineDB.updateOrder(order._id, {
            billed: true,
            billedAt: new Date().toISOString(),
            billId: response.data._id,
            billNumber: response.data.billNumber,
          });
          
          if (response.offline) {
            setSyncStatus('pending');
          } else {
            setSyncStatus('synced');
            setTimeout(() => setSyncStatus(null), 3000);
          }
          
          if (onBillGenerated) {
            onBillGenerated(response.data, [order._id]);
          }
        } else {
          throw new Error(response.message || "Failed to generate bill");
        }
      } catch (error) {
        console.error("Bill generation error:", error);
        setError(
          isOnline 
            ? "Failed to generate bill. Please try again." 
            : "Bill saved offline. Will sync when online."
        );
        setSyncStatus(null);
      } finally {
        setGeneratingBill(false);
      }
    } catch (error) {
      console.error("Unexpected error in handleBillAction:", error);
      setError("An unexpected error occurred");
      setGeneratingBill(false);
      setLoadingBill(false);
      setSyncStatus(null);
    }
  }, [order, owner, isBilled, hasUnbilledSession, isOnline, onBillGenerated]);

  const toggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      setBillData(null);
      setPrintBill(null);
      setError(null);
      setSyncStatus(null);
    };
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 relative">
        {!isOnline && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
              <WifiOff className="w-3 h-3 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">Offline</span>
            </div>
          </div>
        )}

        {syncStatus === 'pending' && (
          <div className="absolute top-2 right-20 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
              <span className="text-xs text-blue-700 font-medium">Syncing...</span>
            </div>
          </div>
        )}

        {syncStatus === 'synced' && (
          <div className="absolute top-2 right-20 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Synced</span>
            </div>
          </div>
        )}

        {error && (
          <div className="px-3 py-2 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="p-3 cursor-pointer" onClick={toggleExpand}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {orderType === "DINE_IN" && (
                <>
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-900">
                    Table {order.tableNumber}
                  </span>
                </>
              )}
              {orderType === "TAKEAWAY" && (
                <>
                  <Package className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-900">
                    Takeaway
                  </span>
                </>
              )}
              {orderType === "ONLINE" && (
                <>
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-900">
                    Delivery
                  </span>
                </>
              )}
              
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
              
              {hasUnbilledSession && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {sessionOrders.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getTimeElapsed()}</span>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {order.customerName}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {order.items?.length || 0} items
            </span>
          </div>

          {isBilled && order.billNumber && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 border border-green-200 rounded">
              <Receipt className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              <span className="text-xs font-mono text-green-700">
                {order.billNumber}
              </span>
              <FileCheck className="w-3.5 h-3.5 text-green-600 ml-auto" />
            </div>
          )}

          {isOnlineOrder && isCompleted && (
            <div className={`p-2 mb-2 rounded border ${getDeliveryStatusColor(deliveryStatus)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">Delivery Status</span>
                <span className="text-xs font-bold uppercase">{deliveryStatus.replace('_', ' ')}</span>
              </div>
              {deliveryStatus !== "not_assigned" && order.delivery?.boyName && (
                <div className="text-xs text-gray-700 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{order.delivery.boyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{order.delivery.boyPhone}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(order.grandTotal)}
              </span>
            </div>

            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isPending && (
                <>
                  <button
                    onClick={() => onUpdate(order._id, "confirmed")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                    disabled={!isOnline}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => onUpdate(order._id, "cancelled")}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                    disabled={!isOnline}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </>
              )}

              {isPreparing && (
                <button
                  onClick={() => onUpdate(order._id, "completed")}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                  disabled={!isOnline}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Ready
                </button>
              )}

              {isCompleted && !isBilled && !isOnlineOrder && (
                <button
                  onClick={handleBillAction}
                  disabled={generatingBill}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {generatingBill ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : !isOnline ? (
                    <CloudOff className="w-3.5 h-3.5" />
                  ) : (
                    <Receipt className="w-3.5 h-3.5" />
                  )}
                  {generatingBill
                    ? "..."
                    : hasUnbilledSession
                    ? "Review"
                    : "Bill"}
                </button>
              )}

              {isCompleted && isOnlineOrder && deliveryStatus === "not_assigned" && (
                <button
                  onClick={() => setShowDeliveryAssign(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Assign
                </button>
              )}

              {isCompleted && isOnlineOrder && deliveryStatus === "assigned" && (
                <button
                  onClick={() => handleUpdateDeliveryStatus("out_for_delivery")}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Out
                </button>
              )}

              {isCompleted && isOnlineOrder && deliveryStatus === "out_for_delivery" && (
                <button
                  onClick={() => handleUpdateDeliveryStatus("delivered")}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Delivered
                </button>
              )}

              {isBilled && (
                <button
                  onClick={handleBillAction}
                  disabled={loadingBill}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded transition-colors border border-green-200 flex items-center gap-1 disabled:opacity-50"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {loadingBill ? "..." : "View"}
                </button>
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-200 p-3 space-y-2 bg-gray-50">
            <div className="flex items-center gap-2 text-xs">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono text-gray-700">
                {order._id?.slice(-8)}
              </span>
            </div>

            {orderType === "ONLINE" && order.deliveryAddress && (
              <div className="flex items-start gap-2 text-xs p-2 bg-green-50 border border-green-200 rounded">
                <Truck className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-700 mb-1">Delivery Address</p>
                  <p className="text-gray-700">
                    {order.deliveryAddress.line1}
                    {order.deliveryAddress.line2 && `, ${order.deliveryAddress.line2}`}
                  </p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-gray-600 italic">Near: {order.deliveryAddress.landmark}</p>
                  )}
                </div>
              </div>
            )}

            {order.phoneNumber && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-700">{order.phoneNumber}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {hasUnbilledSession && (
              <div className="flex items-center gap-2 text-xs p-2 bg-purple-50 border border-purple-200 rounded">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-purple-700">
                  {sessionOrders.length} orders • ₹
                  {sessionOrders
                    .reduce((sum, o) => sum + o.grandTotal, 0)
                    .toFixed(0)}
                </span>
              </div>
            )}

            <div className="space-y-1 max-h-40 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="text-gray-700 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-500">×{item.qty}</span>
                    <span className="text-blue-600 font-semibold">
                      ₹{item.totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {order.description && (
              <div className="text-xs text-gray-600 italic p-2 bg-blue-50 border border-blue-100 rounded">
                "{order.description}"
              </div>
            )}
          </div>
        )}
      </div>

      {showDeliveryAssign && (
        <DeliveryAssignModal
          onClose={() => setShowDeliveryAssign(false)}
          deliveryBoys={owner?.deliveryPhones || []}
          selectedBoy={selectedDeliveryBoy}
          onSelect={setSelectedDeliveryBoy}
          onAssign={handleAssignDelivery}
          assigning={assigningDelivery}
        />
      )}

      {showBillDetails && billData && (
        <BillDetailsModal
          bill={billData}
          onClose={() => {
            setShowBillDetails(false);
            setBillData(null);
          }}
          onPrint={(bill) => {
            if (isElectron()) {
              const printContent = document.getElementById('print-bill-content');
              if (printContent) {
                window.print();
              } else {
                setPrintBill(bill);
                setTimeout(() => {
                  window.print();
                  setTimeout(() => {
                    setPrintBill(null);
                    setShowBillDetails(false);
                    setBillData(null);
                  }, 1000);
                }, 100);
              }
            } else {
              setPrintBill(bill);
              setShowBillDetails(false);
              setBillData(null);
              setTimeout(() => {
                window.print();
                setTimeout(() => setPrintBill(null), 1000);
              }, 500);
            }
          }}
          restaurantName={owner?.restaurantName}
          isOnline={isOnline}
        />
      )}

      {printBill && (
        <PrintBillComponent
          bill={printBill}
          restaurantName={owner?.restaurantName}
        />
      )}

      {showBillPreview && hasUnbilledSession && (
        <SessionBillPreview
          sessionOrders={sessionOrders}
          onClose={() => setShowBillPreview(false)}
          username={order.username || owner?.username}
          onBillGenerated={onBillGenerated}
          isOnline={isOnline}
        />
      )}
    </>
  );
});

const DeliveryAssignModal = ({ onClose, deliveryBoys, selectedBoy, onSelect, onAssign, assigning }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <h2 className="text-lg font-bold">Assign Delivery</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Select a delivery partner for this order</p>
          
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {deliveryBoys.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No delivery partners available. Please add them in settings.
              </p>
            ) : (
            // deliveryBoys.map((boy) => (
            //   <label
            //     key={boy._id || boy.number}
            //     className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
            //       selectedBoy === boy.number
            //         ? "border-blue-500 bg-blue-50"
            //         : "border-gray-200 hover:border-blue-300"
            //     }`}
            //   >

            //       <input
            //         type="radio"
            //         name="deliveryBoy"
            //         // value={boy.phone}
            //         // checked={selectedBoy === boy.phone}
            //         value={boy.number}
            //         checked={selectedBoy === boy.number}
            //         onChange={(e) => onSelect(e.target.value)}
            //         className="w-4 h-4 text-blue-600"
            //       />
            //       <div className="flex-1">
            //         <p className="font-semibold text-gray-900">{boy.name}</p>
            //         {/* <p className="text-sm text-gray-600">{boy.phone}</p> */}
            //         <p className="text-sm text-gray-600">{boy.number}</p>
            //       </div>
            //     </label>
            //   ))
            deliveryBoys.map((boy) => (
              <label
                key={boy._id}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedBoy === boy.number
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="deliveryBoy"
                  value={boy.number}
                  checked={selectedBoy === boy.number}
                  onChange={(e) => onSelect(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {boy.label || "Delivery Partner"}
                  </p>
                  <p className="text-sm text-gray-600">{boy.number}</p>
                </div>
              </label>
            ))

            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAssign}
              disabled={!selectedBoy || assigning || deliveryBoys.length === 0}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {assigning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BillDetailsModal = ({ bill, onClose, onPrint, restaurantName, isOnline }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrint = () => {
    onPrint(bill);
  };

  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "FINALIZED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "PARTIAL":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{restaurantName}</h2>
            <p className="text-blue-100 text-sm flex items-center gap-2">
              Bill Receipt
              {!isOnline && (
                <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-400/30 rounded text-xs">
                  Offline Mode
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Bill Number</p>
              <p className="font-bold text-gray-900">{bill.billNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                {bill.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-sm text-gray-900">
                {new Date(bill.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Table</p>
              <p className="text-sm text-gray-900">Table {bill.tableNumber}</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{bill.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{bill.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Order Items ({bill.items?.length || 0} items)
            </h3>
            <div className="space-y-2">
              {bill.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.unitPrice} × {item.qty}
                        {item.variant?.name && ` • ${item.variant.name}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">
                    ₹{item.totalPrice.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{bill.subtotal.toFixed(0)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount{" "}
                    {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}
                  </span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              {bill.serviceCharge?.enabled && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Service Charge ({bill.serviceCharge.rate}%)
                  </span>
                  <span className="font-medium text-gray-900">
                    +₹{bill.serviceCharge.amount.toFixed(0)}
                  </span>
                </div>
              )}

              {bill.taxes?.map((tax, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600">
                    {tax.name} ({tax.rate}%)
                  </span>
                  <span className="font-medium text-gray-900">
                    +₹{tax.amount.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <span className="text-lg font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{bill.grandTotal.toFixed(0)}
              </span>
            </div>
          </div>

          {bill.status === "FINALIZED" && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                  <p className={`font-bold ${getPaymentColor(bill.paymentStatus)}`}>
                    {bill.paymentStatus}
                  </p>
                </div>
                {bill.paymentMethod && (
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900">{bill.paymentMethod}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {bill.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Notes</p>
              <p className="text-sm text-gray-900">{bill.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-300"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionBillPreview = ({ sessionOrders, onClose, username, onBillGenerated, isOnline }) => {
  const [selectedOrders, setSelectedOrders] = useState(
    sessionOrders.reduce(
      (acc, order) => ({
        ...acc,
        [order._id]: {
          included: true,
          items: order.items.reduce(
            (itemAcc, item, idx) => ({ ...itemAcc, [idx]: true }),
            {}
          ),
        },
      }),
      {}
    )
  );
  const [generatingBill, setGeneratingBill] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const calculateTotal = () => {
    let total = 0;
    let itemCount = 0;
    sessionOrders.forEach((order) => {
      if (selectedOrders[order._id]?.included) {
        order.items.forEach((item, idx) => {
          if (selectedOrders[order._id].items[idx]) {
            total += item.totalPrice;
            itemCount++;
          }
        });
      }
    });
    return { total, itemCount };
  };

  const { total: totalAmount, itemCount } = calculateTotal();

  const toggleOrder = (orderId) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], included: !prev[orderId].included },
    }));
  };

  const toggleItem = (orderId, itemIndex) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        items: {
          ...prev[orderId].items,
          [itemIndex]: !prev[orderId].items[itemIndex],
        },
      },
    }));
  };

  const handleGenerateBill = async () => {
    const orderItems = [];
    const affectedOrderIds = [];

    sessionOrders.forEach((order) => {
      if (!selectedOrders[order._id]?.included) return;

      const selectedItemIndexes = [];
      Object.entries(selectedOrders[order._id].items).forEach(
        ([index, isSelected]) => {
          if (isSelected) selectedItemIndexes.push(parseInt(index));
        }
      );

      if (selectedItemIndexes.length > 0) {
        orderItems.push({ orderId: order._id, itemIndexes: selectedItemIndexes });
        affectedOrderIds.push(order._id);
      }
    });

    if (orderItems.length === 0) return;

    setGeneratingBill(true);
    setError(null);

    try {
      const billData = {
        orderItems,
        discount: 0,
        discountType: "NONE",
        taxes: [
          { name: "CGST", rate: 2.5 },
          { name: "SGST", rate: 2.5 },
        ],
        serviceCharge: { enabled: false, rate: 0 },
        additionalCharges: [],
        notes: `Session: ${orderItems.length} orders, ${itemCount} items`,
      };

      const response = await createBillFromSelectedItems(username, billData);
      
      if (response.success && response.data) {
        console.log('✅ Session bill created:', response.data.billNumber);
        
        await offlineDB.saveBill(response.data);
        
        for (const orderId of affectedOrderIds) {
          await offlineDB.updateOrder(orderId, {
            billed: true,
            billedAt: new Date().toISOString(),
            billId: response.data._id,
            billNumber: response.data.billNumber,
          });
        }
        
        if (onBillGenerated) {
          onBillGenerated(response.data, affectedOrderIds);
        }
        
        onClose();
      } else {
        throw new Error(response.message || "Failed to generate bill");
      }
    } catch (error) {
      console.error("Failed to generate bill:", error);
      
      if (error.message && error.message.includes('offline')) {
        onClose();
      } else {
        setError(
          isOnline 
            ? "Failed to generate bill. Please try again." 
            : "Bill saved offline. Will sync when online."
        );
      }
    } finally {
      setGeneratingBill(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200 shadow-2xl">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Session Bill
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              {sessionOrders.length} orders
              {!isOnline && (
                <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
                  Offline
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-200px)]">
          {sessionOrders.map((order) => {
            const isOrderIncluded = selectedOrders[order._id]?.included;

            return (
              <div
                key={order._id}
                className={`rounded-lg border-2 transition-all ${
                  isOrderIncluded
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <label className="flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={isOrderIncluded}
                    onChange={() => toggleOrder(order._id)}
                    className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-600">
                        #{order._id.slice(-6)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.items.length} items
                      </span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      ₹{order.grandTotal.toFixed(0)}
                    </span>
                  </div>
                </label>

                {isOrderIncluded && (
                  <div className="p-2 space-y-1">
                    {order.items.map((item, idx) => {
                      const isItemSelected =
                        selectedOrders[order._id].items[idx];
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                            isItemSelected
                              ? "bg-white border border-purple-200"
                              : "bg-gray-100 border border-gray-200 opacity-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={() => toggleItem(order._id, idx)}
                            className="w-3 h-3 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                          />
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.unitPrice} × {item.qty}
                            </p>
                          </div>
                          <span className="text-xs text-purple-600 font-bold">
                            ₹{item.totalPrice.toFixed(0)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">Selected</p>
              <p className="text-sm font-bold text-gray-900">{itemCount} items</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{totalAmount.toFixed(0)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateBill}
              disabled={generatingBill || itemCount === 0}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generatingBill ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Receipt className="w-4 h-4" />
              )}
              {generatingBill ? "Generating..." : `Generate (${itemCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintBillComponent = ({ bill, restaurantName }) => {
  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  return (
    <div id="print-bill-content" className="print-only fixed inset-0 bg-white z-[99999]">
      <style>{`
        @media print {
          .print-only {
            display: block !important;
          }
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurantName}
          </h1>
          <p className="text-sm text-gray-600">Bill Receipt</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-600">Bill Number:</p>
            <p className="font-bold">{bill.billNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="font-medium">
              {new Date(bill.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Table:</p>
            <p className="font-medium">Table {bill.tableNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="font-medium">{bill.status}</p>
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-300">
          <h3 className="font-bold mb-2">Customer Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{bill.customerName}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{bill.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">Order Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2">
                    <p className="font-medium">{item.name}</p>
                    {item.variant?.name && (
                      <p className="text-xs text-gray-600">{item.variant.name}</p>
                    )}
                  </td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">₹{item.unitPrice.toFixed(0)}</td>
                  <td className="text-right font-medium">
                    ₹{item.totalPrice.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t-2 border-gray-800 pt-4">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{bill.subtotal.toFixed(0)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount{" "}
                  {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}:
                </span>
                <span className="font-medium">-₹{discountAmount.toFixed(0)}</span>
              </div>
            )}

            {bill.serviceCharge?.enabled && (
              <div className="flex justify-between">
                <span>Service Charge ({bill.serviceCharge.rate}%):</span>
                <span className="font-medium">
                  +₹{bill.serviceCharge.amount.toFixed(0)}
                </span>
              </div>
            )}

            {bill.taxes?.map((tax, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {tax.name} ({tax.rate}%):
                </span>
                <span className="font-medium">+₹{tax.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-lg font-bold border-t-2 border-gray-800 pt-3">
            <span>Grand Total:</span>
            <span>₹{bill.grandTotal.toFixed(0)}</span>
          </div>
        </div>

        {bill.status === "FINALIZED" && (
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-600">Payment Status:</p>
                <p className="font-bold">{bill.paymentStatus}</p>
              </div>
              {bill.paymentMethod && (
                <div className="text-right">
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="font-medium">{bill.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {bill.notes && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <p className="text-xs text-gray-600 mb-1">Notes:</p>
            <p className="text-sm">{bill.notes}</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            Printed on {new Date().toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

OrderCard.displayName = "OrderCard";

export default OrderCard;