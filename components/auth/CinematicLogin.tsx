"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleButton } from "@/components/auth/GoogleButton";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic full-screen login. The guardians key art fills the viewport
 * (cover on portrait/mobile — the artwork's own aspect ratio, so nothing
 * meaningful is cropped; contained beside the form column on wide
 * screens so the robots and shield always stay whole), with a slow
 * decorative zoom and a soft black gradient for readability.
 *
 * Sign-in is a two-step chooser: "Continue with Google" (primary) and
 * "Continue with Email", which reveals the server-action email form
 * passed in as children — keeping the form itself server-rendered.
 */
export function CinematicLogin({
  next,
  startOnEmail,
  children,
}: {
  next: string;
  /** open with the email form visible (e.g. returning from a login error) */
  startOnEmail: boolean;
  children: React.ReactNode;
}) {
  const [method, setMethod] = useState<"choice" | "email">(
    startOnEmail ? "email" : "choice"
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      {/* ── key art: full-bleed on mobile, left pane on wide screens ── */}
      <div className="absolute inset-0 overflow-hidden lg:right-[44%]">
        <div className="absolute inset-0 animate-login-zoom">
          <Image
            src="/images/login-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover object-top lg:object-contain lg:object-center"
          />
        </div>
        {/* soft black gradient for readability — lighter on wide screens
         * where the content never overlaps the artwork */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.6)_72%,rgba(0,0,0,0.82)_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_70%,rgba(0,0,0,0.65)_100%)]"
        />
      </div>

      {/* wide screens: noir field behind the form column */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 hidden w-[44%] bg-noir lg:block"
      >
        <div className="absolute -left-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.1),transparent)]" />
      </div>

      {/* ── content column ── */}
      <div className="relative flex min-h-dvh flex-col px-6 sm:px-8 lg:ml-[56%] lg:w-[44%] lg:px-12">
        {/* artwork carries the branding on mobile: the growing spacer pushes
         * the actions to the bottom of the screen, keeping the logo, robots
         * and shield in clear view (guarded on very short screens) */}
        <div className="min-h-[40dvh] flex-1" />

        <div className="mx-auto w-full max-w-sm">
          <AnimatePresence mode="wait" initial={false}>
            {method === "choice" ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="mb-7 text-center">
                  <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-white">
                    Welcome back.
                  </h1>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                    Sign in to continue your{" "}
                    <span className="font-semibold text-gold-bright">
                      Financial Intelligence
                    </span>{" "}
                    journey.
                  </p>
                </div>

                <GoogleButton next={next} variant="gold" />

                <button
                  type="button"
                  onClick={() => setMethod("email")}
                  className="mt-3.5 flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm transition-colors hover:border-[rgba(212,175,55,0.4)] hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4 text-gold-bright" strokeWidth={2} />
                  Continue with Email
                </button>

                <p className="mt-7 text-center text-[13px] text-white/60">
                  New to DONRITHIK?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-gold-bright underline-offset-2 hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                <button
                  type="button"
                  onClick={() => setMethod("choice")}
                  className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/70 transition-colors hover:text-gold-bright"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                  All sign-in options
                </button>
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* bottom-anchored with safe-area padding for gesture bars/notches */}
        <div className="pb-[max(2rem,calc(env(safe-area-inset-bottom)+1.25rem))] lg:flex-1 lg:pb-0" />
      </div>
    </div>
  );
}
