import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Dashboards() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/dashboard");
      setItems(data.dashboards);
    } catch (err) {
      setError(err.response?.data?.msg || "Could not load dashboards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this dashboard?")) return;
    try {
      await api.delete(`/dashboard/${id}`);
      setItems((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Your dashboards
            </h1>
            <p className="text-slate-400">
              {loading
                ? "Loading…"
                : `${items.length} dashboard${items.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create")}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            New dashboard
          </motion.button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl border border-white/10 bg-slate-900/40 shimmer"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-white/15 bg-slate-900/30 p-16 text-center"
          >
            <div className="inline-flex w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 items-center justify-center text-violet-300 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 19V5m0 14h16M8 15l3-6 3 4 5-8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xl font-semibold text-white mb-1">
              No dashboards yet
            </div>
            <div className="text-slate-400 mb-6">
              Turn your first Google Sheet into a live dashboard.
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/create")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30"
            >
              Create dashboard
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/5 transition-all duration-500 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold text-white truncate">
                        {d.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {new Date(d.createdAt).toLocaleDateString()} ·{" "}
                        {d.columns?.length || 0} cols
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(d._id)}
                      title="Delete"
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(d.columns || []).slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400"
                      >
                        {c}
                      </span>
                    ))}
                    {(d.columns || []).length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500">
                        +{d.columns.length - 4}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/dashboard/${d._id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-violet-300 hover:text-violet-200 font-medium"
                  >
                    Open
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
