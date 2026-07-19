import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Money Leak Detector — Android shell configuration.
 *
 * Remote-URL architecture: the native app's WebView loads the production
 * web app directly, so Web and Android share ONE deployed codebase.
 * Every Vercel deployment updates the Android app automatically — no
 * store re-release needed for web-side changes.
 *
 * `webDir` holds only a tiny offline fallback page; at runtime the
 * WebView navigates straight to `server.url`.
 */
const config: CapacitorConfig = {
  appId: "com.donrithik.moneyleakdetector",
  appName: "Money Leak Detector",
  webDir: "capacitor-shell",
  // marks the native shells' WebView requests so the server can render
  // app-only variants (e.g. the cinematic login) without touching web
  appendUserAgent: "MLDNative",
  server: {
    url: "https://money-leak-detector.vercel.app",
    androidScheme: "https",
    // shown from webDir when the remote app can't be reached (offline)
    errorPath: "index.html",
  },
  android: {
    allowMixedContent: false,
  },
  backgroundColor: "#0a0c10",
};

export default config;
