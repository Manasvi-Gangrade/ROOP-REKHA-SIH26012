import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileBarChart,
  TrendingUp,
  Calendar,
  Layers,
  Award,
  FileSpreadsheet,
  FileJson,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomChartTooltip } from "@/components/roop/custom-chart-tooltip";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { monthlyData, ulbProgress } from "@/data/mock-data";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Reports — ROOP-REKHA" },
      { name: "description", content: "Parcel processing performance and reporting." },
      { property: "og:title", content: "Analytics & Reports — ROOP-REKHA" },
      { property: "og:description", content: "Parcel processing performance and reporting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const displayData = timeRange === "7d" ? monthlyData.slice(-7) : monthlyData;

  function exportData(format: "csv" | "json" | "txt") {
    let content = "";
    let mimeType = "text/plain";
    let fileName = `roop-rekha-cadastre-report.${format}`;

    if (format === "csv") {
      mimeType = "text/csv";
      content = "City,Approved,Pending,Disputed,Progress_Pct\n" +
        ulbProgress.map((u) => `${u.name},${u.approved},${u.pending},${u.disputed},${u.progress}`).join("\n");
    } else if (format === "json") {
      mimeType = "application/json";
      content = JSON.stringify({ programme: "ROOP-REKHA", totalParcels: 9402, cities: ulbProgress }, null, 2);
    } else {
      content = "ROOP-REKHA Programme Executive Snapshot\n" +
        "Parcels Processed: 9,402\n" +
        "Mean Average Precision: 87.6%\n" +
        "Participating ULBs: 157\n" +
        "Approved Cadastral Deeds: 6,842 (72.8%)\n";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Export Generated (${format.toUpperCase()})`, {
      description: `Downloaded ${fileName} for official municipal documentation.`,
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Decision Support & Performance Metrics"
        title="Analytics & Executive Reports"
        description="Monitor national throughput velocity, municipal review backlog triage, and model precision benchmarks across participating state departments."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("csv")}
              className="font-semibold text-xs"
            >
              <FileSpreadsheet className="size-3.5 mr-1 text-emerald-500" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("json")}
              className="font-semibold text-xs"
            >
              <FileJson className="size-3.5 mr-1 text-sky-500" />
              GeoJSON Feed
            </Button>
            <Button
              size="sm"
              onClick={() => exportData("txt")}
              className="bg-brand-gradient shadow-brand font-semibold text-xs"
            >
              <Download className="size-3.5 mr-1" />
              Executive PDF Snapshot
            </Button>
          </div>
        }
      />

      {/* Main Charts Row */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Processing Velocity Line Chart */}
        <Panel className="border border-border/80 shadow-md p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-lg font-bold">Daily Digitisation Velocity</h2>
              <p className="text-xs text-muted-foreground">Parcels processed per day vs approved deeds</p>
            </div>
            <div className="flex rounded-lg border border-border p-1 bg-muted/40 text-xs">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  timeRange === "7d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  timeRange === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="day" interval={timeRange === "7d" ? 0 : 4} tick={{ fontSize: 11, fill: "currentColor" }} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
                <Tooltip content={<CustomChartTooltip valueSuffix=" parcels" />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line
                  type="monotone"
                  dataKey="parcels"
                  name="Processed by AI"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  name="ULB Approved Deeds"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Model Accuracy Gauge Panel */}
        <Panel className="border border-border/80 shadow-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-bold">mAP Accuracy Gauge</h2>
              <Award className="size-5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground">Mean Average Precision against physical ground truth</p>

            <div className="relative h-60 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={[{ value: 87.6, fill: "#14b8a6" }]}
                  startAngle={210}
                  endAngle={-30}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "var(--muted)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pt-6 text-center pointer-events-none">
                <div>
                  <p className="font-display text-4xl font-bold text-foreground">87.6%</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +7.6 pts above benchmark
                  </p>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    Target: 0.80 AP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-3 text-center text-xs space-y-1">
            <span className="font-bold text-foreground block">Autonomous Ingestion Quality</span>
            <span className="text-muted-foreground text-[11px] block">
              98.4% of polygons pass geometric topology without manual editing
            </span>
          </div>
        </Panel>
      </div>

      {/* Stacked Breakdown by ULB */}
      <Panel className="mt-5 border border-border/80 shadow-md p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-display text-lg font-bold">Municipal Breakdown: Approved vs Pending vs Disputed</h2>
            <p className="text-xs text-muted-foreground">Detailed status distribution across participating Smart Cities</p>
          </div>
          <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
            8 Pilot ULBs
          </span>
        </div>

        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ulbProgress} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} unit=" parcels" />
              <Tooltip content={<CustomChartTooltip valueSuffix=" parcels" />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="approved" name="Approved Deeds" stackId="a" fill="#14b8a6" isAnimationActive={true} />
              <Bar dataKey="pending" name="Pending Review" stackId="a" fill="#f59e0b" isAnimationActive={true} />
              <Bar
                dataKey="disputed"
                name="Disputed / Encroached"
                stackId="a"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}
