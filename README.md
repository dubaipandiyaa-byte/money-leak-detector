# Money Leak Detector

**AI Financial Intelligence Platform · by DONRITHIK LABS**

Money Leak Detector continuously finds subscriptions, forgotten bills, duplicate
payments, hidden charges, and wasteful spending patterns — before they drain
your wealth. This repository contains the complete marketing site and the
logged-in **AI Command Center** dashboard.

## Stack

- **Next.js 15** (App Router, static prerendering) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 4** with a custom design-token theme (`app/globals.css`)
- **Framer Motion 12** for all motion (springs, scroll reveal, draw-on-view charts)
- **Lucide** icons · **Inter Variable** (self-hosted via Fontsource)
- Hand-rolled SVG charts (`components/ui/charts.tsx`) — no chart library needed

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
```

## Routes

| Route | What it is |
|---|---|
| `/` | Landing page: hero with live AI scan visualization, trusted marquee, how-it-works, AI intelligence bento, the signature Leak Detection wall (try sealing a card), conversational insights, testimonials, pricing, FAQ, CTA, footer |
| `/dashboard` | AI Command Center: time-aware greeting, animated Guardian intelligence card (scan phases, confidence, financial score ring), living widget grid, active leaks with one-click fixes, AI timeline, conversational insight feed |

## Design system

Tokens live in `app/globals.css` under `@theme`:

- **Palette** — pure white canvas, soft grays (`mist`, `fog`), emerald scale,
  electric lime (`lime-electric`), graphite ink.
- **Surfaces** — `.glass` / `.glass-subtle` (blurred glassmorphism),
  `.card-luxe` (layered luxury shadows), `.noise` grain, aurora gradient blobs.
- **Motion** — shared easing `[0.16, 1, 0.3, 1]`, spring hovers, scroll-reveal
  with blur, marquee/orbit/scanline/breathe keyframes. All animation respects
  `prefers-reduced-motion`.

## Structure

```
app/                 layout, landing page, dashboard route
components/ui/       Reveal, AnimatedNumber, MagneticButton, ProgressRing,
                     Aurora, Logo, charts (AreaSpark, Bars)
components/landing/  Nav, Hero, HeroVisual, TrustedBy, HowItWorks,
                     IntelligenceEngine, LeakShowcase, InsightsShowcase,
                     Testimonials, Pricing, FAQ, FinalCTA, Footer
components/dashboard/ DashboardNav, Greeting, GuardianCard, Widgets,
                     LeakGrid, Timeline, InsightFeed
components/leaks/    LeakCard — the signature sealable leak card
lib/data.ts          demo data model (leaks, timeline, insights, pricing…)
```

All demo data is illustrative. Money Leak Detector is a design/product
prototype, not a licensed financial advisor.
