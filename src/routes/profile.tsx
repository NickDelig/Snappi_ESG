import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, Lightbulb } from "lucide-react";
import { SubHeader } from "@/components/snappi/Shell";
import { Card, SectionTitle, catBg } from "@/components/snappi/ui";
import { useSheets } from "@/components/snappi/sheets-context";
import { useSnappi } from "@/lib/snappi/store";
import { SCORE_HISTORY, esgCategory, merchantById, treeStage, type EsgCategory } from "@/lib/snappi/data";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => meta("My sustainability dashboard — Snappi", "Your ESG Score trend, spending mix by ESG category and personalised insights."),
  component: ProfilePage,
});

function ProfilePage() {
  const s = useSnappi();
  const { openDemo } = useSheets();
  const data = [...SCORE_HISTORY, { m: "Oct", v: s.score }];
  const [sel, setSel] = useState(data.length - 1);

  const totals: Record<EsgCategory, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  s.transactions.forEach((t) => (totals[esgCategory(merchantById(t.merchantId).esg)] += t.amount));
  const sum = totals.HIGH + totals.MEDIUM + totals.LOW;
  const pct = (c: EsgCategory) => Math.round((totals[c] / sum) * 100);

  const min = 600, max = 850;
  const pts = data.map((d, i) => [20 + (i * 280) / (data.length - 1), 120 - ((d.v - min) / (max - min)) * 100]);

  return (
    <div className="animate-in fade-in">
      <SubHeader
        title=""
        right={
          <button onClick={openDemo} className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground tap">
            <FlaskConical className="h-3.5 w-3.5" />Demo mode
          </button>
        }
      />
      <div className="px-4">
        <h1 className="text-3xl font-semibold">Hello, Nick</h1>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/esg" className="rounded-2xl border border-border bg-card p-4 tap"><p className="text-[11px] text-muted-foreground">ESG Score</p><p className="text-2xl font-semibold">{s.score}<span className="text-sm text-muted-foreground"> / 1000</span></p></Link>
          <Link to="/esg" className="rounded-2xl border border-border bg-card p-4 tap"><p className="text-[11px] text-muted-foreground">Tier</p><p className="text-2xl font-bold text-esg-high">{s.tier.id}</p></Link>
          <Link to="/snappies" className="rounded-2xl border border-border bg-card p-4 tap"><p className="text-[11px] text-muted-foreground">Snappies</p><p className="text-2xl font-semibold text-accent">{s.snappies.toLocaleString("en")}</p></Link>
          <Link to="/snappies" className="rounded-2xl border border-border bg-card p-4 tap"><p className="text-[11px] text-muted-foreground">Tree level</p><p className="text-lg font-semibold">{treeStage(s.snappies).stage.name}</p></Link>
        </div>

        <SectionTitle>ESG Score · last 6 months</SectionTitle>
        <Card>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-semibold tabular-nums">{data[sel]!.v}</p>
            <p className="text-xs text-muted-foreground">{data[sel]!.m} · this month {s.monthDelta >= 0 ? "+" : ""}{s.monthDelta}</p>
          </div>
          <svg viewBox="0 0 320 140" className="mt-2 w-full">
            <defs>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="text-esg-high">
              <path d={`M${pts.map((p) => p.join(",")).join(" L")} L300,130 L20,130 Z`} fill="url(#area)" />
              <path d={`M${pts.map((p) => p.join(",")).join(" L")}`} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              {pts.map(([x, y], i) => (
                <g key={i} onClick={() => setSel(i)} className="cursor-pointer">
                  <circle cx={x} cy={y} r="14" fill="transparent" />
                  <circle cx={x} cy={y} r={i === sel ? 6 : 3.5} className={i === sel ? "fill-foreground" : "fill-current"} />
                </g>
              ))}
            </g>
            {data.map((d, i) => (
              <text key={d.m} x={pts[i]![0]} y="138" textAnchor="middle" className="fill-muted-foreground text-[10px]">{d.m}</text>
            ))}
          </svg>
        </Card>

        <SectionTitle>Spending by ESG category</SectionTitle>
        <Card>
          <div className="flex h-3 overflow-hidden rounded-full">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((c) => <div key={c} className={cn(catBg[c], "transition-all duration-700")} style={{ width: `${pct(c)}%` }} />)}
          </div>
          <div className="mt-3 grid grid-cols-3 text-center">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((c) => (
              <div key={c}><p className="text-xl font-semibold">{pct(c)}%</p><p className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground"><span className={cn("h-2 w-2 rounded-full", catBg[c])} />{c} ESG</p></div>
            ))}
          </div>
        </Card>

        <SectionTitle>ESG Insights</SectionTitle>
        <div className="space-y-2">
          {[
            "Based on your demo spending profile, your spending at high-ESG merchants increased 18% this month.",
            `You earned 42 more Snappies than last month.`,
            s.nextTier ? `You're ${s.nextTier.min - s.score} points away from ${s.nextTier.id}.` : "You've reached the top tier — keep it up!",
            "Switching €50 of monthly spending from low-ESG to high-ESG merchants could triple the Snappies you earn on it.",
          ].map((t) => (
            <Card key={t} className="flex gap-3">
              <Lightbulb className="h-4 w-4 shrink-0 text-esg-medium" />
              <p className="text-sm text-muted-foreground">{t}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] text-muted-foreground">You choose where you spend. Snappi just shows you the ESG profile and rewards better choices.</p>
      </div>
    </div>
  );
}
