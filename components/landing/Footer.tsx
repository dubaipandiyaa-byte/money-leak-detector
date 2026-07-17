import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

// Every link below points to a page or section that actually exists.
// Entries with no real destination yet (Careers, Press, Brand, Help
// Center, API Docs, Status, Licenses) are intentionally omitted rather
// than left as dead links during Beta.
const columns = [
  {
    title: "Product",
    links: [
      { label: "Leak Detection", href: "/#leak-detection" },
      { label: "Subscription Scanner", href: "/#intelligence" },
      { label: "Duplicate Alerts", href: "/#intelligence" },
      { label: "Health Score", href: "/#intelligence" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About DONRITHIK LABS", href: "/" }],
  },
  {
    title: "Resources",
    links: [{ label: "Security", href: "/privacy" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Data Protection", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-black/[0.05] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-[13.5px] leading-relaxed text-quiet">
              The AI financial guardian that finds where money silently
              disappears — before you even realize it.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11.5px] font-medium text-quiet">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-50">
                <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
                </svg>
              </span>
              AES-256 encrypted · Read-only rails · SOC 2 aligned
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-quiet">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] font-medium text-slate-ink transition-colors hover:text-emerald-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.05] pt-8">
          <p className="text-[12.5px] text-quiet">
            © {new Date().getFullYear()} DONRITHIK LABS. Crafted with intent, every pixel.
          </p>
          <p className="text-[12.5px] text-quiet">
            Money Leak Detector is a financial intelligence tool, not a licensed financial advisor.
          </p>
        </div>
      </div>
    </footer>
  );
}
