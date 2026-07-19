# Play Store Release Guide

Everything for the Google Play release. Assets are pre-generated in this
folder; the only steps that can't be automated are keystore creation, Play
Console signup, and form acceptance (marked **[OWNER]**).

## Ready-made assets (this folder)

| Asset | File | Play requirement |
|---|---|---|
| Hi-res icon | `icon-512.png` | 512×512 PNG ✓ |
| Feature graphic | `feature-graphic-1024x500.png` | 1024×500 ✓ |
| Phone screenshots | `screenshots/` (4) | min 2, 1080×2400 ✓ |

## Store listing copy (paste-ready)

**App name:** Money Leak Detector

**Short description** (≤80 chars):
> AI reads your bank statement and finds the leaks draining your wealth.

**Full description:**
> **We detect. We protect. You save.**
>
> Money Leak Detector reads your bank statement and finds what's silently
> draining your wealth: forgotten subscriptions, duplicate payments, hidden
> charges, bank fees, and spending drift.
>
> 🧠 **Private by design** — your statement is analyzed on your device.
> The raw file is never uploaded.
>
> 📊 **A complete intelligence report** — leaks, subscriptions, merchant and
> category analysis, cash flow, savings rate, your financial score, and a
> personalized savings plan. Export it as a beautiful PDF.
>
> 🏦 **Works with your bank** — PDF or CSV statements, any bank, any
> currency, with first-class support for Indian formats (UPI, NEFT, IMPS).
>
> 🔐 **Your reports, everywhere** — sign in with Google or email and your
> reports follow you across devices.
>
> Free during beta.

**Category:** Finance · **Tags:** personal finance, budgeting
**Privacy policy URL:** https://money-leak-detector.vercel.app/privacy
**Contact email:** the address on the Play Console account

## Data safety form answers

| Question | Answer |
|---|---|
| Does the app collect or share user data? | **Collects** (no sharing with third parties) |
| Personal info → Email address | Collected · Required for account · Not shared · Encrypted in transit · Deletable |
| Financial info → Other financial info | **Report summaries only** (totals/categories the user chooses to save) · Optional · Not shared · Encrypted in transit · Deletable |
| Files & docs (the statement itself) | **Not collected** — processed on device, never transmitted |
| Data encrypted in transit? | Yes (TLS) |
| Can users request deletion? | Yes (account deletion removes reports via cascade) |

**Content rating questionnaire:** Finance category, no user-generated public
content, no gambling → expect **Everyone**.

## Release build — technical steps

`android/app/build.gradle` already contains a release signing config that
activates automatically when `android/keystore.properties` exists (the file
and all keystores are gitignored).

1. **[OWNER] Create the release keystore** (choose your own passwords):
   ```bash
   keytool -genkey -v -keystore mld-release.jks -keyalg RSA -keysize 2048 \
     -validity 10000 -alias mld
   ```
2. **[OWNER]** Create `android/keystore.properties`:
   ```properties
   storeFile=C:/absolute/path/to/mld-release.jks
   storePassword=***
   keyAlias=mld
   keyPassword=***
   ```
3. Extract the **release SHA-1**:
   `keytool -list -v -keystore mld-release.jks -alias mld`
4. **[OWNER]** In Google Cloud Console (project `civil-lambda-502913-u4`) add a
   **second Android OAuth client**: package `com.donrithik.moneyleakdetector`
   + the release SHA-1 — without this, Google Sign-In fails in the release
   build. (If you enroll in **Play App Signing**, repeat with Google's
   app-signing SHA-1 from Play Console → App integrity.)
5. Build the bundle:
   ```bash
   cd android && ./gradlew bundleRelease   # → app/build/outputs/bundle/release/app-release.aab
   ```
6. Bump `versionCode`/`versionName` in `android/app/build.gradle` for every
   subsequent upload.

## Play Console — owner-only steps

1. **[OWNER]** Create the developer account at play.google.com/console
   ($25 one-time, identity verification required)
2. **[OWNER]** Create app → fill Store listing with the copy + assets above
3. **[OWNER]** Complete Data safety + Content rating with the answers above
4. Upload the AAB to **Internal testing** first; add tester emails
5. Promote to **Production** review once internal testing is clean

## Account-deletion policy compliance

Play requires in-app account deletion plus a web deletion resource for any
app with account creation. Both are implemented:

- **In-app / web:** https://money-leak-detector.vercel.app/data-retention has
  a self-service "Delete my account" flow (use this URL in the Play data
  form's *"Account deletion URL"* field)
- **[OWNER] one-time setup:** run the `delete_user()` section at the bottom
  of [`supabase-schema.sql`](../supabase-schema.sql) in the Supabase SQL
  Editor — until then the button degrades gracefully to the manual channel

**"What's new" text for the first upload:**
> First public beta — AI statement analysis, 16-section PDF reports,
> Google Sign-In, and cross-device report history.

## App Links note

`public/.well-known/assetlinks.json` currently carries the **debug**
certificate fingerprint. After the release keystore exists, append the
release SHA-256 (and Google's app-signing SHA-256 if using Play App
Signing) to the `sha256_cert_fingerprints` array and redeploy — otherwise
verified app links won't auto-open the release build.

## Pre-submission checklist

- [ ] Release keystore created and backed up somewhere safe (losing it means
      losing the app identity)
- [ ] Release Android OAuth client added (Google Sign-In verified in the
      release build, not just debug)
- [ ] `bundleRelease` builds and installs cleanly
- [ ] Deep links still verified (`money-leak-detector.vercel.app`)
- [ ] Version code bumped
- [ ] Privacy policy page reachable
