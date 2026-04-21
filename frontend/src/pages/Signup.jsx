import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { label: "", pct: 0, color: "" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p) || /[^\w]/.test(p)) score++;
    const map = [
      { label: "Too short", pct: 20, color: "bg-rose-400" },
      { label: "Weak", pct: 40, color: "bg-rose-400" },
      { label: "Okay", pct: 60, color: "bg-amber-400" },
      { label: "Good", pct: 80, color: "bg-emerald-400" },
      { label: "Strong", pct: 100, color: "bg-emerald-500" },
    ];
    return map[score];
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboards");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-600/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19V5m0 14h16M8 15l3-6 3 4 5-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">SheetVision</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-slate-400 text-sm mb-6">
            Free forever. No credit card required.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition"
              />
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      animate={{ width: `${passwordStrength.pct}%` }}
                      transition={{ duration: 0.25 }}
                      className={`h-full ${passwordStrength.color}`}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {passwordStrength.label}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-shadow hover:shadow-violet-500/50"
            >
              {loading ? "Creating account…" : "Create account"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 font-medium hover:text-violet-300"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
