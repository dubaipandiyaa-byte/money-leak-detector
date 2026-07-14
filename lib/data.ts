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
    hue: "#fdecec",
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
    hue: "#fdeee6",
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
    hue: "#e9f9ef",
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
    hue: "#fff6e3",
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
    hue: "#f1f3f6",
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
    hue: "#e9f1fd",
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
    hue: "#eaf8f1",
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
    hue: "#eef0fb",
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
    hue: "#e9f6fa",
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

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    when: "Yesterday",
    label: "21:14",
    title: "Duplicate payment detected",
    detail:
      "Two identical charges of AED 249 from Emirates Home Fiber, 40 seconds apart. Refund draft prepared.",
    amount: 249,
    tone: "detected",
  },
  {
    id: "t2",
    when: "Today",
    label: "08:02",
    title: "Forgotten subscription found",
    detail:
      "FitLab Gym Platinum still billing monthly. No check-ins since April 28.",
    amount: 349,
    tone: "found",
  },
  {
    id: "t3",
    when: "Tomorrow",
    label: "Forecast",
    title: "Bill increase predicted",
    detail:
      "Electricity trending 18% above last month. Summer tariff kicks in on your next cycle.",
    amount: 86,
    tone: "predicted",
  },
  {
    id: "t4",
    when: "This quarter",
    label: "Projection",
    title: "Potential savings unlocked",
    detail:
      "Applying all 9 open recommendations frees AED 963 per month with zero lifestyle change.",
    amount: 2889,
    tone: "potential",
  },
];

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

export const spendingByMonth = [
  { m: "Feb", spend: 9420, saved: 310 },
  { m: "Mar", spend: 10180, saved: 540 },
  { m: "Apr", spend: 8960, saved: 780 },
  { m: "May", spend: 9740, saved: 1105 },
  { m: "Jun", spend: 8410, saved: 1420 },
  { m: "Jul", spend: 7980, saved: 1248 },
];

export const cashFlow = [42, 48, 44, 56, 51, 62, 58, 71, 66, 74, 79, 86];

export const healthScore = 82;

export const pricing = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    tagline: "See your first leaks",
    features: [
      "Connect 2 accounts",
      "Monthly leak scan",
      "Subscription overview",
      "Basic AI insights",
      "Financial health score",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Guardian",
    price: "39",
    period: "per month",
    tagline: "Full AI protection, always on",
    features: [
      "Unlimited accounts",
      "Real-time leak detection",
      "Duplicate & hidden-fee alerts",
      "One-click cancellations",
      "Predictive bill forecasts",
      "Priority AI concierge",
    ],
    cta: "Start 14-Day Trial",
    featured: true,
  },
  {
    name: "Family",
    price: "69",
    period: "per month",
    tagline: "Protect the whole household",
    features: [
      "Everything in Guardian",
      "Up to 6 members",
      "Shared goals & budgets",
      "Household leak map",
      "Dedicated success manager",
    ],
    cta: "Start 14-Day Trial",
    featured: false,
  },
];

export const faqs = [
  {
    q: "How does Money Leak Detector find leaks I can't see?",
    a: "Our AI reads the shape of your spending, not just the labels. It learns your patterns across months of history, then flags anything that drifts: a plan you stopped using, a price that quietly increased, a fee that shouldn't exist, or the same charge appearing twice. Most leaks hide in plain sight because they're small and recurring — that's exactly what pattern models are best at catching.",
  },
  {
    q: "Is my banking data safe?",
    a: "Yes. We connect through regulated, read-only open-banking rails — we can see transactions, but we can never move money. Data is encrypted in transit (TLS 1.3) and at rest (AES-256), and we never sell or share your financial data. You can disconnect and erase everything with one tap.",
  },
  {
    q: "Can it actually cancel subscriptions for me?",
    a: "For hundreds of supported merchants, yes — one tap and our concierge handles the cancellation, downgrade, or refund request end-to-end. For everything else, we prepare the exact steps and draft the message so it takes you under a minute.",
  },
  {
    q: "What makes this different from a budgeting app?",
    a: "Budgeting apps ask you to do the work: categorize, review, restrain. Money Leak Detector inverts that — the AI does the finding, the math, and most of the fixing. You don't manage your money harder; leaks simply get sealed before they compound.",
  },
  {
    q: "How much does the average person recover?",
    a: "Across our early users, the median first-month discovery is AED 4,980 per year in recoverable leaks — unused subscriptions, duplicate charges, and above-market bills. Your number depends on your accounts, but almost everyone finds something they'd forgotten.",
  },
  {
    q: "Do I need to change banks or cards?",
    a: "No. Money Leak Detector sits on top of your existing accounts. Nothing about how you bank, pay, or save needs to change — we just watch the flow and point out where it quietly escapes.",
  },
];

export const testimonials = [
  {
    quote:
      "It found a gym membership I'd been paying for two years after moving cities. Two years. The app paid for itself in the first hour.",
    name: "Sarah Al-Mansouri",
    role: "Product Manager, Dubai",
    recovered: "AED 8,376 recovered",
  },
  {
    quote:
      "The duplicate-payment alert caught my landlord's portal double-charging rent. I would never have noticed — the amounts looked normal in my statement.",
    name: "James Okafor",
    role: "Software Engineer, Abu Dhabi",
    recovered: "AED 6,500 recovered",
  },
  {
    quote:
      "I don't budget. I don't want to budget. This thing quietly protects my money anyway, and the insights read like a friend explaining, not a spreadsheet.",
    name: "Priya Raghavan",
    role: "Founder, Sharjah",
    recovered: "AED 11,040 recovered",
  },
];

export const trustedCompanies = [
  "Meridian Capital",
  "Northwind",
  "Atlas Group",
  "Halcyon",
  "Vertex Partners",
  "Aurora Labs",
  "Keystone",
  "Solara",
];
