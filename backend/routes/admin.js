const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Dashboard = require("../models/Dashboard");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.use(auth, admin);

// System stats
router.get("/stats", async (req, res) => {
  try {
    const [users, superadmins, dashboards, newUsers7d, newDash7d] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "superadmin" }),
        Dashboard.countDocuments(),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        Dashboard.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ]);
    res.json({
      users,
      superadmins,
      dashboards,
      newUsers7d,
      newDashboards7d: newDash7d,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// All users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    const counts = await Dashboard.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    res.json({
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        dashboardCount: map[String(u._id)] || 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// All dashboards
router.get("/dashboards", async (req, res) => {
  try {
    const dashboards = await Dashboard.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json({ dashboards });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete user (and cascade their dashboards)
router.delete("/users/:id", async (req, res) => {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ msg: "Cannot delete yourself" });
    }
    await Dashboard.deleteMany({ user: req.params.id });
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "User and their dashboards deleted" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

// Delete any dashboard
router.delete("/dashboards/:id", async (req, res) => {
  try {
    const result = await Dashboard.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Dashboard deleted" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

// Toggle role (promote/demote). Cannot demote self.
router.patch("/users/:id/role", async (req, res) => {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ msg: "Cannot modify your own role" });
    }
    const { role } = req.body;
    if (!["user", "superadmin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "Not found" });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

module.exports = router;
