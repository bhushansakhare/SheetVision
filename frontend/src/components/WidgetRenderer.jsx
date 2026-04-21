import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatNumber } from "./widgetBuilders";

const PALETTE = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e"];

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "12px",
};

function Shell({ title, dragHandle, children, bodyClass = "" }) {
  return (
    <div className="h-full flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-4">
      <div className={`flex items-center justify-between mb-3 ${dragHandle ? "cursor-grab active:cursor-grabbing" : ""}`}>
        <div className="text-sm font-semibold text-white truncate">
          {title}
        </div>
        {dragHandle && (
          <div className="text-slate-600 text-xs" title="Drag to move">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
            </svg>
          </div>
        )}
      </div>
      <div className={`flex-1 min-h-0 ${bodyClass}`}>{children}</div>
    </div>
  );
}

function StatWidget({ label, value, delta }) {
  return (
    <div className="h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 overflow-hidden">
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium truncate">
        {label}
      </span>
      <div className="mt-2">
        <div className="text-3xl font-bold text-white tabular-nums truncate">
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
    </div>
  );
}

function AreaWidget({ chartRows, numericCols }) {
  return (
    <ResponsiveContainer>
      <AreaChart data={chartRows}>
        <defs>
          {numericCols.map((c, i) => (
            <linearGradient key={c} id={`gradArea-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.5} />
              <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="__key"
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={formatNumber}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        {numericCols.map((c, i) => (
          <Area
            key={c}
            type="monotone"
            dataKey={c}
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            fill={`url(#gradArea-${i})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BarWidget({ chartRows, metric }) {
  return (
    <ResponsiveContainer>
      <BarChart data={chartRows}>
        <defs>
          <linearGradient id="barGradW" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="__key"
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={formatNumber}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(139,92,246,0.08)" }}
        />
        <Bar dataKey={metric} fill="url(#barGradW)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineWidget({ chartRows, numericCols }) {
  return (
    <ResponsiveContainer>
      <LineChart data={chartRows}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="__key"
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={formatNumber}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        {numericCols.map((c, i) => (
          <Line
            key={c}
            type="monotone"
            dataKey={c}
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieWidget({ pieData }) {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={2}
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          wrapperStyle={{ fontSize: "11px" }}
          formatter={(v) => <span style={{ color: "#cbd5e1" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TableWidget({ rows, columns }) {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur">
          <tr className="text-slate-400 text-xs uppercase tracking-wider">
            {columns.map((c) => (
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
          {rows
            .slice(-30)
            .reverse()
            .map((row, i) => (
              <tr
                key={i}
                className="text-slate-300 border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                {columns.map((c) => (
                  <td
                    key={c}
                    className="px-3 py-2 whitespace-nowrap max-w-[220px] truncate tabular-nums"
                  >
                    {typeof row[c] === "number"
                      ? formatNumber(row[c])
                      : String(row[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WidgetRenderer({ widget, dragHandle = false }) {
  if (widget.kind === "stat") {
    return <StatWidget {...widget.props} />;
  }

  const body =
    widget.kind === "area" ? (
      <AreaWidget {...widget.props} />
    ) : widget.kind === "bar" ? (
      <BarWidget {...widget.props} />
    ) : widget.kind === "line" ? (
      <LineWidget {...widget.props} />
    ) : widget.kind === "pie" ? (
      <PieWidget {...widget.props} />
    ) : widget.kind === "table" ? (
      <TableWidget {...widget.props} />
    ) : null;

  return (
    <Shell
      title={widget.title}
      dragHandle={dragHandle}
      bodyClass={widget.kind === "table" ? "" : ""}
    >
      {body}
    </Shell>
  );
}
