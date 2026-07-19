# Contributing to Money Leak Detector

Thanks for helping catch money leaks! This guide gets you productive fast.

## Development setup

1. **Fork and clone**, then `npm install`
2. `cp .env.example .env.local` and fill in your own
   [Supabase](https://supabase.com) project values (free tier is plenty)
3. Run [`supabase-schema.sql`](supabase-schema.sql) once in your project's
   SQL Editor
4. `npm run dev` → http://localhost:3000

You do **not** need the Android toolchain unless you're touching `android/` —
the entire product logic lives in the web app.

## Before you open a PR

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] You manually tested the flow you touched (upload → report at minimum)
- [ ] No secrets, real statements, or generated artifacts in the diff
- [ ] Commit messages follow the existing style (`feat:`, `fix:`, `docs:` …)

## What we're most excited about

- **Bank parsers** — see the pinned bank-format issue. Always include an
  *anonymized* sample (fake names/numbers, real layout) so we can build a
  regression fixture from it.
- **Tests** — the analyzer needs golden tests; any coverage is a gift.
- Anything labeled `good first issue`.

## Ground rules

- The raw statement must never leave the user's device during analysis —
  don't add network calls to the analysis path.
- The noir/gold design language is intentional; UI changes should fit it.
- Be kind in reviews and issues. We're all here to save people money.

## Security issues

Never open a public issue for a vulnerability — use
[private reporting](https://github.com/dubaipandiyaa-byte/money-leak-detector/security/advisories/new).
See [SECURITY.md](SECURITY.md).

## License note

The project currently has **no open-source license** (all rights reserved
while the licensing decision is finalized). By submitting a contribution you
agree it may be included in the project under the license eventually chosen.
