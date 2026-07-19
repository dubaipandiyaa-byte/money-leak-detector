import { NoirLogo } from "@/components/ui/NoirLogo";

/**
 * Money Leak Detector wordmark. Delegates to the noir gold brand mark so
 * every page — product and marketing alike — carries one identity.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return <NoirLogo compact={compact} />;
}
