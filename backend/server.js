require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));


mongoose
  .connect(MONGO_URI)
  .then(() => console.log("[db] MongoDB Connected"))
  .catch((err) => console.log("[db] MongoDB Error", err));

app.get("/api/health", (req, res) => res.json({ ok: true }));

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  const admins = authRouter.superAdminEmails?.() || [];
  if (admins.length) {
    console.log(
      `[auth] SUPER_ADMIN_EMAIL → ${admins.join(", ")} (auto-elevates on login/register)`
    );
  } else {
    console.log(
      "[auth] SUPER_ADMIN_EMAIL is NOT set. Auto-elevation disabled. " +
        "Set it in backend/.env and restart, or run `node scripts/promote-admin.js <email>`."
    );
  }
  if (!process.env.JWT_SECRET) {
    console.log("[auth] WARNING: JWT_SECRET not set — using insecure fallback.");
  }
});
