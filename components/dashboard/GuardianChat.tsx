"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import type { Report } from "@/lib/analyzer";

interface Msg {
  id: number;
  from: "ai" | "user";
  text: string;
}

/**
 * Rule-based, keyword-matched assistant grounded in the user's real latest
 * report — not a general-purpose AI model. Every number it states comes
 * from the report passed in; if there's no report yet, it says so.
 */
function guardianReply(input: string, report: Report | null): string {
  if (!report) {
    return "I don't have a statement to look at yet — analyze one and I'll be able to answer real questions about it.";
  }

  const q = input.toLowerCase();
  const cur = report.currency;
  const money = (n: number) => `${cur} ${Math.round(n).toLocaleString()}`;
  const subs = report.recurring.filter(
    (r) => r.category === "Subscriptions" || r.category === "Gym & Memberships"
  );

  if (/(subscri|recurring|netflix|gym|stream)/.test(q)) {
    if (subs.length === 0) return "I didn't find any recurring subscriptions or memberships in your latest report.";
    const top = subs[0];
    return `You have ${subs.length} recurring ${subs.length === 1 ? "charge" : "charges"} like this, totalling ${money(subs.reduce((s, r) => s + r.monthly, 0))}/mo. The biggest is ${top.merchant} at ${money(top.monthly)}/mo (${top.count}× charged so far).`;
  }

  if (/(duplicate|double|twice)/.test(q)) {
    if (report.duplicates.length === 0) return "No duplicate charges in your latest report — clean.";
    const d = report.duplicates[0];
    return `I found ${report.duplicates.length} duplicate charge${report.duplicates.length > 1 ? "s" : ""}. ${d.merchant} was charged twice: ${d.dates[0].toLocaleDateString("en-GB")} and ${d.dates[1].toLocaleDateString("en-GB")}, worth ${money(d.amount)}.`;
  }

  if (/(bill|electric|utilit|dewa)/.test(q)) {
    const utilities = report.categories.find((c) => c.category === "Utilities");
    if (!utilities) return "I didn't see a utilities category in your latest report.";
    return `Utilities came to ${money(utilities.total)} across ${utilities.count} charge${utilities.count > 1 ? "s" : ""} in this report.`;
  }

  if (/(fee|charge)/.test(q) && report.fees.length > 0) {
    return `Bank fees and charges totalled ${money(report.fees.reduce((s, f) => s + f.amount, 0))} across ${report.fees.length} entries — usually the easiest money to get back.`;
  }

  if (/(save|saving|money)/.test(q)) {
    return `Following your savings plan frees ${money(report.potentialMonthlySaving)}/month — ${money(report.potentialMonthlySaving * 12)} a year, with no lifestyle change.`;
  }

  if (/(score|health)/.test(q)) {
    return `Your savings rate is ${report.savingsRate}% of income this report. ${report.savingsRate >= 20 ? "That's a healthy rate." : "Getting this closer to 20% is the fastest way to build a real buffer."}`;
  }

  if (/(hello|hi|hey|salam)/.test(q)) {
    return `Hi — I've read ${report.txnCount} transactions from your latest statement. There ${report.recurring.length + report.duplicates.length === 1 ? "is" : "are"} ${report.recurring.length + report.duplicates.length} recurring or duplicate charge${report.recurring.length + report.duplicates.length === 1 ? "" : "s"} worth a look.`;
  }

  return `I've read ${report.txnCount} transactions from your latest statement — ${money(report.potentialMonthlySaving)}/mo in savings is on the table. Try asking me about subscriptions, duplicates, bills, or fees.`;
}

interface GuardianChatProps {
  name: string;
  report: Report | null;
}

/** Floating AI Guardian chat — grounded in the user's real report, not scripted fiction. */
export function GuardianChat({ name, report }: GuardianChatProps) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: "ai",
      text: report
        ? `Hi ${name} — ask me anything about your latest report: leaks, subscriptions, duplicates, fees, or savings.`
        : `Hi ${name} — analyze a statement and I'll be able to answer real questions about it.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function send() {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", text }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { id: nextId.current++, from: "ai", text: guardianReply(text, report) }]);
      setTyping(false);
    }, 1100);
  }

  return (
    <>
      {/* launcher */}
      <motion.button
        type="button"
        aria-label={open ? "Close AI Guardian chat" : "Open AI Guardian chat"}
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/10 text-lime-electric shadow-[0_16px_40px_-8px_rgba(20,24,29,0.55)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "spark"}
            initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        )}
      </motion.button>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[480px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-[1.75rem]"
            role="dialog"
            aria-label="AI Guardian chat"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.05] px-5 py-4">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/10">
                <Sparkles className="h-4.5 w-4.5 text-lime-electric" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-ivory">Your AI Guardian</p>
                <p className="text-[11.5px] text-ash">Rule-based assistant · reads your latest report</p>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    m.from === "ai"
                      ? "max-w-[85%] rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3 text-[13px] leading-relaxed text-ivory shadow-float ring-1 ring-white/10"
                      : "ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-white/[0.08] px-4 py-3 text-[13px] leading-relaxed text-ivory"
                  }
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3.5 shadow-float ring-1 ring-white/10"
                  aria-label="AI Guardian is typing"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      className="h-1.5 w-1.5 rounded-full bg-quiet"
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* input */}
            <form
              className="border-t border-white/[0.08] bg-white/[0.05] p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 ring-1 ring-white/10 focus-within:ring-emerald-300">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about leaks, bills, subscriptions…"
                  aria-label="Message your AI Guardian"
                  className="w-full bg-transparent text-[13.5px] text-ivory outline-none placeholder:text-ash"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/10 text-lime-electric transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                  disabled={!input.trim() || typing}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
