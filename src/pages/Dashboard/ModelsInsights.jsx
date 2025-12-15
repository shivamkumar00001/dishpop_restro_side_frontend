import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { TrendingUp } from "lucide-react";

export default function ModelInsights({ restaurantId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!restaurantId) return;

    api
      .get("/ar-stats/top", {
        params: { restaurantId, limit: 10 },
      })
      .then((res) => setItems(res.data.topItems || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 animate-pulse">
        <div className="h-4 w-40 bg-[#1A1F2B] rounded mb-2" />
        <div className="h-3 w-52 bg-[#1A1F2B] rounded mb-6" />

        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 bg-[#1A1F2B] rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-[#1A1F2B] rounded" />
              <div className="h-2 w-24 bg-[#1A1F2B] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            AR Model Insights
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Top performing AR dishes
          </p>
        </div>

        <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
          <TrendingUp className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      {items.length === 0 ? (
        <p className="text-xs text-gray-500">No AR data yet.</p>
      ) : (
        <div
          className="
            space-y-3
            h-[260px]
            overflow-y-auto
            pr-1
            hide-scrollbar
          "
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="
                group flex items-center gap-4
                bg-[#12151D] border border-[#232A37]
                rounded-xl p-3
                transition-all duration-300
                hover:border-blue-400/40
                hover:-translate-y-[1px]
                hover:shadow-[0_0_16px_-6px_rgba(59,130,246,0.35)]
              "
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item._id}
                  className="w-11 h-11 rounded-xl object-cover"
                />

                {i === 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-600 text-white">
                    Top
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-100 truncate">
                  {item._id}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {item.totalClicks} AR views
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
