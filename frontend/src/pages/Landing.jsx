import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const features = [
  {
    title: "Real-time refresh",
    desc: "Your dashboards stay in sync with every sheet edit. Zero polling noise — instant visual updates.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12a9 9 0 1 1-3.5-7.1M21 3v5h-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Smart chart picking",
    desc: "Drop your sheet URL, pick the columns that matter. We choose the right chart, every time.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19V5m0 14h16M8 15l3-6 3 4 5-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "One-click sharing",
    desc: "Generate a public link that always reflects the latest data. No exports, no stale screenshots.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5m-1.5 9.57L9 16.5a5 5 0 0 1-7.07-7.07l3-3a5 5 0 0 1 7.07 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Blazing fast",
    desc: "Charts render in under 300ms. Built on a modern stack so your dashboards never feel laggy.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Secure by default",
    desc: "Your credentials never leave our encrypted store. Dashboards are private until you share them.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Mobile ready",
    desc: "Every chart adapts to tablet and phone viewports. Ship dashboards that look great anywhere.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="5"
          y="2"
          width="14"
          height="20"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M11 18h2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const steps = [
  { n: "01", t: "Paste URL", d: "Drop any shared Google Sheet link." },
  { n: "02", t: "Pick columns", d: "Choose what to visualize." },
  { n: "03", t: "Go live", d: "Share a link. Data refreshes itself." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
            Now in public beta — free while we scale
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Turn any Google Sheet into a
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              live analytics dashboard.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-slate-400 mb-10"
          >
            SheetVision reads your sheet, auto-picks the right charts, and
            refreshes every 5 seconds. Ship a beautiful dashboard in minutes —
            share it with a single link.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              Get started — it's free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              I have an account
            </motion.button>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl shadow-violet-500/10">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-slate-400 font-mono">
                  sheetvision.app/d/q3-revenue
                </span>
                <span className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { l: "Revenue", v: "$128.4k", d: "+12%" },
                  { l: "Signups", v: "2,841", d: "+8%" },
                  { l: "Active", v: "647", d: "+4%" },
                  { l: "Churn", v: "1.2%", d: "-0.3%" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 text-left"
                  >
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                      {s.l}
                    </div>
                    <div className="text-xl font-bold text-white tabular-nums">
                      {s.v}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">
                      {s.d}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-5 h-40 flex items-end gap-1.5">
                {[40, 55, 48, 72, 65, 82, 71, 90, 78, 95, 88, 100].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + i * 0.04, duration: 0.6 }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500/80 to-fuchsia-400"
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-3"
        >
          From sheet to dashboard in 30 seconds.
        </motion.h2>
        <p className="text-center text-slate-400 max-w-xl mx-auto mb-14">
          No code, no setup, no imports. Just paste the link.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-slate-900/40 p-6"
            >
              <div className="text-xs font-mono text-violet-400 mb-4">
                STEP {s.n}
              </div>
              <div className="text-xl font-semibold text-white mb-2">{s.t}</div>
              <div className="text-slate-400 text-sm">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-3"
        >
          Everything you need to ship dashboards.
        </motion.h2>
        <p className="text-center text-slate-400 mb-14">
          Built for teams who want to stop screenshotting spreadsheets.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(139,92,246,0.4)" }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20 p-6 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-4">
                {f.icon}
              </div>
              <div className="text-lg font-semibold text-white mb-1.5">
                {f.title}
              </div>
              <div className="text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-3"
        >
          Simple pricing. Ship today.
        </motion.h2>
        <p className="text-center text-slate-400 mb-14">
          Start free. Upgrade when you need more power.
        </p>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 flex flex-col"
          >
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Free
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-bold text-white">$0</span>
              <span className="text-slate-500 mb-2">/ forever</span>
            </div>
            <div className="text-slate-400 text-sm mb-6">
              Perfect for personal use and small teams.
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-300">
              {[
                "Up to 3 dashboards",
                "5-second auto-refresh",
                "Public share links",
                "CSV export",
                "AI insights",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 flex-shrink-0 text-emerald-400"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12l5 5 9-11"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/signup")}
              className="mt-auto py-3 rounded-lg border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Start free
            </motion.button>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="relative rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-600/15 via-fuchsia-600/5 to-slate-900/40 p-8 flex flex-col overflow-hidden"
          >
            <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>
            <div className="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-2">
              Pro
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-bold text-white">$19</span>
              <span className="text-slate-400 mb-2">/ month</span>
            </div>
            <div className="text-slate-300 text-sm mb-6">
              Everything in Free, plus power tools for teams.
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-200">
              {[
                "Unlimited dashboards",
                "1-second refresh tier",
                "Drag & resize widgets",
                "Saved layouts per dashboard",
                "Advanced AI insights",
                "Priority support",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 flex-shrink-0 text-emerald-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12l5 5 9-11"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/signup")}
              className="mt-auto py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              Start Pro trial
            </motion.button>
          </motion.div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Need custom limits or self-hosted? <a href="#" className="underline hover:text-slate-300">Contact sales</a>.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-slate-900 p-10 md:p-14 text-center"
        >
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">
              Ready to ship your first dashboard?
            </h3>
            <p className="text-slate-300 max-w-lg mx-auto mb-8">
              Free forever for personal use. No credit card required.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="px-8 py-4 rounded-xl bg-white text-slate-950 font-bold shadow-xl hover:bg-slate-100 transition-colors"
            >
              Create your first dashboard
            </motion.button>
          </div>
        </motion.div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/5 flex items-center justify-between text-sm text-slate-500">
        <span>© {new Date().getFullYear()} SheetVision</span>
        <span className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-300">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-300">
            Terms
          </a>
          <a href="#" className="hover:text-slate-300">
            Contact
          </a>
        </span>
      </footer>
    </div>
  );
}
