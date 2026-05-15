"use client";

import { motion } from "framer-motion";

export function Ornament({ label }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
      className="flex items-center justify-center gap-5 text-gold"
    >
      <span className="h-px w-14 bg-gold/40 sm:w-20" />
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="16" cy="16" r="2.5" />
        <circle cx="16" cy="16" r="7" />
        <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
        <path d="M6 6l4 4M22 22l4 4M6 26l4-4M22 10l4-4" />
      </svg>
      {label && (
        <span className="text-[0.65rem] uppercase tracking-[0.32em] text-gold">
          {label}
        </span>
      )}
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="16" cy="16" r="2.5" />
        <circle cx="16" cy="16" r="7" />
        <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
        <path d="M6 6l4 4M22 22l4 4M6 26l4-4M22 10l4-4" />
      </svg>
      <span className="h-px w-14 bg-gold/40 sm:w-20" />
    </motion.div>
  );
}

export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <circle cx="100" cy="100" r="98" />
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="60" />
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="20" />
      {/* Trig values rounded to 3 decimal places so server SSR and client
          render emit identical strings (otherwise React hydration mismatches). */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 16;
        const x1 = +(100 + Math.cos(a) * 20).toFixed(3);
        const y1 = +(100 + Math.sin(a) * 20).toFixed(3);
        const x2 = +(100 + Math.cos(a) * 98).toFixed(3);
        const y2 = +(100 + Math.sin(a) * 98).toFixed(3);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8 + Math.PI / 16;
        const cx = +(100 + Math.cos(a) * 70).toFixed(3);
        const cy = +(100 + Math.sin(a) * 70).toFixed(3);
        return <circle key={`p-${i}`} cx={cx} cy={cy} r="8" />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 12;
        const cx = +(100 + Math.cos(a) * 50).toFixed(3);
        const cy = +(100 + Math.sin(a) * 50).toFixed(3);
        return <circle key={`s-${i}`} cx={cx} cy={cy} r="4" />;
      })}
    </svg>
  );
}

export function SectionLabel({
  eyebrow,
  title,
  script,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Ornament label={eyebrow} />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
      >
        {title}
        {script && (
          <>
            {" "}
            <span className="font-script text-5xl text-gold-deep sm:text-6xl lg:text-7xl">
              {script}
            </span>
          </>
        )}
      </motion.h2>
    </div>
  );
}
