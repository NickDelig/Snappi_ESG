import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Info, RotateCcw } from "lucide-react";
import { MERCHANTS, merchantById, esgCategory, snappiesFor, SNAPPIE_RATE, fmtEur } from "@/lib/snappi/data";
import { useSnappi } from "@/lib/snappi/store";
import { Sheet, EsgBadge, Progress, catText, catBg, MerchantAvatar } from "./ui";
import { cn } from "@/lib/utils";

export function TxDetailSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { transactions } = useSnappi();
  const tx = transactions.find((t) => t.id === id);
  if (!tx) return <Sheet open={false} onClose={onClose}>{null}</Sheet>;
  const m = merchantById(tx.merchantId);
  const cat = esgCategory(m.esg);
  const sn = snappiesFor(tx.amount, m.esg);
  const pts = cat === "HIGH" ? Math.floor(tx.amount / 10) : cat === "MEDIUM" ? Math.floor(tx.amount / 50) : 0;
  return (
    <Sheet open onClose={onClose} title="Transaction">
      <div className="flex flex-col items-center py-2 text-center">
        <MerchantAvatar name={m.name} score={m.esg} />
        <p className="mt-3 text-sm text-muted-foreground">{m.name}</p>
        <p className="text-4xl font-light tabular-nums">-{fmtEur(tx.amount)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{tx.date} · {tx.method}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 bg-gradient-esg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Company ESG Score</p>
            <p className="mt-1 text-3xl font-semibold">{m.esg}<span className="text-base text-muted-foreground"> / 100</span></p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold text-background", catBg[cat])}>{cat}</span>
        </div>
        <p className="mt-4 text-sm font-medium">Why this score?</p>
        <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
        <div className="mt-3 space-y-2.5">
          {[["Environmental", m.e], ["Social", m.s], ["Governance", m.g]].map(([k, v]) => (
            <div key={k as string}>
              <div className="mb-1 flex justify-between text-xs"><span>{k}</span><span className="tabular-nums">{v}</span></div>
              <Progress value={v as number} barClass={catBg[esgCategory(v as number)]} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Your impact from this purchase</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface p-3"><p className={cn("text-xl font-semibold", catText[cat])}>+{pts}</p><p className="text-xs text-muted-foreground">ESG points</p></div>
          <div className="rounded-xl bg-surface p-3"><p className="text-xl font-semibold text-accent">+{sn} 🌱</p><p className="text-xs text-muted-foreground">Snappies</p></div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {fmtEur(tx.amount)} ÷ €{SNAPPIE_RATE[cat]} = {sn} Snappies, because {m.name} has {cat} ESG.
        </p>
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">Demo ESG data for illustration only.</p>
    </Sheet>
  );
}

const ACCOUNTS = ["Payments Account •• 8158", "Snappi Pay Later"];

export function PaySheet({ open, initialMerchant, onClose }: { open: boolean; initialMerchant?: string | undefined; onClose: () => void }) {
  const { previewPurchase, addPurchase, score, paymentsBalance } = useSnappi();
  const [merchantId, setMerchantId] = useState(initialMerchant ?? "public");
  const [amount, setAmount] = useState("60");
  const [acct, setAcct] = useState(ACCOUNTS[0]);
  const [done, setDone] = useState<null | { snappies: number; esgDelta: number; amount: number }>(null);

  useEffect(() => {
    if (open) {
      setDone(null);
      if (initialMerchant) setMerchantId(initialMerchant);
    }
  }, [open, initialMerchant]);

  const amt = Math.max(0, parseFloat(amount.replace(",", ".")) || 0);
  const m = merchantById(merchantId);
  const cat = esgCategory(m.esg);
  const p = previewPurchase(merchantId, amt);

  if (done)
    return (
      <Sheet open={open} onClose={onClose} title="">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-esg-high/15 shadow-leaf animate-in zoom-in">
            <svg viewBox="0 0 40 40" className="h-10 w-10"><path d="M10 21 l7 7 l14 -15" className="stroke-esg-high animate-check" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Payment successful</p>
          <p className="text-4xl font-light tabular-nums">{fmtEur(done.amount)}</p>
          <div className="mt-6 flex gap-3">
            <span className="rounded-full bg-accent/15 px-4 py-2 text-sm font-semibold text-accent animate-in fade-in slide-in-from-bottom-2 delay-200 fill-mode-both">+{done.snappies} Snappies 🌱</span>
            <span className={cn("rounded-full bg-surface px-4 py-2 text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 delay-300 fill-mode-both", done.esgDelta >= 0 ? "text-esg-high" : "text-esg-low")}>
              {done.esgDelta >= 0 ? "+" : ""}{done.esgDelta} ESG points
            </span>
          </div>
          <p className="mt-5 text-base font-medium">{done.snappies > 0 ? "Your Snappi Tree grew!" : "Every purchase counts towards your tree."}</p>
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <Link to="/snappies" onClick={onClose} className="rounded-full bg-surface py-3 text-sm font-semibold tap">See my tree</Link>
            <button onClick={onClose} className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground tap">Done</button>
          </div>
        </div>
      </Sheet>
    );

  return (
    <Sheet open={open} onClose={onClose} title="Pay">
      <div className="rounded-2xl bg-card p-4 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount</p>
        <div className="mt-1 flex items-center justify-center text-4xl font-light">
          <span className="text-muted-foreground">€</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-36 bg-transparent text-center tabular-nums outline-none"
            aria-label="Amount"
          />
        </div>
      </div>

      <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-muted-foreground">Merchant</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {MERCHANTS.map((x) => (
          <button
            key={x.id}
            onClick={() => setMerchantId(x.id)}
            className={cn("shrink-0 rounded-xl border px-3 py-2 text-left tap", x.id === merchantId ? "border-primary bg-primary/15" : "border-border bg-card")}
          >
            <p className="text-sm font-medium">{x.name}</p>
            <p className={cn("text-[10px] font-semibold", catText[esgCategory(x.esg)])}>ESG {x.esg}</p>
          </button>
        ))}
      </div>

      <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-muted-foreground">Pay with</p>
      <div className="grid grid-cols-2 gap-2">
        {ACCOUNTS.map((a) => (
          <button key={a} onClick={() => setAcct(a)} className={cn("rounded-xl border px-3 py-2.5 text-left text-xs tap", a === acct ? "border-primary bg-primary/15" : "border-border bg-card")}>
            {a}
            {a === ACCOUNTS[0] && <span className="block text-muted-foreground">{fmtEur(paymentsBalance)}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-4 bg-gradient-esg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Merchant ESG</p>
            <p className="text-2xl font-semibold">{m.esg}<span className="text-sm text-muted-foreground"> / 100</span></p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold text-background", catBg[cat])}>{cat} ESG</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface/80 p-3">
            <p className="text-[11px] text-muted-foreground">You'll earn</p>
            <p className="text-lg font-semibold text-accent">+{p.snappies} Snappies</p>
            <p className="text-[10px] text-muted-foreground">€{SNAPPIE_RATE[cat]} → 1 Snappie</p>
          </div>
          <div className="rounded-xl bg-surface/80 p-3">
            <p className="text-[11px] text-muted-foreground">Your ESG Score</p>
            <p className={cn("text-lg font-semibold", p.esgDelta >= 0 ? "text-esg-high" : "text-esg-low")}>{p.esgDelta >= 0 ? "+" : ""}{p.esgDelta} points</p>
            <p className="text-[10px] text-muted-foreground">{score} → {score + p.esgDelta}</p>
          </div>
        </div>
        {cat !== "HIGH" && (
          <p className="mt-3 flex gap-1.5 text-[11px] text-muted-foreground"><Info className="h-3.5 w-3.5 shrink-0" />You choose where you spend. High-ESG merchants earn Snappies up to 3× faster.</p>
        )}
      </div>

      <button
        disabled={amt <= 0}
        onClick={() => {
          const ev = addPurchase(merchantId, amt, acct);
          setDone({ snappies: ev.snappies, esgDelta: ev.esgDelta, amount: amt });
        }}
        className="mt-5 w-full rounded-full bg-gradient-primary py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-glow tap disabled:opacity-40"
      >
        Confirm payment
      </button>
    </Sheet>
  );
}

export function DemoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPurchase, score, tier, snappies, reset, lastEarn } = useSnappi();
  const [merchantId, setMerchantId] = useState("ecowear");
  const [amount, setAmount] = useState(100);
  const m = merchantById(merchantId);
  return (
    <Sheet open={open} onClose={onClose} title="Demo mode">
      <p className="text-xs text-muted-foreground">Presenter controls. Add mock purchases and watch every number update live.</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-card p-3"><p className="text-xl font-semibold tabular-nums">{score}</p><p className="text-[10px] text-muted-foreground">ESG score</p></div>
        <div className="rounded-xl bg-card p-3"><p className="text-sm font-bold pt-1">{tier.id}</p><p className="text-[10px] text-muted-foreground pt-1">Tier</p></div>
        <div className="rounded-xl bg-card p-3"><p className="text-xl font-semibold tabular-nums text-accent">{snappies.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Snappies</p></div>
      </div>

      <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-muted-foreground">Quick scenarios</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => addPurchase("ecowear", 100)} className="rounded-xl border border-esg-high/40 bg-esg-high/10 p-3 text-left text-sm tap">€100 · EcoWear<span className="block text-[11px] text-esg-high">ESG 91 HIGH</span></button>
        <button onClick={() => addPurchase("fastfashion", 100)} className="rounded-xl border border-esg-low/40 bg-esg-low/10 p-3 text-left text-sm tap">€100 · Fast Fashion<span className="block text-[11px] text-esg-low">ESG 28 LOW</span></button>
        <button onClick={() => { for (let i = 0; i < 1; i++) addPurchase("public", 400); }} className="rounded-xl border border-border bg-card p-3 text-left text-sm tap">€400 · Public<span className="block text-[11px] text-muted-foreground">Push toward SUSTAINER</span></button>
        <button onClick={() => addPurchase("shell", 70)} className="rounded-xl border border-esg-medium/40 bg-esg-medium/10 p-3 text-left text-sm tap">€70 · Shell<span className="block text-[11px] text-esg-medium">ESG 42 MEDIUM</span></button>
      </div>

      <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-muted-foreground">Custom purchase</p>
      <select value={merchantId} onChange={(e) => setMerchantId(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-3 text-sm">
        {MERCHANTS.map((x) => <option key={x.id} value={x.id}>{x.name} — ESG {x.esg}</option>)}
      </select>
      <div className="mt-3 flex items-center gap-3">
        <input type="range" min={5} max={500} step={5} value={amount} onChange={(e) => setAmount(+e.target.value)} className="flex-1 accent-primary" />
        <span className="w-16 text-right tabular-nums">€{amount}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <EsgBadge score={m.esg} /> <span>Earns +{snappiesFor(amount, m.esg)} Snappies</span>
      </div>
      <button onClick={() => addPurchase(merchantId, amount)} className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground tap">Add transaction</button>

      {lastEarn && (
        <div key={lastEarn.key} className="mt-3 flex items-center gap-2 rounded-xl bg-surface p-3 text-xs animate-in fade-in">
          <Check className="h-4 w-4 text-esg-high" /> {lastEarn.merchant} €{lastEarn.amount}: <span className="text-accent">+{lastEarn.snappies} Snappies</span>,
          <span className={lastEarn.esgDelta >= 0 ? "text-esg-high" : "text-esg-low"}>{lastEarn.esgDelta >= 0 ? "+" : ""}{lastEarn.esgDelta} ESG</span>
        </div>
      )}
      <button onClick={reset} className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-xs text-muted-foreground tap"><RotateCcw className="h-3.5 w-3.5" />Reset demo data</button>
    </Sheet>
  );
}
