import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  LandPlot,
  MapPin,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/roop/page-kit";

export const Route = createFileRoute("/dashboard/encroachment")({
  head: () => ({
    meta: [
      { title: "Encroachment Detection — ROOP-REKHA" },
      { name: "description", content: "Review and resolve parcel overlap flags." },
      { property: "og:title", content: "Encroachment Detection — ROOP-REKHA" },
      { property: "og:description", content: "Review and resolve parcel overlap flags." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Encroach,
});

interface EncroachmentCard {
  id: string;
  parcel: string;
  ward: string;
  overlap: number;
  conflictType: string;
  owner: string;
  areaSqM: number;
}

const initialColumns: Record<string, EncroachmentCard[]> = {
  "New Flags": [
    {
      id: "ENC-101",
      parcel: "MP-54-4523",
      ward: "Ward 54 (Central)",
      overlap: 18.4,
      conflictType: "Municipal Road Right-of-Way",
      owner: "Commercial Encroachment",
      areaSqM: 36.4,
    },
    {
      id: "ENC-102",
      parcel: "RJ-12-3315",
      ward: "Ward 12 (North)",
      overlap: 11.7,
      conflictType: "Adjoining Private Plot Boundary",
      owner: "Govind Ram & Brothers",
      areaSqM: 28.2,
    },
    {
      id: "ENC-103",
      parcel: "GJ-03-1834",
      ward: "Ward 03 (East)",
      overlap: 8.2,
      conflictType: "Drainage / Nullah Buffer Zone",
      owner: "Patel Warehouse Compound",
      areaSqM: 19.5,
    },
  ],
  "Under Review": [
    {
      id: "ENC-104",
      parcel: "MH-09-9082",
      ward: "Ward 09 (South)",
      overlap: 15.1,
      conflictType: "Government School Compound",
      owner: "Pending Tehsildar Hearing",
      areaSqM: 42.0,
    },
    {
      id: "ENC-105",
      parcel: "KL-08-7428",
      ward: "Ward 08 (Coastal)",
      overlap: 6.8,
      conflictType: "Canal Setback Encroachment",
      owner: "Mathew Thomas",
      areaSqM: 14.2,
    },
    {
      id: "ENC-106",
      parcel: "AS-11-2234",
      ward: "Ward 11 (Brahmaputra)",
      overlap: 5.9,
      conflictType: "Public Park Boundary",
      owner: "Community Welfare Assn",
      areaSqM: 12.8,
    },
  ],
  Resolved: [
    {
      id: "ENC-107",
      parcel: "MP-21-1188",
      ward: "Ward 21 (West)",
      overlap: 9.6,
      conflictType: "Demolished Temporary Structure",
      owner: "Settled via ULB Notice",
      areaSqM: 22.4,
    },
    {
      id: "ENC-108",
      parcel: "GJ-07-6412",
      ward: "Ward 07 (Central)",
      overlap: 7.1,
      conflictType: "Amicable Mutation Mutual Agreement",
      owner: "Shah & Desai Family",
      areaSqM: 16.5,
    },
  ],
};

function Encroach() {
  const [columns, setColumns] = useState(initialColumns);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<EncroachmentCard | null>(null);

  const columnNames = ["New Flags", "Under Review", "Resolved"];

  function moveCard(fromCol: string, cardIndex: number, direction: "next" | "prev") {
    const currentIndex = columnNames.indexOf(fromCol);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= columnNames.length) return;

    const toCol = columnNames[targetIndex];
    const sourceList = [...columns[fromCol]];
    const [cardToMove] = sourceList.splice(cardIndex, 1);

    if (!cardToMove) return;

    setColumns({
      ...columns,
      [fromCol]: sourceList,
      [toCol]: [cardToMove, ...(columns[toCol] || [])],
    });

    toast.success(`Moved ${cardToMove.parcel}`, {
      description: `Transitioned from "${fromCol}" to "${toCol}". Workflow audit recorded.`,
    });
  }

  function flagNewConflict() {
    const newCase: EncroachmentCard = {
      id: `ENC-${Math.floor(100 + Math.random() * 900)}`,
      parcel: `MP-54-${4530 + Math.floor(Math.random() * 20)}`,
      ward: "Ward 54 (Central)",
      overlap: +(10 + Math.random() * 12).toFixed(1),
      conflictType: "Street Setback Overhang",
      owner: "Simulated Commercial Unit",
      areaSqM: +(15 + Math.random() * 25).toFixed(1),
    };

    setColumns((prev) => ({
      ...prev,
      "New Flags": [newCase, ...prev["New Flags"]],
    }));

    toast.error("New Encroachment Flagged", {
      description: `Parcel ${newCase.parcel} flagged with ${newCase.overlap}% overlap.`,
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Dispute Mitigation & Legal Compliance"
        title="Encroachment Detection & Triage"
        description="Automated cadastral overlay detects spatial collisions between AI-segmented properties and public infrastructure corridors. Triage and resolve boundary disputes through a transparent multi-tier review workflow."
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              className="bg-rose-600 hover:bg-rose-700 shadow-sm font-semibold"
              onClick={flagNewConflict}
            >
              <Plus className="size-4 mr-1.5" />
              Simulate New Conflict
            </Button>
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3 mb-5">
        <Panel className="border border-border/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Flags</span>
            <ShieldAlert className="size-5 text-rose-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
            {columns["New Flags"].length} New Cases
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Requiring initial spatial triage</p>
        </Panel>

        <Panel className="border border-border/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Under Investigation</span>
            <Clock className="size-5 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {columns["Under Review"].length} In Hearing
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Notice served to land title holder</p>
        </Panel>

        <Panel className="border border-border/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Resolved Cadastre</span>
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {columns["Resolved"].length} Settled
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Corrected deed updated in GIS registry</p>
        </Panel>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-5 xl:grid-cols-3">
        {columnNames.map((colName) => {
          const cards = columns[colName] || [];
          const isResolved = colName === "Resolved";
          const isNew = colName === "New Flags";

          return (
            <section
              key={colName}
              className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${
                        isResolved
                          ? "bg-emerald-500"
                          : isNew
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <h2 className="font-display text-base font-bold text-foreground">
                      {colName}
                    </h2>
                  </div>
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-bold shadow-xs">
                    {cards.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {cards.map((card, index) => (
                    <article
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display font-bold text-foreground text-sm">{card.parcel}</p>
                          <p className="text-[11px] text-muted-foreground">{card.ward}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            card.overlap > 12
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {card.overlap}% Overlap
                        </span>
                      </div>

                      <div className="mt-3 rounded-lg bg-muted/50 p-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Conflict Nature:
                        </span>
                        <span className="font-medium text-foreground">{card.conflictType}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-border text-xs">
                        <span className="text-[11px] text-muted-foreground">{card.areaSqM} m² affected</span>

                        {/* Workflow Action Buttons */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {colName !== "New Flags" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => moveCard(colName, index, "prev")}
                              title="Move back"
                            >
                              <ArrowLeft className="size-3.5" />
                            </Button>
                          )}
                          {colName !== "Resolved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs border-primary/40 text-primary hover:bg-primary hover:text-white"
                              onClick={() => moveCard(colName, index, "next")}
                              title="Advance workflow"
                            >
                              Advance <ArrowRight className="size-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}

                  {cards.length === 0 && (
                    <div className="py-12 text-center text-xs text-muted-foreground border-2 border-dashed border-border rounded-xl">
                      No cases in this stage.
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Selected Card Modal / Inspection Drawer */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-500">
                  Encroachment Audit Sheet
                </span>
                <h3 className="font-display text-xl font-bold">{selectedCard.parcel}</h3>
              </div>
              <span className="rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-3 py-1 text-xs font-bold">
                {selectedCard.overlap}% Overlap
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-muted/60 p-3">
                <span className="text-muted-foreground block text-[11px]">Infringement Classification</span>
                <span className="font-bold text-foreground text-sm">{selectedCard.conflictType}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/60 p-2.5">
                  <span className="text-muted-foreground block text-[10px]">Territory Ward</span>
                  <span className="font-bold text-foreground">{selectedCard.ward}</span>
                </div>
                <div className="rounded-xl bg-muted/60 p-2.5">
                  <span className="text-muted-foreground block text-[10px]">Infringed Area</span>
                  <span className="font-bold text-foreground">{selectedCard.areaSqM} m²</span>
                </div>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <span className="text-muted-foreground block text-[10px]">Record of Rights Owner</span>
                <span className="font-bold text-foreground">{selectedCard.owner}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                onClick={() => {
                  toast.success(`Legal notice dispatched for ${selectedCard.parcel}`);
                  setSelectedCard(null);
                }}
              >
                Dispatch Legal Notice
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedCard(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}