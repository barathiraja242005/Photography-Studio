"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  AtSign,
  Calendar,
  Check,
  Clock,
  Globe,
  Heart,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Mandala, SectionLabel } from "@/components/Ornament";
import Tilt3D from "@/components/Tilt3D";
import { currentYear } from "@/config/site";
import { useSite } from "@/components/SiteContext";

const NEXT_DATES = [
  { day: "Sat", date: "Feb 28", status: "booked" },
  { day: "Sat", date: "Mar 14", status: "open" },
  { day: "Sat", date: "Mar 21", status: "limited" },
  { day: "Sat", date: "Apr 4", status: "open" },
  { day: "Sat", date: "Apr 18", status: "booked" },
  { day: "Sat", date: "May 2", status: "open" },
] as const;

const STATUS = {
  open: { dot: "bg-jade", text: "text-jade", label: "Available" },
  limited: { dot: "bg-terracotta", text: "text-terracotta", label: "Limited" },
  booked: { dot: "bg-ruby", text: "text-ruby/70", label: "Booked" },
} as const;

export default function Contact() {
  const site = useSite();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Helpful email subject line
    formData.set(
      "_subject",
      `New inquiry · ${formData.get("name") || "—"} & ${formData.get("partner") || "—"}`
    );

    try {
      const res = await fetch(
        `https://formspree.io/f/${site.formspree.contact}`,
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );

      if (res.ok) {
        setSent(true);
        form.reset();
        setSelectedDate(null);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(
          json?.errors?.[0]?.message ||
            json?.error ||
            "Couldn't send right now. Please try again, or email us directly."
        );
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg-soft py-28 sm:py-36"
    >
      {/* Background flourish — mandalas + bloom */}
      <Mandala className="pointer-events-none absolute -left-40 top-32 z-0 h-[500px] w-[500px] text-plum/[0.07] spin-slow" />
      <Mandala className="pointer-events-none absolute -right-40 bottom-20 z-0 h-[500px] w-[500px] text-terracotta/[0.06] spin-slow [animation-direction:reverse]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[400px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(232,168,150,0.18),transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <SectionLabel
          eyebrow="Begin the conversation"
          title="An invitation to"
          script="inquire."
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-ink-soft sm:text-lg"
        >
          We accept 18–24 weddings per season — so each one stays personal.
          Tell us about your day, and we&apos;ll reply by hand within 48 hours.
        </motion.p>

        {/* 3-column grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-7">
          {/* ─── LEFT: REACH-US CARD ─── */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="relative flex flex-col gap-6 overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border border-line bg-paper p-7 shadow-[0_25px_60px_-30px_rgba(31,15,41,0.3)] lg:col-span-3"
          >
            <div className="absolute right-4 top-4 rounded-full border border-jade/30 bg-jade/5 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.24em] text-jade">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-jade align-middle [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              Replies in 48h
            </div>

            <div>
              <span className="text-[0.55rem] uppercase tracking-[0.32em] text-plum">
                Reach us
              </span>
              <h3 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
                The studio,{" "}
                <span className="font-script text-3xl text-plum">on call.</span>
              </h3>
            </div>

            <ul className="flex flex-col gap-5 text-sm text-ink-soft">
              {[
                {
                  icon: Phone,
                  label: "Call us",
                  value: site.contact.phoneDisplay,
                  href: `tel:${site.contact.phoneTel}`,
                  color: "plum",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: site.contact.email,
                  href: `mailto:${site.contact.email}`,
                  color: "jade",
                },
                {
                  icon: AtSign,
                  label: "Instagram",
                  value: site.social.instagram.handle,
                  href: site.social.instagram.url,
                  color: "terracotta",
                },
                {
                  icon: MapPin,
                  label: "Studio",
                  value: `${site.contact.address.line1.split(",")[1]?.trim() ?? site.contact.address.line1} · ${site.contact.address.city}`,
                  href: "#",
                  color: "ruby",
                },
              ].map((c) => {
                const Icon = c.icon;
                const colorCls = {
                  plum: "border-plum/30 text-plum group-hover:border-plum group-hover:bg-plum/10",
                  jade: "border-jade/30 text-jade group-hover:border-jade group-hover:bg-jade/10",
                  terracotta:
                    "border-terracotta/30 text-terracotta group-hover:border-terracotta group-hover:bg-terracotta/10",
                  ruby: "border-ruby/30 text-ruby group-hover:border-ruby group-hover:bg-ruby/10",
                }[c.color];
                return (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className="group flex items-center gap-4 transition-colors duration-300 hover:text-ink"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-paper transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180 ${colorCls}`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[0.55rem] uppercase tracking-[0.28em] text-muted">
                          {c.label}
                        </div>
                        <div className="mt-0.5 truncate font-medium">
                          {c.value}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto rounded-2xl border border-dashed border-plum/30 bg-bg-soft/60 p-4">
              <div className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.28em] text-plum">
                <Clock className="h-3 w-3" strokeWidth={1.6} />
                Hours
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Mon — Sat · 10am to 7pm
                <br />
                <span className="text-[0.65rem] text-muted">
                  Closed Sundays · By appointment
                </span>
              </p>
            </div>
          </motion.aside>

          {/* ─── MIDDLE: THE INVITATION (FORM) ─── */}
          <Tilt3D
            intensity={3}
            hoverScale={1}
            className="relative lg:col-span-6"
          >
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
              onSubmit={submit}
              className="relative h-full overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl border border-plum/20 bg-paper shadow-[0_40px_100px_-30px_rgba(31,15,41,0.45)]"
            >
              {/* Inner crested border (paper ornament) */}
              <span className="pointer-events-none absolute inset-3 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-md rounded-br-md border border-plum/15" />

              {/* WAX-SEAL MONOGRAM — nested cleanly inside the card */}
              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                whileInView={{ scale: 1, rotate: -8, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                }}
                className="absolute left-1/2 top-6 z-20 -translate-x-1/2 sm:top-8"
              >
                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-plum-deep to-plum text-bg shadow-[0_10px_28px_-6px_rgba(74,28,61,0.55)] sm:h-[88px] sm:w-[88px]">
                  {/* Engraving rings */}
                  <span className="absolute inset-1.5 rounded-full border border-bg/30" />
                  <span className="absolute inset-3 rounded-full border border-bg/15" />
                  <div className="relative text-center font-display leading-none">
                    <div className="text-xl tracking-[0.18em] sm:text-2xl">
                      A·S
                    </div>
                    <div className="mt-0.5 text-[0.42rem] uppercase tracking-[0.28em] text-bg/70 sm:text-[0.45rem]">
                      Sealed
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="relative px-7 pb-10 pt-28 sm:px-12 sm:pb-12 sm:pt-32">
                {/* Header */}
                <div className="text-center">
                  <span className="text-[0.55rem] uppercase tracking-[0.36em] text-plum">
                    ⊹ The Invitation ⊹
                  </span>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
                    Write to us,{" "}
                    <span className="font-script text-4xl text-plum sm:text-5xl">
                      slowly.
                    </span>
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {!sent ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="mt-9 space-y-5"
                    >
                      {/* Couple — names joined by & */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                        <LetterField
                          label="Your name"
                          name="name"
                          placeholder="Anaya"
                        />
                        <div className="pb-2 text-center font-script text-3xl text-plum">
                          &amp;
                        </div>
                        <LetterField
                          label="Partner"
                          name="partner"
                          placeholder="Ishaan"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <LetterField
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                        />
                        <LetterField
                          label="Phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <LetterField
                          label="Wedding date"
                          name="date"
                          type="date"
                          value={selectedDate ?? undefined}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          icon={
                            <Calendar
                              className="h-3 w-3"
                              strokeWidth={1.6}
                            />
                          }
                        />
                        <LetterField
                          label="Venue / city"
                          name="location"
                          placeholder="Udaipur, Rajasthan"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[0.55rem] uppercase tracking-[0.3em] text-muted">
                          Tell us about your day
                        </label>
                        <textarea
                          name="story"
                          rows={4}
                          placeholder="Number of days, ceremonies you're planning, anything you'd like us to know…"
                          className="w-full resize-none border-b-2 border-line bg-transparent px-1 pb-2 pt-1 text-sm leading-relaxed text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-plum"
                        />
                      </div>

                      {/* Error banner — visible when submission fails */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden rounded-md border border-ruby/40 bg-ruby/10 px-4 py-3 text-[0.7rem] text-ruby-deep"
                          >
                            ⚠ {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit row */}
                      <div className="flex flex-col items-center gap-5 pt-2 sm:flex-row sm:justify-between">
                        <p className="text-[0.55rem] uppercase tracking-[0.26em] text-muted">
                          By post or by hand · we read every word
                        </p>
                        <motion.button
                          type="submit"
                          whileTap={{ scale: 0.94 }}
                          disabled={loading}
                          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-plum px-9 py-4 text-xs uppercase tracking-[0.28em] text-bg shadow-[0_15px_35px_-12px_rgba(107,36,84,0.55)] transition-all duration-500 hover:bg-plum-deep hover:shadow-[0_20px_45px_-12px_rgba(107,36,84,0.7)] disabled:opacity-70"
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-bg/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                          <Send
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            strokeWidth={0}
                          />
                          <span className="relative">
                            {loading ? "Sending…" : "Send the invitation"}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="mt-10 flex flex-col items-center gap-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 14,
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-jade text-bg"
                      >
                        <Check className="h-7 w-7" strokeWidth={2.4} />
                      </motion.div>
                      <h4 className="font-display text-3xl text-ink sm:text-4xl">
                        Received with care.
                      </h4>
                      <p className="max-w-md text-sm text-ink-soft">
                        We&apos;ll write back within 48 hours — usually sooner.
                        In the meantime, you&apos;ll find us on Instagram at{" "}
                        <span className="text-plum">@as.photography</span>.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-muted">
                        <Heart className="h-3 w-3 text-ruby" fill="currentColor" strokeWidth={0} />
                        with love · the studio
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          </Tilt3D>

          {/* ─── RIGHT: AVAILABILITY SIDEBAR ─── */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative flex flex-col gap-5 overflow-hidden rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl border border-line bg-paper p-7 shadow-[0_25px_60px_-30px_rgba(31,15,41,0.3)] lg:col-span-3"
          >
            <div>
              <span className="text-[0.55rem] uppercase tracking-[0.32em] text-plum">
                When?
              </span>
              <h3 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
                Upcoming{" "}
                <span className="font-script text-3xl text-plum">Saturdays.</span>
              </h3>
              <p className="mt-3 text-[0.7rem] text-ink-soft">
                Tap a date to pre-fill the invitation.
              </p>
            </div>

            <ul className="flex flex-col">
              {NEXT_DATES.map((d, i) => {
                const s = STATUS[d.status];
                const isPicked = selectedDate === d.date;
                const isBooked = d.status === "booked";
                return (
                  <motion.li
                    key={d.date}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                  >
                    <button
                      type="button"
                      disabled={isBooked}
                      onClick={() => !isBooked && setSelectedDate(d.date)}
                      className={`group flex w-full items-center gap-3 border-b border-line py-3 text-left transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isPicked ? "bg-plum/5" : "hover:bg-bg-soft/60"
                      }`}
                    >
                      <span className="text-[0.55rem] uppercase tracking-[0.28em] text-muted w-7">
                        {d.day}
                      </span>
                      <span className="flex-1 font-display text-base text-ink">
                        {d.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        <span
                          className={`text-[0.55rem] uppercase tracking-[0.24em] ${s.text}`}
                        >
                          {s.label}
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.5rem] uppercase tracking-[0.24em] text-muted">
              {Object.entries(STATUS).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
                  {v.label}
                </span>
              ))}
            </div>

            <div className="mt-auto rounded-2xl bg-plum/[0.06] p-4 text-[0.65rem] leading-relaxed text-ink-soft">
              <div className="mb-1.5 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.28em] text-plum">
                <Sparkles className="h-3 w-3" strokeWidth={1.6} />
                Currently booking
              </div>
              <strong className="text-ink">2026 — 4 dates remaining.</strong>
              <br />
              2027 calendar opens in March.
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Letter-style underline field — wedding-stationery feel
// ──────────────────────────────────────────────────────────
function LetterField({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.3em] text-muted"
      >
        {icon}
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="peer w-full border-b-2 border-line bg-transparent px-1 py-2 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-plum"
      />
    </div>
  );
}

function IGGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function PinterestGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 21l1.2-5.4M10.2 15.6c.4 1 1.4 1.4 2.4 1.4 2 0 3.4-2 3.4-4.5 0-2.5-1.8-4.5-4.5-4.5-3 0-4.7 2.2-4.7 4.5 0 1 .4 2 1 2.6.2.2.3.3.2.5l-.3 1c-.1.2-.2.3-.5.2-1.5-.7-2.4-2.8-2.4-4.5 0-3.6 2.7-7 7.7-7 4 0 7 2.9 7 6.6 0 4-2.5 7.2-6.1 7.2-1.1 0-2.2-.6-2.6-1.3" />
    </svg>
  );
}

function YouTubeGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.5 20.5l1.4-4.2A8.4 8.4 0 1 1 8 19.6L3.5 20.5z" />
      <path d="M8.5 9.5c.5 1.7 1.6 3.4 3 4.8 1.4 1.4 3.1 2.4 4.8 3 .4.1.8-.1 1-.4l.6-.9c.2-.3.6-.4.9-.2l2 1.2c.3.2.4.6.2 1l-.6 1.1c-.5.9-1.6 1.5-2.7 1.3-2.4-.4-5.7-2.1-8.2-4.6S5.5 9.7 5.1 7.3C5 6.2 5.5 5.2 6.4 4.6l1.1-.6c.3-.2.7-.1.9.2l1.2 2c.2.3.1.7-.2.9l-.9.6c-.3.3-.5.7-.4 1.1z" />
    </svg>
  );
}

// SOCIAL + NAV are now derived from useSite() inside Footer/Newsletter — see below.

function Newsletter() {
  const site = useSite();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch(
        `https://formspree.io/f/${site.formspree.newsletter}`,
        {
          method: "POST",
          body: new URLSearchParams({
            email,
            _subject: "Newsletter signup",
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res.ok) {
        setDone(true);
        setEmail("");
        setTimeout(() => setDone(false), 4000);
      }
    } catch {
      // silent fail; newsletter is non-critical
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-stretch overflow-hidden rounded-full border border-line bg-paper transition-all duration-500 focus-within:border-plum focus-within:shadow-[0_15px_35px_-15px_rgba(107,36,84,0.4)]"
    >
      {/* Mail icon in its own padded column — vertical-centered */}
      <span className="flex items-center pl-4 pr-1 text-muted">
        <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
      </span>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink placeholder:text-muted outline-none"
      />

      <button
        type="submit"
        disabled={busy || done}
        className="group inline-flex shrink-0 items-center justify-center gap-2 bg-plum px-5 text-[0.6rem] uppercase tracking-[0.28em] text-bg transition-colors duration-300 hover:bg-plum-deep disabled:opacity-70"
      >
        {done ? (
          <span className="flex items-center gap-1.5">Sent <span aria-hidden>✓</span></span>
        ) : busy ? (
          <span>Sending…</span>
        ) : (
          <>
            Subscribe
            <Send
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.8}
            />
          </>
        )}
      </button>
    </form>
  );
}

function BackToTop() {
  return (
    <a
      href="#top"
      className="group flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.28em] text-plum transition-colors hover:text-ruby"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-plum/40 bg-paper transition-all duration-500 group-hover:-translate-y-1 group-hover:border-plum group-hover:bg-plum group-hover:text-bg">
        <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      Back to top
    </a>
  );
}

export function Footer() {
  const site = useSite();
  const SOCIAL = [
    { name: site.social.instagram.name, handle: site.social.instagram.handle, url: site.social.instagram.url, Icon: IGGlyph },
    { name: site.social.pinterest.name, handle: site.social.pinterest.handle, url: site.social.pinterest.url, Icon: PinterestGlyph },
    { name: site.social.youtube.name, handle: site.social.youtube.handle, url: site.social.youtube.url, Icon: YouTubeGlyph },
    { name: site.social.whatsapp.name, handle: site.social.whatsapp.handle, url: site.social.whatsapp.url, Icon: WhatsAppGlyph },
  ];
  const NAV = [
    ...site.nav.links.filter((l) => l.label !== "Home"),
    { href: "#portfolio", label: "Portfolio" },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-soft">
      {/* Background flourish */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 right-0 h-[300px] w-[400px] rounded-full bg-plum/[0.05] blur-[120px]" />
        <div className="absolute -bottom-20 left-0 h-[300px] w-[400px] rounded-full bg-terracotta/[0.06] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-20 sm:px-10">
        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6 text-[0.6rem] uppercase tracking-[0.28em]"
        >
          <span className="flex items-center gap-2 text-jade">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-jade" />
            </span>
            Currently booking 2026 — 4 dates left
          </span>
          <span className="flex items-center gap-2 text-muted">
            <Globe className="h-3 w-3" strokeWidth={1.6} />
            Mumbai · Delhi · Bengaluru · Worldwide
          </span>
        </motion.div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Studio identity — col 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <a href="#top" className="group inline-flex items-center gap-2">
              <svg
                viewBox="0 0 32 32"
                className="h-7 w-7 text-plum transition-transform duration-700 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="16" cy="16" r="14" />
                <circle cx="16" cy="16" r="8" />
                <circle cx="16" cy="16" r="2.5" fill="currentColor" />
                <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
              </svg>
              <span className="font-display text-3xl tracking-[0.18em] uppercase text-ink">
                {site.studio.name}
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
              {site.studio.bio}
            </p>
            <p className="mt-5 font-script text-3xl text-plum">
              {site.studio.closingScript}
            </p>

            {/* Trust badges */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.22em] text-plum">
                <Newspaper className="h-3 w-3" strokeWidth={1.6} />
                Vogue 2024
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.22em] text-terracotta">
                ★ ★ ★ ★ ★ 5.0
              </div>
            </div>
          </motion.div>

          {/* Navigate — col 2 */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h4 className="mb-5 text-[0.6rem] uppercase tracking-[0.32em] text-plum">
              Navigate
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-ink-soft">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-2 transition-colors hover:text-plum"
                  >
                    <span className="h-px w-2 bg-plum/40 transition-all duration-500 group-hover:w-6" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Get in touch — col 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="mb-5 text-[0.6rem] uppercase tracking-[0.32em] text-plum">
              Get in touch
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm text-ink-soft">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                <a href={`tel:${site.contact.phoneTel}`} className="hover:text-plum">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                <a href={`mailto:${site.contact.email}`} className="hover:text-plum">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                <span>
                  {site.contact.address.line1}
                  <br />
                  {site.contact.address.city} · {site.contact.address.pincode}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-3.5 w-3.5 text-terracotta" strokeWidth={1.6} />
                <span>
                  {site.contact.hours}
                  <br />
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
                    {site.contact.hoursNote}
                  </span>
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter — col 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <h4 className="mb-5 text-[0.6rem] uppercase tracking-[0.32em] text-plum">
              The Journal
            </h4>
            <p className="mb-5 text-sm leading-relaxed text-ink-soft">
              Once a month — a quiet email with behind-the-scenes from a recent
              wedding, plus a playlist.
            </p>
            <Newsletter />
            <p className="mt-3 text-[0.55rem] uppercase tracking-[0.22em] text-muted">
              No spam · Unsubscribe anytime
            </p>
          </motion.div>
        </div>

        {/* Middle band — social icons + back to top */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-col items-center justify-between gap-8 border-y border-line py-8 lg:flex-row lg:items-center lg:gap-6 lg:py-6"
        >
          {/* Label + icons */}
          <div className="flex w-full flex-col items-center gap-5 lg:w-auto lg:flex-row lg:gap-7">
            <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
              <span className="h-px w-8 bg-line lg:hidden" />
              <span>Follow along</span>
              <span className="h-px w-8 bg-line lg:hidden" />
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-5 sm:gap-x-6 lg:flex lg:gap-4">
              {SOCIAL.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    aria-label={`${s.name} — ${s.handle}`}
                    className="group flex transform-gpu flex-col items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
                  >
                    {/* Button surface */}
                    <span className="relative inline-flex">
                      {/* Pulse ring — sits BEHIND the button, animates outward */}
                      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full ring-1 ring-plum/0 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.4] group-hover:ring-plum/40" />

                      {/* Surface — icon STAYS plum throughout; bg gets a soft plum tint on hover. No colour flash. */}
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-plum shadow-[0_2px_6px_-4px_rgba(31,15,41,0.2)] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-plum group-hover:bg-plum/10 group-hover:shadow-[0_15px_30px_-10px_rgba(107,36,84,0.4)] sm:h-12 sm:w-12">
                        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                      </span>
                    </span>

                    {/* Permanent label — visible everywhere */}
                    <span className="flex flex-col items-center gap-0.5 text-center leading-tight">
                      <span className="text-[0.55rem] uppercase tracking-[0.22em] text-ink-soft transition-colors duration-300 group-hover:text-plum">
                        {s.name}
                      </span>
                      <span className="hidden truncate text-[0.55rem] text-muted/80 sm:block sm:max-w-[10rem]">
                        {s.handle}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <BackToTop />
        </motion.div>

        {/* Giant animated wordmark — letter-by-letter reveal + continuous shimmer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative my-12 select-none text-center"
          aria-hidden
        >
          {/* Soft pulsing halo behind the wordmark */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0">
            <div className="wordmark-glow h-[60vw] max-h-[400px] w-[80vw] max-w-[800px] rounded-full bg-[radial-gradient(closest-side,rgba(212,54,94,0.18),rgba(107,36,84,0.06)_60%,transparent_80%)] blur-2xl" />
          </div>

          <div className="relative font-display">
            {/* A S — dominant initials, letter-by-letter rise */}
            <div className="overflow-hidden text-[clamp(6rem,28vw,18rem)] leading-[0.85] tracking-tight">
              {["A", " ", "S"].map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 120, rotate: -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.2 + i * 0.18,
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="wordmark-shimmer inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* PHOTOGRAPHY — letter-by-letter rise, smaller stagger */}
            <div className="-mt-2 overflow-hidden text-[clamp(1.5rem,5.5vw,4.5rem)] font-medium leading-none tracking-[0.22em] sm:-mt-3 sm:tracking-[0.3em]">
              {"PHOTOGRAPHY".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.75 + i * 0.045,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="wordmark-shimmer inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Decorative underline rule that draws from the center */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.5, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-8 h-px w-32 origin-center bg-gradient-to-r from-transparent via-plum to-transparent"
            />

            {/* Tagline under the rule */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 2 }}
              className="mt-5 font-mono text-[0.55rem] uppercase tracking-[0.32em] text-muted"
            >
              ⊹ est. MMXII · Mumbai · Worldwide ⊹
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col-reverse items-center justify-between gap-3 border-t border-line pt-6 text-[0.6rem] uppercase tracking-[0.28em] text-muted sm:flex-row"
        >
          <div className="flex items-center gap-4">
            <span>© {currentYear} {site.studio.name}</span>
            <span className="hidden sm:inline text-line">·</span>
            <a href="#" className="hover:text-plum">Privacy</a>
            <span className="hidden sm:inline text-line">·</span>
            <a href="#" className="hover:text-plum">Terms</a>
          </div>
          <div className="flex items-center gap-2">
            <span>Made in India</span>
            <span className="text-terracotta">·</span>
            <span className="font-script text-base text-plum">
              for couples everywhere
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
