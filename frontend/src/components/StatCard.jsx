import { motion } from "framer-motion";

export default function StatCard({ label, value, delta, icon, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 p-5 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/5 transition-all duration-500" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            {label}
          </span>
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-violet-300">
              {icon}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-white tabular-nums">
          {value}
        </div>
        {delta !== undefined && delta !== null && (
          <div
            className={`text-xs mt-1 font-medium ${
              delta >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </div>
        )}
      </div>
    </motion.div>
  );
}
