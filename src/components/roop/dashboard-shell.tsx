import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  FileUp,
  Grid2X2,
  LandPlot,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Radar,
  ShieldCheck,
  Sun,
  Users,
  X,
  Shield,
  Building2,
  UserRound,
  MapPin,
  Eye,
  MoreHorizontal,
  Compass,
  Check,
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/upload", label: "Upload & Ingestion", icon: FileUp },
  { to: "/dashboard/extraction", label: "AI Parcel Extraction", icon: Bot },
  { to: "/dashboard/map", label: "Web-GIS Viewer", icon: Map },
  { to: "/dashboard/validation", label: "Topology & Validation", icon: ShieldCheck },
  { to: "/dashboard/encroachment", label: "Encroachment", icon: LandPlot },
  { to: "/dashboard/gnss", label: "GNSS Verification", icon: Radar },
  { to: "/dashboard/land-use", label: "Land-Use", icon: Grid2X2 },
  { to: "/dashboard/analytics", label: "Analytics & Reports", icon: BarChart3 },
  { to: "/dashboard/roles", label: "Role Panels", icon: Users },
] as const;

export const roles = [
  "Super Admin",
  "State Authority",
  "ULB Admin",
  "Field Surveyor",
  "Citizen",
] as const;

export type Role = (typeof roles)[number];

export interface RoleTheme {
  name: Role;
  icon: typeof Shield;
  scope: string;
  location: string;
  tagline: string;
  bannerClass: string;
  badgeClass: string;
  sidebarBorder: string;
  accentColor: string;
  ringColor: string;
}

export const roleThemes: Record<Role, RoleTheme> = {
  "Super Admin": {
    name: "Super Admin",
    icon: Shield,
    scope: "National Command",
    location: "MoHUA / DoLR National Mission",
    tagline: "Full Clearance · 157 ULBs · Model Tuning & Oversight",
    bannerClass: "bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 text-white shadow-md",
    badgeClass: "bg-violet-500/20 text-violet-300 border-violet-400/40",
    sidebarBorder: "border-l-4 border-l-violet-600",
    accentColor: "text-violet-500",
    ringColor: "ring-violet-500",
  },
  "State Authority": {
    name: "State Authority",
    icon: Building2,
    scope: "State Operations",
    location: "Madhya Pradesh Urban Dev Directorate",
    tagline: "State Clearance · 16 Municipal Corporations · Approvals Queue",
    bannerClass: "bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 text-white shadow-md",
    badgeClass: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    sidebarBorder: "border-l-4 border-l-teal-600",
    accentColor: "text-teal-500",
    ringColor: "ring-teal-500",
  },
  "ULB Admin": {
    name: "ULB Admin",
    icon: UserRound,
    scope: "Municipal Operations",
    location: "Indore Municipal Corporation (IMC)",
    tagline: "ULB Clearance · Ward 54 Execution · Encroachment Triage",
    bannerClass: "bg-gradient-to-r from-cyan-800 via-sky-700 to-blue-800 text-white shadow-md",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    sidebarBorder: "border-l-4 border-l-cyan-600",
    accentColor: "text-cyan-500",
    ringColor: "ring-cyan-500",
  },
  "Field Surveyor": {
    name: "Field Surveyor",
    icon: MapPin,
    scope: "Ground Ground-Truthing",
    location: "Ward 54 Rajwada Grid",
    tagline: "Field Rover Queue · DGPS Centimetre Corrections · Physical Audits",
    bannerClass: "bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white shadow-md",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    sidebarBorder: "border-l-4 border-l-amber-600",
    accentColor: "text-amber-500",
    ringColor: "ring-amber-500",
  },
  Citizen: {
    name: "Citizen",
    icon: Eye,
    scope: "Public Portal",
    location: "Citizen Cadastre Access",
    tagline: "Public Deeds · Verified Parcel Transparency · Citizen Grievance Submission",
    bannerClass: "bg-gradient-to-r from-rose-700 via-fuchsia-700 to-indigo-800 text-white shadow-md",
    badgeClass: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    sidebarBorder: "border-l-4 border-l-rose-500",
    accentColor: "text-rose-500",
    ringColor: "ring-rose-500",
  },
};

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
  theme: RoleTheme;
}>({
  role: "Super Admin",
  setRole: () => undefined,
  theme: roleThemes["Super Admin"],
});

export const useRole = () => useContext(RoleContext);

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [role, setRoleState] = useState<Role>("Super Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const { dark, toggle } = useTheme();

  const theme = roleThemes[role];

  // Keep the selected perspective stable as users move between dashboard modules.
  useEffect(() => {
    const savedRole = window.localStorage.getItem("roop-rekha-role");
    if (savedRole && roles.includes(savedRole as Role)) setRoleState(savedRole as Role);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    window.localStorage.setItem("roop-rekha-role", newRole);
    toast.info(`Active Profile: ${newRole}`, {
      description: roleThemes[newRole].tagline,
    });
  };

  const contextValue = useMemo(() => ({ role, setRole, theme }), [role, theme]);
  const RoleIcon = theme.icon;

  return (
    <RoleContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex lg:flex-col shadow-sm",
            collapsed ? "w-[76px]" : "w-64",
            theme.sidebarBorder
          )}
        >
          {/* Logo & Platform Name */}
          <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-4">
            <Link
              to="/"
              aria-label="ROOP-REKHA home"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-brand transition-transform hover:scale-105"
            >
              <LandPlot className="size-5" />
            </Link>
            {!collapsed && (
              <div>
                <p className="font-display text-lg font-bold tracking-tight">ROOP-REKHA</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Parcel Intelligence
                </p>
              </div>
            )}
          </div>

          {/* Active Role Indicator in Sidebar */}
          {!collapsed && (
            <div className="px-3 pt-3 pb-1">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 p-2.5">
                <span className={cn("grid size-8 place-items-center rounded-lg bg-background shadow-xs", theme.accentColor)}>
                  <RoleIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {theme.scope}
                  </span>
                  <span className="block text-xs font-bold text-foreground truncate">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard modules">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-brand"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Menu className="size-5" />
              {!collapsed && "Collapse menu"}
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl md:px-7">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </Button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  National Urban Digital Mission
                </p>
                <p className="hidden text-sm text-muted-foreground sm:block font-medium">
                  Cadastral Intelligence & AI Parcel Extraction Command
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Switcher in Navbar */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setRoleOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={roleOpen}
                  className={cn(
                    "flex items-center gap-2 font-semibold transition-all border-border shadow-xs",
                    `hover:${theme.ringColor}`
                  )}
                >
                  <RoleIcon className={cn("size-4", theme.accentColor)} />
                  <span className="hidden sm:inline font-bold text-xs">{role}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>

                {roleOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-popover p-2 shadow-2xl backdrop-blur-xl">
                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Switch Stakeholder Persona
                    </p>
                    <div className="space-y-1">
                      {roles.map((name) => {
                        const rTheme = roleThemes[name];
                        const RIcon = rTheme.icon;
                        const isCurrent = name === role;
                        return (
                          <button
                            key={name}
                            onClick={() => {
                              setRole(name);
                              setRoleOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-colors",
                              isCurrent
                                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                : "hover:bg-muted text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <RIcon className="size-4 shrink-0" />
                              <div>
                                <span className="block font-bold">{name}</span>
                                <span className={cn("text-[10px] block", isCurrent ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                  {rTheme.scope}
                                </span>
                              </div>
                            </div>
                            {isCurrent && <Check className="size-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
              >
                {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative"
                onClick={() => {
                  toast.info("Notifications", {
                    description: "3 new parcel overlap alerts flagged in Indore Ward 54.",
                  });
                }}
              >
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 animate-pulse" />
              </Button>
            </div>
          </header>

          {/* Dynamic Role-Sensitive Operational Banner */}
          <div className={cn("px-4 py-2.5 text-xs font-semibold md:px-7 transition-all duration-300", theme.bannerClass)}>
            <div className="flex flex-wrap items-center justify-between gap-2 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-2">
                <RoleIcon className="size-4 shrink-0" />
                <span>
                  <strong>{role}:</strong> {theme.tagline}
                </span>
              </div>
              <span className="text-[11px] opacity-90 hidden md:inline">
                {theme.location}
              </span>
            </div>
          </div>

          {/* Main Dashboard Router Outlet */}
          <main className="mx-auto max-w-[1600px] p-4 pb-24 md:p-7 lg:pb-8 animate-rise">
            {children}
          </main>
        </div>

        {/* Mobile Full Navigation Slide-out Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="h-full w-80 bg-sidebar p-5 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-sidebar-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-white">
                      <LandPlot className="size-5" />
                    </span>
                    <div>
                      <span className="font-display text-lg font-bold">ROOP-REKHA</span>
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
                        Cadastre Vision
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                {/* Role Switcher in Mobile Drawer */}
                <div className="mb-4 rounded-xl border border-border p-3 bg-muted/40">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">
                    Current Persona
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={cn(
                          "rounded-lg p-2 text-left text-xs font-semibold transition-colors",
                          r === role ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                        pathname === item.to
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-sidebar-border pt-4 text-center text-xs text-muted-foreground">
                ROOP-REKHA · Urban Parcel Intelligence
              </div>
            </aside>
          </div>
        )}

        {/* Mobile Responsive Bottom Navigation Bar */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-2 py-2 backdrop-blur-xl lg:hidden shadow-xl"
          aria-label="Mobile quick navigation"
        >
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 text-[9px] font-bold py-1 rounded-lg transition-colors",
                pathname === item.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1 text-[9px] font-bold py-1 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </RoleContext.Provider>
  );
}
