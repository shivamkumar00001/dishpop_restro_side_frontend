// src/components/Dashboard/ARViewStatistics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../utils/socket";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ARViewStatistics({ restaurantId }) {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [totalWeekClicks, setTotalWeekClicks] = useState(0);

  /* ---------------- LAST 7 DAYS ---------------- */
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(
        d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
      );
    }
    return dates;
  };

  /* ---------------- FETCH ---------------- */
  const fetchWeeklyStats = async () => {
    if (!restaurantId) return;

    try {
      const res = await axios.get(
        `https://dishpop-user-side-backend.onrender.com/api/ar/stats/${restaurantId}`
      );

      const data = res.data.stats || [];
      const last7Days = getLast7Days();

      const chartData = last7Days.map((date) => {
        const totalClicks = data
          .filter((s) => s.date === date)
          .reduce((sum, s) => sum + s.clicks, 0);

        const dayLabel = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "Asia/Kolkata",
        });

        return {
          date,        // ✅ internal (for live updates)
          day: dayLabel, // ✅ display (for X-axis)
          clicks: totalClicks,
        };
      });

      setWeeklyStats(chartData);
      setTotalWeekClicks(
        chartData.reduce((sum, d) => sum + d.clicks, 0)
      );
    } catch (err) {
      console.error("Failed to fetch weekly AR stats:", err);
    }
  };

  useEffect(() => {
    fetchWeeklyStats();
  }, [restaurantId]);

  /* ---------------- LIVE UPDATES ---------------- */
  useEffect(() => {
    socket.on("ar-updated", (data) => {
      if (data.restaurantId !== restaurantId) return;

      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      setWeeklyStats((prev) =>
        prev.map((d) =>
          d.date === today ? { ...d, clicks: d.clicks + 1 } : d
        )
      );

      setTotalWeekClicks((prev) => prev + 1);
    });

    return () => socket.off("ar-updated");
  }, [restaurantId]);

  return (
    <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            AR Views
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Last 7 days performance
          </p>
        </div>

        <p className="text-sm font-bold text-blue-400">
          {totalWeekClicks} views
        </p>
      </div>

      {/* CHART */}
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyStats}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            {/* Horizontal grid only */}
            <CartesianGrid
              vertical={false}
              stroke="#1F2532"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="day"   // ✅ FIXED
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              axisLine={{ stroke: "#232A37" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              axisLine={{ stroke: "#232A37" }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0D1017",
                border: "1px solid #1F2532",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "#9CA3AF" }}
              itemStyle={{ color: "#60A5FA" }}
            />

            <Bar
              dataKey="clicks"
              fill="#60A5FA"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
