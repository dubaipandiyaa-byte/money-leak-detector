"use client";

import { motion, useInView } from "framer-motion";
import { useId, useRef } from "react";

/* Hand-rolled, motion-first SVG charts — lighter and more controllable
   than a chart library for this design language. */

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

interface AreaSparkProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

/** Smooth animated area chart with gradient fill and draw-on-view stroke. */
export function AreaSpark({
  data,
  width = 280,
  height = 88,
  color = "#10b981",
  className,
  strokeWidth = 2.5,
}: AreaSparkProps) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  const pad = strokeWidth * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (width - pad * 2),
    y: pad + (1 - (v - min) / span) * (height - pad * 2),
  }));
  const line = buildSmoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${id}-fill)`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* live endpoint dot */}
      <motion.circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={4}
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 14 }}
      />
      <motion.circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={4}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        initial={{ scale: 1, opacity: 0.7 }}
        animate={inView ? { scale: [1, 2.4], opacity: [0.7, 0] } : {}}
        transition={{ delay: 1.6, duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
      />
    </svg>
  );
}

interface BarsProps {
  data: { label: string; value: number; accent?: boolean }[];
  height?: number;
  className?: string;
  color?: string;
  accentColor?: string;
}

/** Animated rounded bar chart with per-bar spring rise. */
export function Bars({
  data,
  height = 120,
  className,
  color = "#e8edf0",
  accentColor = "#10b981",
}: BarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div ref={ref} className={`flex items-end gap-2 ${className ?? ""}`} style={{ height }} aria-hidden>
      {data.map((d, i) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <motion.div
            className="w-full rounded-lg"
            style={{
              background: d.accent ? accentColor : color,
              transformOrigin: "bottom",
            }}
            initial={{ height: 0 }}
            animate={inView ? { height: `${(d.value / max) * 82}%` } : {}}
            transition={{
              delay: 0.15 + i * 0.07,
              type: "spring",
              stiffness: 160,
              damping: 20,
            }}
          />
          <span className="text-[10px] font-medium text-quiet">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
