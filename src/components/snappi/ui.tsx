import type { ReactNode } from "react";
import { X, Leaf } from "lucide-react";
import { esgCategory, type EsgCategory } from "@/lib/snappi/data";
import { cn } from "@/lib/utils";

const catStyles: Record<EsgCategory, string> = {
  HIGH: "text-esg-high bg-esg-high/12 ring-esg-high/30",
  MEDIUM: "text-esg-medium bg-esg-medium/12 ring-esg-medium/30",
  LOW: "text-esg-low bg-esg-low/12 ring-esg-low/30",
};
export const catText: Record<EsgCategory, string> = {
  HIGH: "text-esg-high",
  MEDIUM: "text-esg-medium",
  LOW: "text-esg-low",
};
export const catBg: Record<EsgCategory, string> = {
  HIGH: "bg-esg-high",
  MEDIUM: "bg-esg-medium",
  LOW: "bg-esg-low",
};

export function EsgBadge({ score, compact }: { score: number; compact?: boolean }) {
  const c = esgCategory(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ring-1",
        catStyles[c],
      )}
    >
      <Leaf className="h-2.5 w-2.5" />
      ESG {score}
      {!compact && <span className="opacity-70">• {c}</span>}
    </span>
  );
}

export function ScoreRing({
  value,
  max,
  size = 132,
  stroke = 10,
  children,
  colorClass = "text-esg-high",
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  colorClass?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={cn(colorClass, "transition-[stroke-dashoffset] duration-1000 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function Progress({ value, className, barClass = "bg-esg-high" }: { value: number; className?: string; barClass?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-700", barClass)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Close" className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative max-h-[92%] overflow-y-auto no-scrollbar rounded-t-3xl border-t border-border bg-popover px-5 pb-8 pt-3 animate-sheet">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full bg-surface p-1.5 tap" aria-label="Close sheet">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className={cn("block w-full rounded-2xl border border-border bg-card p-4 text-left", onClick && "tap", className)}>
      {children}
    </Comp>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn("rounded-md bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", className)}>
      Demo rate
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function MerchantAvatar({ name, score }: { name: string; score: number }) {
  const c = esgCategory(score);
  return (
    <div className="relative">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-sm font-semibold">
        {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
      </div>
      <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card", catBg[c])} />
    </div>
  );
}
