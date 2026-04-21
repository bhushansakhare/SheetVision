const express = require("express");
const router = express.Router();

const Dashboard = require("../models/Dashboard");
const auth = require("../middleware/authMiddleware");
const { fetchSheet } = require("../utils/sheetFetcher");
const { generateInsights } = require("../utils/insights");

function toCsv(columns, rows) {
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = columns.map(escape).join(",");
  const body = rows
    .map((r) => columns.map((c) => escape(r[c])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

// Preview
router.post("/preview", auth, async (req, res) => {
  try {
    const { sheetUrl } = req.body;
    if (!sheetUrl) return res.status(400).json({ msg: "sheetUrl required" });

    const { columns, rows } = await fetchSheet(sheetUrl);
    res.json({ columns, rows: rows.slice(0, 50), totalRows: rows.length });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { name, sheetUrl, columns } = req.body;
    if (!name || !sheetUrl) {
      return res.status(400).json({ msg: "name and sheetUrl required" });
    }

    const dashboard = await Dashboard.create({
      user: req.user.id,
      name,
      sheetUrl,
      columns: Array.isArray(columns) ? columns : [],
    });

    res.status(201).json({ dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// List for current user
router.get("/", auth, async (req, res) => {
  try {
    const dashboards = await Dashboard.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ dashboards });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Public share - must be declared before /:id
router.get("/share/:shareId", async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ shareId: req.params.shareId });
    if (!dashboard) return res.status(404).json({ msg: "Not found" });

    const { columns, rows } = await fetchSheet(dashboard.sheetUrl);
    res.json({
      name: dashboard.name,
      columns,
      rows,
      selected: dashboard.columns,
      layoutConfig: dashboard.layoutConfig || null,
      fetchedAt: Date.now(),
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Get one (owner only)
router.get("/:id", auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dashboard) return res.status(404).json({ msg: "Not found" });
    res.json({ dashboard });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

// Live data (owner polling)
router.get("/:id/data", auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dashboard) return res.status(404).json({ msg: "Not found" });

    const { columns, rows } = await fetchSheet(dashboard.sheetUrl);
    res.json({
      columns,
      rows,
      selected: dashboard.columns,
      layoutConfig: dashboard.layoutConfig || null,
      fetchedAt: Date.now(),
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// AI insights
router.get("/:id/insights", auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dashboard) return res.status(404).json({ msg: "Not found" });

    const { columns, rows } = await fetchSheet(dashboard.sheetUrl);
    const active =
      dashboard.columns && dashboard.columns.length
        ? dashboard.columns.filter((c) => columns.includes(c))
        : columns;
    const insights = generateInsights({ columns: active, rows });
    res.json({ insights, generatedAt: Date.now() });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// CSV export
router.get("/:id/export", auth, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dashboard) return res.status(404).json({ msg: "Not found" });

    const { columns, rows } = await fetchSheet(dashboard.sheetUrl);
    const active =
      dashboard.columns && dashboard.columns.length
        ? dashboard.columns.filter((c) => columns.includes(c))
        : columns;
    const csv = toCsv(active, rows);

    const safeName = (dashboard.name || "dashboard")
      .replace(/[^\w\-]+/g, "-")
      .slice(0, 60);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.csv"`
    );
    res.send(csv);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Save layout
router.patch("/:id/layout", auth, async (req, res) => {
  try {
    const { layoutConfig } = req.body;
    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { layoutConfig: layoutConfig ?? null },
      { new: true }
    );
    if (!dashboard) return res.status(404).json({ msg: "Not found" });
    res.json({ dashboard });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Dashboard.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Not found" });
    }
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid id" });
  }
});

module.exports = router;
