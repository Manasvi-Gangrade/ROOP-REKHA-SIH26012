import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("glass-panel rounded-2xl p-5", className)} {...props}>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status.toLowerCase().includes("approv") || status === "Processed" || status === "Resolved"
      ? "bg-approved-soft text-approved"
      : status.toLowerCase().includes("disput") || status.toLowerCase().includes("flag")
        ? "bg-disputed-soft text-disputed"
        : "bg-pending-soft text-pending";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tone)}>
      {status}
    </span>
  );
}
