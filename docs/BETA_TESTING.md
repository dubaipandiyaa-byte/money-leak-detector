# Beta Testing Guide

Thanks for testing Money Leak Detector! This checklist covers everything worth
exercising. Report anything broken with the
[🐛 Bug report](https://github.com/dubaipandiyaa-byte/money-leak-detector/issues/new/choose)
template — parsing problems go in the 🏦 Bank format template.

> ⚠️ **Never share a real statement.** For parser reports, recreate the layout
> with fake names, numbers, and amounts.

## Where to test

- **Web:** https://money-leak-detector.vercel.app
- **Android:** APK from the
  [latest release](https://github.com/dubaipandiyaa-byte/money-leak-detector/releases)
  (enable "Install unknown apps" when prompted)

## Core checklist (both platforms)

- [ ] Sign up with email → confirmation mail arrives → account activates
- [ ] Sign in / sign out; session survives closing and reopening
- [ ] "Continue with Google" completes and lands you signed in
- [ ] Upload a CSV statement → analysis runs → report renders
- [ ] Upload a text-based PDF statement → report renders
- [ ] Report numbers are *correct*: income, spend, net, currency ← the most
      valuable thing you can verify
- [ ] Download PDF report → opens correctly, shows your name
- [ ] Report saved to account → appears in History → reopens from History
- [ ] Forgot-password flow end to end
- [ ] Wrong password / bad file / oversized file show friendly errors

## Android-specific

- [ ] Install succeeds; app icon and splash artwork look right
- [ ] Cinematic login screen appears (artwork background, Google + Email buttons)
- [ ] Back button: navigates back through pages; minimizes at home
- [ ] PDF export opens the native share sheet (Gmail/Drive/etc.)
- [ ] Airplane mode → app shows offline page → Retry recovers
- [ ] Keyboard doesn't cover inputs; rotation doesn't break layout
- [ ] Report your device model + Android version in
      [the device matrix issue](https://github.com/dubaipandiyaa-byte/money-leak-detector/issues/6)

## Web-specific

- [ ] Desktop, tablet, and phone browser layouts
- [ ] Dark-noir rendering has no unreadable text anywhere you can find

## How feedback is triaged

| Priority | What | Response target |
|---|---|---|
| **P0** | Wrong money math, auth failures, data privacy | Same day |
| **P1** | Broken flow on a specific device/bank | This week |
| **P2** | Parser gaps (needs anonymized sample), UX friction | Batched |
| **P3** | Feature ideas → Discussions first | Roadmap review |

Maintainer triage rhythm: label within 24 h, first response within 48 h.
