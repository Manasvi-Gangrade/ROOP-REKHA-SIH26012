import type { TooltipProps } from "recharts";

export function CustomChartTooltip({
  active,
  payload,
  label,
  valueSuffix = "",
}: TooltipProps<number, string> & { valueSuffix?: string }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-border bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-md">
      {label && <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs font-medium">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.payload?.fill || "var(--primary)" }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold text-foreground">
              {typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
