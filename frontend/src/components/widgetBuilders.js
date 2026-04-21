// Turns { columns, rows, selected } into widget specs that the grid renders.

function isNumeric(v) {
  return typeof v === "number" && !Number.isNaN(v);
}

function isNumericColumn(rows, col) {
  if (!rows.length) return false;
  let numeric = 0;
  let total = 0;
  for (const r of rows.slice(0, 30)) {
    const v = r[col];
    if (v === null || v === undefined || v === "") continue;
    total++;
    if (isNumeric(v)) numeric++;
  }
  return total > 0 && numeric / total >= 0.7;
}

export function formatNumber(n) {
  if (!isNumeric(n)) return n;
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

export function buildWidgets(data) {
  if (!data) return { widgets: [], numericCols: [], categoryCol: null };
  const { columns = [], rows = [], selected = [] } = data;

  const active = (selected && selected.length
    ? selected.filter((c) => columns.includes(c))
    : columns
  ).slice(0, 8);

  const numericCols = active.filter((c) => isNumericColumn(rows, c));
  const categoryCol = active.find((c) => !numericCols.includes(c)) || active[0];

  const widgets = [];

  // Stat cards — one per numeric col (up to 4)
  numericCols.slice(0, 4).forEach((c, i) => {
    const values = rows.map((r) => r[c]).filter(isNumeric);
    const sum = values.reduce((a, b) => a + b, 0);
    const last = values[values.length - 1];
    const prev = values[values.length - 2];
    let delta = null;
    if (typeof prev === "number" && prev !== 0) {
      delta = Math.round(((last - prev) / prev) * 100);
    }
    widgets.push({
      id: `stat-${i}`,
      kind: "stat",
      title: c,
      props: { label: c, value: formatNumber(sum), delta },
      defaultLayout: { x: i * 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
    });
  });

  // Chart rows shape: x=categoryCol, y=numericCols
  const chartRows = rows.slice(-60).map((r, i) => {
    const out = {
      __key: categoryCol
        ? String(r[categoryCol] ?? `Row ${i + 1}`)
        : `#${i + 1}`,
    };
    numericCols.forEach((c) => {
      const v = r[c];
      out[c] = typeof v === "number" ? v : Number(v) || 0;
    });
    return out;
  });

  // Pie data: sum first numeric grouped by category
  let pieData = [];
  if (categoryCol && numericCols.length > 0) {
    const metric = numericCols[0];
    const map = new Map();
    for (const r of rows) {
      const key = String(r[categoryCol] ?? "Unknown");
      const v = isNumeric(r[metric]) ? r[metric] : Number(r[metric]) || 0;
      map.set(key, (map.get(key) || 0) + v);
    }
    pieData = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }

  if (numericCols.length > 0) {
    widgets.push({
      id: "chart-area",
      kind: "area",
      title: `Trend by ${categoryCol || "row"}`,
      props: { chartRows, numericCols: numericCols.slice(0, 4) },
      defaultLayout: { x: 0, y: 3, w: 6, h: 7, minW: 4, minH: 5 },
    });
    widgets.push({
      id: "chart-bar",
      kind: "bar",
      title: `Compare ${numericCols[0]}`,
      props: {
        chartRows: chartRows.slice(-12),
        metric: numericCols[0],
      },
      defaultLayout: { x: 6, y: 3, w: 6, h: 7, minW: 4, minH: 5 },
    });
  }

  if (numericCols.length > 1) {
    widgets.push({
      id: "chart-line",
      kind: "line",
      title: `${numericCols.slice(0, 3).join(" / ")} over time`,
      props: { chartRows, numericCols: numericCols.slice(0, 3) },
      defaultLayout: { x: 0, y: 10, w: 6, h: 7, minW: 4, minH: 5 },
    });
  }

  if (pieData.length > 0) {
    widgets.push({
      id: "chart-pie",
      kind: "pie",
      title: `${numericCols[0]} by ${categoryCol}`,
      props: { pieData },
      defaultLayout: { x: 6, y: 10, w: 6, h: 7, minW: 3, minH: 5 },
    });
  }

  widgets.push({
    id: "table",
    kind: "table",
    title: "Raw data",
    props: { rows, columns: active },
    defaultLayout: { x: 0, y: 17, w: 12, h: 7, minW: 6, minH: 4 },
  });

  return { widgets, numericCols, categoryCol };
}

export function defaultLayout(widgets) {
  return widgets.map((w) => ({ i: w.id, ...w.defaultLayout }));
}
