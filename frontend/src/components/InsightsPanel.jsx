import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const ICONS = {
  stat: "📊",
  trend: "📈",
  anomaly: "⚠️",
  extreme: "🎯",
  correlation: "🔗",
  change: "⚡",
  summary: "✨",
  info: "💡",
};

const TONE = {
  stat: "from-violet-500/15 to-violet-500/5 border-violet-500/25 text-violet-200",
  trend: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/25 text-emerald-200",
  anomaly: "from-amber-500/15 to-amber-500/5 border-amber-500/25 text-amber-200",
  extreme: "from-fuchsia-500/15 to-fuchsia-500/5 border-fuchsia-500/25 text-fuchsia-200",
  correlation: "from-sky-500/15 to-sky-500/5 border-sky-500/25 text-sky-200",
  change: "from-rose-500/15 to-rose-500/5 border-rose-500/25 text-rose-200",
  summary: "from-slate-500/15 to-slate-500/5 border-white/10 text-slate-300",
  info: "from-slate-500/10 to-slate-500/5 border-white/10 text-slate-300",
};

export default function InsightsPanel({ dashboardId, refreshKey }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/dashboard/${dashboardId}/insights`);
      setInsights(data.insights || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not generate insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, refreshKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L14 8h6l-5 4 2 7-7-4-7 4 2-7-5-4h6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Insights</div>
            <div className="text-xs text-slate-500">
              Auto-generated from your live data
            </div>
          </div>
        </div>
        <button
          onClick={load}
          className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
        >
          Regenerate
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 rounded-lg border border-white/10 shimmer"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-2">
          <AnimatePresence>
            {insights.map((ins, i) => (
              <motion.div
                key={`${ins.kind}-${i}-${ins.text}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-lg border bg-gradient-to-br p-3 text-sm flex items-start gap-2.5 ${
                  TONE[ins.kind] || TONE.info
                }`}
              >
                <span className="text-lg leading-none mt-0.5">
                  {ICONS[ins.kind] || "•"}
                </span>
                <span className="leading-snug">{ins.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
