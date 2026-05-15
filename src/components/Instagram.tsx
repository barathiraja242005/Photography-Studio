"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Heart,
  Inbox,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  Smile,
  Tag,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { IG_POSTS, IG_STORIES } from "@/lib/images";
import { cn } from "@/lib/cn";

const STATS = [
  { value: 248, label: "Posts" },
  { value: 48200, label: "Followers" },
  { value: 312, label: "Following" },
];

function format(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useMotionValue(0);
  const spring = useSpring(value, { duration: 1.8, bounce: 0 });
  const display = useTransform(spring, (v) => format(Math.round(v)));
  const [text, setText] = useState("0");

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  useEffect(() => display.on("change", (v) => setText(v)), [display]);

  return <span ref={ref}>{text}</span>;
}

// Simulated comments for the post detail modal
const COMMENT_POOL = [
  { who: "anaya.kapoor", text: "Stop, this is breathtaking 🥹", t: "2h" },
  { who: "ishaan.m", text: "Made me cry all over again", t: "3h" },
  { who: "riya_studio", text: "Tell me how. Pls 🙏", t: "5h" },
  { who: "karthik.j", text: "Y'all should write a book", t: "7h" },
  { who: "meera.shah", text: "Saving for our day in March ✨", t: "9h" },
  { who: "wedme.good", text: "Top 5 of the year, easily.", t: "1d" },
  { who: "the.knot", text: "Featured this in our editorial!", t: "1d" },
];

const STORY_DURATION = 5000; // ms

export default function Instagram() {
  const [tab, setTab] = useState<"posts" | "reels" | "tagged">("posts");
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [activePost, setActivePost] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-bg-soft py-24 sm:py-32">
      {/* Ambient drifting gradient behind the card */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(40% 50% at 20% 30%, rgba(212,54,94,0.10), transparent 70%), radial-gradient(40% 50% at 80% 70%, rgba(13,85,71,0.10), transparent 70%), radial-gradient(40% 50% at 50% 50%, rgba(182,92,69,0.08), transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl border border-line bg-paper shadow-[0_30px_80px_-40px_rgba(31,15,41,0.35)]">
          {/* ────── HEADER ────── */}
          <div className="relative border-b border-line p-6 sm:p-10">
            {/* Notification + DM icons */}
            <div className="absolute right-5 top-5 z-10 flex items-center gap-2 sm:right-7 sm:top-7">
              <button
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-ruby hover:bg-ruby hover:text-bg"
              >
                <Bell className="h-4 w-4" strokeWidth={1.6} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ruby px-1 text-[0.55rem] font-bold text-bg shadow-md">
                  12
                </span>
              </button>
              <button
                aria-label="Direct messages"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-plum hover:bg-plum hover:text-bg"
              >
                <Inbox className="h-4 w-4" strokeWidth={1.6} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-jade px-1 text-[0.55rem] font-bold text-bg shadow-md">
                  3
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              {/* Avatar — continuously rotating gradient ring + live pulse */}
              <div className="relative shrink-0">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 14,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #d4365e, #b65c45, #e8a896, #6b2454, #d4365e)",
                    }}
                  />
                  <div className="absolute inset-[3px] rounded-full bg-paper p-1">
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-plum text-bg">
                      <svg
                        viewBox="0 0 32 32"
                        className="h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <circle cx="16" cy="16" r="14" />
                        <circle cx="16" cy="16" r="8" />
                        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
                        <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Live dot */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                  className="absolute -bottom-1 -left-1 flex h-7 items-center gap-1 rounded-full bg-ruby px-2 text-bg shadow-md"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg opacity-80" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg" />
                  </span>
                  <span className="text-[0.5rem] font-bold uppercase tracking-[0.18em]">
                    Live
                  </span>
                </motion.span>
                {/* Verified */}
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-jade text-bg shadow-md"
                >
                  <BadgeCheck className="h-4 w-4" strokeWidth={2} />
                </motion.span>
              </div>

              {/* Identity + bio */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl text-ink sm:text-3xl">
                    as.photography
                  </span>
                  <BadgeCheck
                    className="h-5 w-5 text-jade"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  <span className="rounded-full border border-plum/30 bg-plum/5 px-2.5 py-0.5 text-[0.55rem] uppercase tracking-[0.2em] text-plum">
                    Photographer
                  </span>
                </div>

                <div className="mt-1.5 text-sm text-ink-soft">
                  A S Photography · Wedding Photography
                </div>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                  Indian weddings, told slowly. Candid · Editorial · Worldwide.
                  <br />
                  <span className="text-plum">✨ Booking 2026 — DM to enquire</span>
                  <br />
                  <span className="inline-flex items-center gap-1 text-muted">
                    <MapPin className="h-3 w-3" strokeWidth={1.6} />
                    Mumbai · Delhi · Wherever you are
                  </span>
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-2 rounded-full bg-plum px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-all hover:bg-plum-deep"
                  >
                    Follow
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                    />
                  </a>
                  <button className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-soft/60 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-plum hover:text-plum">
                    <Send className="h-3.5 w-3.5" strokeWidth={1.6} />
                    Message
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full border border-line bg-bg-soft/60 px-3.5 py-2.5 text-ink-soft transition-colors hover:border-plum hover:text-plum">
                    <Bookmark className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              </div>

              {/* Stats — with growth indicator under Followers */}
              <div className="grid grid-cols-3 gap-6 self-start sm:gap-10 sm:self-center sm:border-l sm:border-line sm:pl-10">
                {STATS.map((s, i) => (
                  <div key={s.label} className="relative">
                    <div className="font-display text-2xl text-plum sm:text-3xl">
                      <Counter to={s.value} />
                    </div>
                    <div className="mt-1 text-[0.6rem] uppercase tracking-[0.28em] text-muted">
                      {s.label}
                    </div>
                    {i === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-jade/10 px-1.5 py-0.5 text-[0.5rem] font-medium text-jade"
                      >
                        <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} />
                        +147 this week
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stories — clickable, rings continuously rotate */}
            <div className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-2 sm:gap-7">
              {IG_STORIES.map((s, i) => (
                <motion.button
                  key={s.label}
                  onClick={() => setActiveStory(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.05 * i, duration: 0.6 }}
                  whileTap={{ scale: 0.92 }}
                  className="group flex shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative h-[68px] w-[68px] transition-transform duration-500 group-hover:scale-105 sm:h-[84px] sm:w-[84px]">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10 + i,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          i === 5
                            ? "conic-gradient(from 0deg, #d4365e, #b65c45, #d4365e, #b65c45, #d4365e)"
                            : "conic-gradient(from 0deg, #b65c45, #e8a896, #6b2454, #d4365e, #b65c45)",
                      }}
                    />
                    <div className="absolute inset-[2.5px] rounded-full bg-paper p-[2px]">
                      <div className="relative h-full w-full overflow-hidden rounded-full">
                        <Image
                          src={s.img}
                          alt={s.label}
                          fill
                          sizes="84px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    {/* Live indicator on the first story */}
                    {i === 0 && (
                      <span className="absolute -bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ruby px-1.5 py-0.5 text-[0.45rem] font-bold uppercase tracking-[0.16em] text-bg shadow-md">
                        Live
                      </span>
                    )}
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft transition-colors group-hover:text-plum">
                    {s.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ────── TABS ────── */}
          <div className="flex items-center justify-center gap-10 border-b border-line text-[0.65rem] uppercase tracking-[0.32em]">
            {(
              [
                { id: "posts", label: "Posts", Icon: Grid3x3 },
                { id: "reels", label: "Reels", Icon: Play },
                { id: "tagged", label: "Tagged", Icon: Tag },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "relative flex items-center gap-2 py-4 transition-colors",
                  tab === id ? "text-plum" : "text-muted hover:text-ink"
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {label}
                {tab === id && (
                  <motion.span
                    layoutId="ig-tab"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-plum"
                  />
                )}
              </button>
            ))}
          </div>

          {/* ────── GRID ────── */}
          <div className="grid grid-cols-3 gap-1 p-1 sm:gap-1.5 sm:p-1.5">
            {IG_POSTS.map((p, i) => (
              <PostTile
                key={p.src}
                p={p}
                i={i}
                onClick={() => setActivePost(i)}
              />
            ))}
          </div>

          {/* ────── FOOTER ────── */}
          <div className="border-t border-line bg-bg-soft/50 px-6 py-5 sm:px-10">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted">
                Live preview of @as.photography — updated daily
              </p>
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-plum transition-colors hover:text-ruby"
              >
                Open on Instagram
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.6}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Story viewer modal */}
      <AnimatePresence>
        {activeStory !== null && (
          <StoryViewer
            startIndex={activeStory}
            onClose={() => setActiveStory(null)}
          />
        )}
      </AnimatePresence>

      {/* Post detail modal */}
      <AnimatePresence>
        {activePost !== null && (
          <PostDetail
            index={activePost}
            onClose={() => setActivePost(null)}
            onNav={(d) =>
              setActivePost(
                (activePost + d + IG_POSTS.length) % IG_POSTS.length
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Individual post tile with heart-on-double-tap pop
// ──────────────────────────────────────────────────────────
function PostTile({
  p,
  i,
  onClick,
}: {
  p: (typeof IG_POSTS)[number];
  i: number;
  onClick: () => void;
}) {
  const [popping, setPopping] = useState(false);
  const lastTap = useRef(0);

  function handleClick(e: React.MouseEvent) {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // double tap
      e.preventDefault();
      setPopping(true);
      setTimeout(() => setPopping(false), 800);
    } else {
      onClick();
    }
    lastTap.current = now;
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.04, duration: 0.6 }}
      className="group relative block aspect-square overflow-hidden bg-bg-soft"
    >
      <Image
        src={p.src}
        alt={p.caption}
        fill
        sizes="(min-width: 1024px) 25vw, 33vw"
        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
      />

      {/* Reel badge + play count */}
      {p.kind === "reel" && (
        <>
          <div className="absolute right-3 top-3 z-10 flex h-7 items-center gap-1 rounded-full bg-ink/65 px-2 text-bg backdrop-blur-md">
            <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.18em]">
              Reel
            </span>
          </div>
          {p.plays && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-ink/65 px-2 py-1 text-bg backdrop-blur-md">
              <Play
                className="h-2.5 w-2.5"
                fill="currentColor"
                strokeWidth={0}
              />
              <span className="text-[0.55rem] font-medium">
                {format(p.plays)} plays
              </span>
            </div>
          )}
        </>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="flex items-center justify-center gap-8 py-6 text-bg sm:py-8">
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            {format(p.likes)}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <MessageCircle
              className="h-4 w-4"
              fill="currentColor"
              strokeWidth={0}
            />
            {p.comments}
          </span>
        </div>
        <p className="line-clamp-2 px-4 pb-4 text-center text-[0.7rem] leading-relaxed text-bg/90">
          {p.caption}
        </p>
      </div>

      {/* Double-tap heart pop */}
      <AnimatePresence>
        {popping && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Heart
              className="h-24 w-24 text-bg drop-shadow-[0_8px_30px_rgba(212,54,94,0.6)]"
              fill="currentColor"
              strokeWidth={0}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ──────────────────────────────────────────────────────────
// Story viewer — fullscreen Instagram-style with progress bars
// ──────────────────────────────────────────────────────────
function StoryViewer({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const initial = progress;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = initial + (elapsed / STORY_DURATION) * (1 - initial);
      if (p >= 1) {
        if (i < IG_STORIES.length - 1) {
          setI(i + 1);
          setProgress(0);
        } else {
          onClose();
        }
      } else {
        setProgress(p);
      }
    };
    const id = setInterval(tick, 40);
    return () => clearInterval(id);
  }, [i, paused, progress, onClose]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [i]);

  const story = IG_STORIES[i];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-[88vh] w-[90vw] max-w-[420px] overflow-hidden rounded-2xl bg-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* Progress bars */}
        <div className="absolute inset-x-3 top-3 z-30 flex gap-1.5">
          {IG_STORIES.map((_, k) => (
            <div
              key={k}
              className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-bg/30"
            >
              <motion.div
                className="h-full bg-bg"
                initial={{ width: 0 }}
                animate={{
                  width:
                    k < i ? "100%" : k === i ? `${progress * 100}%` : "0%",
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Top header */}
        <div className="absolute inset-x-0 top-7 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-full p-[1.5px]"
              style={{
                background:
                  "conic-gradient(from 0deg, #d4365e, #b65c45, #e8a896, #6b2454, #d4365e)",
              }}
            >
              <div className="rounded-full bg-ink p-[1px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-plum text-bg">
                  <svg viewBox="0 0 32 32" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="16" cy="16" r="14" />
                    <circle cx="16" cy="16" r="6" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-bg">
                as.photography
                <BadgeCheck className="h-3 w-3 text-blush" fill="currentColor" strokeWidth={0} />
              </div>
              <div className="text-[0.55rem] uppercase tracking-[0.22em] text-bg/60">
                {story.label} · {Math.floor((IG_STORIES.length - i) * 2)}h
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-bg/85">
            <button
              onClick={() => setMuted(!muted)}
              className="rounded-full p-1.5 hover:bg-bg/15"
              aria-label="mute"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Volume2 className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
            <button
              onClick={() => setPaused(!paused)}
              className="rounded-full p-1.5 hover:bg-bg/15"
              aria-label="pause"
            >
              {paused ? (
                <Play className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              ) : (
                <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-bg/15"
              aria-label="close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Story image */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={story.full}
              alt={story.label}
              fill
              sizes="420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-ink/55" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute inset-x-6 bottom-24 z-20 text-center"
          >
            <p className="font-display text-2xl italic leading-tight text-bg drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-3xl">
              {story.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tap-zones — left third = prev, right = next, center reserved for pause */}
        <button
          aria-label="previous"
          onClick={() => i > 0 && setI(i - 1)}
          className="absolute inset-y-0 left-0 z-10 w-1/3"
        />
        <button
          aria-label="next"
          onClick={() =>
            i < IG_STORIES.length - 1 ? setI(i + 1) : onClose()
          }
          className="absolute inset-y-0 right-0 z-10 w-1/3"
        />

        {/* Reply bar */}
        <div className="absolute inset-x-3 bottom-3 z-30 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-bg/40 bg-ink/40 px-4 py-2.5 backdrop-blur-md">
            <Smile className="h-4 w-4 text-bg/70" strokeWidth={1.6} />
            <input
              placeholder={`Reply to ${story.label}…`}
              className="flex-1 bg-transparent text-xs text-bg placeholder:text-bg/60 outline-none"
            />
          </div>
          <button className="rounded-full p-2.5 text-bg hover:bg-bg/15">
            <Heart className="h-4 w-4" strokeWidth={2} />
          </button>
          <button className="rounded-full p-2.5 text-bg hover:bg-bg/15">
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// Post detail modal — caption, comments, like/save buttons
// ──────────────────────────────────────────────────────────
function PostDetail({
  index,
  onClose,
  onNav,
}: {
  index: number;
  onClose: () => void;
  onNav: (d: number) => void;
}) {
  const p = IG_POSTS[index];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(p.likes);

  useEffect(() => {
    setLiked(false);
    setSaved(false);
    setLikes(p.likes);
  }, [index, p.likes]);

  function toggleLike() {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
    }
  }

  // Use a deterministic slice of comments per post
  const comments = COMMENT_POOL.slice(
    index % 3,
    (index % 3) + 4
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-[80vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-paper shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] sm:grid-cols-5"
      >
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute -top-12 right-0 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-bg/20 text-bg backdrop-blur-md hover:bg-bg/30"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Side nav */}
        <button
          onClick={() => onNav(-1)}
          aria-label="previous post"
          className="absolute left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-ink backdrop-blur hover:bg-bg sm:flex"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          onClick={() => onNav(1)}
          aria-label="next post"
          className="absolute right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-ink backdrop-blur hover:bg-bg sm:flex"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Image side */}
        <div className="relative bg-ink sm:col-span-3">
          <Image
            src={p.src}
            alt={p.caption}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
          {p.kind === "reel" && (
            <div className="absolute right-3 top-3 z-10 flex h-7 items-center gap-1 rounded-full bg-ink/65 px-2 text-bg backdrop-blur-md">
              <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
              <span className="text-[0.55rem] font-medium uppercase tracking-[0.18em]">
                Reel
              </span>
            </div>
          )}
        </div>

        {/* Detail side */}
        <div className="flex h-full flex-col sm:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="rounded-full p-[1.5px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #d4365e, #b65c45, #e8a896, #6b2454, #d4365e)",
                }}
              >
                <div className="rounded-full bg-paper p-[1px]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-plum text-bg">
                    <svg viewBox="0 0 32 32" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="16" cy="16" r="14" />
                      <circle cx="16" cy="16" r="6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  as.photography
                  <BadgeCheck className="h-3 w-3 text-jade" fill="currentColor" strokeWidth={0} />
                </div>
                <div className="text-[0.55rem] uppercase tracking-[0.22em] text-muted">
                  Mumbai · Sponsored
                </div>
              </div>
            </div>
            <button className="text-ink-soft hover:text-ink">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Comments scroll */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-4 flex gap-3">
              <div className="h-7 w-7 shrink-0 rounded-full bg-plum" />
              <div className="text-xs leading-relaxed text-ink">
                <span className="font-medium">as.photography</span>{" "}
                <span className="text-ink-soft">{p.caption}</span>
                <div className="mt-1 text-[0.55rem] uppercase tracking-[0.22em] text-muted">
                  2 days ago
                </div>
              </div>
            </div>
            {comments.map((c, k) => (
              <motion.div
                key={`${index}-${k}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + k * 0.08, duration: 0.4 }}
                className="mb-3 flex gap-3"
              >
                <div className="h-6 w-6 shrink-0 rounded-full bg-bg-soft ring-1 ring-line" />
                <div className="flex-1 text-xs leading-relaxed text-ink">
                  <span className="font-medium">{c.who}</span>{" "}
                  <span className="text-ink-soft">{c.text}</span>
                  <div className="mt-0.5 flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.22em] text-muted">
                    <span>{c.t}</span>
                    <button className="hover:text-ink">Reply</button>
                    <button className="hover:text-ruby">Like</button>
                  </div>
                </div>
                <button className="self-start text-muted hover:text-ruby">
                  <Heart className="h-3 w-3" strokeWidth={1.6} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Action bar */}
          <div className="border-t border-line px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleLike}
                  className="relative"
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-colors",
                      liked ? "text-ruby" : "text-ink hover:text-muted"
                    )}
                    fill={liked ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                  <AnimatePresence>
                    {liked && (
                      <motion.span
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="pointer-events-none absolute inset-0 rounded-full bg-ruby/40"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
                <button>
                  <MessageCircle
                    className="h-6 w-6 text-ink hover:text-muted"
                    strokeWidth={1.5}
                  />
                </button>
                <button>
                  <Send
                    className="h-6 w-6 text-ink hover:text-muted"
                    strokeWidth={1.5}
                  />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark
                  className={cn(
                    "h-6 w-6 transition-colors",
                    saved ? "text-ink" : "text-ink hover:text-muted"
                  )}
                  fill={saved ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              </motion.button>
            </div>

            <div className="mt-2 text-xs font-medium text-ink">
              <motion.span
                key={likes}
                initial={{ scale: 1.15, color: "#d4365e" }}
                animate={{ scale: 1, color: "#1f0f29" }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                {likes.toLocaleString()} likes
              </motion.span>
            </div>
            <div className="mt-0.5 text-[0.55rem] uppercase tracking-[0.22em] text-muted">
              {p.comments} comments · 2 days ago
            </div>

            {/* Comment input */}
            <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
              <Smile className="h-4 w-4 text-ink-soft" strokeWidth={1.6} />
              <input
                placeholder="Add a comment…"
                className="flex-1 bg-transparent text-xs text-ink placeholder:text-muted outline-none"
              />
              <button className="text-xs font-medium text-plum opacity-50 hover:opacity-100">
                Post
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
