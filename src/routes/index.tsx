import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  DatabaseZap,
  LandPlot,
  Map,
  Radar,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Compass,
  FileCheck,
  Building,
  Award,
  Moon,
  Sun,
} from "lucide-react";
import aerial from "@/assets/indore-aerial.jpg";
import { AnimatedCounter } from "@/components/roop/animated-counter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/roop/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ROOP-REKHA — AI Urban Parcel Mapping & Cadastral Intelligence" },
      {
        name: "description",
        content:
          "Transform drone and LiDAR aerial surveys into legal-grade, verified urban parcel intelligence for Indian Urban Local Bodies.",
      },
      { property: "og:title", content: "ROOP-REKHA — AI Urban Parcel Mapping" },
      {
        property: "og:description",
        content:
          "AI-powered cadastral feature extraction, topology validation, and encroachment detection for the Department of Land Resources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const modules = [
  {
    icon: Bot,
    title: "AI Parcel Extraction",
    copy: "Deep Vision Transformers segment cadastral plot boundaries from aerial orthomosaics with sub-centimetre precision.",
    to: "/dashboard/extraction",
    tag: "Core AI Model",
  },
  {
    icon: Map,
    title: "Web-GIS Map Viewer",
    copy: "Inspect, filter, and approve parcels against street maps and high-res Esri satellite basemaps with real-time symbology.",
    to: "/dashboard/map",
    tag: "Interactive GIS",
  },
  {
    icon: ShieldCheck,
    title: "Topology & Validation",
    copy: "Eliminate sliver polygons, resolve boundary overlaps, and enforce 90° corners to meet legal OGC standards.",
    to: "/dashboard/validation",
    tag: "OGC Rules",
  },
  {
    icon: LandPlot,
    title: "Encroachment Triage",
    copy: "Automated spatial collision detection flags right-of-way infringements into an actionable Kanban workflow.",
    to: "/dashboard/encroachment",
    tag: "Legal Compliance",
  },
  {
    icon: Radar,
    title: "GNSS Field Verification",
    copy: "Connect rover surveyors with centimetre RTK corrections via the Survey of India CORS network.",
    to: "/dashboard/gnss",
    tag: "Ground Truth",
  },
  {
    icon: DatabaseZap,
    title: "Analytics & Reports",
    copy: "Track municipal throughput velocity, digitisation completion percentages, and export statutory deed reports.",
    to: "/dashboard/analytics",
    tag: "Executive Insights",
  },
] as const;

function Landing() {
  const { dark, toggle } = useTheme();

  return (
    <main className="overflow-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[94vh] border-b border-border flex flex-col justify-between">
        <img
          src={aerial}
          alt="Aerial survey of an Indian urban neighbourhood"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Multi-layer gradient overlay for pristine contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/40 dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-900/60" />

        {/* Top Navbar */}
        <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 text-white md:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-white shadow-brand">
              <LandPlot className="size-6" />
            </span>
            <div>
              <p className="font-display text-xl font-bold tracking-tight">ROOP-REKHA</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Urban Parcel Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button
              asChild
              className="bg-white text-slate-950 hover:bg-white/90 font-bold shadow-lg h-10 px-5 text-xs sm:text-sm"
            >
              <Link to="/dashboard">
                Open Command Centre <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-5 py-16 text-white md:px-8">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold backdrop-blur-md">
            <Sparkles className="size-4 text-emerald-400" />
            Urban land intelligence for local governments
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Map every parcel.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Unlock every city.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            An AI-powered urban cadastral platform that converts drone and LiDAR aerial surveys into
            topologically regularized, legally reviewable property parcels for Indian Urban Local
            Bodies.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-12 bg-brand-gradient px-7 font-bold shadow-brand text-sm hover:opacity-95"
            >
              <Link to="/dashboard">
                Enter Operational Dashboard <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 font-semibold backdrop-blur-md"
            >
              <Link to="/dashboard/map">
                <Compass className="size-4 mr-2 text-emerald-400" />
                Launch Live Web-GIS Map
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 font-semibold backdrop-blur-md"
            >
              <Link to="/dashboard/extraction">
                <Bot className="size-4 mr-2 text-cyan-400" />
                Inspect AI Extraction Slider
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating Bottom Stats HUD */}
        <div className="relative z-20 mx-auto -mb-10 w-full max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:grid-cols-4 md:p-6">
            <div className="text-center p-2 border-r border-border/60 last:border-r-0">
              <p className="font-display text-3xl font-bold text-primary md:text-4xl">
                <AnimatedCounter value={157} />
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Urban Local Bodies</p>
            </div>
            <div className="text-center p-2 border-r border-border/60 last:border-r-0">
              <p className="font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400 md:text-4xl">
                <AnimatedCounter value={4484} suffix=" sq.km" />
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Urban Area Mapped</p>
            </div>
            <div className="text-center p-2 border-r border-border/60 last:border-r-0">
              <p className="font-display text-3xl font-bold text-amber-600 dark:text-amber-400 md:text-4xl">
                70–80%
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Faster Digitisation
              </p>
            </div>
            <div className="text-center p-2">
              <p className="font-display text-3xl font-bold text-violet-600 dark:text-violet-400 md:text-4xl">
                <AnimatedCounter value={87.6} suffix="%" />
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">mAP Model Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Continuous Cadastral Workflow */}
      <section className="mx-auto max-w-7xl px-5 pt-28 pb-20 md:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            End-to-End Autonomous Pipeline
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            From Drone Flight to Certified Land Title
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A seamless digital assembly line that replaces multi-year manual revenue mapping with
            intelligent machine vision and real-time ground truth.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              icon: UploadCloud,
              step: "01",
              title: "Ingestion",
              copy: "Cloud-Optimized GeoTIFFs & LiDAR point clouds",
            },
            {
              icon: Bot,
              step: "02",
              title: "AI Extraction",
              copy: "Segment Anything neural boundary detection",
            },
            {
              icon: ShieldCheck,
              step: "03",
              title: "Validation",
              copy: "Douglas-Peucker orthogonalization & OGC checks",
            },
            {
              icon: Map,
              step: "04",
              title: "GIS Review",
              copy: "Multi-stakeholder visual deed approval",
            },
            {
              icon: CheckCircle2,
              step: "05",
              title: "CORS Verify",
              copy: "Centimetre DGPS field sign-off & publishing",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <span className="font-display text-2xl font-bold text-muted-foreground/30">
                  {item.step}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Module Highlight Cards with Direct Links */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Integrated Operational Modules
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Engineered for the Entire Cadastral Lifecycle
              </h2>
            </div>
            <Button asChild className="bg-brand-gradient shadow-brand">
              <Link to="/dashboard">
                Explore All 10 Modules <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Link
                key={mod.title}
                to={mod.to}
                className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <mod.icon className="size-6" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{mod.copy}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                  <span>Open Interactive Demo</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment-ready footer banner */}
      <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 md:p-12 shadow-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold border border-emerald-500/30 mb-4">
            <CheckCircle2 className="size-3.5" />
            Static Ready · Zero Backend Required · 100% Deterministic
          </span>
          <h2 className="font-display text-3xl font-bold md:text-4xl text-foreground">
            A Clearer Line From Aerial Evidence to Citizen Rights.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            ROOP-REKHA is primed for direct deployment to Vercel, Netlify, or Cloudflare Pages with
            complete offline mock data and responsive cross-device support.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild className="h-12 bg-brand-gradient px-8 font-bold shadow-brand">
              <Link to="/dashboard">
                Launch Command Centre <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
