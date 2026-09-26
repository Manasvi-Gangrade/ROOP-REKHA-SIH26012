import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wand2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel, StatusBadge } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/validation")({
  head: () => ({
    meta: [
      { title: "Topology & Validation — ROOP-REKHA" },
      { name: "description", content: "Validate parcel topology and geometry." },
      { property: "og:title", content: "Topology & Validation — ROOP-REKHA" },
      { property: "og:description", content: "Validate parcel topology and geometry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Validation,
});

interface GeometryIssue {
  id: string;
  parcel: string;
  issue: string;
  deviation: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
}

const initialIssues: GeometryIssue[] = [
  {
    id: "ISS-01",
    parcel: "MP-IND-54-4523",
    issue: "Right-of-Way Boundary Overlap",
    deviation: "12.4 m²",
    severity: "High",
    status: "Open",
  },
  {
    id: "ISS-02",
    parcel: "RJ-12-3315",
    issue: "Sliver Polygon (Sub-metric gap)",
    deviation: "2.1 m²",
    severity: "Medium",
    status: "Open",
  },
  {
    id: "ISS-03",
    parcel: "GJ-03-1834",
    issue: "Open Ring / Unclosed Boundary Vertex",
    deviation: "1 vertex",
    severity: "Medium",
    status: "Open",
  },
  {
    id: "ISS-04",
    parcel: "MH-09-9082",
    issue: "Self-Intersecting Corner Vertex",
    deviation: "0.8 m²",
    severity: "Low",
    status: "Open",
  },
];

function Validation() {
  const [issues, setIssues] = useState<GeometryIssue[]>(initialIssues);
  const [tolerance, setTolerance] = useState(0.15);
  const [viewMode, setViewMode] = useState<"both" | "raw" | "clean">("both");

  const openCount = issues.filter((x) => x.status === "Open").length;
  const resolvedCount = issues.filter((x) => x.status === "Resolved").length;

  function resolveIssue(id: string, actionType: string) {
    setIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Resolved" as const } : item)),
    );
    toast.success(`Issue ${id} Resolved`, {
      description: `Applied ${actionType}. Geometry topology updated to strict OGC standards.`,
    });
  }

  function resolveAll() {
    setIssues((prev) => prev.map((item) => ({ ...item, status: "Resolved" as const })));
    toast.success("Automated Topology Cleanup Completed", {
      description: "All slivers merged and unclosed rings snapped to nearest cadastral node.",
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Quality Assurance & Spatial Topology"
        title="Topology & Geometric Validation"
        description="Convert noisy segmentation masks into legally reviewable parcel geometry. Eliminate sliver polygons, resolve overlaps, enforce 90° orthogonal corners, and verify unclosed boundaries against OGC Simple Features standards."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIssues(initialIssues);
                toast.info("Reset validation queue");
              }}
            >
              <RotateCcw className="size-3.5 mr-1" />
              Reset Issues
            </Button>
            <Button
              size="sm"
              className="bg-brand-gradient shadow-brand font-semibold"
              onClick={resolveAll}
              disabled={openCount === 0}
            >
              <Wand2 className="size-3.5 mr-1" />
              Auto-Resolve All ({openCount})
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Interactive Mask Regularization Canvas */}
        <Panel className="border border-border/80 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold">Polygon Regularization Engine</h2>
              <p className="text-xs text-muted-foreground">
                Douglas-Peucker simplification with minimum boundary area constraints
              </p>
            </div>
            <div className="flex rounded-lg border border-border p-1 bg-muted/40 text-xs">
              <button
                onClick={() => setViewMode("both")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  viewMode === "both"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Comparison
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  viewMode === "raw"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Raw Mask
              </button>
              <button
                onClick={() => setViewMode("clean")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  viewMode === "clean"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Clean Cadastre
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Raw Jagged Mask */}
            {(viewMode === "both" || viewMode === "raw") && (
              <figure className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all">
                <figcaption className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <span>Raw Neural Mask (Pre-regularization)</span>
                  <span className="text-[10px] bg-rose-500/15 px-2 py-0.5 rounded-full font-mono">
                    18 vertices
                  </span>
                </figcaption>
                <div className="aspect-[4/3] rounded-xl bg-background/50 border border-border/60 p-2 flex items-center justify-center">
                  <svg viewBox="0 0 300 220" className="w-full h-full drop-shadow">
                    <path
                      d="M35 40L98 28 123 51 181 38 247 58 256 118 229 128 250 184 180 196 142 177 73 193 47 150 29 119 51 91Z"
                      fill="#f43f5e"
                      fillOpacity="0.25"
                      stroke="#f43f5e"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Contains jagged raster artifacts, curved building corners, and tree occlusions.
                </p>
              </figure>
            )}

            {/* Validated Regularized Polygon */}
            {(viewMode === "both" || viewMode === "clean") && (
              <figure className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all">
                <figcaption className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span>Validated Vector Cadastre</span>
                  <span className="text-[10px] bg-emerald-500/15 px-2 py-0.5 rounded-full font-mono">
                    4 orthogonal nodes
                  </span>
                </figcaption>
                <div className="aspect-[4/3] rounded-xl bg-background/50 border border-border/60 p-2 flex items-center justify-center">
                  <svg viewBox="0 0 300 220" className="w-full h-full drop-shadow">
                    <path
                      d="M44 42L244 52 250 186 54 192Z"
                      fill="#10b981"
                      fillOpacity="0.25"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                    <circle cx="44" cy="42" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <circle
                      cx="244"
                      cy="52"
                      r="5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx="250"
                      cy="186"
                      r="5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx="54"
                      cy="192"
                      r="5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Orthogonalized corners, closed ring geometry, zero self-intersections. Ready for
                  land registry.
                </p>
              </figure>
            )}
          </div>

          {/* Tolerance Slider */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              Simplification Epsilon Tolerance (ε = {tolerance.toFixed(2)}m):
            </span>
            <input
              type="range"
              min="5"
              max="35"
              value={Math.round(tolerance * 100)}
              onChange={(e) => setTolerance(Number(e.target.value) / 100)}
              className="w-48 accent-primary h-1.5 bg-muted rounded cursor-pointer"
            />
          </div>
        </Panel>

        {/* Validation Rules Checklist Panel */}
        <Panel className="border border-border/80 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">OGC Rule Checklist</h2>
              <p className="text-xs text-muted-foreground">
                ISO 19107 Geographic Information Rules
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Ring Closure & Vertex Density",
                rule: "First and last vertex coincident",
                passed: true,
                badge: "PASS",
              },
              {
                title: "No Self-Intersections (Kinks)",
                rule: "Zero non-simple polygon boundaries",
                passed: true,
                badge: "PASS",
              },
              {
                title: "Boundary Overlap Verification",
                rule: "Adjoining parcel right-of-way check",
                passed: openCount === 0,
                badge: openCount === 0 ? "PASS" : `${openCount} Flags`,
              },
              {
                title: "Minimum Sliver Tolerance",
                rule: "Area threshold > 5.0 m²",
                passed: true,
                badge: "PASS",
              },
            ].map((rule) => (
              <div
                key={rule.title}
                className="flex items-center justify-between rounded-xl bg-muted/40 p-3 border border-border/60"
              >
                <div className="flex items-start gap-2.5">
                  {rule.passed ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="block text-xs font-bold text-foreground">{rule.title}</span>
                    <span className="block text-[10px] text-muted-foreground">{rule.rule}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    rule.passed
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {rule.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
            <span className="block font-display text-2xl font-bold text-primary">
              {resolvedCount}/{issues.length}
            </span>
            <span className="text-[11px] text-muted-foreground">Geometry Exceptions Cleared</span>
          </div>
        </Panel>
      </div>

      {/* Open Geometry Issues Table */}
      <Panel className="mt-5 border border-border/80 shadow-md overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Open Geometry Exceptions Queue</h2>
            <p className="text-xs text-muted-foreground">
              Review sub-metric deviations and click action buttons to auto-regularize or merge
              slivers.
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {openCount} Open · {resolvedCount} Resolved
          </span>
        </div>

        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="text-[11px] font-bold uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="pb-3">Parcel ID</th>
              <th className="pb-3">Geometry Anomaly</th>
              <th className="pb-3">Deviation Extent</th>
              <th className="pb-3">Severity</th>
              <th className="pb-3">Current Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {issues.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/40">
                <td className="py-3.5 font-bold text-foreground">{item.parcel}</td>
                <td className="py-3.5 font-medium">{item.issue}</td>
                <td className="py-3.5 font-mono text-[11px]">{item.deviation}</td>
                <td className="py-3.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.severity === "High"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : item.severity === "Medium"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {item.severity}
                  </span>
                </td>
                <td className="py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "Resolved"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  {item.status === "Open" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
                      onClick={() => resolveIssue(item.id, "Auto-Snap Regularization")}
                    >
                      <Wand2 className="size-3 mr-1" />
                      Auto-Snap & Fix
                    </Button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Cleaned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
