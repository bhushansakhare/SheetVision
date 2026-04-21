import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import api from "../api";

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, d] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/dashboards"),
      ]);
      setStats(s.data);
      setUsers(u.data.users);
      setDashboards(d.data.dashboards);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user and all their dashboards?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      load();
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  const toggleRole = async (u) => {
    const next = u.role === "superadmin" ? "user" : "superadmin";
    if (!confirm(`Change ${u.email} role to ${next}?`)) return;
    try {
      const { data } = await api.patch(`/admin/users/${u._id}/role`, {
        role: next,
      });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, role: data.user.role } : x))
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  const deleteDash = async (id) => {
    if (!confirm("Delete this dashboard?")) return;
    try {
      await api.delete(`/admin/dashboards/${id}`);
      setDashboards((prev) => prev.filter((d) => d._id !== id));
      load();
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                SUPER ADMIN
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Control panel</h1>
            <p className="text-slate-400">
              Platform analytics, users, and dashboards.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-xl border border-white/10 bg-slate-900/40 p-1 w-fit">
          {[
            { k: "overview", l: "Overview" },
            { k: "users", l: `Users (${users.length})` },
            { k: "dashboards", l: `Dashboards (${dashboards.length})` },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                tab === t.k
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === t.k && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-lg bg-white/10 border border-white/15"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative">{t.l}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div
              key="ov"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {loading || !stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-2xl border border-white/10 shimmer"
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total users" value={stats.users} index={0} />
                    <StatCard
                      label="Super admins"
                      value={stats.superadmins}
                      index={1}
                    />
                    <StatCard
                      label="Total dashboards"
                      value={stats.dashboards}
                      index={2}
                    />
                    <StatCard
                      label="New (7d)"
                      value={`${stats.newUsers7d} / ${stats.newDashboards7d}`}
                      index={3}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                    <div className="text-sm font-semibold text-white mb-4">
                      Platform health
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="text-xs text-emerald-300 uppercase tracking-wider mb-1">
                          API
                        </div>
                        <div className="text-xl font-semibold text-white">
                          Operational
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          All endpoints responding normally.
                        </div>
                      </div>
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="text-xs text-emerald-300 uppercase tracking-wider mb-1">
                          Database
                        </div>
                        <div className="text-xl font-semibold text-white">
                          Connected
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {stats.users} accounts · {stats.dashboards} dashboards.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "users" && (
            <motion.div
              key="us"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        User
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Email
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Role
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Dashboards
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Joined
                      </th>
                      <th className="px-5 py-3 text-right font-medium border-b border-white/10">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-300 border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-semibold">
                              {u.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-400">{u.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              u.role === "superadmin"
                                ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                                : "bg-white/5 border border-white/10 text-slate-400"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 tabular-nums">
                          {u.dashboardCount}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => toggleRole(u)}
                            className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 text-slate-300 mr-2"
                          >
                            {u.role === "superadmin" ? "Demote" : "Promote"}
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="text-xs px-2 py-1 rounded border border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {users.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-10 text-center text-slate-500"
                        >
                          No users yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === "dashboards" && (
            <motion.div
              key="dd"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Name
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Owner
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Columns
                      </th>
                      <th className="px-5 py-3 text-left font-medium border-b border-white/10">
                        Created
                      </th>
                      <th className="px-5 py-3 text-right font-medium border-b border-white/10">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboards.map((d) => (
                      <motion.tr
                        key={d._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-300 border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-3 text-white">{d.name}</td>
                        <td className="px-5 py-3 text-slate-400">
                          {d.user?.email || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {d.columns?.length || 0}
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <a
                            href={`/share/${d.shareId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 text-slate-300 mr-2"
                          >
                            Open
                          </a>
                          <button
                            onClick={() => deleteDash(d._id)}
                            className="text-xs px-2 py-1 rounded border border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {dashboards.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-slate-500"
                        >
                          No dashboards yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
