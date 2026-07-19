import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Money Leak Detector — Stop Losing Money You Never Meant to Spend",
    template: "%s · Money Leak Detector",
  },
  description:
    "Money Leak Detector continuously finds subscriptions, forgotten bills, duplicate payments, hidden charges, and wasteful spending patterns before they drain your wealth. Your AI financial guardian, by DONRITHIK LABS.",
  keywords: [
    "AI finance",
    "money leaks",
    "subscription tracker",
    "duplicate payment detection",
    "hidden fees",
    "financial intelligence",
  ],
  openGraph: {
    title: "Money Leak Detector — AI Financial Intelligence",
    description:
      "Discover where money silently disappears before you even realize it. Your elite AI financial guardian.",
    type: "website",
    siteName: "Money Leak Detector",
  },
  twitter: {
    card: "summary_large_image",
    title: "Money Leak Detector — AI Financial Intelligence",
    description:
      "Discover where money silently disappears before you even realize it. Your elite AI financial guardian.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // draw behind the iPhone notch; safe-area padding in globals.css
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
