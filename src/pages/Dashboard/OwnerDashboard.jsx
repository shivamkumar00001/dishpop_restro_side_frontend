import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/Sidebar";
import ARViewStatistics from "./ArViewStatistics";
import FeedbackSummary from "./FeedbackSummary";
import ModelInsights from "./ModelsInsights";
import LiveOrdersPanel from "./LiveOrderPanel";

import { api } from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD DASHBOARD DATA
  =============================== */
  useEffect(() => {
    async function loadData() {
      try {
        const [resUser, resRestaurant] = await Promise.all([
          api.get("/auth/profile", { withCredentials: true }),
          api.get(`/v1/restaurant/${username}`, { withCredentials: true }),
        ]);

        setUser(resUser.data.user);
        setRestaurant(resRestaurant.data);

        localStorage.setItem("uname", resUser.data.user.username);
        localStorage.setItem("rid", resRestaurant.data._id);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load dashboard";
        toast.error(msg);

        if (err.response?.status === 404) {
          navigate("/404", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [username, navigate]);
 console.log("Dashboard room:", username);

  /* ===============================
     LOGOUT
  =============================== */
  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ===============================
     LOADING / ERROR STATES
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
        Loading...
      </div>
    );
  }

  if (!user || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
        <p>Error loading dashboard</p>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen bg-[#0c0f14] text-white flex relative">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg lg:text-2xl font-bold">
            Dashboard – {user.restaurantName}
          </h1>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ARViewStatistics restaurantId={username} />
          </div>

            <div className="lg:col-span-1">
            <ModelInsights restaurantId={username} />
          </div>
        </div>

        {/* LIVE ORDERS + FEEDBACK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
         { (
  <LiveOrdersPanel username={username} />
)}

<FeedbackSummary username={user.username} />
        </div>
      </div>
    </div>
  );
}
