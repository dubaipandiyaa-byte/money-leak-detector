"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

function greetingForHour(h: number) {
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

interface GreetingProps {
  name: string;
  potentialSavings: number;
  currency: string;
}

/** Time-aware AI greeting with the account's real potential-savings figure. */
export function Greeting({ name, potentialSavings, currency }: GreetingProps) {
  // Render a stable greeting on the server, personalize after hydration —
  // the server can't know the visitor's local hour, so this setState is a
  // deliberate, necessary correction of a client-only value, not a
  // redundant derived-state effect.
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="text-[30px] font-bold tracking-tight text-graphite sm:text-[36px]">
        {greeting}, {name}.
      </h1>
      <p className="mt-1.5 text-[16px] text-slate-ink">
        {potentialSavings > 0 ? (
          <>
            I found{" "}
            <AnimatedNumber
              value={potentialSavings}
              prefix={`${currency} `}
              className="font-bold tabular-nums text-emerald-600"
            />{" "}
            you could save this month.
          </>
        ) : (
          "Your latest report is looking clean — no major savings left on the table."
        )}
      </p>
    </motion.div>
  );
}
