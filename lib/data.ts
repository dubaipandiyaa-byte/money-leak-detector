/**
 * Demo data model for Money Leak Detector.
 * All currency values in AED unless noted.
 */

export type RiskLevel = "high" | "medium" | "low";

export interface Leak {
  id: string;
  vendor: string;
  category: string;
  monogram: string; // letter mark rendered in the vendor tile
  hue: string; // brand-adjacent tile background
  monthlyWaste: number;
  yearlySavings: number;
  confidence: number; // 0–100
  risk: RiskLevel;
  finding: string;
  action: string;
}

export const leaks: Leak[] = [
  {
    id: "netflix",
    vendor: "Netflix",
    category: "Streaming",
    monogram: "N",
    hue: "#31171a",
    monthlyWaste: 56,
    yearlySavings: 672,
    confidence: 97,
    risk: "high",
    finding: "Premium 4K plan active — no 4K device streamed in 94 days.",
    action: "Downgrade to Standard",
  },
  {
    id: "adobe",
    vendor: "Adobe Creative Cloud",
    category: "Software",
    monogram: "A",
    hue: "#301d12",
    monthlyWaste: 251,
    yearlySavings: 3012,
    confidence: 93,
    risk: "high",
    finding: "Full suite billed monthly. Only Photoshop opened this quarter.",
    action: "Switch to single-app plan",
  },
  {
    id: "spotify",
    vendor: "Spotify",
    category: "Streaming",
    monogram: "S",
    hue: "#12281b",
    monthlyWaste: 20,
    yearlySavings: 240,
    confidence: 88,
    risk: "medium",
    finding: "Duo plan detected, but only one profile has listened since March.",
    action: "Move to Individual",
  },
  {
    id: "amazon",
    vendor: "Amazon Prime",
    category: "Membership",
    monogram: "a",
    hue: "#2e2410",
    monthlyWaste: 16,
    yearlySavings: 192,
    confidence: 84,
    risk: "medium",
    finding: "Duplicate membership found — annual plan and monthly plan overlap.",
    action: "Cancel monthly duplicate",
  },
  {
    id: "apple",
    vendor: "Apple One",
    category: "Bundle",
    monogram: "",
    hue: "#1c2129",
    monthlyWaste: 25,
    yearlySavings: 300,
    confidence: 91,
    risk: "medium",
    finding: "iCloud+ billed separately while Apple One already includes 2TB.",
    action: "Remove separate iCloud+",
  },
  {
    id: "google",
    vendor: "Google One",
    category: "Storage",
    monogram: "G",
    hue: "#142030",
    monthlyWaste: 37,
    yearlySavings: 444,
    confidence: 82,
    risk: "low",
    finding: "2TB tier at 4% utilization for 6 consecutive months.",
    action: "Downgrade to 200GB",
  },
  {
    id: "gym",
    vendor: "FitLab Gym",
    category: "Fitness",
    monogram: "F",
    hue: "#12281b",
    monthlyWaste: 349,
    yearlySavings: 4188,
    confidence: 96,
    risk: "high",
    finding: "Platinum membership — last check-in was 11 weeks ago.",
    action: "Pause or cancel membership",
  },
  {
    id: "insurance",
    vendor: "Shield Insurance",
    category: "Insurance",
    monogram: "S",
    hue: "#1c2129",
    monthlyWaste: 118,
    yearlySavings: 1416,
    confidence: 79,
    risk: "medium",
    finding: "Premium is 31% above market for identical coverage in your area.",
    action: "Review 3 cheaper quotes",
  },
  {
    id: "utilities",
    vendor: "DEWA Utilities",
    category: "Utilities",
    monogram: "D",
    hue: "#142030",
    monthlyWaste: 86,
    yearlySavings: 1032,
    confidence: 74,
    risk: "low",
    finding: "Off-peak usage patterns qualify you for the time-of-use tariff.",
    action: "Switch tariff plan",
  },
];

export const totalYearlySavings = leaks.reduce((s, l) => s + l.yearlySavings, 0);

export interface TimelineEvent {
  id: string;
  when: string;
  label: string;
  title: string;
  detail: string;
  amount?: number;
  tone: "detected" | "found" | "predicted" | "potential";
}

export interface Insight {
  id: string;
  message: string;
  sub: string;
  impact: string;
}

export const insights: Insight[] = [
  {
    id: "i1",
    message:
      "I noticed you paid for three streaming services this month, but only watched one.",
    sub: "Netflix, OSN+ and Shahid VIP were all billed. Only Netflix registered watch time.",
    impact: "Save AED 732/yr",
  },
  {
    id: "i2",
    message:
      "Your electricity bill will likely rise next month — summer tariff starts on your next cycle.",
    sub: "I can pre-move AED 120 into your bills buffer so it never touches your spending money.",
    impact: "Zero surprise",
  },
  {
    id: "i3",
    message:
      "You've been charged a foreign-transaction fee 4 times this month on the same merchant.",
    sub: "Your other card waives this fee entirely. Routing future payments saves the spread.",
    impact: "Save AED 288/yr",
  },
  {
    id: "i4",
    message:
      "Your emergency fund reached 2.8 months of expenses. You're ahead of 71% of similar profiles.",
    sub: "At the current pace you'll reach the 3-month milestone on August 9.",
    impact: "On track",
  },
];

export const pricing = [
  {
    name: "Free",
    price: "0",
    period: "during Beta",
    tagline: "Everything, while we're in Beta",
    features: [
      "Unlimited statement analysis",
      "PDF or CSV, any bank, any currency",
      "Full leak, duplicate & fee detection",
      "Downloadable PDF report",
      "Account history across your devices",
    ],
    cta: "Start Free",
    featured: true,
  },
  {
    name: "Guardian",
    price: "—",
    period: "planned after Beta",
    tagline: "Not available yet",
    features: [
      "Everything in Free",
      "Automatic recurring re-scans",
      "Priority support",
    ],
    cta: "Coming soon",
    featured: false,
    comingSoon: true,
  },
  {
    name: "Family",
    price: "—",
    period: "planned after Beta",
    tagline: "Not available yet",
    features: ["Everything in Guardian", "Shared household view"],
    cta: "Coming soon",
    featured: false,
    comingSoon: true,
  },
];

export const faqs = [
  {
    q: "How does Money Leak Detector find leaks I can't see?",
    a: "The AI reads every transaction in your statement, not just the labels — it flags recurring charges, duplicate payments within days of each other, bank fees, and spending that looks routine versus discretionary. Most leaks hide in plain sight because they're small and repeat quietly every month.",
  },
  {
    q: "Is my banking data safe?",
    a: "Yes. Your statement is read entirely inside your own browser and is never uploaded to any server we operate. If you create an account, only the resulting analysis (not the original file) is saved to your account, protected by row-level security so only you can ever read it. See our Privacy Policy and Security page for the full detail.",
  },
  {
    q: "Can it cancel subscriptions for me?",
    a: "No — Money Leak Detector doesn't move money or contact merchants on your behalf. For every leak it finds, it tells you exactly what to do and gives you the numbers to act on, but cancelling, downgrading, or requesting a refund is something you do yourself.",
  },
  {
    q: "What makes this different from a budgeting app?",
    a: "Budgeting apps ask you to categorize and review your own spending. Money Leak Detector does that analysis for you from a single statement upload — no ongoing manual entry, no linked accounts.",
  },
  {
    q: "Do I need to change banks or cards?",
    a: "No. Money Leak Detector doesn't connect to your bank at all — you export a statement (PDF or CSV) from your own banking app and upload it here. Nothing about how you bank needs to change.",
  },
];
