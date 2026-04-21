import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const isAdmin = user?.role === "superadmin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkCls = (path) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-white"
        : "text-slate-400 hover:text-white"
    }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
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

        {token ? (
          <div className="flex items-center gap-1">
            <Link to="/dashboards" className={linkCls("/dashboards")}>
              My Dashboards
            </Link>
            <Link to="/create" className={linkCls("/create")}>
              Create
            </Link>
            {isAdmin && (
              <Link to="/admin" className={linkCls("/admin")}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    ADMIN
                  </span>
                  Control
                </span>
              </Link>
            )}
            <div className="w-px h-5 bg-white/10 mx-2" />
            <ThemeToggle className="mx-1" />
            <div className="w-px h-5 bg-white/10 mx-2" />
            <div className="hidden sm:flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-slate-300 text-sm">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="ml-1 px-3 py-1.5 text-sm rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle className="mr-1" />
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="px-4 py-2 text-sm rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-100 transition-colors"
            >
              Sign up free
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
