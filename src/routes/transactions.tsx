import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/snappi/Shell";
import { TxRow } from "@/components/snappi/TxRow";
import { useSnappi } from "@/lib/snappi/store";
import { esgCategory, merchantById } from "@/lib/snappi/data";
import { meta } from "@/lib/snappi/meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transactions")({
  head: () => meta("Transactions — Snappi", "Every payment with the merchant's ESG score and the Snappies you earned."),
  component: TxPage,
});

function TxPage() {
  const { transactions } = useSnappi();
  const [f, setF] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const list = transactions.filter((t) => f === "ALL" || esgCategory(merchantById(t.merchantId).esg) === f);
  return (
    <div className="animate-in fade-in">
      <SubHeader title="Transactions" />
      <div className="flex gap-2 px-4">
        {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((x) => (
          <button key={x} onClick={() => setF(x)} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold tap", f === x ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
            {x === "ALL" ? "All" : `${x} ESG`}
          </button>
        ))}
      </div>
      <div className="mx-4 mt-4 divide-y divide-border rounded-2xl border border-border bg-card px-3">
        {list.map((t) => <TxRow key={t.id} tx={t} />)}
        {list.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No transactions in this category yet.</p>}
      </div>
    </div>
  );
}
