const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sheetvision-secret-key";

// Read SUPER_ADMIN_EMAIL FRESH on every call so a server running when .env
// changed still sees the update after restart, and the list can hold multiple
// emails (comma-separated). Case- and whitespace-insensitive.
function superAdminEmails() {
  const raw = process.env.SUPER_ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isSuperAdminEmail(email) {
  if (!email) return false;
  const list = superAdminEmails();
  if (list.length === 0) return false;
  return list.includes(String(email).trim().toLowerCase());
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// Reconcile a freshly loaded user doc against the current env.
// Returns the (possibly-updated) user after persisting any role change.
async function reconcileRole(user) {
  if (!user) return user;
  const shouldBeSuper = isSuperAdminEmail(user.email);
  if (shouldBeSuper && user.role !== "superadmin") {
    user.role = "superadmin";
    await user.save();
  }
  // Do NOT auto-demote here — demotion must be an explicit admin action.
  return user;
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const role = isSuperAdminEmail(normalizedEmail) ? "superadmin" : "user";
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role,
    });

    console.log(
      `[auth] registered ${user.email} as ${user.role} (superadmin env: ${
        superAdminEmails().join(", ") || "<none>"
      })`
    );

    res.status(201).json({
      msg: "Signup successful",
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    console.error("[auth/register]", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Guarantee: if this email is in the SUPER_ADMIN_EMAIL list, elevate
    // BEFORE signing the JWT so the token carries role: "superadmin".
    await reconcileRole(user);

    console.log(
      `[auth] login ${user.email} → role=${user.role} (env: ${
        superAdminEmails().join(", ") || "<none>"
      })`
    );

    res.json({
      msg: "Login successful",
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ME - verify token AND reconcile role. Frontend calls this on app boot to
// refresh a stale cached role after the admin env var was updated.
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No token" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await reconcileRole(user);

    // If the role changed since this token was issued, mint a fresh one so
    // the frontend sees the update without forcing a re-login.
    const tokenRole = decoded.role || "user";
    const newToken = tokenRole !== user.role ? signToken(user) : null;

    res.json({ user: safeUser(user), token: newToken });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;
module.exports.superAdminEmails = superAdminEmails;
module.exports.isSuperAdminEmail = isSuperAdminEmail;
