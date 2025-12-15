// // src/routes/AppRoutes.jsx
// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";

// // AUTH
// import Register from "../pages/auth/Register";
// import Login from "../pages/auth/Login";
// import Forget from "../pages/auth/Forget";
// import VerifyOTP from "../pages/auth/Verify";
// import ResetPassword from "../pages/auth/ResetPassword";

// // SETTINGS
// import Profile from "../pages/profile/Profile";
// import EditProfile from "../pages/profile/EditProfile";

// // OWNER / MENU
// import Dashboard from "../pages/Dashboard/OwnerDashboard";
// import SubscriptionPage from "../pages/subscription/subscriptionPage";
// import DishList from "../pages/Menu/DishList";
// import AddDishPage from "../pages/Menu/AddDishPage";
// import EditDishPage from "../pages/Menu/EditDishPage";
// import QrPage from "../pages/Menu/QrPage";
// import OrdersPage from "../pages/ordermanage/OrderPage";

// // LANDING
// import LandingPage from "../pages/Home/LandingPage";

// // 404
// import NotFound from "../pages/NotFound/NotFound";

// export default function AppRoutes() {
//   return (
//     <Routes>

//       {/* PUBLIC */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/forget" element={<Forget />} />
//       <Route path="/verify-otp" element={<VerifyOTP />} />
//       <Route path="/reset-password" element={<ResetPassword />} />

//       {/* SETTINGS */}
//       <Route path="/settings" element={
//         <ProtectedRoute>
//           <Profile />
//         </ProtectedRoute>
//       } />

//       <Route path="/settings/edit" element={
//         <ProtectedRoute>
//           <EditProfile />
//         </ProtectedRoute>
//       } />

//       {/* USER DASHBOARD */}
//       <Route path="/:username/dashboard" element={
//         <ProtectedRoute>
//           <Dashboard />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/subscribe" element={
//         <ProtectedRoute>
//           <SubscriptionPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/dishes" element={
//         <ProtectedRoute>
//           <DishList />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/menu/add" element={
//         <ProtectedRoute>
//           <AddDishPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/dish/:id/edit" element={
//         <ProtectedRoute>
//           <EditDishPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/qr" element={
//         <ProtectedRoute>
//           <QrPage />
//         </ProtectedRoute>
//       } />

//       <Route path="/:username/orders" element={
//         <ProtectedRoute>
//           <OrdersPage />
//         </ProtectedRoute>
//       } />

//       {/* 404 */}
//       <Route path="/404" element={<NotFound />} />
//       <Route path="*" element={<Navigate to="/404" replace />} />

//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------- AUTH ---------- */
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Forget from "../pages/auth/Forget";
import VerifyOTP from "../pages/auth/Verify";
import ResetPassword from "../pages/auth/ResetPassword";

/* ---------- SETTINGS ---------- */
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";

/* ---------- OWNER / MENU ---------- */
import Dashboard from "../pages/Dashboard/OwnerDashboard";
import SubscriptionPage from "../pages/subscription/subscriptionPage";
import DishList from "../pages/Menu/DishList";
import AddDishPage from "../pages/Menu/AddDishPage";
import EditDishPage from "../pages/Menu/EditDishPage";
import QrPage from "../pages/Menu/QrPage";
import OrdersPage from "../pages/ordermanage/OrderPage";

/* ---------- LANDING ---------- */
import LandingPage from "../pages/Home/LandingPage";

/* ---------- 404 ---------- */
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>

        {/* SETTINGS */}
        <Route path="/settings" element={<Profile />} />
        <Route path="/settings/edit" element={<EditProfile />} />

        {/* OWNER DASHBOARD */}
        <Route path="/:username/dashboard" element={<Dashboard />} />
        <Route path="/:username/subscribe" element={<SubscriptionPage />} />
        <Route path="/:username/dishes" element={<DishList />} />
        <Route path="/:username/menu/add" element={<AddDishPage />} />
        <Route path="/:username/dish/:id/edit" element={<EditDishPage />} />
        <Route path="/:username/qr" element={<QrPage />} />
        <Route path="/:username/orders" element={<OrdersPage />} />

      </Route>

      {/* ================= 404 ================= */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
}
