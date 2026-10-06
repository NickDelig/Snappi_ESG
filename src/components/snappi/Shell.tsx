import { useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Home, CalendarClock, ScanLine, Search, Sparkles, User } from "lucide-react";
import { SheetsContext } from "./sheets-context";
import { DemoSheet, PaySheet, TxDetailSheet } from "./Sheets";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  const [txId, setTxId] = useState<string | null>(null);
  const [pay, setPay] = useState<{ open: boolean; merchant?: string | undefined }>({ open: false });
  const [demo, setDemo] = useState(false);

  return (
    <SheetsContext.Provider
      value={{ openTx: setTxId, openPay: (merchant) => setPay({ open: true, merchant }), openDemo: () => setDemo(true) }}
    >
      <div className="flex min-h-dvh items-center justify-center md:py-8">
        <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background md:h-[880px] md:rounded-[44px] md:border md:border-border md:shadow-glow">
          <main className="flex-1 overflow-y-auto no-scrollbar pb-28">{children}</main>
          <BottomNav />
          <TxDetailSheet id={txId} onClose={() => setTxId(null)} />
          <PaySheet open={pay.open} initialMerchant={pay.merchant} onClose={() => setPay({ open: false })} />
          <DemoSheet open={demo} onClose={() => setDemo(false)} />
        </div>
      </div>
    </SheetsContext.Provider>
  );
}

function BottomNav() {
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cards", label: "Cards", icon: CreditCard },
    { to: "/pay-later", label: "Pay later", icon: CalendarClock },
  ] as const;
  return (
    <nav className="absolute inset-x-4 bottom-4 z-40 flex rounded-full border border-border bg-popover/85 p-1.5 backdrop-blur-xl">
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: true }}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold text-foreground/80 transition-colors data-[status=active]:bg-gradient-primary data-[status=active]:text-primary-foreground"
        >
          <Icon className="h-5 w-5" strokeWidth={1.6} />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card tap" aria-label="Profile">
        <User className="h-5 w-5" strokeWidth={1.5} />
      </Link>
      <div className="flex items-center gap-2">
        {[Search, Sparkles, ScanLine].map((I, i) => (
          <button key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-card/60 tap" aria-label="Action">
            <I className="h-5 w-5" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function SubHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 bg-background/85 px-4 py-4 backdrop-blur-xl">
      <button onClick={() => router.history.back()} className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-card tap")} aria-label="Back">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      {right}
    </div>
  );
}
