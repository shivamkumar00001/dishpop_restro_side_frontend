import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { owner, loading } = useAuth();
  const location = useLocation();
  const { username } = useParams();

  // ✅ DO NOT BLOCK ROUTE DURING LOADING
  if (loading) {
    return <Outlet />;   // 🔥 THIS IS THE FIX
  }

  // 🔒 Not logged in (ONLY after loading finished)
  if (!owner) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ❌ Username mismatch → 404
  if (username && username !== owner.username) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
