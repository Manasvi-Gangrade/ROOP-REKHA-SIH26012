import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Factory,
  Home,
  Sprout,
  Warehouse,
  PieChart as PieIcon,
  CheckCircle2,
  Filter,
  Layers,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CustomChartTooltip } from "@/components/roop/custom-chart-tooltip";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";
import { landUse as initialLandUse } from "@/data/mock-data";

export const Route = createFileRoute("/dashboard/land-use")({
  head: () => ({
    meta: [
      { title: "Land-Use Classification — ROOP-REKHA" },
      { name: "description", content: "Review AI-classified urban land use." },
      { property: "og:title", content: "Land-Use Classification — ROOP-REKHA" },
      { property: "og:description", content: "Review AI-classified urban land use." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandUse,
});

const icons = [Home, Building2, Warehouse, Sprout, Factory];
const zoneCodes = ["Zone R-1 (High Density)", "Zone C-2 (Commercial Hub)", "Zone M-1 (Mixed Transit)", "Zone AG-3 (Peri-urban)", "Zone PUB-1 (Govt / Open)"];

function LandUse() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? initialLandUse.filter((item) => item.name === selectedCategory)
    : initialLandUse;

  return (
    <>
      <PageHeader
        eyebrow="Multispectral AI & Urban Planning"
        title="Land-Use & Zoning Classification"
        description="Multispectral vision models classify every segmented parcel into statutory urban master plan categories, enabling municipal tax assessments, zone compliance tracking, and automated property register updates."
        action={
          selectedCategory ? (
            <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
              Clear Filter (Show All Zones)
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Pie Chart Card */}
        <Panel className="border border-border/80 shadow-md p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Urban Land-Use Composition</h2>
              <p className="text-xs text-muted-foreground">Functional mix of 9,402 mapped parcels</p>
            </div>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
              Indore Master Plan
            </span>
          </div>

          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={initialLandUse}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {initialLandUse.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      stroke={selectedCategory === entry.name ? "#ffffff" : "transparent"}
                      strokeWidth={selectedCategory === entry.name ? 3 : 1}
                      className="cursor-pointer transition-all"
                      onClick={() =>
                        setSelectedCategory((prev) => (prev === entry.name ? null : entry.name))
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
            {initialLandUse.map((x) => (
              <button
                key={x.name}
                onClick={() =>
                  setSelectedCategory((prev) => (prev === x.name ? null : x.name))
                }
                className={`flex items-center justify-between rounded-lg p-2 text-left text-xs transition-colors ${
                  selectedCategory === x.name
                    ? "bg-primary text-primary-foreground font-bold"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: x.color }} />
                  <span className="truncate max-w-[100px]">{x.name}</span>
                </span>
                <span className="font-mono text-[11px]">{x.value}%</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Detailed Land-Use Category Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {initialLandUse.map((item, i) => {
            const Icon = icons[i] ?? Home;
            const isSelected = selectedCategory === item.name;

            return (
              <Panel
                key={item.name}
                onClick={() =>
                  setSelectedCategory((prev) => (prev === item.name ? null : item.name))
                }
                className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md p-4 flex flex-col justify-between ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                    : "border border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className="grid size-11 place-items-center rounded-xl"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: `${item.color}25`, color: item.color }}
                    >
                      {item.value}% Mix
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-base font-bold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">{zoneCodes[i]}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Mapped Area:</span>
                    <span className="font-semibold text-foreground font-mono">{item.areaHectares} ha</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Parcels:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {item.parcels.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.value * 2}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </>
  );
}