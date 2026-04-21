// Deterministic analytics — produces human-readable insights from the data.

function isNumeric(v) {
  return typeof v === "number" && !Number.isNaN(v);
}

function formatNumber(n) {
  if (!isNumeric(n)) return String(n);
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function numericColumns(rows, columns) {
  return columns.filter((c) => {
    let num = 0,
      total = 0;
    for (const r of rows.slice(0, 40)) {
      const v = r[c];
      if (v === null || v === undefined || v === "") continue;
      total++;
      if (isNumeric(v)) num++;
    }
    return total > 0 && num / total >= 0.7;
  });
}

function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function stddev(arr) {
  const m = mean(arr);
  const v = mean(arr.map((x) => (x - m) * (x - m)));
  return Math.sqrt(v);
}

function linearTrend(values) {
  // Slope of least-squares line over index 0..n-1
  const n = values.length;
  if (n < 2) return 0;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }
  const denom = n * sumXX - sumX * sumX;
  return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
}

function pearson(a, b) {
  const n = Math.min(a.length, b.length);
  if (n < 3) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0,
    da = 0,
    db = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i] - ma;
    const y = b[i] - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  const denom = Math.sqrt(da * db);
  return denom === 0 ? 0 : num / denom;
}

function generateInsights({ columns, rows }) {
  const insights = [];
  if (!rows.length) {
    return [{ kind: "info", text: "No rows yet — add some data to your sheet." }];
  }

  const numCols = numericColumns(rows, columns);

  if (numCols.length === 0) {
    insights.push({
      kind: "info",
      text: "No numeric columns detected — add numbers for richer insights.",
    });
  }

  // Totals + trend per numeric column
  for (const c of numCols.slice(0, 4)) {
    const values = rows.map((r) => r[c]).filter(isNumeric);
    if (!values.length) continue;
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const slope = linearTrend(values);
    const direction = slope > 0 ? "upward" : slope < 0 ? "downward" : "flat";
    const pctRate =
      avg !== 0 ? ((slope / Math.abs(avg)) * 100).toFixed(1) : "0.0";

    insights.push({
      kind: "stat",
      text: `${c} totals ${formatNumber(total)} with average ${formatNumber(
        avg
      )} per row.`,
    });

    if (values.length >= 4) {
      insights.push({
        kind: "trend",
        text: `${c} is trending ${direction} (${slope >= 0 ? "+" : ""}${pctRate}% relative to mean).`,
      });
    }

    // Anomalies (values > 2σ from mean)
    const sd = stddev(values);
    if (sd > 0) {
      const m = mean(values);
      const outliers = values.filter((v) => Math.abs(v - m) > 2 * sd);
      if (outliers.length > 0) {
        insights.push({
          kind: "anomaly",
          text: `${outliers.length} outlier${
            outliers.length === 1 ? "" : "s"
          } detected in ${c} (>2σ from mean).`,
        });
      }
    }

    // Peak + trough
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (max !== min) {
      insights.push({
        kind: "extreme",
        text: `${c} peaked at ${formatNumber(max)} and dipped to ${formatNumber(
          min
        )} — a ${((max - min) / Math.max(Math.abs(min), 1)).toFixed(1)}x range.`,
      });
    }
  }

  // Correlations between first few numeric pairs
  if (numCols.length >= 2) {
    const pairs = [];
    for (let i = 0; i < numCols.length; i++) {
      for (let j = i + 1; j < numCols.length; j++) {
        const a = rows.map((r) => r[numCols[i]]).filter(isNumeric);
        const b = rows.map((r) => r[numCols[j]]).filter(isNumeric);
        const r = pearson(a, b);
        pairs.push({ a: numCols[i], b: numCols[j], r });
      }
    }
    const strong = pairs
      .filter((p) => Math.abs(p.r) >= 0.6)
      .sort((x, y) => Math.abs(y.r) - Math.abs(x.r))
      .slice(0, 2);
    for (const p of strong) {
      insights.push({
        kind: "correlation",
        text: `${p.a} and ${p.b} are ${
          p.r > 0 ? "positively" : "negatively"
        } correlated (r=${p.r.toFixed(2)}).`,
      });
    }
  }

  // Recent-change callout (last vs average of prior)
  for (const c of numCols.slice(0, 2)) {
    const values = rows.map((r) => r[c]).filter(isNumeric);
    if (values.length < 4) continue;
    const last = values[values.length - 1];
    const prior = values.slice(0, -1);
    const priorMean = mean(prior);
    if (priorMean === 0) continue;
    const pct = ((last - priorMean) / Math.abs(priorMean)) * 100;
    if (Math.abs(pct) >= 10) {
      insights.push({
        kind: "change",
        text: `Most recent ${c} (${formatNumber(last)}) is ${pct > 0 ? "up" : "down"} ${Math.abs(
          pct
        ).toFixed(0)}% vs historical average.`,
      });
    }
  }

  insights.push({
    kind: "summary",
    text: `Analyzed ${rows.length} rows across ${columns.length} columns (${numCols.length} numeric).`,
  });

  return insights.slice(0, 10);
}

module.exports = { generateInsights };
