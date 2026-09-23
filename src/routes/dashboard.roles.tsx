import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Check,
  Eye,
  MapPin,
  Shield,
  UserRound,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRole, type Role } from "@/components/roop/dashboard-shell";
import { PageHeader, Panel } from "@/components/roop/page-kit";
import { Button } from "@/components/ui/button";

const rolesList = [
  {
    name: "Super Admin" as Role,
    icon: Shield,
    scope: "National Command",
    badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    description: "Ministry of Housing & Urban Affairs and Department of Land Resources national oversight.",
    permitted: [
      "Access all 157 participating ULBs",
      "Retrain & deploy Vision Transformer checkpoints",
      "Global user & role privilege delegation",
      "Executive audit export & legal compliance",
    ],
    restricted: ["Direct field observation edits without surveyor sign-off"],
  },
  {
    name: "State Authority" as Role,
    icon: Building2,
    scope: "State Level (Madhya Pradesh)",
    badgeColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    description: "State Directorate of Urban Administration & Development monitoring pilot cities.",
    permitted: [
      "Multi-city performance monitoring",
      "State-level revenue settlement approvals",
      "Inter-municipal budget & survey drone allocation",
      "District collector escalation reviews",
    ],
    restricted: ["National model hyperparameter tuning"],
  },
  {
    name: "ULB Admin" as Role,
    icon: UserRound,
    scope: "Municipal Level (Indore)",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    description: "Indore Municipal Corporation (IMC) town planning and property tax wing.",
    permitted: [
      "Ward-wise parcel digitization sign-off",
      "Encroachment triage and legal notice dispatch",
      "Field rover surveyor task allocation",
      "Municipal GIS tax roll integration",
    ],
    restricted: ["State-wide cross-municipality policy overrides"],
  },
  {
    name: "Field Surveyor" as Role,
    icon: MapPin,
    scope: "Field Grid (Ward 54)",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    description: "On-ground surveyor equipped with DGPS rover and mobile verification application.",
    permitted: [
      "Centimetre RTK boundary node capture",
      "Physical landholder evidence collection",
      "Boundary dispute ground photographs",
      "Direct CORS sync verification",
    ],
    restricted: ["Final legal deed issuance without municipal approval"],
  },
  {
    name: "Citizen" as Role,
    icon: Eye,
    scope: "Public Cadastre Access",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    description: "Property owner and general public accessing verified land records.",
    permitted: [
      "Search parcel boundary by Khasra / CTS ID",
      "Download certified digital land deed preview",
      "Submit boundary objection / encroachment grievance",
      "View public master plan zoning restrictions",
    ],
    restricted: ["Editing spatial geometry or viewing surveyor internal queue"],
  },
] as const;

export const Route = createFileRoute("/dashboard/roles")({
  head: () => ({
    meta: [
      { title: "Role Panels — ROOP-REKHA" },
      { name: "description", content: "Role-based access demonstration for parcel operations." },
      { property: "og:title", content: "Role Panels — ROOP-REKHA" },
      { property: "og:description", content: "Role-based access demonstration for parcel operations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Roles,
});

function Roles() {
  const { role, setRole, theme } = useRole();

  return (
    <>
      <PageHeader
        eyebrow="Access Control & Security Simulation"
        title="Role-Based Operational Panels"
        description="Switch between stakeholder personas to experience how permissions, operational scope, and user interface emphasis adapt for national ministries, state secretariats, municipal bodies, field surveyors, and citizens."
      />

      {/* Active Role Highlight Banner */}
      <div className={`mb-6 rounded-2xl p-6 transition-all duration-300 ${theme.bannerClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Active Demonstration Persona
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold flex items-center gap-2">
              {role}
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20">
                {theme.scope}
              </span>
            </h2>
            <p className="mt-1 text-xs opacity-90 max-w-xl">
              {theme.tagline}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md text-xs font-medium border border-white/20">
            <span className="block opacity-80">Operational Jurisdiction:</span>
            <span className="font-bold">{theme.location}</span>
          </div>
        </div>
      </div>

      {/* 5 Role Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rolesList.map((item) => {
          const isCurrent = role === item.name;
          const Icon = item.icon;

          return (
            <Panel
              key={item.name}
              className={`p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isCurrent
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl border-primary/50"
                  : "border border-border/80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${
                      isCurrent ? "bg-primary text-primary-foreground shadow-brand" : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="size-6" />
                  </span>

                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3.5" />
                      Active Role
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold"
                      onClick={() => setRole(item.name)}
                    >
                      Switch To Persona
                    </Button>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {item.name}
                </h3>
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border mt-1 ${item.badgeColor}`}>
                  {item.scope}
                </span>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Permitted Features */}
                <div className="mt-4 pt-3 border-t border-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                    Permitted Capabilities:
                  </span>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {item.permitted.map((perm) => (
                      <li key={perm} className="flex items-start gap-1.5">
                        <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Restricted Features */}
                {item.restricted.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-1">
                      Enforced Restrictions:
                    </span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {item.restricted.map((rest) => (
                        <li key={rest} className="flex items-start gap-1.5">
                          <Lock className="size-3 text-rose-500 shrink-0 mt-0.5" />
                          <span>{rest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isCurrent && (
                <div className="mt-5 pt-3 border-t border-border text-center">
                  <span className="text-xs font-bold text-primary">
                    Currently inspecting platform with this role's clearances
                  </span>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </>
  );
}