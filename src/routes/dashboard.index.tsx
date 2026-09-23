import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Compass,
  FileUp,
  LandPlot,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatedCounter } from "@/components/roop/animated-counter";
import { CustomChartTooltip } from "@/components/roop/custom-chart-tooltip";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";
import { activity, parcelStatus, ulbProgress } from "@/data/mock-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Overview — ROOP-REKHA" },
      { name: "description", content: "National parcel mapping programme overview." },
      { property: "og:title", content: "ROOP-REKHA Overview" },
      { property: "og:description", content: "National parcel mapping programme overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const kpis = [
    {
      icon: LandPlot,
      value: 9402,
      display: "9,402",
      label: "Parcels Processed",
      delta: "+12.8% this month",
      isPositive: true,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      icon: CheckCircle2,
      value: 6842,
      display: "6,842",
      label: "Approved Cadastral Deeds",
      delta: "72.8% of total",
      isPositive: true,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Clock3,
      value: 1948,
      display: "1,948",
      label: "Pending ULB Review",
      delta: "-8.4% queue time",
      isPositive: true,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: TrendingUp,
      value: 87.6,
      display: "87.6%",
      suffix: "%",
      label: "Model mAP Accuracy",
      delta: "+2.1 pts vs baseline",
      isPositive: true,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Programme Operations & Intelligence"
        title="Good afternoon, Programme Team"
        description="A live operational picture of drone-based cadastral parcel extraction, automated topology validation, and ground-truth verification across participating Urban Local Bodies."
        action={
          <div className="flex gap-2">
            <Button asChild className="bg-brand-gradient shadow-brand">
              <Link to="/dashboard/map">
                <Compass className="size-4 mr-1.5" />
                Launch Web-GIS Viewer
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Panel
            key={kpi.label}
            className="animate-rise transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-border/80"
          >
            <div className="flex items-start justify-between">
              <span className={`grid size-12 place-items-center rounded-2xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="size-6" />
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  kpi.isPositive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                {kpi.delta}
              </span>
            </div>
            <p className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground">
              <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{kpi.label}</p>
          </Panel>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.4fr]">
        {/* Donut Chart: Review Status */}
        <Panel className="border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Cadastral Review Status</h2>
              <p className="text-xs text-muted-foreground">Distribution of 9,402 processed parcels</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              Live National Feed
            </span>
          </div>

          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={parcelStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={98}
                  paddingAngle={5}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {parcelStatus.map((x) => (
                    <Cell key={x.name} fill={x.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip valueSuffix=" parcels" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
            {parcelStatus.map((x) => (
              <div key={x.name} className="rounded-xl bg-muted/40 p-2">
                <span className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <i className="size-2 rounded-full" style={{ background: x.color }} />
                  {x.name}
                </span>
                <span className="block font-display text-sm font-bold text-foreground mt-0.5">
                  <AnimatedCounter value={x.value} />
                </span>
                <span className="text-[10px] text-muted-foreground">{x.percentage}%</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Bar Chart: ULB Completion */}
        <Panel className="border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">ULB Digitisation Progress</h2>
              <p className="text-xs text-muted-foreground">Completion percentage across pilot municipal bodies</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary">
              <Link to="/dashboard/analytics">
                Detailed Analytics <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ulbProgress} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.6} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={75}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                />
                <Tooltip content={<CustomChartTooltip valueSuffix="%" />} />
                <Bar
                  dataKey="progress"
                  name="Completion %"
                  fill="#7c3aed"
                  radius={[0, 8, 8, 0]}
                  barSize={18}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Core Workflow Shortcuts Banner */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Link
          to="/dashboard/extraction"
          className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-500 group-hover:scale-105 transition-transform">
              <Bot className="size-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-foreground">AI Parcel Extraction</p>
              <p className="text-[11px] text-muted-foreground">Compare orthomosaics with SAM</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>

        <Link
          to="/dashboard/map"
          className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition-transform">
              <Compass className="size-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-foreground">Web-GIS Map Viewer</p>
              <p className="text-[11px] text-muted-foreground">Inspect parcels on satellite layer</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>

        <Link
          to="/dashboard/validation"
          className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-foreground">Topology & Validation</p>
              <p className="text-[11px] text-muted-foreground">Clean slivers and overlaps</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      </div>

      {/* Recent Operational Activity */}
      <Panel className="mt-5 border border-border/80 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Recent System Activity</h2>
          </div>
          <span className="text-xs text-muted-foreground">Audited event ledger</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activity.map((item) => (
            <div
              key={item.id || item.title}
              className="rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    item.tone === "approved"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : item.tone === "disputed"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {item.tone.toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-xs font-bold text-foreground line-clamp-1">{item.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{item.place}</p>
              <p className="mt-2 text-[10px] font-medium text-primary">By {item.user || "Autonomous Agent"}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}