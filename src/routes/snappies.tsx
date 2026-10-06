import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/snappi/Shell";
import { SnappiTree } from "@/components/snappi/SnappiTree";
import { Card, SectionTitle, Progress, Sheet, EsgBadge, catText } from "@/components/snappi/ui";
import { useSnappi } from "@/lib/snappi/store";
import { REWARDS, SNAPPIE_RATE, TREE_STAGES, esgCategory, merchantById, snappiesFor, treeStage, fmtEur, type Reward } from "@/lib/snappi/data";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/snappies")({
  head: () => meta("Snappies & your Snappi Tree — Snappi", "Earn Snappies faster at high-ESG merchants, grow your Snappi Tree and redeem rewards like planting a real tree."),
  component: SnappiesPage,
});

function SnappiesPage() {
  const s = useSnappi();
  const { idx, next } = treeStage(s.snappies);
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const [success, setSuccess] = useState<Reward | null>(null);
  const [tab, setTab] = useState<"history" | "redeem">("history");

  return (
    <div className="animate-in fade-in">
      <SubHeader title="Snappies" />
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Card className="p-3"><p className="text-xl font-semibold tabular-nums text-accent">{s.snappies.toLocaleString("en")}</p><p className="text-[10px] text-muted-foreground">Balance</p></Card>
          <Card className="p-3"><p className="text-xl font-semibold">+{s.monthlySnappies}</p><p className="text-[10px] text-muted-foreground">This month</p></Card>
          <Card className="p-3"><p className="text-xl font-semibold tabular-nums">{s.lifetimeSnappies.toLocaleString("en")}</p><p className="text-[10px] text-muted-foreground">Lifetime</p></Card>
        </div>

        <div className="mt-4 rounded-3xl border border-border bg-card bg-gradient-esg p-5">
          <p className="text-[11px] tracking-wider text-muted-foreground">YOUR SNAPPIES TREE</p>
          <p className="text-xl font-semibold">{TREE_STAGES[idx]!.name}</p>
          <SnappiTree snappies={s.snappies} size={260} />
          {next ? (
            <>
              <div className="mb-1.5 flex justify-between text-xs"><span className="tabular-nums">{s.snappies.toLocaleString("en")} / {next.min.toLocaleString("en")}</span><span className="text-muted-foreground">Next: {next.name}</span></div>
              <Progress value={((s.snappies - TREE_STAGES[idx]!.min) / (next.min - TREE_STAGES[idx]!.min)) * 100} barClass="bg-leaf" />
              <p className="mt-2 text-xs text-muted-foreground">{(next.min - s.snappies).toLocaleString("en")} Snappies until your tree reaches the next stage.</p>
            </>
          ) : <p className="text-center text-sm text-accent">Your tree is fully grown 🌳</p>}
          <div className="mt-4 flex justify-between">
            {TREE_STAGES.map((t, i) => (
              <div key={t.name} className="flex flex-col items-center gap-1">
                <span className={cn("h-2 w-2 rounded-full", i <= idx ? "bg-leaf" : "bg-muted")} />
                <span className={cn("text-[9px]", i === idx ? "text-foreground" : "text-muted-foreground")}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <SectionTitle>How you earn</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {(["HIGH", "MEDIUM", "LOW"] as const).map((c) => (
            <Card key={c} className="p-3 text-center">
              <p className={cn("text-[10px] font-bold", catText[c])}>{c} ESG</p>
              <p className="mt-1 text-lg font-semibold">€{SNAPPIE_RATE[c]}</p>
              <p className="text-[10px] text-muted-foreground">→ 1 Snappie</p>
              <div className="mt-2 flex justify-center gap-0.5">{Array.from({ length: 30 / SNAPPIE_RATE[c] }).map((_, i) => <span key={i}>🌱</span>)}</div>
              <p className="text-[9px] text-muted-foreground">per €30</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex rounded-full bg-card p-1">
          {(["history", "redeem"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
              {t === "history" ? "History" : "Redeem Snappies"}
            </button>
          ))}
        </div>

        {tab === "history" ? (
          <div className="mt-3 space-y-2">
            {s.transactions.map((t) => {
              const m = merchantById(t.merchantId);
              const c = esgCategory(m.esg);
              return (
                <Card key={t.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{m.name} <span className="text-muted-foreground">· {fmtEur(t.amount)}</span></p>
                    <div className="mt-1"><EsgBadge score={m.esg} /></div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{fmtEur(t.amount)} ÷ €{SNAPPIE_RATE[c]} = {snappiesFor(t.amount, m.esg)}</p>
                  </div>
                  <p className="text-lg font-semibold text-accent">+{snappiesFor(t.amount, m.esg)}</p>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {REWARDS.map((r) => {
              const can = s.snappies >= r.cost;
              return (
                <Card key={r.id} className={cn("flex items-center gap-3", r.featured && "border-esg-high/40 bg-gradient-esg")}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-2xl">{r.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground">{r.note}</p>
                    <p className="mt-0.5 text-xs font-semibold text-accent">{r.cost.toLocaleString("en")} Snappies</p>
                  </div>
                  <button disabled={!can} onClick={() => setConfirm(r)} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground tap disabled:bg-surface disabled:text-muted-foreground">
                    {can ? "Redeem" : `${r.cost - s.snappies} more`}
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title="Confirm redemption">
        {confirm && (
          <div className="text-center">
            <p className="text-5xl">{confirm.emoji}</p>
            <p className="mt-3 text-lg font-semibold">{confirm.title}</p>
            <p className="text-sm text-muted-foreground">{confirm.cost} Snappies · balance after: {(s.snappies - confirm.cost).toLocaleString("en")}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Demo only — no real voucher is issued.</p>
            <button
              onClick={() => { if (s.redeem(confirm.id, confirm.cost)) setSuccess(confirm); setConfirm(null); }}
              className="mt-5 w-full rounded-full bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground tap"
            >Redeem now</button>
          </div>
        )}
      </Sheet>
      <Sheet open={!!success} onClose={() => setSuccess(null)} title="">
        {success && (
          <div className="py-4 text-center animate-in zoom-in-95">
            <p className="text-6xl">{success.emoji}</p>
            <p className="mt-4 text-xl font-semibold">{success.id === "tree" ? "A tree will be planted in your name 🌍" : "Reward redeemed!"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{success.title}</p>
            <button onClick={() => setSuccess(null)} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground tap">Done</button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
