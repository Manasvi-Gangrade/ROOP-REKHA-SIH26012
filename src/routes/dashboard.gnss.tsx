import { createFileRoute } from "@tanstack/react-router";
import {
  Navigation,
  Radio,
  Satellite,
  CheckCircle2,
  Clock,
  Compass,
  RefreshCw,
  PhoneCall,
  Activity,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomChartTooltip } from "@/components/roop/custom-chart-tooltip";
import { PageHeader, Panel, StatusBadge } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";
import { offsetData as initialOffsetData } from "@/data/mock-data";

export const Route = createFileRoute("/dashboard/gnss")({
  head: () => ({
    meta: [
      { title: "GNSS Field Verification — ROOP-REKHA" },
      { name: "description", content: "Manage field surveys and boundary verification." },
      { property: "og:title", content: "GNSS Verification — ROOP-REKHA" },
      { property: "og:description", content: "Manage field surveys and boundary verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gnss,
});

interface SurveyorQueueItem {
  id: string;
  name: string;
  parcel: string;
  ulb: string;
  distance: string;
  satellites: number;
  accuracy: string;
  status: "In field" | "Verified" | "Syncing" | "Pending";
}

const initialSurveyors: SurveyorQueueItem[] = [
  {
    id: "SV-104",
    name: "Aditi Sharma",
    parcel: "MP-54-4523",
    ulb: "Indore (Ward 54)",
    distance: "1.2 km away",
    satellites: 21,
    accuracy: "±1.6 cm",
    status: "In field",
  },
  {
    id: "SV-108",
    name: "Rahul Meena",
    parcel: "RJ-12-3315",
    ulb: "Jaipur (Ward 12)",
    distance: "3.8 km away",
    satellites: 18,
    accuracy: "±2.2 cm",
    status: "Pending",
  },
  {
    id: "SV-112",
    name: "Neha Patel",
    parcel: "GJ-03-1834",
    ulb: "Surat (Ward 03)",
    distance: "5.1 km away",
    satellites: 23,
    accuracy: "±1.4 cm",
    status: "Verified",
  },
  {
    id: "SV-119",
    name: "Sanjay Gaur",
    parcel: "MH-09-9082",
    ulb: "Pune (Kothrud)",
    distance: "2.4 km away",
    satellites: 19,
    accuracy: "±1.8 cm",
    status: "In field",
  },
];

function Gnss() {
  const [surveyors, setSurveyors] = useState<SurveyorQueueItem[]>(initialSurveyors);
  const [isSyncing, setIsSyncing] = useState(false);

  function syncAllObservations() {
    setIsSyncing(true);
    toast.info("Connecting to CORS Network", {
      description: "Fetching differential RTCM 3.2 corrections via Survey of India CORS network...",
    });

    setTimeout(() => {
      setSurveyors((prev) =>
        prev.map((s) => ({
          ...s,
          status: "Verified" as const,
        }))
      );
      setIsSyncing(false);
      toast.success("GNSS Rover Observations Synchronized", {
        description: "All centimetre field observation vectors integrated into the Web-GIS database.",
      });
    }, 1200);
  }

  function updateSurveyorStatus(id: string, newStatus: SurveyorQueueItem["status"]) {
    setSurveyors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    toast.success(`Surveyor ${id} status updated`, {
      description: `Field unit transitioned to ${newStatus}.`,
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Ground Truthing & Geodesy"
        title="GNSS Field Verification & CORS Sync"
        description="Connect drone-derived AI boundaries with physical ground observations. Continuously Operating Reference Stations (CORS) provide real-time centimetre kinematic (RTK) corrections to field surveyors."
        action={
          <Button
            size="sm"
            className="bg-brand-gradient shadow-brand font-semibold"
            disabled={isSyncing}
            onClick={syncAllObservations}
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            Sync CORS Observations
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        {/* Radar Telemetry Graphic */}
        <Panel className="border border-border/80 shadow-md flex flex-col items-center justify-center p-6 text-center">
          <div className="relative grid size-60 place-items-center my-2">
            <div className="gnss-ring absolute size-60 rounded-full border-2 border-primary/30" />
            <div
              className="gnss-ring absolute size-44 rounded-full border-2 border-primary/40"
              style={{ animationDelay: "0.4s" }}
            />
            <div
              className="gnss-ring absolute size-28 rounded-full border-2 border-primary/60"
              style={{ animationDelay: "0.8s" }}
            />
            <div className="relative z-10 grid size-20 place-items-center rounded-full bg-brand-gradient text-white shadow-brand">
              <Satellite className="size-8 animate-pulse" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-display text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              &plusmn; 1.8 cm
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              RTK FIXED · 21 Satellites (GPS + NavIC + GLONASS)
            </p>
          </div>

          {/* Telemetry specs */}
          <div className="mt-5 grid grid-cols-2 gap-2 w-full text-xs">
            <div className="rounded-xl bg-muted/60 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-medium">PDOP Indicator</span>
              <span className="font-bold text-foreground">1.1 (Excellent)</span>
            </div>
            <div className="rounded-xl bg-muted/60 p-2.5">
              <span className="text-[10px] text-muted-foreground block font-medium">CORS Base Station</span>
              <span className="font-bold text-primary truncate block">SOI-INDORE-01</span>
            </div>
          </div>
        </Panel>

        {/* Offset Comparison Bar Chart */}
        <Panel className="border border-border/80 shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-display text-lg font-bold">Boundary Offset: AI vs GNSS Field Truth</h2>
              <p className="text-xs text-muted-foreground">Discrepancy measured in centimetres (Tolerance threshold: &plusmn;5 cm)</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold">
              92% within tolerance
            </span>
          </div>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialOffsetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="parcel" tick={{ fontSize: 11, fill: "currentColor" }} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} unit="cm" />
                <Tooltip content={<CustomChartTooltip valueSuffix=" cm" />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "5cm Standard", fill: "#ef4444", fontSize: 10 }} />
                <Bar name="AI Predicted Offset" dataKey="ai" fill="#7c3aed" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000} />
                <Bar name="GNSS Verified Offset" dataKey="gnss" fill="#14b8a6" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Surveyor Queue Table */}
      <Panel className="mt-5 border border-border/80 shadow-md overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Field Surveyor Dispatch Queue</h2>
            <p className="text-xs text-muted-foreground">
              Live tracking of ground rovers equipped with dual-frequency RTK GNSS receivers.
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {surveyors.length} active surveyors
          </span>
        </div>

        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="text-[11px] font-bold uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="pb-3">Surveyor Name</th>
              <th className="pb-3">Target Parcel</th>
              <th className="pb-3">Assigned ULB</th>
              <th className="pb-3">Distance</th>
              <th className="pb-3">Satellites</th>
              <th className="pb-3">Live Accuracy</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {surveyors.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-muted/40">
                <td className="py-3.5 font-bold text-foreground flex items-center gap-2">
                  <Navigation className="size-4 text-primary shrink-0" />
                  <div>
                    <span>{s.name}</span>
                    <span className="block text-[10px] text-muted-foreground font-mono">{s.id}</span>
                  </div>
                </td>
                <td className="py-3.5 font-semibold text-primary">{s.parcel}</td>
                <td className="py-3.5 font-medium">{s.ulb}</td>
                <td className="py-3.5 text-muted-foreground">{s.distance}</td>
                <td className="py-3.5 font-mono">{s.satellites} sats</td>
                <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">{s.accuracy}</td>
                <td className="py-3.5">
                  <StatusBadge status={s.status} />
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {s.status !== "Verified" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                        onClick={() => updateSurveyorStatus(s.id, "Verified")}
                      >
                        <CheckCircle2 className="size-3 mr-1" />
                        Verify
                      </Button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" />
                        Audited
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => toast.info(`Contacting ${s.name}`, { description: `Connecting VoIP to rover handset ${s.id}...` })}
                      title="Contact Rover"
                    >
                      <PhoneCall className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}