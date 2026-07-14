import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
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
};

export const viewport: Viewport = {
  themeColor: "#fbfcfd",
  width: "device-width",
  initialScale: 1,
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
