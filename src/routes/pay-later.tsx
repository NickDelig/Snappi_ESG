import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { TopBar } from "@/components/snappi/Shell";
import { Card, SectionTitle, DemoTag, EsgBadge, Progress } from "@/components/snappi/ui";
import { useSnappi } from "@/lib/snappi/store";
import { MERCHANTS, BASE_LOAN } from "@/lib/snappi/data";
import { useSheets } from "@/components/snappi/sheets-context";
import { meta } from "@/lib/snappi/meta";

export const Route = createFileRoute("/pay-later")({
  head: () => meta("Pay Later — Snappi", "Split purchases into instalments with Snappi Pay Later — your ESG tier may unlock preferential terms."),
  component: PayLaterPage,
});

const UPCOMING = [
  { m: "EcoWear", d: "15 Oct", a: 40, n: "2 of 3" },
  { m: "Fast Fashion Store", d: "26 Oct", a: 30, n: "2 of 3" },
  { m: "EcoWear", d: "15 Nov", a: 40, n: "3 of 3" },
];

function PayLaterPage() {
  const { tier } = useSnappi();
  const { openPay } = useSheets();
  return (
    <div className="animate-in fade-in">
      <TopBar />
      <div className="mt-6 text-center">
        <p className="text-xs font-medium tracking-wider">AVAILABLE AMOUNT</p>
        <p className="text-[44px] font-light tabular-nums">€1,500.00</p>
        <div className="mx-auto mt-2 w-56"><Progress value={92} barClass="bg-primary" /></div>
        <p className="mt-1.5 text-xs text-muted-foreground">€110 used of €1,610 limit</p>
      </div>
      <div className="px-4">
        <Link to="/esg" className="mt-6 block rounded-2xl border border-esg-high/30 bg-card bg-gradient-esg p-4 tap">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold"><Leaf className="h-4 w-4 text-esg-high" />Your {tier.id} tier</p>
            <DemoTag />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Your ESG Tier may unlock preferential terms.</p>
          <p className="mt-2 text-2xl font-semibold">{tier.loan.toFixed(2)}% <span className="text-sm font-normal text-muted-foreground line-through">{BASE_LOAN.toFixed(2)}%</span></p>
          <p className="text-[11px] text-muted-foreground">Current demo rate for longer instalment plans</p>
        </Link>

        <SectionTitle>Upcoming payments</SectionTitle>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
          {UPCOMING.map((u, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div><p className="text-sm font-medium">{u.m}</p><p className="text-xs text-muted-foreground">{u.d} · Instalment {u.n}</p></div>
              <p className="font-medium tabular-nums">€{u.a.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <SectionTitle>Our Partners</SectionTitle>
        <p className="-mt-2 mb-3 text-xs text-muted-foreground">Explore our featured Snappi merchants.</p>
        <div className="rounded-2xl bg-foreground p-5 text-background">
          <p className="text-2xl font-light leading-tight">Shop your favorite brands with</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-3xl font-light">snappi</span>
            <div className="text-lg font-bold leading-none">
              <span className="block bg-accent px-1.5 py-0.5 text-accent-foreground">PAY</span>
              <span className="block bg-primary px-1.5 py-0.5 text-primary-foreground">LATER</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {MERCHANTS.slice(0, 6).map((m) => (
            <Card key={m.id} onClick={() => openPay(m.id)} className="p-3">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="mb-2 text-[11px] text-muted-foreground">{m.category}</p>
              <EsgBadge score={m.esg} compact />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
