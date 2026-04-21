import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WidgetRenderer from "./WidgetRenderer";
import { buildWidgets, defaultLayout } from "./widgetBuilders";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function GridDashboard({
  data,
  layoutConfig,
  editable = true,
  onLayoutChange,
}) {
  const { widgets } = useMemo(() => buildWidgets(data), [data]);

  const initialLayout = useMemo(() => {
    if (
      layoutConfig &&
      Array.isArray(layoutConfig.lg) &&
      layoutConfig.lg.length > 0
    ) {
      // Only keep entries for widgets that still exist; fall back to default for new ones
      const known = new Set(widgets.map((w) => w.id));
      const kept = layoutConfig.lg.filter((l) => known.has(l.i));
      const keptIds = new Set(kept.map((l) => l.i));
      const missing = widgets
        .filter((w) => !keptIds.has(w.id))
        .map((w) => ({ i: w.id, ...w.defaultLayout }));
      return [...kept, ...missing];
    }
    return defaultLayout(widgets);
  }, [layoutConfig, widgets]);

  const layouts = { lg: initialLayout };

  if (!widgets.length) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <div className="text-amber-300 font-semibold mb-1">
          No data to visualize
        </div>
        <div className="text-slate-400 text-sm">
          Your sheet appears empty or has no numeric columns.
        </div>
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1100, md: 800, sm: 480, xs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      rowHeight={42}
      margin={[16, 16]}
      isDraggable={editable}
      isResizable={editable}
      draggableHandle=".drag-handle"
      onLayoutChange={(cur, all) => {
        if (editable && onLayoutChange) onLayoutChange({ lg: cur, ...all });
      }}
      compactType="vertical"
    >
      {widgets.map((w) => (
        <div key={w.id} className="drag-handle">
          <WidgetRenderer widget={w} dragHandle={editable} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
