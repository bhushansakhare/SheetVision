import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
      className={`relative inline-flex w-14 h-7 rounded-full border border-white/10 bg-white/5 transition-colors ${className}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
          isDark
            ? "left-0.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
            : "left-[1.75rem] bg-amber-400 text-slate-900"
        }`}
      >
        {isDark ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        )}
      </motion.span>
    </button>
  );
}
