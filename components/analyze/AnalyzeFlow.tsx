"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import {
  FileUp,
  FileText,
  ShieldCheck,
  Sparkles,
  ScanSearch,
  BrainCircuit,
  Droplets,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { analyze, parseStatement, type Report } from "@/lib/analyzer";
import { SAMPLE_STATEMENT_CSV } from "@/lib/sampleStatement";
import { ReportView } from "./ReportView";

type Stage = "upload" | "scanning" | "report";

const SCAN_STEPS = [
  { icon: FileText, label: "Reading your statement" },
  { icon: ScanSearch, label: "Categorizing every transaction" },
  { icon: BrainCircuit, label: "Separating routine from wasteful spending" },
  { icon: Droplets, label: "Hunting duplicates, fees and leaks" },
  { icon: Sparkles, label: "Writing your savings plan" },
];

export function AnalyzeFlow() {
  const [stage, setStage] = useState<Stage>("upload");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [scanStep, setScanStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback((csvText: string, name: string) => {
    const txns = parseStatement(csvText);
    if (txns.length < 5) {
      setError(
        "I couldn't read enough transactions from that file. Export your statement as CSV from your bank (with Date, Description and Amount or Debit/Credit columns) and try again."
      );
      return;
    }
    setError(null);
    setFileName(name);
    const result = analyze(txns);
    setStage("scanning");
    setScanStep(0);

    // cinematic scan: advance a step every ~900ms, then reveal the report
    SCAN_STEPS.forEach((_, i) => {
      setTimeout(() => setScanStep(i), i * 900);
    });
    setTimeout(() => {
      setReport(result);
      setStage("report");
    }, SCAN_STEPS.length * 900 + 500);
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!/\.csv$|\.txt$/i.test(file.name)) {
        setError("For now I read CSV statements (PDF & Excel support is coming). Export as CSV from your bank and drop it here.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => runAnalysis(String(reader.result ?? ""), file.name);
      reader.readAsText(file);
    },
    [runAnalysis]
  );

  return (
    <AnimatePresence mode="wait">
      {stage === "upload" && (
        <motion.div
          key="upload"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-2xl"
        >
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
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragOver
                ? "border-emerald-400 bg-emerald-50/60 shadow-glow-emerald"
                : "border-black/10 bg-white/70 hover:border-emerald-300 hover:bg-white"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
            />
            <motion.div
              animate={dragOver ? { scale: 1.06, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-graphite shadow-[0_16px_40px_-8px_rgba(20,24,29,0.45)]"
            >
              <FileUp className="h-9 w-9 text-lime-electric" />
            </motion.div>
            <h2 className="mt-6 text-[22px] font-bold tracking-tight text-graphite">
              Drop your bank statement here
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-slate-ink">
              CSV export from any bank — or click to browse. DONRITHIK AI reads
              every transaction and builds your full money report.
            </p>
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Analyzed on your device — never uploaded, never stored
            </p>
          </div>

          {/* sample */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="text-[13px] text-quiet">No statement handy?</span>
            <button
              type="button"
              onClick={() => runAnalysis(SAMPLE_STATEMENT_CSV, "sample-statement.csv")}
              className="inline-flex items-center gap-2 rounded-full bg-graphite px-6 py-3 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-all hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)] active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-lime-electric" />
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
                className="mt-6 flex items-start gap-3 rounded-2xl bg-risk-soft px-5 py-4 text-[13.5px] leading-relaxed text-risk"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {stage === "scanning" && (
        <motion.div
          key="scanning"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-lg"
        >
          <div className="noise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-graphite via-[#1a2129] to-[#11291f] p-10 text-white shadow-luxe-lg">
            <div aria-hidden className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px]" />

            {/* pulsing core */}
            <div className="relative mx-auto grid h-28 w-28 place-items-center" aria-hidden>
              <span className="absolute inset-0 animate-breathe rounded-full bg-emerald-500/20" />
              <span className="absolute inset-0 animate-orbit">
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-electric shadow-glow-lime" />
              </span>
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.08] ring-1 ring-white/15">
                <BrainCircuit className="h-8 w-8 text-lime-electric" strokeWidth={1.8} />
              </span>
            </div>

            <p className="relative mt-6 text-center text-[13px] font-medium text-white/50">
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
                        done ? "bg-emerald-500/20 text-emerald-300" : active ? "bg-lime-electric/15 text-lime-electric" : "bg-white/[0.06] text-white/40"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                    </span>
                    <span className={`text-[14px] font-medium ${done ? "text-white/60" : active ? "text-white" : "text-white/40"}`}>
                      {s.label}
                      {active && <span className="shimmer-text ml-1">…</span>}
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
        >
          <ReportView
            report={report}
            fileName={fileName}
            onReset={() => {
              setReport(null);
              setStage("upload");
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
