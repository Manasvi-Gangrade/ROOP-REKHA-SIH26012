import { createFileRoute } from "@tanstack/react-router";
import {
  ScanLine,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Sliders,
  ChevronRight,
  Maximize2,
  Minimize2,
  Split,
  Columns,
  ZoomIn,
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import aerial from "@/assets/indore-aerial.jpg";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/extraction")({
  head: () => ({
    meta: [
      { title: "AI Parcel Extraction — ROOP-REKHA" },
      { name: "description", content: "Compare aerial imagery with AI-extracted parcels." },
      { property: "og:title", content: "AI Parcel Extraction — ROOP-REKHA" },
      { property: "og:description", content: "Compare aerial imagery with AI-extracted parcels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Extraction,
});

interface ExtractedParcel {
  id: string;
  name: string;
  confidence: number;
  area: number;
  vertices: number;
  iou: number;
  landUse: string;
  points: string;
  labelCoord: { x: number; y: number };
  status: "High Confidence" | "Review Advised" | "Flagged";
}

const extractedParcels: ExtractedParcel[] = [
  {
    id: "MP-54-4521",
    name: "Jawahar Marg Plot 12",
    confidence: 96,
    area: 286,
    vertices: 5,
    iou: 0.94,
    landUse: "Commercial",
    points: "24,28 210,22 222,175 118,178 30,174",
    labelCoord: { x: 120, y: 100 },
    status: "High Confidence",
  },
  {
    id: "MP-54-4522",
    name: "Sarafa Bazar Lane 3",
    confidence: 84,
    area: 344,
    vertices: 6,
    iou: 0.83,
    landUse: "Mixed-Use",
    points: "230,24 398,28 412,110 392,185 240,182 225,105",
    labelCoord: { x: 315, y: 105 },
    status: "Review Advised",
  },
  {
    id: "MP-54-4523",
    name: "Khajuri Bazar Main",
    confidence: 71,
    area: 198,
    vertices: 7,
    iou: 0.72,
    landUse: "Commercial (Road Overlap)",
    points: "418,26 585,20 608,125 595,182 485,186 422,184 414,102",
    labelCoord: { x: 505, y: 105 },
    status: "Flagged",
  },
  {
    id: "MP-54-4524",
    name: "Bada Sarafa Ext.",
    confidence: 93,
    area: 427,
    vertices: 5,
    iou: 0.92,
    landUse: "Residential",
    points: "32,194 218,188 228,358 112,364 22,360",
    labelCoord: { x: 125, y: 275 },
    status: "High Confidence",
  },
  {
    id: "MP-54-4525",
    name: "Chhatribagh Rd 102",
    confidence: 88,
    area: 312,
    vertices: 6,
    iou: 0.87,
    landUse: "Residential",
    points: "236,195 395,192 415,280 405,368 248,362 232,278",
    labelCoord: { x: 320, y: 280 },
    status: "Review Advised",
  },
  {
    id: "MP-54-4526",
    name: "Balaji Compound",
    confidence: 95,
    area: 640,
    vertices: 8,
    iou: 0.95,
    landUse: "Institutional",
    points: "424,196 612,188 638,275 628,362 520,366 438,364 420,295 418,240",
    labelCoord: { x: 525, y: 280 },
    status: "High Confidence",
  },
  {
    id: "MP-54-4527",
    name: "Old Cloth Market",
    confidence: 68,
    area: 175,
    vertices: 5,
    iou: 0.69,
    landUse: "Commercial Sliver",
    points: "26,380 224,374 245,502 110,506 20,504",
    labelCoord: { x: 130, y: 440 },
    status: "Flagged",
  },
  {
    id: "MP-54-4528",
    name: "Imli Bazar Plot 305",
    confidence: 91,
    area: 480,
    vertices: 6,
    iou: 0.91,
    landUse: "Residential",
    points: "242,378 425,380 435,445 428,504 260,502 245,440",
    labelCoord: { x: 335, y: 442 },
    status: "High Confidence",
  },
];

function getConfidenceStyle(confidence: number) {
  if (confidence >= 90) {
    return {
      fill: "#10b981",
      stroke: "#059669",
      glow: "rgba(16, 185, 129, 0.4)",
      badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      gaugeColor: "#10b981",
      statusText: "High confidence",
    };
  }
  if (confidence >= 75) {
    return {
      fill: "#f59e0b",
      stroke: "#d97706",
      glow: "rgba(245, 158, 11, 0.4)",
      badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      gaugeColor: "#f59e0b",
      statusText: "Review advised",
    };
  }
  return {
    fill: "#ef4444",
    stroke: "#dc2626",
    glow: "rgba(239, 68, 68, 0.4)",
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    gaugeColor: "#ef4444",
    statusText: "Flagged / Low",
  };
}

function CircularGauge({ score, size = 48 }: { score: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const style = getConfidenceStyle(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={style.gaugeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-display text-xs font-bold text-foreground">{score}%</span>
    </div>
  );
}

function Extraction() {
  const [split, setSplit] = useState(52);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide" | "maskOnly" | "sourceOnly">("slider");
  const [selectedParcelId, setSelectedParcelId] = useState<string>("MP-54-4521");
  const [filterConfidence, setFilterConfidence] = useState<"all" | "high" | "review" | "flagged">("all");
  const [maskOpacity, setMaskOpacity] = useState(0.55);
  const [hoveredParcel, setHoveredParcel] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const activeParcel = useMemo(
    () => extractedParcels.find((p) => p.id === selectedParcelId) || extractedParcels[0],
    [selectedParcelId]
  );

  const filteredList = useMemo(() => {
    if (filterConfidence === "high") return extractedParcels.filter((p) => p.confidence >= 90);
    if (filterConfidence === "review") return extractedParcels.filter((p) => p.confidence >= 75 && p.confidence < 90);
    if (filterConfidence === "flagged") return extractedParcels.filter((p) => p.confidence < 75);
    return extractedParcels;
  }, [filterConfidence]);

  // Pointer drag events for smooth touch and mouse interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateSplitFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateSplitFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const updateSplitFromPointer = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSplit(percentage);
  };

  return (
    <>
      <PageHeader
        eyebrow="Vision Transformer & Segment Anything"
        title="AI Parcel Extraction Viewer"
        description="Deep learning models automatically detect property boundaries from aerial orthomosaics. Compare raw imagery with model-derived cadastral segmentation."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm">
              <button
                onClick={() => setViewMode("slider")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "slider"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Split className="size-3.5" />
                Interactive Split
              </button>
              <button
                onClick={() => setViewMode("sideBySide")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "sideBySide"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns className="size-3.5" />
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode("maskOnly")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "maskOnly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="size-3.5" />
                AI Mask Only
              </button>
            </div>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Main Comparison Canvas */}
        <div className="space-y-4">
          <Panel className="relative overflow-hidden p-0 border border-border shadow-lg">
            {/* Split Slider Mode */}
            {viewMode === "slider" && (
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative aspect-[16/10] max-h-[640px] w-full select-none overflow-hidden rounded-xl bg-muted cursor-ew-resize touch-none"
              >
                {/* Background Layer: Source Orthomosaic */}
                <img
                  src={aerial}
                  width={1536}
                  height={1024}
                  alt="Source aerial survey"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Foreground Layer: AI Segmented Overlay */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${split}%` }}
                >
                  <div
                    className="relative h-full"
                    style={{ width: `${(100 / split) * 100}%` }}
                  >
                    <img
                      src={aerial}
                      width={1536}
                      height={1024}
                      alt="AI segmented aerial survey"
                      className="h-full w-full object-cover brightness-[0.82] contrast-125"
                    />

                    {/* SVG Parcel Polygons Overlay */}
                    <svg
                      viewBox="0 0 800 520"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full"
                    >
                      <defs>
                        <filter id="polygon-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" />
                        </filter>
                      </defs>

                      {extractedParcels.map((parcel) => {
                        const isSelected = selectedParcelId === parcel.id;
                        const isHovered = hoveredParcel === parcel.id;
                        const style = getConfidenceStyle(parcel.confidence);

                        return (
                          <g
                            key={parcel.id}
                            className="cursor-pointer transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedParcelId(parcel.id);
                            }}
                            onMouseEnter={() => setHoveredParcel(parcel.id)}
                            onMouseLeave={() => setHoveredParcel(null)}
                          >
                            <polygon
                              points={parcel.points}
                              fill={style.fill}
                              fillOpacity={isSelected ? 0.48 : isHovered ? 0.38 : maskOpacity}
                              stroke={isSelected ? "#ffffff" : style.stroke}
                              strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                              strokeDasharray={parcel.confidence < 75 ? "5 3" : undefined}
                              className="transition-all duration-200"
                            />
                            {/* Centroid Tag */}
                            <g transform={`translate(${parcel.labelCoord.x}, ${parcel.labelCoord.y})`}>
                              <rect
                                x="-36"
                                y="-12"
                                width="72"
                                height="24"
                                rx="12"
                                fill="rgba(15, 23, 42, 0.85)"
                                stroke={isSelected ? "#ffffff" : style.stroke}
                                strokeWidth={isSelected ? "2" : "1"}
                              />
                              <text
                                x="0"
                                y="4"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                fontFamily="sans-serif"
                              >
                                {parcel.confidence}%
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Slider Handle Divider */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-2xl transition-transform"
                  style={{ left: `${split}%` }}
                >
                  <div className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110 active:scale-95">
                    <ScanLine className="size-5 animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                    {Math.round(split)}%
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  AI SEGMENTATION OUTPUT
                </div>
                <div className="pointer-events-none absolute right-4 top-4 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  SOURCE ORTHOMOSAIC
                </div>
              </div>
            )}

            {/* Side-by-Side Mode */}
            {viewMode === "sideBySide" && (
              <div className="grid gap-2 p-2 sm:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                  <img src={aerial} alt="Source" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white">
                    Raw Aerial Survey
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                  <img
                    src={aerial}
                    alt="Segmented"
                    className="h-full w-full object-cover brightness-90 contrast-125"
                  />
                  <svg
                    viewBox="0 0 800 520"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    {extractedParcels.map((parcel) => {
                      const isSelected = selectedParcelId === parcel.id;
                      const style = getConfidenceStyle(parcel.confidence);
                      return (
                        <polygon
                          key={parcel.id}
                          points={parcel.points}
                          fill={style.fill}
                          fillOpacity={0.45}
                          stroke={isSelected ? "#ffffff" : style.stroke}
                          strokeWidth={isSelected ? 3 : 1.5}
                          onClick={() => setSelectedParcelId(parcel.id)}
                          className="cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <span className="absolute left-3 top-3 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white">
                    Extracted Cadastral Polygons
                  </span>
                </div>
              </div>
            )}

            {/* Mask Only Mode */}
            {viewMode === "maskOnly" && (
              <div className="relative aspect-[16/10] max-h-[640px] w-full overflow-hidden rounded-xl bg-slate-950 p-2">
                <img
                  src={aerial}
                  alt="Base"
                  className="h-full w-full object-cover opacity-30 blur-[1px]"
                />
                <svg
                  viewBox="0 0 800 520"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full p-2"
                >
                  {extractedParcels.map((parcel) => {
                    const isSelected = selectedParcelId === parcel.id;
                    const style = getConfidenceStyle(parcel.confidence);
                    return (
                      <g key={parcel.id} onClick={() => setSelectedParcelId(parcel.id)} className="cursor-pointer">
                        <polygon
                          points={parcel.points}
                          fill={style.fill}
                          fillOpacity={isSelected ? 0.7 : 0.45}
                          stroke={isSelected ? "#ffffff" : style.stroke}
                          strokeWidth={isSelected ? 4 : 2}
                        />
                        <text
                          x={parcel.labelCoord.x}
                          y={parcel.labelCoord.y}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {parcel.id} ({parcel.confidence}%)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/90 px-4 py-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Split Position:</span>
                  <div className="flex gap-1">
                    {[25, 50, 75].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setSplit(pct)}
                        className={`rounded-lg px-2 py-0.5 font-bold transition-colors ${
                          Math.round(split) === pct
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Overlay Opacity:</span>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={Math.round(maskOpacity * 100)}
                    onChange={(e) => setMaskOpacity(Number(e.target.value) / 100)}
                    className="w-24 accent-primary h-1.5 bg-muted rounded cursor-pointer"
                  />
                  <span className="font-semibold text-foreground">{Math.round(maskOpacity * 100)}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  &ge;90% High
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-amber-500" />
                  75-89% Review
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-rose-500" />
                  &lt;75% Flagged
                </span>
              </div>
            </div>
          </Panel>

          {/* Quick Filter Tabs for Extracted Parcels */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5">
              {(
                [
                  ["all", "All Parcels (8)"],
                  ["high", "High Confidence (4)"],
                  ["review", "Review Advised (2)"],
                  ["flagged", "Flagged (2)"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterConfidence(key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    filterConfidence === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Click a card to highlight</span>
          </div>

          {/* Extracted Parcels Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {filteredList.map((parcel) => {
              const isSelected = selectedParcelId === parcel.id;
              const style = getConfidenceStyle(parcel.confidence);

              return (
                <Panel
                  key={parcel.id}
                  className={`cursor-pointer p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                      : "border border-border/80"
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedParcelId(parcel.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-display text-sm font-bold text-foreground">
                          {parcel.id}
                        </span>
                        <span className="block text-[11px] text-muted-foreground truncate max-w-[130px]">
                          {parcel.name}
                        </span>
                      </div>
                      <CircularGauge score={parcel.confidence} size={42} />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[11px]">
                      <span className="text-muted-foreground">{parcel.area} m²</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${style.badge}`}
                      >
                        {style.statusText}
                      </span>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>

        {/* Selected Parcel Telemetry & Model Inspector */}
        <div className="space-y-4">
          <Panel className="p-5 border border-border shadow-md">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Segmentation Telemetry
                </span>
                <h3 className="font-display text-xl font-bold">{activeParcel.id}</h3>
              </div>
              <CircularGauge score={activeParcel.confidence} size={50} />
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Status banner */}
              <div
                className={`rounded-xl border p-3 ${
                  getConfidenceStyle(activeParcel.confidence).badge
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {activeParcel.confidence >= 90 ? (
                    <CheckCircle2 className="size-4" />
                  ) : activeParcel.confidence >= 75 ? (
                    <Clock className="size-4" />
                  ) : (
                    <AlertTriangle className="size-4" />
                  )}
                  <span>{activeParcel.status}</span>
                </div>
                <p className="mt-1 text-[11px] opacity-90">
                  {activeParcel.confidence >= 90
                    ? "Model edge uncertainty is within sub-centimetre tolerance. Ready for automated registry drafting."
                    : activeParcel.confidence >= 75
                    ? "Roof eaves or tree overhang creates marginal edge noise. Field surveyor visual check advised."
                    : "Severe boundary deviation or right-of-way conflict detected. Requires physical GNSS field check."}
                </p>
              </div>

              {/* Model Performance Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-muted/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Intersection (IoU)
                  </span>
                  <span className="font-display text-lg font-bold text-foreground">
                    {(activeParcel.iou * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Regularized Area
                  </span>
                  <span className="font-display text-lg font-bold text-foreground">
                    {activeParcel.area} m²
                  </span>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Polygon Vertices
                  </span>
                  <span className="font-display text-lg font-bold text-foreground">
                    {activeParcel.vertices} nodes
                  </span>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Inference Time
                  </span>
                  <span className="font-display text-lg font-bold text-primary">
                    38 ms
                  </span>
                </div>
              </div>

              {/* Model Specifications */}
              <div className="rounded-xl bg-muted/40 p-3.5 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Neural Backbone:</span>
                  <span className="font-semibold text-foreground">SAM-Cadastre v2.4 (ViT-H)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Boundary Regularizer:</span>
                  <span className="font-semibold text-foreground">Douglas-Peucker (ε=0.12m)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GSD Ground Resolution:</span>
                  <span className="font-semibold text-foreground">4.8 cm / pixel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Land-Use Prediction:</span>
                  <span className="font-semibold text-primary">{activeParcel.landUse}</span>
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="pt-2 border-t border-border space-y-2">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  onClick={() => {
                    toast.success(`Boundary approved for ${activeParcel.id}`, {
                      description: "Extracted geometry pushed to Web-GIS validation queue.",
                    });
                  }}
                >
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Accept AI Boundary
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs font-semibold"
                    onClick={() => {
                      toast.info(`Field verification task dispatched`, {
                        description: `Assigned Ward 54 GNSS rover to inspect ${activeParcel.id}.`,
                      });
                    }}
                  >
                    Dispatch GNSS Rover
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-xs font-semibold"
                    onClick={() => {
                      toast.info(`Manual vertex editor opened for ${activeParcel.id}`);
                    }}
                  >
                    Adjust Vertices
                  </Button>
                </div>
              </div>
            </div>
          </Panel>

          {/* Pipeline Info Card */}
          <Panel className="p-4 border border-border bg-brand-gradient/5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="size-4" />
              Automated Parcel Pipeline
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ROOP-REKHA's convolutional edge-regularizer simplifies raw raster semantic masks into topologically clean vectors, preserving 90° building angles while removing vegetation occlusion.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
