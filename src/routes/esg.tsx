import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock, Info } from "lucide-react";
import { SubHeader } from "@/components/snappi/Shell";
import { ScoreRing, Progress, Card, SectionTitle, DemoTag } from "@/components/snappi/ui";
import { useSnappi } from "@/lib/snappi/store";
import { BASE_LOAN, BASE_SAVINGS, TIERS } from "@/lib/snappi/data";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/esg")({
  head: () => meta("Your ESG Score & Benefits — Snappi", "See how your spending shapes your ESG Score, your tier and the better savings and loan rates it unlocks."),
  component: EsgPage,
});

function EsgPage() {
  const s = useSnappi();
  const idx = TIERS.indexOf(s.tier);
  return (
    <div className="animate-in fade-in">
      <SubHeader title="ESG Benefits" />
      <div className="px-4">
        <div className="flex flex-col items-center rounded-3xl border border-border bg-card bg-gradient-esg p-6">
          <ScoreRing value={s.score} max={1000} size={170} stroke={12}>
            <span className="text-5xl font-semibold tabular-nums">{s.score}</span>
            <span className="text-xs text-muted-foreground">Current ESG Score</span>
          </ScoreRing>
          <p className="mt-4 text-[11px] tracking-wider text-muted-foreground">CURRENT TIER</p>
          <p className="text-2xl font-bold tracking-wide text-esg-high">{s.tier.id}</p>
          {s.nextTier ? (
            <div className="mt-4 w-full">
              <div className="mb-1.5 flex justify-between text-xs"><span>{s.score} / {s.nextTier.min}</span><span className="text-muted-foreground">{s.nextTier.min - s.score} points until {s.nextTier.id}</span></div>
              <Progress value={((s.score - s.tier.min) / (s.nextTier.min - s.tier.min)) * 100} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-accent">Top tier reached 🎉</p>
          )}
        </div>

        {/* Tier ladder */}
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {TIERS.map((t, i) => (
            <div key={t.id} className={cn("rounded-xl border p-2 text-center", i === idx ? "border-esg-high bg-esg-high/10" : "border-border bg-card", i > idx && "opacity-60")}>
              {i <= idx ? <Check className="mx-auto h-3.5 w-3.5 text-esg-high" /> : <Lock className="mx-auto h-3.5 w-3.5" />}
              <p className="mt-1 text-[10px] font-bold">{t.id}</p>
              <p className="text-[9px] text-muted-foreground">{t.min}–{t.max}</p>
            </div>
          ))}
        </div>

        <SectionTitle>Your {s.tier.id} tier</SectionTitle>
        <div className="space-y-2">
          {[
            ["Higher savings interest", `${s.tier.savings.toFixed(2)}% APY · +${(s.tier.savings - BASE_SAVINGS).toFixed(2)}% ESG bonus`],
            ["Lower loan interest", `${s.tier.loan.toFixed(2)}% · ${(BASE_LOAN - s.tier.loan).toFixed(2)}% ESG discount`],
            ["Snappies rewards multiplier", `${s.tier.multiplier} on partner offers`],
          ].map(([a, b]) => (
            <Card key={a} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-esg-high/15"><Check className="h-4 w-4 text-esg-high" /></span>
              <div><p className="text-sm font-medium">{a}</p><p className="text-xs text-muted-foreground">{b}</p></div>
            </Card>
          ))}
        </div>

        {s.nextTier && (
          <>
            <SectionTitle>Next tier: {s.nextTier.id}</SectionTitle>
            <Card className="border-dashed">
              <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" />{s.nextTier.min} ESG Score required</div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>+{(s.nextTier.savings - BASE_SAVINGS).toFixed(2)}% savings bonus ({s.nextTier.savings.toFixed(2)}% APY)</li>
                <li>-{(BASE_LOAN - s.nextTier.loan).toFixed(2)}% loan discount ({s.nextTier.loan.toFixed(2)}%)</li>
                <li>Higher rewards potential ({s.nextTier.multiplier})</li>
              </ul>
            </Card>
          </>
        )}

        <SectionTitle action={<DemoTag />}>All tiers</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-border bg-card text-sm">
          <div className="grid grid-cols-3 bg-surface px-4 py-2 text-[11px] text-muted-foreground"><span>Tier</span><span>Savings APY</span><span>Loan rate</span></div>
          {TIERS.map((t, i) => (
            <div key={t.id} className={cn("grid grid-cols-3 px-4 py-3", i === idx && "bg-esg-high/10")}>
              <span className="flex items-center gap-1.5 font-semibold">{i <= idx ? <Check className="h-3.5 w-3.5 text-esg-high" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}{t.id}</span>
              <span>{t.savings.toFixed(2)}%</span>
              <span>{t.loan.toFixed(2)}%</span>
            </div>
          ))}
        </div>

        <SectionTitle>How is my ESG Score calculated?</SectionTitle>
        <Card>
          <p className="text-sm text-muted-foreground">Your score reflects the ESG performance of the companies you spend money with. Spending more with higher-ESG merchants gradually improves your score.</p>
          <p className="mt-3 flex gap-1.5 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5 shrink-0" />Your transaction-weighted merchant scores are blended with a six-month baseline, so one purchase does not swing your score dramatically.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
            {["Inform", "Reward", "Improve"].map((x, i) => (
              <div key={x} className="rounded-xl bg-surface p-2"><p className="font-bold text-primary-glow">{i + 1}</p>{x}</div>
            ))}
          </div>
        </Card>
        <p className="mt-6 text-center text-[10px] text-muted-foreground">All rates are prototype/demo values and not an offer.</p>
      </div>
    </div>
  );
}
