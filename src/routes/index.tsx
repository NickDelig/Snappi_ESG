import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, Eye, EyeOff, LayoutGrid, Plus, Wallet, Check, Leaf } from "lucide-react";
import { TopBar } from "@/components/snappi/Shell";
import { ScoreRing, SectionTitle, DemoTag, Progress, Card } from "@/components/snappi/ui";
import { TxRow } from "@/components/snappi/TxRow";
import { useSheets } from "@/components/snappi/sheets-context";
import { useSnappi } from "@/lib/snappi/store";
import { BASE_LOAN, BASE_SAVINGS, fmtEur, treeStage } from "@/lib/snappi/data";
import { SnappiTree } from "@/components/snappi/SnappiTree";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => meta("Snappi ESG", "Your Snappi accounts, personal ESG Score and Snappies rewards in one place. Climathon demo."),
  component: HomePage,
});

function HomePage() {
  const s = useSnappi();
  const { openPay } = useSheets();
  const [hidden, setHidden] = useState(false);
  const [slide, setSlide] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const total = s.paymentsBalance + 8579.26 + 2500;

  const accounts = [
    { name: "Payments account", sub: "Payment Account", bal: s.paymentsBalance, cls: "bg-gradient-primary", status: "Active", action: "Add money", extra: null as ReactNode },
    {
      name: "Savings account", sub: "Instant access", bal: 8579.26, cls: "bg-gradient-savings", status: "Earning", action: "Deposit",
      extra: <span>{s.tier.savings.toFixed(2)}% APY <span className="text-accent">(+{(s.tier.savings - BASE_SAVINGS).toFixed(2)}% ESG)</span></span>,
    },
    {
      name: "Personal loan", sub: "€2,500 remaining", bal: 2500, cls: "bg-gradient-loan", status: "On track", action: "Repay",
      extra: <span>{s.tier.loan.toFixed(2)}% rate <span className="text-accent">(-{(BASE_LOAN - s.tier.loan).toFixed(2)}% ESG)</span></span>,
    },
  ];

  const toNext = s.nextTier ? s.nextTier.min - s.score : 0;
  const tree = treeStage(s.snappies);

  return (
    <div className="animate-in fade-in">
      <TopBar />
      <div className="mt-6 text-center">
        <p className="text-xs font-medium tracking-wider">TOTAL BALANCE</p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <p className="text-[44px] font-light tabular-nums leading-tight">{hidden ? "••••••" : fmtEur(total)}</p>
          <button onClick={() => setHidden(!hidden)} aria-label="Toggle balance" className="tap text-muted-foreground">
            {hidden ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth * 0.82)))}
        className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar px-6"
      >
        {accounts.map((a) => (
          <div key={a.name} className={cn("relative w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl p-5 shadow-glow", a.cls)}>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-semibold text-primary-foreground">{a.name}</p>
                <p className="text-xs text-primary-foreground/75">{a.sub}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-background/25 px-2 py-0.5 text-[10px] text-primary-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />{a.status}
              </span>
            </div>
            <p className="mt-4 text-2xl font-light tabular-nums text-primary-foreground">{hidden ? "••••" : fmtEur(a.bal)}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-primary-foreground/85">
              <span>{a.extra ?? "**** 8158 · Mastercard debit"}</span>
              <button className="rounded-full bg-background/25 px-3 py-1 font-semibold tap">{a.action}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {accounts.map((_, i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-all", i === slide ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40")} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 px-5">
        {[
          { l: "Add", I: Plus, f: () => {} },
          { l: "Send", I: ArrowRight, f: () => {} },
          { l: "Pay", I: Wallet, f: () => openPay() },
          { l: "More", I: LayoutGrid, f: () => {} },
        ].map(({ l, I, f }) => (
          <button key={l} onClick={f} className="flex flex-col items-center gap-2 tap">
            <span className={cn("flex h-14 w-14 items-center justify-center rounded-full", l === "Pay" ? "bg-primary text-primary-foreground shadow-glow" : "bg-card")}>
              <I className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span className="text-xs">{l}</span>
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* ESG score */}
        <Link to="/esg" className="mt-7 block rounded-3xl border border-border bg-card bg-gradient-esg p-5 tap">
          <div className="flex items-center gap-5">
            <ScoreRing value={s.score} max={1000} size={116}>
              <span className="text-3xl font-semibold tabular-nums">{s.score}</span>
              <span className="text-[10px] text-muted-foreground">/ 1000</span>
            </ScoreRing>
            <div className="flex-1">
              <p className="text-[11px] font-medium tracking-wider text-muted-foreground">YOUR ESG SCORE</p>
              <p className="mt-1 text-xl font-bold tracking-wide text-esg-high">{s.tier.id}</p>
              <p className="mt-1 text-xs text-muted-foreground">You're making a positive impact with your everyday spending.</p>
              <p className="mt-2 text-xs font-semibold text-accent">{s.monthDelta >= 0 ? "+" : ""}{s.monthDelta} points this month</p>
              <p className="text-[11px] text-muted-foreground">12% better than your previous month</p>
            </div>
          </div>
          {s.nextTier && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[11px]">
                <span>{s.tier.id} · {s.score} / {s.nextTier.min}</span>
                <span className="text-muted-foreground">{toNext} pts to {s.nextTier.id}</span>
              </div>
              <Progress value={((s.score - s.tier.min) / (s.nextTier.min - s.tier.min)) * 100} />
            </div>
          )}
        </Link>

        {/* Snappies */}
        <Link to="/snappies" className="mt-3 flex items-center gap-3 overflow-hidden rounded-3xl border border-border bg-card p-4 tap">
          <div className="-my-4 -ml-4"><SnappiTree snappies={s.snappies} size={110} /></div>
          <div className="flex-1">
            <p className="text-[11px] font-medium tracking-wider text-muted-foreground">🌱 SNAPPIES</p>
            <p className="text-3xl font-semibold tabular-nums">{s.snappies.toLocaleString("en")}</p>
            <p className="text-xs text-accent">+{s.monthlySnappies} this month</p>
            <p className="text-[11px] text-muted-foreground">{tree.stage.name}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        {/* Benefits */}
        <SectionTitle action={<Link to="/esg" className="text-xs text-primary-glow">View all benefits</Link>}>Your ESG Benefits</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Savings</p><DemoTag /></div>
            <p className="mt-2 text-2xl font-semibold">{s.tier.savings.toFixed(2)}%</p>
            <p className="text-[11px] text-muted-foreground">APY</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-esg-high"><Check className="h-3 w-3" />+{(s.tier.savings - BASE_SAVINGS).toFixed(2)}% ESG bonus</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Personal Loan</p><DemoTag /></div>
            <p className="mt-2 text-2xl font-semibold">{s.tier.loan.toFixed(2)}%</p>
            <p className="text-[11px] text-muted-foreground">Interest rate</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-esg-high"><Check className="h-3 w-3" />{(BASE_LOAN - s.tier.loan).toFixed(2)}% ESG discount</p>
          </Card>
        </div>

        {/* Transactions */}
        <SectionTitle action={<Link to="/transactions" className="text-xs text-primary-glow">View all transactions</Link>}>Transactions</SectionTitle>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-3">
          {s.transactions.slice(0, 4).map((t) => <TxRow key={t.id} tx={t} />)}
        </div>

        {/* Promo */}
        <div className="mt-6 flex snap-x gap-3 overflow-x-auto no-scrollbar">
          <Link to="/pay-later" className="w-[85%] shrink-0 snap-center rounded-2xl border border-border bg-card p-4 tap">
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">Cash Now</span>
            <p className="mt-3 font-semibold">Boost your income today</p>
            <p className="mt-1 text-xs text-muted-foreground">Get up to 80% of your salary in Snappi. Pay back in 3 instalments.</p>
          </Link>
          <Link to="/snappies" className="w-[85%] shrink-0 snap-center rounded-2xl border border-border bg-card bg-gradient-esg p-4 tap">
            <span className="flex w-fit items-center gap-1 rounded-full bg-esg-high/20 px-2.5 py-1 text-[10px] font-bold text-esg-high"><Leaf className="h-3 w-3" />New</span>
            <p className="mt-3 font-semibold">Plant a real tree with 300 Snappies</p>
            <p className="mt-1 text-xs text-muted-foreground">Redeem your rewards for things that matter.</p>
          </Link>
        </div>
        <p className="mt-6 text-center text-[10px] text-muted-foreground">Climathon prototype · all data and rates are demo values</p>
      </div>
    </div>
  );
}
