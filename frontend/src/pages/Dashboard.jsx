import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import GridDashboard from "../components/GridDashboard";
import InsightsPanel from "../components/InsightsPanel";
import { API_BASE } from "../api";
import api from "../api";

const REFRESH_MS = 5000;

export default function Dashboard() {
  const { id } = useParams();
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const pollRef = useRef(null);
  const layoutSaveRef = useRef(null);
  const insightsRefreshRef = useRef(0);

  const loadMeta = async () => {
    try {
      const { data } = await api.get(`/dashboard/${id}`);
      setMeta(data.dashboard);
      setLayoutConfig(data.dashboard.layoutConfig || null);
    } catch (err) {
      setError(err.response?.data?.msg || "Not found");
    }
  };

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const { data: live } = await api.get(`/dashboard/${id}/data`);
      setData(live);
      setLastFetchedAt(live.fetchedAt);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not refresh");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
    fetchData();
    pollRef.current = setInterval(fetchData, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(pollRef.current);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const secondsSince = lastFetchedAt
    ? Math.max(0, Math.floor((now - lastFetchedAt) / 1000))
    : 0;

  const copyShareLink = async () => {
    if (!meta?.shareId) return;
    const url = `${window.location.origin}/share/${meta.shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      prompt("Copy this share link:", url);
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/dashboard/${id}/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Export failed");
        return r.blob();
      })
      .then((blob) => {
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = `${meta?.name || "dashboard"}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
      })
      .catch((e) => alert(e.message));
  };

  const handleLayoutChange = useCallback(
    (next) => {
      setLayoutConfig(next);
      // Debounce save
      if (layoutSaveRef.current) clearTimeout(layoutSaveRef.current);
      layoutSaveRef.current = setTimeout(() => {
        api
          .patch(`/dashboard/${id}/layout`, { layoutConfig: next })
          .catch(() => {
            /* layout save failed - ignore */
          });
      }, 700);
    },
    [id]
  );

  return (
    <div className="min-h-screen">
      <Navbar />

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
            <div className="grid lg:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-white/10 shimmer"
                />
              ))}
            </div>
          </div>
        ) : error && !data ? (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="text-rose-400 font-semibold mb-2">
              Something went wrong
            </div>
            <div className="text-slate-400 mb-6">{error}</div>
            <Link
              to="/dashboards"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              ← Back to dashboards
            </Link>
          </div>
        ) : (
          data && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {meta?.name || "Dashboard"}
                  </h1>
                  <div className="text-slate-400 text-sm mt-1">
                    {data.rows.length} rows · refreshed {secondsSince}s ago ·
                    drag & resize any widget
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300">
                    <motion.span
                      animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                      transition={{
                        duration: 1,
                        repeat: refreshing ? Infinity : 0,
                        ease: "linear",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"
                    />
                    Auto-refresh · every 5s
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={fetchData}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10 flex items-center gap-1.5"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 12a9 9 0 1 1-3.5-7.1M21 3v5h-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExport}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/10 flex items-center gap-1.5"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Export CSV
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={copyShareLink}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-500/20"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="c"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5"
                        >
                          ✓ Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="s"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5m-1.5 9.57L9 16.5a5 5 0 0 1-7.07-7.07l3-3a5 5 0 0 1 7.07 0"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Share
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              <InsightsPanel
                dashboardId={id}
                refreshKey={insightsRefreshRef.current}
              />

              <GridDashboard
                data={data}
                layoutConfig={layoutConfig}
                editable={true}
                onLayoutChange={handleLayoutChange}
              />
            </>
          )
        )}

        {error && data && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
