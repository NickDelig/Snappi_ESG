// Demo data for the Snappi Climathon prototype. Edit freely — everything else is derived.

export type EsgCategory = "HIGH" | "MEDIUM" | "LOW";

export interface Merchant {
  id: string;
  name: string;
  category: string;
  esg: number; // 0–100
  e: number;
  s: number;
  g: number;
  description: string;
}

export const MERCHANTS: Merchant[] = [
  { id: "public", name: "Public", category: "Retail", esg: 82, e: 82, s: 78, g: 86, description: "Electronics & books retailer with audited supply-chain and recycling programmes." },
  { id: "ab", name: "AB Vassilopoulos", category: "Supermarket", esg: 76, e: 74, s: 79, g: 75, description: "Supermarket chain with food-waste reduction and local sourcing targets." },
  { id: "ecowear", name: "EcoWear", category: "Fashion", esg: 91, e: 93, s: 89, g: 90, description: "Certified organic and recycled-fibre clothing brand." },
  { id: "greenbean", name: "Green Bean Café", category: "Coffee", esg: 84, e: 85, s: 86, g: 80, description: "Fair-trade coffee shop with compostable packaging." },
  { id: "shell", name: "Shell", category: "Energy", esg: 42, e: 30, s: 52, g: 58, description: "Fuel retailer transitioning part of its network to EV charging." },
  { id: "generic", name: "Generic Market", category: "Retail", esg: 55, e: 50, s: 58, g: 57, description: "General retailer with limited sustainability disclosures." },
  { id: "fastfashion", name: "Fast Fashion Store", category: "Fashion", esg: 28, e: 20, s: 30, g: 38, description: "High-volume fashion retailer with limited supply-chain transparency." },
];

export const merchantById = (id: string) => MERCHANTS.find((m) => m.id === id)!;

export const esgCategory = (score: number): EsgCategory =>
  score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

// Euros needed to earn 1 Snappie
export const SNAPPIE_RATE: Record<EsgCategory, number> = { HIGH: 10, MEDIUM: 20, LOW: 30 };

export const snappiesFor = (amount: number, esg: number) =>
  Math.floor(amount / SNAPPIE_RATE[esgCategory(esg)]);

export interface Tier {
  id: "STARTER" | "GREEN" | "IMPACT" | "SUSTAINER";
  min: number;
  max: number;
  savings: number; // APY %
  loan: number; // %
  multiplier: string;
}

// DEMO rates only
export const BASE_SAVINGS = 2.0;
export const BASE_LOAN = 6.5;
export const TIERS: Tier[] = [
  { id: "STARTER", min: 0, max: 399, savings: 2.0, loan: 6.5, multiplier: "1.0×" },
  { id: "GREEN", min: 400, max: 599, savings: 2.25, loan: 6.25, multiplier: "1.1×" },
  { id: "IMPACT", min: 600, max: 799, savings: 2.5, loan: 6.0, multiplier: "1.25×" },
  { id: "SUSTAINER", min: 800, max: 1000, savings: 3.0, loan: 5.5, multiplier: "1.5×" },
];

export const tierFor = (score: number) => TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0]!;

export const TREE_STAGES = [
  { name: "Seed", min: 0 },
  { name: "Sprout", min: 200 },
  { name: "Young Tree", min: 500 },
  { name: "Growing Tree", min: 1000 },
  { name: "Full Tree", min: 2000 },
];

export const treeStage = (snappies: number) => {
  let idx = 0;
  TREE_STAGES.forEach((s, i) => {
    if (snappies >= s.min) idx = i;
  });
  return { idx, stage: TREE_STAGES[idx]!, next: TREE_STAGES[idx + 1] };
};

export interface Transaction {
  id: string;
  merchantId: string;
  amount: number;
  date: string; // label
  method: string;
  isNew?: boolean;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", merchantId: "public", amount: 60, date: "Today", method: "Snappi Mastercard •• 8158" },
  { id: "t2", merchantId: "shell", amount: 70, date: "Yesterday", method: "Snappi Mastercard •• 8158" },
  { id: "t3", merchantId: "ab", amount: 45.2, date: "28 Sep", method: "Snappi Mastercard •• 8158" },
  { id: "t4", merchantId: "fastfashion", amount: 90, date: "26 Sep", method: "Snappi Pay Later" },
  { id: "t5", merchantId: "greenbean", amount: 12.4, date: "25 Sep", method: "Snappi Mastercard •• 8158" },
  { id: "t6", merchantId: "ecowear", amount: 120, date: "22 Sep", method: "Snappi Pay Later" },
  { id: "t7", merchantId: "generic", amount: 34.9, date: "20 Sep", method: "Snappi Mastercard •• 8158" },
];

export interface Reward {
  id: string;
  title: string;
  cost: number;
  emoji: string;
  note: string;
  featured?: boolean;
}

export const REWARDS: Reward[] = [
  { id: "tree", title: "Plant a real tree", cost: 300, emoji: "🌳", note: "With our reforestation partner", featured: true },
  { id: "coffee", title: "Free coffee", cost: 250, emoji: "☕", note: "At Green Bean Café" },
  { id: "public5", title: "€5 Public voucher", cost: 500, emoji: "🛍️", note: "Online & in-store" },
  { id: "sustain10", title: "€10 sustainable shopping", cost: 900, emoji: "♻️", note: "EcoWear & partners" },
  { id: "travel20", title: "€20 travel voucher", cost: 1500, emoji: "🚆", note: "Rail & ferry partners" },
];

export const SCORE_HISTORY = [
  { m: "May", v: 655 },
  { m: "Jun", v: 671 },
  { m: "Jul", v: 668 },
  { m: "Aug", v: 690 },
  { m: "Sep", v: 704 },
];

export const fmtEur = (n: number) =>
  "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
