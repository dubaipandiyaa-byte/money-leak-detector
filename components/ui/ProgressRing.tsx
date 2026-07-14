"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  trackColor?: string;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

/** Animated circular progress ring that draws itself when in view. */
export function ProgressRing({
  value,
  size = 120,
  stroke = 9,
  trackColor = "rgba(20,24,29,0.06)",
  color = "#10b981",
  children,
  className,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={inView ? { strokeDashoffset: c * (1 - value / 100) } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
