"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";

interface Msg {
  id: number;
  from: "ai" | "user";
  text: string;
}

const opener: Msg = {
  id: 0,
  from: "ai",
  text: "Hi Raj — I'm watching your accounts right now. Ask me about your leaks, subscriptions, bills, or savings.",
};

/** Scripted demo brain: keyword-matched, calm-guardian voice. */
function guardianReply(input: string): string {
  const q = input.toLowerCase();
  if (/(netflix|stream)/.test(q))
    return "You're on Netflix Premium 4K, but no 4K device has streamed in 94 days. Downgrading to Standard saves AED 672/yr — I can prepare the switch, you just confirm.";
  if (/(gym|fitlab)/.test(q))
    return "FitLab Gym is your biggest leak: AED 349/mo with no check-ins for 11 weeks. Pausing keeps your rate locked; cancelling saves AED 4,188/yr. Your call — I've drafted both.";
  if (/(subscri|recurring)/.test(q))
    return "You have 17 active subscriptions totalling AED 1,412/mo. Five haven't been used in 60+ days — sealing just those frees AED 963 every month.";
  if (/(duplicate|double)/.test(q))
    return "Yesterday at 21:14 I caught two identical AED 249 charges from Emirates Home Fiber, 40 seconds apart. The refund request is drafted — one tap to send it.";
  if (/(bill|electric|dewa)/.test(q))
    return "Your electricity bill is trending 18% above last month — summer tariff starts on your next cycle. I can pre-move AED 120 into your bills buffer so it never touches spending money.";
  if (/(save|saving|money)/.test(q))
    return "This month I've protected AED 1,248 so far. If you seal the 3 high-risk leaks, your yearly recovery reaches AED 11,496 — and your Japan trip goal lands 7 weeks early.";
  if (/(score|health)/.test(q))
    return "Your financial health score is 82, up 6 points this month. The fastest path to 85+: seal the FitLab leak and finish your 3-month emergency fund — you're at 2.8 months now.";
  if (/(goal|japan|trip)/.test(q))
    return "Japan trip is 64% funded. At your current pace you arrive on budget in November — seal the high-risk leaks and I can move that up to late September.";
  if (/(hello|hi|hey|salam)/.test(q))
    return "Hello! All 4 accounts are healthy and monitored. There are 9 open leaks worth AED 963/mo if you'd like to review them.";
  return "I've scanned 1,284 transactions across your 4 accounts this month. 9 leaks are open worth AED 963/mo. Try asking me about Netflix, your gym, duplicates, bills, or your goals.";
}

/** Floating AI Guardian chat — the AI as a character, not a widget. */
export function GuardianChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([opener]);
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
      setMsgs((m) => [...m, { id: nextId.current++, from: "ai", text: guardianReply(text) }]);
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
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-graphite text-lime-electric shadow-[0_16px_40px_-8px_rgba(20,24,29,0.55)]"
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
            <div className="flex items-center gap-3 border-b border-black/[0.05] bg-white/60 px-5 py-4">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-graphite">
                <Sparkles className="h-4.5 w-4.5 text-lime-electric" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-graphite">Your AI Guardian</p>
                <p className="text-[11.5px] text-quiet">Watching 4 accounts · always on</p>
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
                      ? "max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[13px] leading-relaxed text-graphite shadow-float ring-1 ring-black/[0.04]"
                      : "ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-graphite px-4 py-3 text-[13px] leading-relaxed text-white"
                  }
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-float ring-1 ring-black/[0.04]"
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
              className="border-t border-black/[0.05] bg-white/60 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-black/[0.06] focus-within:ring-emerald-300">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about leaks, bills, goals…"
                  aria-label="Message your AI Guardian"
                  className="w-full bg-transparent text-[13.5px] text-graphite outline-none placeholder:text-quiet"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-graphite text-lime-electric transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
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
