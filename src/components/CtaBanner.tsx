"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import BgVideo from "@/components/BgVideo";
import { useSite } from "@/components/SiteContext";

export default function CtaBanner() {
  const site = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
        ref={ref}
        className="relative h-[80svh] min-h-[480px] overflow-hidden bg-ink"
      >
        <motion.div
          style={{ y }}
          className="absolute inset-0 -z-10 will-change-transform"
        >
          <BgVideo src="/videos/cta.mp4" poster={site.ctaImage} />
          {/* Golden-hour wash: warm haze on top, deep plum only at the very bottom for text-zone contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-terracotta/35 via-plum/35 to-plum-deep/70" />
          {/* Warm blush bloom upper-left */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_15%,rgba(232,168,150,0.45),transparent_70%)]" />
          {/* Ruby ember bottom-right */}
          <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_85%_85%,rgba(212,54,94,0.35),transparent_65%)]" />
          {/* Soft cream vignette for premium feel */}
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_50%,transparent_30%,rgba(31,15,41,0.35)_100%)]" />
        </motion.div>

        <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center sm:px-10">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 rounded-full border border-bg/30 bg-bg/10 px-5 py-2 text-[0.65rem] uppercase tracking-[0.42em] text-bg backdrop-blur-md"
          >
            <span className="h-px w-8 bg-bg/60" />
            Let&apos;s Make Something Beautiful
            <span className="h-px w-8 bg-bg/60" />
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-6 font-display text-4xl leading-[1.05] text-bg sm:text-6xl lg:text-7xl"
          >
            Your story is{" "}
            <span className="font-script text-5xl text-blush-soft drop-shadow-[0_4px_20px_rgba(31,15,41,0.4)] sm:text-7xl lg:text-8xl">
              waiting.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-8 max-w-xl text-bg/85 sm:text-lg"
          >
            We take a small number of weddings each season. Reserve early — we
            book six months ahead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
          >
            <a
              href="#contact"
              className="group inline-flex h-[60px] items-center gap-3 rounded-full bg-ruby px-8 text-xs uppercase tracking-[0.28em] text-bg shadow-[0_15px_40px_-12px_rgba(212,54,94,0.6)] transition-all hover:bg-ruby-deep hover:shadow-[0_20px_50px_-12px_rgba(212,54,94,0.8)]"
            >
              Begin your inquiry
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                strokeWidth={1.6}
              />
            </a>

            <span className="hidden text-[0.6rem] uppercase tracking-[0.32em] text-bg/50 sm:inline">
              or
            </span>

            {/* Phone widget — ringing icon, two-line label */}
            <a
              href="tel:+919876543210"
              className="group flex h-[60px] items-center gap-3 rounded-full border border-bg/30 bg-bg/10 pl-2 pr-6 backdrop-blur-md transition-all duration-500 hover:border-blush hover:bg-bg/20"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-plum-deep">
                <span className="absolute inset-0 rounded-full bg-blush opacity-50 [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <Phone
                  className="relative h-4 w-4"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[0.55rem] uppercase tracking-[0.28em] text-bg/70">
                  Speak with us
                </span>
                <span className="font-medium text-sm tracking-wide text-bg">
                  +91 98765 43210
                </span>
              </span>
            </a>
          </motion.div>
        </div>
      </section>
  );
}
