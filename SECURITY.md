# Security Policy

## Supported versions

The public beta (`v1.0.0-beta`) and the live deployment at
https://money-leak-detector.vercel.app are the supported surfaces.

## Reporting a vulnerability

Please report vulnerabilities **privately** via
[GitHub Security Advisories](https://github.com/dubaipandiyaa-byte/money-leak-detector/security/advisories/new)
— never in a public issue. You'll receive a response as quickly as humanly
possible, and credit in the fix release if you'd like it.

Please include reproduction steps and impact. Never include real financial
data in a report — use fabricated statements.

## Security model (what to test against)

- **On-device analysis**: uploaded statements are parsed in the browser and
  must never be transmitted. Any network call carrying statement contents
  during analysis is a vulnerability.
- **Row-level security**: the `reports` table only permits access where
  `auth.uid() = user_id`. Any cross-user read/write is a vulnerability.
- **Auth**: Supabase Auth (email + Google OAuth/ID-token). Session fixation,
  redirect abuse on `/auth/callback`, or auth bypass on protected routes
  (`/analyze`, `/dashboard`, `/history`) are in scope.
- The Supabase anon key and Google client IDs visible in the client are
  **public by design** and are not vulnerabilities on their own.
