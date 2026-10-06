import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, Lock, LayoutGrid, Unlock } from "lucide-react";
import { TopBar } from "@/components/snappi/Shell";
import { TxRow } from "@/components/snappi/TxRow";
import { SectionTitle } from "@/components/snappi/ui";
import { useSnappi } from "@/lib/snappi/store";
import { fmtEur } from "@/lib/snappi/data";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cards")({
  head: () => meta("Cards — Snappi", "Your Snappi Mastercard, limits, lock controls and recent payments with ESG insight."),
  component: CardsPage,
});

function CardsPage() {
  const { transactions, paymentsBalance } = useSnappi();
  const [locked, setLocked] = useState(false);
  return (
    <div className="animate-in fade-in">
      <TopBar />
      <div className="mt-6 text-center">
        <p className="text-xs font-medium tracking-wider">PAYMENTS BALANCE</p>
        <p className="text-[40px] font-light tabular-nums">{fmtEur(paymentsBalance)}</p>
      </div>
      <div className="mx-6 mt-4">
        <div className={cn("relative aspect-[1.7] overflow-hidden rounded-2xl bg-gradient-primary p-5 shadow-glow transition", locked && "grayscale opacity-60")}>
          <p className="text-3xl font-light tracking-tight text-primary-foreground">snappi</p>
          <p className="mt-3 text-sm text-primary-foreground/90">Payments account</p>
          <p className="text-sm text-primary-foreground/90">**** 8158</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-primary-foreground/90"><span className={cn("h-1.5 w-1.5 rounded-full", locked ? "bg-destructive" : "bg-accent")} />{locked ? "Locked" : "Active / Virtual"}</p>
          <div className="absolute bottom-5 right-5 flex">
            <span className="h-9 w-9 rounded-full bg-destructive" />
            <span className="-ml-3 h-9 w-9 rounded-full bg-esg-medium/90" />
          </div>
          <p className="absolute right-5 top-5 text-[10px] text-primary-foreground/80">debit</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 px-8">
        {[
          { l: "Limits", I: ArrowUpDown, f: () => {} },
          { l: locked ? "Unlock" : "Lock", I: locked ? Unlock : Lock, f: () => setLocked(!locked) },
          { l: "More", I: LayoutGrid, f: () => {} },
        ].map(({ l, I, f }) => (
          <button key={l} onClick={f} className="flex flex-col items-center gap-2 tap">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card"><I className="h-5 w-5" strokeWidth={1.6} /></span>
            <span className="text-xs">{l}</span>
          </button>
        ))}
      </div>
      <div className="px-4">
        <SectionTitle action={<Link to="/transactions" className="text-xs text-primary-glow">View all transactions</Link>}>Transactions</SectionTitle>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-3">
          {transactions.filter((t) => !t.method.includes("Pay Later")).slice(0, 5).map((t) => <TxRow key={t.id} tx={t} />)}
        </div>
      </div>
    </div>
  );
}
