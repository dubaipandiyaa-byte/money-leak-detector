<div align="center">

<img src="public/images/ceo-hero.png" alt="Money Leak Detector — We caught you. We save you." width="820" />

# Money Leak Detector

**AI Financial Intelligence · We detect. We protect. You save.**

Upload a bank statement. In seconds, DONRITHIK AI reads every transaction and
surfaces the subscriptions, duplicate payments, hidden charges, and silent
spending drift that drain your wealth — then hands you a personalized savings
plan as a beautiful 16-section PDF report.

[![CI](https://github.com/dubaipandiyaa-byte/money-leak-detector/actions/workflows/ci.yml/badge.svg)](https://github.com/dubaipandiyaa-byte/money-leak-detector/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-3fcf8e?logo=supabase&logoColor=white)](https://supabase.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119eff?logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**[Live app →](https://money-leak-detector.vercel.app)**

</div>

---

## Why it exists

Most people don't lose money in one dramatic moment — they lose it silently:
the trial that became a subscription, the duplicate charge nobody noticed, the
bank fee buried on page four, the spending drift that eats a savings rate one
percent at a time. Money Leak Detector was built to catch exactly that.

**Privacy first:** your statement is parsed and analyzed **entirely in your
browser** — the raw file never leaves your device. Only the finished report is
(optionally) saved to your account so you can revisit it from any device.

## Key features

- 📄 **Universal statement input** — PDF or CSV from any bank, any currency,
  up to 20 MB, with dedicated parsing for wrapped multi-line narrations
  (UPI/NEFT/IMPS and other Indian bank formats included)
- 🧠 **On-device AI analysis** — transaction scanning, leak detection,
  subscription discovery, duplicate-payment detection, cash-flow and
  savings-rate analysis; nothing uploaded during analysis
- 📊 **16-section intelligence report** — leaks, subscriptions, merchant
  analysis, category breakdowns, cash flow, personalized savings plan, and a
  financial score — exportable as a personalized PDF
- 🔐 **Real accounts** — Supabase Auth with email/password *and* native
  Google Sign-In; reports sync to Postgres guarded by row-level security
- 📱 **One codebase, every platform** — the same Next.js app powers the
  website and the Android app (Capacitor remote-URL shell), so every web
  deploy updates the app instantly — no store re-release
- 🎬 **Cinematic noir design** — a black-and-gold design language with brand
  artwork, Framer Motion, and an app-exclusive full-screen login experience
- 📚 **History on any device** — every analyzed statement saved to your
  account, one tap away

## Screenshots

> 📸 *Screenshots coming with the public launch — placeholders below.*

| Landing | Analysis | Report | Android app |
|:---:|:---:|:---:|:---:|
| *coming soon* | *coming soon* | *coming soon* | *coming soon* |

<div align="center">
<img src="public/images/auth-guardians.png" alt="The AI guardians — brand artwork" width="640" />
</div>

## Technology stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router, Server Actions, middleware auth guard) + **React 19** |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS 4** design-token theme · **Framer Motion 12** · **Lucide** icons |
| Auth & database | **Supabase** — Auth (email + Google), Postgres with row-level security |
| Statement parsing | **pdf.js** + custom multi-line/multi-currency analyzer (`lib/analyzer.ts`) |
| PDF reports | Client-side generation (`lib/reportPdf.ts`) |
| Android | **Capacitor 8** remote-URL shell — native plugins for Google Sign-In (Credential Manager), PDF sharing, splash, back-button handling |
| Google Sign-In | Web: Supabase OAuth (PKCE) · Android: native ID token → `signInWithIdToken` |
| Hosting | **Vercel** |

## Getting started

### 1. Clone & install

```bash
git clone https://github.com/dubaipandiyaa-byte/money-leak-detector.git
cd money-leak-detector
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your [Supabase](https://supabase.com) project URL and anon key
(Dashboard → Project Settings → API). No server-side secrets are needed.

### 3. Set up the database

Run [`supabase-schema.sql`](supabase-schema.sql) once in the Supabase
**SQL Editor** — it creates the `reports` table with row-level security so
users can only ever read their own reports.

### 4. Run

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # eslint
```

### Optional: Google Sign-In

1. Create a **Web application** OAuth client in Google Cloud Console with
   redirect URI `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
2. Enable the **Google** provider in Supabase and paste the client ID + secret
3. Set `NEXT_PUBLIC_GOOGLE_AUTH=1` in `.env.local`

### Optional: Android app

The Android app is a thin native shell that loads the deployed web app —
point `server.url` in [`capacitor.config.ts`](capacitor.config.ts) at your
deployment, then:

```bash
npx cap sync android
# open android/ in Android Studio and run, or:
cd android && ./gradlew assembleDebug
```

For native Google Sign-In on Android, additionally create an **Android**
OAuth client (package name + your keystore's SHA-1) in the same Google Cloud
project, and put your Web client ID in
`android/app/src/main/res/values/strings.xml` → `google_web_client_id`.

## Project structure

```
├── app/                  # Next.js App Router
│   ├── page.tsx          #   landing page
│   ├── analyze/          #   upload → AI analysis → report (auth-guarded)
│   ├── dashboard/        #   AI Command Center
│   ├── history/          #   saved reports
│   ├── login/ signup/    #   auth (login has an app-only cinematic variant)
│   └── auth/callback/    #   Supabase code exchange
├── components/
│   ├── analyze/          #   upload flow, scan screen, report view
│   ├── auth/             #   auth shells, Google button, fields
│   ├── landing/          #   hero, showcase, pricing, FAQ…
│   └── ui/               #   shared noir UI primitives
├── lib/
│   ├── analyzer.ts       #   the statement analysis engine (client-side)
│   ├── reportPdf.ts      #   PDF report generator
│   └── supabase/         #   browser/server clients + report queries
├── android/              # Capacitor Android project (native plugins live here)
├── capacitor-shell/      # offline fallback page for the app
├── resources/            # source artwork for icons & splash screens
├── supabase-schema.sql   # database schema + RLS policies
└── middleware.ts         # session refresh + route protection
```

## Roadmap

- [ ] Play Store release (signed AAB, store listing)
- [ ] iOS app — the Capacitor shell is iOS-ready by design
- [ ] Scanned-PDF statements (OCR) and Excel input
- [ ] LLM-powered Guardian chat grounded in your real report
- [ ] Automated test suite (analyzer golden tests, E2E auth flows)
- [ ] Content-Security-Policy hardening
- [ ] More bank-format parsers — contributions especially welcome here

## Contributing

Issues and pull requests are welcome!

1. Fork → branch → make your change
2. Keep `npx tsc --noEmit` and `npm run lint` clean
3. Don't commit secrets, statements, or generated artifacts (`.gitignore`
   already covers them — please keep it that way)
4. For bank-parser contributions, include an **anonymized** sample of the
   format (fake names/numbers) so the parser can be tested

> **Note:** the project does not yet have an open-source license. Until one is
> added, the code is source-available for reading and evaluation; reuse rights
> are reserved. A license decision is on the launch checklist.

## Security

- Statement analysis is client-side; raw statements are never uploaded
- Saved reports are protected by Postgres **row-level security** — verified
  against anonymous and cross-user access
- No server-side secrets exist in this repository or its git history

**Found a vulnerability?** Please report it privately via
**GitHub → Security → Report a vulnerability** (Security Advisories) rather
than opening a public issue. You'll get a response as fast as humanly possible.

## Acknowledgements

Built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com),
[Capacitor](https://capacitorjs.com), [Tailwind CSS](https://tailwindcss.com),
[Framer Motion](https://www.framer.com/motion/),
[pdf.js](https://mozilla.github.io/pdf.js/), and
[Lucide](https://lucide.dev). Brand artwork by DONRITHIK LABS.

---

<div align="center">

**DONRITHIK LABS** · *We caught you. We save you.*

</div>
