import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GridDashboard from "../components/GridDashboard";
import ThemeToggle from "../components/ThemeToggle";
import api from "../api";

const REFRESH_MS = 5000;

export default function Shared() {
  const { shareId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const pollRef = useRef(null);

  const fetchData = async () => {
    try {
      const { data: live } = await api.get(`/dashboard/share/${shareId}`);
      setData(live);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    pollRef.current = setInterval(fetchData, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(pollRef.current);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId]);

  const secondsSince = data?.fetchedAt
    ? Math.max(0, Math.floor((now - data.fetchedAt) / 1000))
    : 0;

  return (
    <div className="min-h-screen">
      {/* Minimal nav for public view */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 19V5m0 14h16M8 15l3-6 3 4 5-8"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              SheetVision
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/signup"
              className="text-xs px-3 py-1.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-100"
            >
              Create your own
            </Link>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div>
            <div className="h-8 w-64 rounded-md shimmer mb-3" />
            <div className="h-4 w-40 rounded-md shimmer mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl border border-white/10 shimmer"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="text-rose-400 font-semibold mb-2">
              Dashboard not available
            </div>
            <div className="text-slate-400 mb-6">{error}</div>
            <Link
              to="/"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              ← Back home
            </Link>
          </div>
        ) : (
          data && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {data.name}
                  </h1>
                  <div className="text-slate-400 text-sm mt-1">
                    {data.rows.length} rows · refreshed {secondsSince}s ago ·
                    read-only share
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  Live · every 5s
                </div>
              </div>
              <GridDashboard
                data={data}
                layoutConfig={data.layoutConfig}
                editable={false}
              />
            </>
          )
        )}
      </div>
    </div>
  );
}
