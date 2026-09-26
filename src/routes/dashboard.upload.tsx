import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  CloudUpload,
  FileArchive,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Database,
  Layers,
  ArrowRight,
  HardDrive,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatusBadge } from "@/components/roop/page-kit";
import { uploads as initialUploads } from "@/data/mock-data";

export const Route = createFileRoute("/dashboard/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Ingestion — ROOP-REKHA" },
      { name: "description", content: "Ingest drone and LiDAR survey data." },
      { property: "og:title", content: "Upload & Ingestion — ROOP-REKHA" },
      { property: "og:description", content: "Ingest drone and LiDAR survey data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

const ingestionStages = [
  "Validating GeoTIFF CRS projection (EPSG:32643 - UTM Zone 43N)...",
  "Checking radiometric calibration and solar angle correction...",
  "Building Cloud-Optimized GeoTIFF (COG) pyramid overviews...",
  "Generating 512x512 inference tiles for AI boundary segmentation...",
  "Package successfully ingested! AI extraction worker assigned.",
];

function UploadPage() {
  const [method, setMethod] = useState("2D Nadir");
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState(initialUploads);
  const inputRef = useRef<HTMLInputElement>(null);

  function simulateUpload(customName?: string, customSize?: string) {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(5);
    setStageIndex(0);

    const fileName = customName || "indore_ward54_highres_ortho.tif";
    const fileSize = customSize || "2.4 GB";

    let current = 5;
    const interval = setInterval(() => {
      current += 15;
      setProgress((prev) => Math.min(prev + 15, 100));

      if (current >= 25 && current < 50) setStageIndex(1);
      else if (current >= 50 && current < 75) setStageIndex(2);
      else if (current >= 75 && current < 100) setStageIndex(3);

      if (current >= 100) {
        clearInterval(interval);
        setStageIndex(4);
        setIsUploading(false);

        // Add new package to recent uploads table
        const newRecord = {
          id: `UP-${100 + items.length + 1}`,
          name: fileName,
          ulb: "Indore",
          size: fileSize,
          method: method,
          status: "Processed",
          date: "Just now",
          parcelsFound: 164,
        };
        setItems([newRecord, ...items]);

        toast.success("Survey Package Ingested", {
          description: `${fileName} (${fileSize}) processed into COG tiles. AI extraction queued.`,
        });
      }
    }, 220);
  }

  return (
    <>
      <PageHeader
        eyebrow="Data Pipelines & Spatial Ingestion"
        title="Upload & Ingestion Pipeline"
        description="Ingest drone orthomosaics, multi-view oblique imagery, and LiDAR point clouds with automatic Coordinate Reference System (CRS) validation and Cloud-Optimized tiling."
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Drag and Drop Zone */}
        <Panel className="border border-border/80 shadow-md">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              simulateUpload();
            }}
            onDragOver={(e) => e.preventDefault()}
            className="group flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center transition-all hover:border-primary hover:bg-primary/10"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".tif,.tiff,.las,.laz,.zip"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  simulateUpload(file.name, `${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB`);
                } else {
                  simulateUpload();
                }
              }}
            />
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-brand transition-transform group-hover:scale-105">
              <UploadCloud className="size-8" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">
              Drop drone survey packages here
            </h2>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm">
              GeoTIFF (.tif), ASPRS LiDAR (.laz / .las), or multi-view drone survey archives (.zip).
              Supports files up to 12 GB.
            </p>
            <span className="mt-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Auto-detects EPSG:32643 / WGS84
            </span>
          </button>

          {/* Upload Progress & Active Stage Indicator */}
          {progress > 0 && (
            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/40 p-4">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="flex items-center gap-2 text-foreground">
                  {progress === 100 ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <span className="size-2 rounded-full bg-primary animate-ping" />
                  )}
                  {progress === 100 ? "Ingestion Pipeline Complete" : "Processing Survey Package"}
                </span>
                <span className="text-primary font-display font-bold">{progress}%</span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-brand-gradient transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2.5 text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="font-semibold text-primary">Stage:</span>
                {ingestionStages[stageIndex]}
              </p>
            </div>
          )}
        </Panel>

        {/* Ingestion Configuration Card */}
        <Panel className="border border-border/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Layers className="size-5" />
              </span>
              <h2 className="font-display text-lg font-bold">Capture Methodology</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure parameters to optimize the AI model's camera perspective transformation.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Sensor Configuration
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>2D Nadir Orthomosaic</option>
                  <option>Oblique 3D Mesh</option>
                  <option>Oblique + LiDAR Point Cloud</option>
                </select>
              </div>

              <div className="rounded-xl bg-muted/50 p-3.5 border border-border/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target GSD:</span>
                  <span className="font-bold text-foreground">&lt; 5.0 cm / pixel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coordinate System:</span>
                  <span className="font-bold text-foreground">EPSG:32643 (UTM 43N)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tile Matrix:</span>
                  <span className="font-bold text-foreground">Web-Mercator COG (512x512)</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Packages to Test Ingestion */}
            <div className="mt-5 border-t border-border pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Simulate Demo Survey Dataset
              </span>
              <div className="space-y-1.5">
                {[
                  { name: "indore_ward54_ortho.tif", size: "2.8 GB" },
                  { name: "jaipur_sector12_lidar.laz", size: "6.3 GB" },
                ].map((demo) => (
                  <button
                    key={demo.name}
                    onClick={() => simulateUpload(demo.name, demo.size)}
                    disabled={isUploading}
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 p-2 text-left text-xs transition-colors hover:bg-muted"
                  >
                    <span className="font-semibold truncate max-w-[180px]">{demo.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{demo.size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="mt-5 w-full bg-brand-gradient shadow-brand font-semibold"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <FileArchive className="size-4 mr-2" />
            {isUploading ? "Processing..." : "Select File From Disk"}
          </Button>
        </Panel>
      </div>

      {/* Recent Uploads Table */}
      <Panel className="mt-5 border border-border/80 shadow-md overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="size-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Ingested Survey Packages</h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {items.length} survey datasets ready for feature extraction
          </span>
        </div>

        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="text-[11px] font-bold uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="pb-3">Package File</th>
              <th className="pb-3">ULB Name</th>
              <th className="pb-3">Size</th>
              <th className="pb-3">Survey Method</th>
              <th className="pb-3">Extracted Parcels</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.name} className="transition-colors hover:bg-muted/40">
                <td className="py-3.5 font-semibold text-foreground flex items-center gap-2">
                  <FileCheck className="size-4 text-primary shrink-0" />
                  <span className="truncate max-w-[240px]">{item.name}</span>
                </td>
                <td className="py-3.5 font-medium">{item.ulb}</td>
                <td className="py-3.5 font-mono text-[11px]">{item.size}</td>
                <td className="py-3.5">{item.method}</td>
                <td className="py-3.5 font-bold">
                  {item.parcelsFound > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {item.parcelsFound} parcels
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-normal">Extracting...</span>
                  )}
                </td>
                <td className="py-3.5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3.5 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-primary hover:text-primary"
                    onClick={() => {
                      toast.info(`Package details for ${item.name}`, {
                        description: `GSD: 4.8 cm/px · Projection: EPSG:32643 · Verified by ULB Indore`,
                      });
                    }}
                  >
                    View Specs
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
