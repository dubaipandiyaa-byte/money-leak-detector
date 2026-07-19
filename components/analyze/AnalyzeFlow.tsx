"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileUp,
  FileText,
  ShieldCheck,
  Sparkles,
  ScanSearch,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Repeat2,
  TrendingUp,
} from "lucide-react";
import {
  analyze,
  detectCurrency,
  extractAccountName,
  parseStatement,
  parseTextStatement,
  type Report,
  type Txn,
} from "@/lib/analyzer";
import { SAMPLE_STATEMENT_CSV } from "@/lib/sampleStatement";
import { clearReport, loadReport, saveReport } from "@/lib/reportStorage";
import { createClient } from "@/lib/supabase/client";
import { saveReportToDb } from "@/lib/supabase/reports";
import { ReportView, type SyncStatus } from "./ReportView";

type Stage = "upload" | "scanning" | "report";

// Client-side PDF/CSV parsing runs entirely in the browser's main thread, so
// an oversized file (e.g. a multi-year statement export) can hang or crash
// the tab rather than just being slow. This caps it well above what a
// realistic few-months bank statement export needs, in text form.
const MAX_FILE_MB = 20;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const SCAN_STEPS = [
  { icon: ScanSearch, label: "Scanning transactions" },
  { icon: Droplets, label: "Finding hidden money leaks" },
  { icon: Repeat2, label: "Detecting subscriptions" },
  { icon: TrendingUp, label: "Analyzing cash flow" },
  { icon: FileText, label: "Generating your financial report" },
];

export function AnalyzeFlow({ uploadExtras }: { uploadExtras?: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>("upload");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [scanStep, setScanStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [reading, setReading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("checking");
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore the last analysis on mount so a page refresh doesn't lose it.
  // Skipped past the upload/scanning stages since this isn't a fresh run.
  // localStorage doesn't exist during SSR, so this must run post-hydration
  // rather than as a lazy useState initializer (which would mismatch the
  // server-rendered upload screen).
  useEffect(() => {
    const saved = loadReport();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReport(saved.report);
      setFileName(saved.fileName);
      setStage("report");
    }
    // A restored local report predates this check and may not actually be
    // in the account yet (e.g. analyzed before signing in), so this only
    // reflects sign-in state, not "this report is saved" — the "saved"
    // status is reserved for a report that was just freshly analyzed and
    // confirmed written to the database, below.
    createClient()
      .auth.getUser()
      .then(({ data }) => setSyncStatus(data.user ? "signed-in" : "anonymous"))
      .catch(() => setSyncStatus("anonymous"));
  }, []);

  const runAnalysis = useCallback((txns: Txn[], currency: string, name: string, accountName?: string) => {
    if (txns.length < 5) {
      setError(
        "I couldn't read enough transactions from that file. Statements work best as your bank's PDF or CSV export — make sure it contains the transaction table (date, description, amount)."
      );
      return;
    }
    setError(null);
    setFileName(name);
    const result = analyze(txns, currency, accountName);
    setStage("scanning");
    setScanStep(0);

    // cinematic scan: advance a step every ~850ms, then reveal the report
    SCAN_STEPS.forEach((_, i) => {
      setTimeout(() => setScanStep(i), i * 850);
    });
    setTimeout(() => {
      setReport(result);
      setStage("report");
      saveReport(result, name);

      // Non-blocking: if signed in, also persist to the account so it's
      // reachable from any device. A failure here never interrupts the
      // local report the user is already looking at.
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then(async ({ data }) => {
          if (!data.user) {
            setSyncStatus("anonymous");
            return;
          }
          const { error: dbError } = await saveReportToDb(supabase, data.user.id, result, name);
          setSyncStatus(dbError ? "save-error" : "saved");
        })
        .catch(() => setSyncStatus("anonymous"));
    }, SCAN_STEPS.length * 850 + 500);
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (file.size > MAX_FILE_BYTES) {
        setError(
          `That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB — larger than the ${MAX_FILE_MB}MB limit. Try exporting a shorter date range from your bank (e.g. 3-6 months at a time) and analyze it in parts.`
        );
        return;
      }
      if (file.size === 0) {
        setError("That file is empty. Try re-exporting or re-downloading it from your bank.");
        return;
      }
      try {
        if (/\.pdf$/i.test(file.name)) {
          setReading(true);
          const { extractPdfLines } = await import("@/lib/pdf");
          const lines = await extractPdfLines(await file.arrayBuffer());
          setReading(false);

          if (lines.filter((l) => l.trim()).length < 4) {
            setError(
              "This PDF contains almost no readable text — it's probably a scanned image of a statement. I need a digital PDF (downloaded from your bank's app or website) or a CSV export."
            );
            return;
          }

          const txns = parseTextStatement(lines);

          if (txns.length < 5) {
            setError(
              `I could read the PDF (${lines.length} lines of text) but only recognized ${txns.length} transaction row${txns.length === 1 ? "" : "s"}. This usually means the statement uses an unusual table layout. Your bank's CSV export will work — or send us the layout and we'll add support.`
            );
            return;
          }
          const fullText = lines.join("\n");
          runAnalysis(txns, detectCurrency(fullText), file.name, extractAccountName(fullText));
        } else if (/\.csv$|\.txt$/i.test(file.name)) {
          const text = await file.text();
          runAnalysis(parseStatement(text), detectCurrency(text), file.name, extractAccountName(text));
        } else {
          setError("I read PDF and CSV statements. Export either format from your bank and drop it here.");
        }
      } catch (err) {
        console.error("statement read failed:", err);
        setReading(false);
        const name = err instanceof Error ? err.name : "";
        setError(
          name === "PasswordException"
            ? "This PDF is password-protected. Remove the password (open it and re-save, or download an unprotected copy from your bank) and try again."
            : "That PDF couldn't be read. Try re-downloading it from your bank, or use the CSV export instead."
        );
      }
    },
    [runAnalysis]
  );

  // Stage progression is plain conditional rendering (no exit-animation
  // dependency): AnimatePresence mode="wait" stalls forever in hidden tabs
  // where requestAnimationFrame is frozen. Entrances still animate.
  return (
    <>
      {stage === "upload" && (
        <motion.div
          key="upload"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="mx-auto max-w-2xl">
          {/* drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload bank statement"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragOver
                ? "border-gold bg-[rgba(212,175,55,0.09)] shadow-glow-gold"
                : "border-[rgba(212,175,55,0.28)] bg-white/[0.03] hover:border-[rgba(212,175,55,0.5)] hover:bg-white/[0.08]/[0.05]"
            }`}
          >
            {/* soft AI glow behind the panel content */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.1),transparent)]"
            />
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.csv,.txt"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? undefined)}
            />
            <motion.div
              animate={dragOver ? { scale: 1.06, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative mx-auto grid h-20 w-20 place-items-center"
            >
              <span aria-hidden className="absolute inset-0 animate-breathe rounded-3xl bg-[rgba(212,175,55,0.15)]" />
              <span className="btn-gold relative grid h-16 w-16 place-items-center rounded-2xl">
                {reading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    <ScanSearch className="h-8 w-8" />
                  </motion.span>
                ) : (
                  <FileUp className="h-8 w-8" />
                )}
              </span>
            </motion.div>
            <h2 className="relative mt-6 text-[24px] font-bold tracking-tight text-ivory">
              {reading ? "Reading your PDF…" : "Ready to discover where your money goes?"}
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ash">
              Drag &amp; drop your bank statement here — PDF or CSV from any
              bank, in any currency, up to {MAX_FILE_MB}MB. DONRITHIK AI reads
              every transaction and builds your full intelligence report.
            </p>
            <span className="btn-gold relative mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13.5px] font-bold uppercase tracking-[0.08em]">
              <FileUp className="h-4 w-4" />
              Upload Statement
            </span>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold text-parchment">
                <FileText className="h-3.5 w-3.5 text-gold" /> PDF
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold text-parchment">
                <FileText className="h-3.5 w-3.5 text-gold" /> CSV
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold text-parchment">
                Max {MAX_FILE_MB}MB
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] px-3.5 py-1.5 text-[12px] font-semibold text-gold-bright">
                <ShieldCheck className="h-3.5 w-3.5" />
                Analyzed on your device — never uploaded
              </span>
            </div>
          </div>

          {/* sample */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="text-[13px] text-ash">No statement handy?</span>
            <button
              type="button"
              onClick={() =>
                runAnalysis(
                  parseStatement(SAMPLE_STATEMENT_CSV),
                  detectCurrency(SAMPLE_STATEMENT_CSV),
                  "sample-statement.csv"
                )
              }
              className="glass-noir inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-ivory transition-all hover:border-[rgba(212,175,55,0.4)] active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              Try the sample statement
            </button>
          </div>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex items-start gap-3 rounded-2xl border border-risk/30 bg-risk/10 px-5 py-4 text-[13.5px] leading-relaxed text-[#f6a08a]"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {uploadExtras}
        </motion.div>
      )}

      {stage === "scanning" && (
        <motion.div
          key="scanning"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-lg"
        >
          <div className="noise card-noir-gold relative overflow-hidden rounded-[2rem] p-10">
            <div
              aria-hidden
              className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.18),transparent)]"
            />

            {/* AI scan screen — brand video, muted and looping */}
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.35)] shadow-glow-gold">
              <video
                src="/videos/ai-scan.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                className="block h-auto w-full"
              />
            </div>

            <p className="relative mt-6 text-center text-[13px] font-medium text-ash">
              Analyzing {fileName}
            </p>

            <div className="relative mt-6 space-y-3">
              {SCAN_STEPS.map((s, i) => {
                const done = i < scanStep;
                const active = i === scanStep;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: done || active ? 1 : 0.35, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${
                        done
                          ? "bg-emerald-500/15 text-emerald-300"
                          : active
                            ? "bg-[rgba(212,175,55,0.15)] text-gold-bright"
                            : "bg-white/[0.05] text-ash/60"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                    </span>
                    <span
                      className={`text-[14px] font-medium ${
                        done ? "text-ash" : active ? "text-ivory" : "text-ash/60"
                      }`}
                    >
                      {s.label}
                      {active && <span className="ml-1 text-gold-bright">…</span>}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {stage === "report" && report && (
        <motion.div
          key="report"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="rounded-[2rem] bg-canvas p-4 shadow-luxe-lg sm:p-8"
        >
          <ReportView
            report={report}
            fileName={fileName}
            syncStatus={syncStatus}
            onReset={() => {
              clearReport();
              setReport(null);
              setStage("upload");
            }}
          />
        </motion.div>
      )}
    </>
  );
}
