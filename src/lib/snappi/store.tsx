import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_TRANSACTIONS,
  merchantById,
  snappiesFor,
  tierFor,
  TIERS,
  type Transaction,
} from "./data";

/*
 * Transparent demo algorithm:
 *   personal score = 10 × (Σ merchantESG × amount) / (Σ amount)
 * A 6‑month history window (HISTORY_WEIGHT euros at HISTORY_AVG ESG) is blended in
 * so single purchases move the score gradually.
 */
const HISTORY_WEIGHT = 500;
const TARGET_INITIAL_SCORE = 742;

const sums = (txs: Transaction[]) =>
  txs.reduce(
    (acc, t) => {
      acc.w += t.amount;
      acc.ws += t.amount * merchantById(t.merchantId).esg;
      return acc;
    },
    { w: 0, ws: 0 },
  );

const init = sums(INITIAL_TRANSACTIONS);
const HISTORY_AVG = ((TARGET_INITIAL_SCORE / 10) * (HISTORY_WEIGHT + init.w) - init.ws) / HISTORY_WEIGHT;

export function computeScore(txs: Transaction[]) {
  const s = sums(txs);
  const raw = (10 * (HISTORY_AVG * HISTORY_WEIGHT + s.ws)) / (HISTORY_WEIGHT + s.w);
  return Math.max(0, Math.min(1000, Math.round(raw)));
}

const INITIAL_SNAPPIES = 1284;
const initEarned = INITIAL_TRANSACTIONS.reduce((a, t) => a + snappiesFor(t.amount, merchantById(t.merchantId).esg), 0);
const SNAPPIE_BASE = INITIAL_SNAPPIES - initEarned;

export interface EarnEvent {
  key: number;
  snappies: number;
  esgDelta: number;
  merchant: string;
  amount: number;
}

interface Ctx {
  transactions: Transaction[];
  score: number;
  tier: (typeof TIERS)[number];
  nextTier: (typeof TIERS)[number] | undefined;
  snappies: number;
  monthlySnappies: number;
  lifetimeSnappies: number;
  monthDelta: number;
  paymentsBalance: number;
  redeemed: string[];
  lastEarn: EarnEvent | null;
  previewPurchase: (merchantId: string, amount: number) => { snappies: number; esgDelta: number };
  addPurchase: (merchantId: string, amount: number, method?: string) => EarnEvent;
  redeem: (id: string, cost: number) => boolean;
  reset: () => void;
}

const SnappiContext = createContext<Ctx | null>(null);

export function SnappiProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [spent, setSpent] = useState(0);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [lastEarn, setLastEarn] = useState<EarnEvent | null>(null);

  const value = useMemo<Ctx>(() => {
    const score = computeScore(transactions);
    const tier = tierFor(score);
    const nextTier = TIERS[TIERS.indexOf(tier) + 1];
    const earned = transactions.reduce((a, t) => a + snappiesFor(t.amount, merchantById(t.merchantId).esg), 0);
    const newEarned = earned - initEarned;
    const newSpend = transactions.filter((t) => t.isNew).reduce((a, t) => a + t.amount, 0);
    return {
      transactions,
      score,
      tier,
      nextTier,
      snappies: SNAPPIE_BASE + earned - spent,
      monthlySnappies: 86 + newEarned,
      lifetimeSnappies: 3742 + newEarned,
      monthDelta: 38 + (score - TARGET_INITIAL_SCORE),
      paymentsBalance: 2165.16 - newSpend,
      redeemed,
      lastEarn,
      previewPurchase: (merchantId, amount) => ({
        snappies: snappiesFor(amount, merchantById(merchantId).esg),
        esgDelta:
          computeScore([...transactions, { id: "p", merchantId, amount, date: "", method: "" }]) - score,
      }),
      addPurchase: () => ({ key: 0, snappies: 0, esgDelta: 0, merchant: "", amount: 0 }),
      redeem: () => false,
      reset: () => {},
    };
  }, [transactions, spent, redeemed, lastEarn]);

  const addPurchase = useCallback(
    (merchantId: string, amount: number, method = "Snappi Mastercard •• 8158") => {
      const tx: Transaction = { id: "n" + Date.now(), merchantId, amount, date: "Just now", method, isNew: true };
      const before = computeScore(transactions);
      const next = [tx, ...transactions];
      const ev: EarnEvent = {
        key: Date.now(),
        snappies: snappiesFor(amount, merchantById(merchantId).esg),
        esgDelta: computeScore(next) - before,
        merchant: merchantById(merchantId).name,
        amount,
      };
      setTransactions(next);
      setLastEarn(ev);
      return ev;
    },
    [transactions],
  );

  const redeem = useCallback(
    (id: string, cost: number) => {
      if (value.snappies < cost) return false;
      setSpent((s) => s + cost);
      setRedeemed((r) => [...r, id]);
      return true;
    },
    [value.snappies],
  );

  const reset = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSpent(0);
    setRedeemed([]);
    setLastEarn(null);
  }, []);

  return (
    <SnappiContext.Provider value={{ ...value, addPurchase, redeem, reset }}>{children}</SnappiContext.Provider>
  );
}

export function useSnappi() {
  const c = useContext(SnappiContext);
  if (!c) throw new Error("useSnappi outside provider");
  return c;
}
