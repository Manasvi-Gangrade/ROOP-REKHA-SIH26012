import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import {
  Layers3,
  Search,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  ExternalLink,
  X,
  Compass,
  Satellite,
  Map as MapIcon,
} from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";
import { parcels as initialParcels, type ParcelRecord } from "@/data/mock-data";

const ParcelMap = lazy(() => import("@/components/roop/parcel-map"));

export const Route = createFileRoute("/dashboard/map")({
  head: () => ({
    meta: [
      { title: "Web-GIS Map Viewer — ROOP-REKHA" },
      { name: "description", content: "Interactive parcel review map for Indian ULBs." },
      { property: "og:title", content: "Web-GIS Viewer — ROOP-REKHA" },
      { property: "og:description", content: "Interactive parcel review map for Indian ULBs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [items, setItems] = useState<ParcelRecord[]>(initialParcels);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Pending" | "Disputed">(
    "All",
  );
  const [selectedParcel, setSelectedParcel] = useState<ParcelRecord | undefined>(initialParcels[0]);
  const [baseLayer, setBaseLayer] = useState<"osm" | "esri">("osm");
  const [showCentroids, setShowCentroids] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [fillOpacity, setFillOpacity] = useState(0.42);
  const [layerControlOpen, setLayerControlOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Filtered parcels based on statusFilter
  const filteredParcels = useMemo(() => {
    return items.filter((p) => {
      if (statusFilter === "All") return true;
      return p.status === statusFilter;
    });
  }, [items, statusFilter]);

  // Autocomplete suggestions based on search text
  const searchSuggestions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return items.filter(
      (p) =>
        p.id.toLowerCase().includes(query) ||
        p.owner.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query),
    );
  }, [items, search]);

  const stats = useMemo(() => {
    const approved = items.filter((x) => x.status === "Approved").length;
    const pending = items.filter((x) => x.status === "Pending").length;
    const disputed = items.filter((x) => x.status === "Disputed").length;
    return { approved, pending, disputed, total: items.length };
  }, [items]);

  function handleStatusChange(id: string, newStatus: "Approved" | "Pending" | "Disputed") {
    setItems((rows) => rows.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    if (selectedParcel?.id === id) {
      setSelectedParcel((prev) => (prev ? { ...prev, status: newStatus } : undefined));
    }
    toast.success(`Parcel ${id} updated`, {
      description: `Status changed to ${newStatus}. Vector symbology updated on map.`,
    });
  }

  function handleSelectFromSearch(parcel: ParcelRecord) {
    setSelectedParcel(parcel);
    setSearch(parcel.id);
    setSearchFocused(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Spatial Operations & GIS"
        title="Web-GIS Map Viewer"
        description="Search, inspect, and approve cadastral parcel boundaries against OpenStreetMap and high-resolution Esri satellite imagery."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm">
              <button
                onClick={() => setBaseLayer("osm")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  baseLayer === "osm"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapIcon className="size-3.5" />
                Street (OSM)
              </button>
              <button
                onClick={() => setBaseLayer("esri")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  baseLayer === "esri"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Satellite className="size-3.5" />
                Esri Satellite
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedParcel(items[0]);
                toast.info("Map view centered on Indore Ward 54 Rajwada");
              }}
            >
              <RotateCcw className="size-3.5 mr-1" />
              Reset Extent
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Main Map Viewer Panel */}
        <Panel className="relative overflow-hidden p-0 min-h-[640px] border border-border shadow-lg">
          {/* Top Search & Filter Bar */}
          <div className="absolute left-4 top-4 z-[400] w-[min(380px,calc(100%-2rem))]">
            <div className="relative flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3 py-1 shadow-xl backdrop-blur-md">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search Parcel ID, Owner, Address..."
                className="h-10 w-full bg-transparent text-xs sm:text-sm font-medium outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchFocused(false);
                  }}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-md">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Matching Parcels ({searchSuggestions.length})
                </p>
                {searchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromSearch(item)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted"
                  >
                    <div>
                      <span className="font-bold text-foreground">{item.id}</span>
                      <span className="block text-[11px] text-muted-foreground truncate max-w-[220px]">
                        {item.owner} · {item.address}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        item.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : item.status === "Disputed"
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Floating Quick Status Filter Pills */}
          <div className="absolute right-4 top-4 z-[400] hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur-md">
            {(["All", "Approved", "Pending", "Disputed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Layer Control Toggle Button */}
          <div className="absolute right-4 bottom-5 z-[400]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLayerControlOpen((v) => !v)}
              className="bg-background/95 shadow-xl backdrop-blur-md"
            >
              <Sliders className="size-3.5 mr-1 text-primary" />
              Layers & Opacity
            </Button>

            {/* Layer Control Panel */}
            {layerControlOpen && (
              <div className="absolute right-0 bottom-12 w-64 rounded-xl border border-border bg-popover/95 p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Layers3 className="size-3.5 text-primary" />
                    Layer Controls
                  </h4>
                  <button
                    onClick={() => setLayerControlOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Polygon Opacity ({Math.round(fillOpacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="85"
                      value={Math.round(fillOpacity * 100)}
                      onChange={(e) => setFillOpacity(Number(e.target.value) / 100)}
                      className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Centroid Markers</span>
                    <input
                      type="checkbox"
                      checked={showCentroids}
                      onChange={(e) => setShowCentroids(e.target.checked)}
                      className="size-4 accent-primary rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Parcel Tooltips</span>
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="size-4 accent-primary rounded"
                    />
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                      Base Map
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        size="sm"
                        variant={baseLayer === "osm" ? "default" : "outline"}
                        className="h-7 text-[11px]"
                        onClick={() => setBaseLayer("osm")}
                      >
                        Street (OSM)
                      </Button>
                      <Button
                        size="sm"
                        variant={baseLayer === "esri" ? "default" : "outline"}
                        className="h-7 text-[11px]"
                        onClick={() => setBaseLayer("esri")}
                      >
                        Satellite
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Cadastral Legend HUD */}
          <div className="absolute bottom-5 left-5 z-[400] rounded-xl border border-border bg-background/95 p-3.5 text-xs shadow-xl backdrop-blur-md max-w-[260px]">
            <p className="mb-2 flex items-center justify-between font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <Layers3 className="size-4 text-primary" />
                Cadastral Status
              </span>
              <span className="text-[10px] text-muted-foreground">Indore Ward 54</span>
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => setStatusFilter("Approved")}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-emerald-500 shadow-sm" />
                  <span className="font-medium">Approved</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.approved}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("Pending")}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-amber-500 shadow-sm" />
                  <span className="font-medium">Pending Review</span>
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {stats.pending}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("Disputed")}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-rose-500 shadow-sm" />
                  <span className="font-medium">Disputed / Conflict</span>
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{stats.disputed}</span>
              </button>
            </div>

            {statusFilter !== "All" && (
              <button
                onClick={() => setStatusFilter("All")}
                className="mt-2 text-[10px] font-bold text-primary hover:underline block text-center w-full"
              >
                Reset Filter (Show All {stats.total})
              </button>
            )}
          </div>

          {/* Leaflet ClientOnly map */}
          <ClientOnly
            fallback={
              <div className="grid min-h-[640px] place-items-center bg-muted text-sm font-semibold text-muted-foreground">
                <div className="text-center">
                  <Compass className="size-8 mx-auto mb-2 text-primary animate-spin" />
                  Loading spatial cadastre workspace...
                </div>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="grid min-h-[640px] place-items-center bg-muted">
                  <div className="text-center text-sm font-semibold text-muted-foreground">
                    Initializing Leaflet GIS canvas...
                  </div>
                </div>
              }
            >
              <ParcelMap
                parcels={filteredParcels}
                selected={selectedParcel}
                onSelectParcel={(p) => setSelectedParcel(p)}
                onStatusChange={handleStatusChange}
                baseLayer={baseLayer}
                showCentroids={showCentroids}
                showLabels={showLabels}
                fillOpacity={fillOpacity}
              />
            </Suspense>
          </ClientOnly>
        </Panel>

        {/* Selected Parcel Inspector Side Panel */}
        <div className="space-y-4">
          <Panel className="p-5 border border-border shadow-md">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Cadastral Deed Record
                </span>
                <h3 className="font-display text-xl font-bold">
                  {selectedParcel ? selectedParcel.id : "Select a Parcel"}
                </h3>
              </div>
              {selectedParcel && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    selectedParcel.status === "Approved"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : selectedParcel.status === "Disputed"
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {selectedParcel.status}
                </span>
              )}
            </div>

            {selectedParcel ? (
              <div className="mt-4 space-y-4 text-xs">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      AI Model Confidence
                    </span>
                    <span className="font-display text-xl font-bold text-foreground">
                      {selectedParcel.confidence}%
                    </span>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Calculated Area
                    </span>
                    <span className="font-display text-xl font-bold text-foreground">
                      {selectedParcel.area} m²
                    </span>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Boundary Perimeter
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {selectedParcel.perimeter} m
                    </span>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      Land-Use Zoning
                    </span>
                    <span className="font-bold text-primary text-sm">{selectedParcel.landUse}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 rounded-xl bg-muted/40 p-3 border border-border/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Owner of Record
                    </span>
                    <span className="font-semibold text-foreground">{selectedParcel.owner}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Property Address
                    </span>
                    <span className="text-muted-foreground">{selectedParcel.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Assigned Surveyor
                    </span>
                    <span className="text-muted-foreground">{selectedParcel.surveyor}</span>
                  </div>
                  {selectedParcel.notes && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Field Audit Notes
                      </span>
                      <p className="text-[11px] text-muted-foreground italic mt-0.5">
                        "{selectedParcel.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Conflict Alert if Disputed */}
                {selectedParcel.overlapPercent && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-600 dark:text-rose-400">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="size-4 shrink-0" />
                      Encroachment Conflict Detected
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed">
                      AI topology detected a {selectedParcel.overlapPercent}% overlap with adjacent
                      public corridor right-of-way.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      onClick={() => handleStatusChange(selectedParcel.id, "Approved")}
                    >
                      <CheckCircle2 className="size-4 mr-1.5" />
                      Approve Deed
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-rose-600 hover:bg-rose-700 font-semibold"
                      onClick={() => handleStatusChange(selectedParcel.id, "Disputed")}
                    >
                      <AlertTriangle className="size-4 mr-1.5" />
                      Flag Dispute
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold"
                    onClick={() => handleStatusChange(selectedParcel.id, "Pending")}
                  >
                    <Clock className="size-3.5 mr-1.5" />
                    Move to Pending Queue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <MapPin className="size-8 mx-auto mb-2 opacity-50" />
                <p>Click any parcel on the map or search above to view cadastral deed details.</p>
              </div>
            )}
          </Panel>

          {/* Quick Parcel Selector List */}
          <Panel className="p-4 border border-border shadow-sm max-h-72 overflow-y-auto">
            <h4 className="font-display text-sm font-bold mb-3 flex items-center justify-between">
              <span>All Ward 54 Parcels</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {filteredParcels.length} records
              </span>
            </h4>
            <div className="space-y-1.5">
              {filteredParcels.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedParcel(p)}
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-colors ${
                    selectedParcel?.id === p.id
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div>
                    <span className="font-bold">{p.id}</span>
                    <span className="block text-[10px] opacity-80">
                      {p.area} m² · {p.landUse}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      selectedParcel?.id === p.id
                        ? "bg-white/20 text-white"
                        : p.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : p.status === "Disputed"
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
