import { Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function FeedbackSummary({ username }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    console.log("FEEDBACK USERNAME (FRONTEND):", username);

    const fetchSummary = async () => {
      try {
        const res = await api.get("/feedback/summary", {
          params: { username },
        });

        console.log("FEEDBACK API RESPONSE:", res.data);

        setSummary(res.data.summary);
      } catch (err) {
        console.error("Failed to load feedback summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 text-gray-500">
        Loading feedback...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6 text-gray-500">
        No feedback data found.
      </div>
    );
  }

  const stats = [
    { label: "Excellent", value: summary.excellent, className: "text-blue-400" },
    { label: "Average", value: summary.average, className: "text-yellow-400" },
    { label: "Poor", value: summary.poor, className: "text-red-400" },
  ];

  return (
    <div className="relative bg-[#0D1017] border border-[#1F2532] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            Feedback Summary
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Customer sentiments performance
          </p>
        </div>
        <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
          <Star className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 space-y-2">
        <div className="flex items-end gap-2">
          <p className="text-5xl font-extrabold text-blue-400">
            {summary.avgRating}
          </p>
          <span className="text-xs text-gray-500 mb-1">/5</span>
        </div>

        <div className="w-full h-2 bg-[#1A1F2B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
            style={{ width: `${summary.positivePercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <TrendingUp className="w-3 h-3 text-green-400" />
          {summary.positivePercent}% overall positive rating
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-[#12151D] border border-[#232A37] rounded-lg py-3 text-center"
          >
            <p className="text-[11px] text-gray-500">{item.label}</p>
            <p className={`text-sm font-bold ${item.className}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-500">
        <Users className="w-3.5 h-3.5" />
        {summary.totalReviews} Responses Counted
      </div>
    </div>
  );
}
