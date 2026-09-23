import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Tooltip,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import { CheckCircle2, AlertOctagon, Clock, MapPin, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParcelRecord } from "@/data/mock-data";

export interface ParcelMapProps {
  parcels: ParcelRecord[];
  selected?: ParcelRecord;
  onSelectParcel: (parcel: ParcelRecord) => void;
  onStatusChange: (id: string, newStatus: "Approved" | "Pending" | "Disputed") => void;
  baseLayer: "osm" | "esri";
  showCentroids?: boolean;
  showLabels?: boolean;
  fillOpacity?: number;
}

function MapController({ selected }: { selected?: ParcelRecord }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo(selected.center, 18, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [map, selected]);

  return null;
}

export default function ParcelMap({
  parcels,
  selected,
  onSelectParcel,
  onStatusChange,
  baseLayer,
  showCentroids = true,
  showLabels = true,
  fillOpacity = 0.42,
}: ParcelMapProps) {
  // Center coordinates for Indore Ward 54 / Rajwada
  const initialCenter: [number, number] = [22.7196, 75.8577];

  const getStatusColors = (status: ParcelRecord["status"], isSelected: boolean) => {
    switch (status) {
      case "Approved":
        return {
          fill: "#10b981",
          stroke: isSelected ? "#047857" : "#059669",
          label: "Approved",
          badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "Disputed":
        return {
          fill: "#ef4444",
          stroke: isSelected ? "#b91c1c" : "#dc2626",
          label: "Disputed / Encroached",
          badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        };
      case "Pending":
      default:
        return {
          fill: "#f59e0b",
          stroke: isSelected ? "#b45309" : "#d97706",
          label: "Pending Review",
          badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
    }
  };

  return (
    <MapContainer
      center={initialCenter}
      zoom={17}
      scrollWheelZoom
      className="h-full min-h-[580px] w-full z-0 font-sans"
      zoomControl={false}
    >
      {/* Base Layer Switcher */}
      {baseLayer === "osm" ? (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
      ) : (
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
      )}

      <MapController selected={selected} />

      {/* Render Parcel Polygons */}
      {parcels.map((parcel) => {
        const isSelected = selected?.id === parcel.id;
        const colors = getStatusColors(parcel.status, isSelected);

        return (
          <Polygon
            key={parcel.id}
            positions={parcel.polygon}
            pathOptions={{
              color: colors.stroke,
              weight: isSelected ? 4 : 2.5,
              dashArray: parcel.status === "Disputed" ? "4 4" : undefined,
              fillColor: colors.fill,
              fillOpacity: isSelected ? Math.min(fillOpacity + 0.25, 0.85) : fillOpacity,
            }}
            eventHandlers={{
              click: () => {
                onSelectParcel(parcel);
              },
            }}
          >
            {showLabels && (
              <Tooltip direction="center" permanent={false} opacity={0.92} className="roop-map-tooltip">
                <div className="font-semibold text-xs py-0.5 px-1">
                  <span>{parcel.id}</span>
                  <span className="block text-[10px] text-muted-foreground">{parcel.landUse} · {parcel.area} m²</span>
                </div>
              </Tooltip>
            )}

            <Popup className="roop-leaflet-popup">
              <div className="w-64 p-1 text-foreground">
                <div className="flex items-start justify-between gap-2 border-b border-border pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      {parcel.ward}
                    </span>
                    <h3 className="font-display text-base font-bold leading-tight">{parcel.id}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${colors.badgeBg}`}
                  >
                    {parcel.status}
                  </span>
                </div>

                <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted/70 p-2">
                    <span className="text-[10px] text-muted-foreground block font-medium">Confidence</span>
                    <span className="font-bold text-foreground text-sm">{parcel.confidence}%</span>
                  </div>
                  <div className="rounded-lg bg-muted/70 p-2">
                    <span className="text-[10px] text-muted-foreground block font-medium">Area</span>
                    <span className="font-bold text-foreground text-sm">{parcel.area} m²</span>
                  </div>
                  <div className="rounded-lg bg-muted/70 p-2">
                    <span className="text-[10px] text-muted-foreground block font-medium">Land-Use</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{parcel.landUse}</span>
                  </div>
                  <div className="rounded-lg bg-muted/70 p-2">
                    <span className="text-[10px] text-muted-foreground block font-medium">Perimeter</span>
                    <span className="font-semibold text-foreground text-xs">{parcel.perimeter} m</span>
                  </div>
                </div>

                <div className="mb-3 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Owner:</span> {parcel.owner}
                </div>

                {parcel.overlapPercent && (
                  <div className="mb-3 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-[11px] text-rose-600 dark:text-rose-400">
                    <strong>Overlap Alert:</strong> {parcel.overlapPercent}% encroachment on adjoining corridor.
                  </div>
                )}

                {/* Working Action Buttons */}
                <div className="flex gap-1.5 pt-1 border-t border-border">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    onClick={() => onStatusChange(parcel.id, "Approved")}
                  >
                    <CheckCircle2 className="size-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
                    onClick={() => onStatusChange(parcel.id, "Pending")}
                  >
                    <Clock className="size-3.5 mr-1" />
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                    onClick={() => onStatusChange(parcel.id, "Disputed")}
                  >
                    <AlertOctagon className="size-3.5 mr-1" />
                    Flag
                  </Button>
                </div>
              </div>
            </Popup>
          </Polygon>
        );
      })}

      {/* Centroid indicators */}
      {showCentroids &&
        parcels.map((parcel) => (
          <CircleMarker
            key={`marker-${parcel.id}`}
            center={parcel.center}
            radius={4}
            pathOptions={{
              color: "#ffffff",
              fillColor:
                parcel.status === "Approved"
                  ? "#10b981"
                  : parcel.status === "Disputed"
                  ? "#ef4444"
                  : "#f59e0b",
              fillOpacity: 1,
              weight: 1.5,
            }}
          />
        ))}
    </MapContainer>
  );
}