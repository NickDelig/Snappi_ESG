import { merchantById, snappiesFor, fmtEur, type Transaction } from "@/lib/snappi/data";
import { EsgBadge, MerchantAvatar } from "./ui";
import { useSheets } from "./sheets-context";
import { cn } from "@/lib/utils";

export function TxRow({ tx }: { tx: Transaction }) {
  const m = merchantById(tx.merchantId);
  const s = snappiesFor(tx.amount, m.esg);
  const { openTx } = useSheets();
  return (
    <button
      onClick={() => openTx(tx.id)}
      className={cn("flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left tap", tx.isNew && "animate-in fade-in slide-in-from-top-2")}
    >
      <MerchantAvatar name={m.name} score={m.esg} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-medium">{m.name}</p>
          <p className="shrink-0 text-[15px] font-medium tabular-nums">-{fmtEur(tx.amount)}</p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{m.category} · {tx.date}</span>
          </div>
          <span className="text-xs font-semibold text-accent">+{s} 🌱</span>
        </div>
        <div className="mt-1.5">
          <EsgBadge score={m.esg} />
        </div>
      </div>
    </button>
  );
}
