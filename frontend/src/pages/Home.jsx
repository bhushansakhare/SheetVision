import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: url, 2: select cols, 3: name
  const [sheetUrl, setSheetUrl] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null); // { columns, rows, totalRows }
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPreview = async (e) => {
    e?.preventDefault();
    setError("");
    if (!sheetUrl.trim()) return setError("Paste a Google Sheet URL");
    setLoading(true);
    try {
      const { data } = await api.post("/dashboard/preview", { sheetUrl });
      if (!data.columns?.length) {
        setError("No columns found. Make sure the sheet has a header row.");
        setLoading(false);
        return;
      }
      setPreview(data);
      setSelected(data.columns.slice(0, Math.min(4, data.columns.length)));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Could not read that sheet");
    } finally {
      setLoading(false);
    }
  };

  const toggleCol = (col) => {
    setSelected((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleCreate = async (e) => {
    e?.preventDefault();
    setError("");
    if (!name.trim()) return setError("Give your dashboard a name");
    if (selected.length === 0)
      return setError("Pick at least one column to visualize");

    setLoading(true);
    try {
      const { data } = await api.post("/dashboard", {
        name,
        sheetUrl,
        columns: selected,
      });
      navigate(`/dashboard/${data.dashboard._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || "Could not create dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex items-center gap-3">
              <motion.div
                animate={{
                  backgroundColor:
                    step >= n ? "rgb(139,92,246)" : "rgba(255,255,255,0.06)",
                  color: step >= n ? "#fff" : "#94a3b8",
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border border-white/10"
              >
                {n}
              </motion.div>
              {i < 2 && (
                <div
                  className={`w-12 h-px ${
                    step > n ? "bg-violet-500" : "bg-white/10"
                  } transition-colors`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.h1
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-2"
        >
          {step === 1 && "Paste your Google Sheet link"}
          {step === 2 && "Pick the columns to visualize"}
          {step === 3 && "Name your dashboard"}
        </motion.h1>
        <p className="text-center text-slate-400 mb-10">
          {step === 1 &&
            "Make sure the sheet is shared with 'Anyone with link (Viewer)'."}
          {step === 2 && `Found ${preview?.totalRows || 0} rows. Select what matters.`}
          {step === 3 && "Almost there. You can share it the moment it's ready."}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="s1"
              onSubmit={fetchPreview}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
                <label className="block text-xs text-slate-400 mb-2 font-medium">
                  Google Sheet URL
                </label>
                <input
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition font-mono text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-60"
                >
                  {loading ? "Reading sheet…" : "Continue"}
                </motion.button>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                <div className="font-medium text-slate-400 mb-2">
                  💡 Tips for sharing your sheet
                </div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Click "Share" → "Anyone with the link" → "Viewer"</li>
                  <li>Or "File → Share → Publish to web" for fully public</li>
                  <li>First row is treated as column names</li>
                </ul>
              </div>
            </motion.form>
          )}

          {step === 2 && preview && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
                <div className="grid sm:grid-cols-2 gap-2 mb-5">
                  {preview.columns.map((col) => {
                    const isOn = selected.includes(col);
                    return (
                      <motion.button
                        key={col}
                        type="button"
                        onClick={() => toggleCol(col)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                          isOn
                            ? "border-violet-500 bg-violet-500/15 text-white"
                            : "border-white/10 bg-slate-800/40 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{col}</span>
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] flex-shrink-0 ml-2 ${
                              isOn
                                ? "bg-violet-500 border-violet-500"
                                : "border-white/20"
                            }`}
                          >
                            {isOn && "✓"}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Sample rows preview */}
                <div className="rounded-lg border border-white/10 bg-slate-950/40 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider">
                        {preview.columns.map((c) => (
                          <th
                            key={c}
                            className="px-3 py-2 text-left font-medium border-b border-white/10 whitespace-nowrap"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.slice(0, 5).map((row, i) => (
                        <tr
                          key={i}
                          className="text-slate-300 border-b border-white/5 last:border-0"
                        >
                          {preview.columns.map((c) => (
                            <td
                              key={c}
                              className="px-3 py-2 whitespace-nowrap max-w-[180px] truncate"
                            >
                              {String(row[c] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 font-medium"
                  >
                    Back
                  </button>
                  <motion.button
                    onClick={() => {
                      if (selected.length === 0) {
                        setError("Pick at least one column");
                        return;
                      }
                      setError("");
                      setStep(3);
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30"
                  >
                    Continue ({selected.length} selected)
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form
              key="s3"
              onSubmit={handleCreate}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
                <label className="block text-xs text-slate-400 mb-2 font-medium">
                  Dashboard name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Revenue"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition"
                />
                <div className="mt-4 text-sm text-slate-400">
                  <div className="text-slate-500 mb-2">Visualizing:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-md bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 font-medium"
                  >
                    Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.01 } : {}}
                    whileTap={!loading ? { scale: 0.99 } : {}}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-60"
                  >
                    {loading ? "Creating…" : "Generate dashboard"}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
