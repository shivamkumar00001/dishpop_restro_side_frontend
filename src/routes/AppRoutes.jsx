import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------- PUBLIC / LANDING ---------- */
import LandingPage from "../pages/Home/LandingPage";
import About from "../pages/Home/About";
import Contact from "../pages/Home/Contact";
import PrivacyPolicy from "../pages/Home/PrivacyPolicy";
import TermsOfService from "../pages/Home/Terms";

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
import ARModelRequest from "../pages/ArmodelRequest";

/* ---------- 404 ---------- */
import NotFound from "../pages/NotFound/NotFound";
import CategoriesPage from "../pages/Menu/CategoriesPage";
import AddonManager from "../pages/Addons/AddonManager";
import BillingPage from "../pages/Billing/BillingPage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      {/* ================= AUTH ================= */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<Forget />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>

        {/* SETTINGS */}
        <Route path="/settings" element={<Profile />} />
        <Route path="/settings/edit" element={<EditProfile />} />

        {/* OWNER DASHBOARD */}
        <Route path="/:username/dashboard" element={<Dashboard />} />
<Route path="/request-ar-model/:dishId" element={<ARModelRequest />} />

        {/* 🔹 Enhanced Subscription Page */}
        <Route
          path="/:username/subscribe"
          element={<SubscriptionPage />}
        />

        <Route path="/:username/dishes" element={<DishList />} />
        <Route path="/:username/menu/add" element={<AddDishPage />} />
        <Route path="/:username/dish/:id/edit" element={<EditDishPage />} />
        <Route path="/:username/qr" element={<QrPage />} />
        <Route path="/:username/orders" element={<OrdersPage />} />

      </Route>

      <Route path="/:username/categories" element={<CategoriesPage />} />


      {/* ================= 404 ================= */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

      <Route path="/:username/addons" element={<AddonManager/>} />

      <Route path="/:username/menu/categories" element={<CategoriesPage/>} />

      <Route path="/billing" element={<BillingPage/>} />
      <Route path="/:username/billing" element={<BillingPage />} />


    </Routes>
  );
}
