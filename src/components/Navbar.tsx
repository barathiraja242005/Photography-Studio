"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { site } from "@/config/site";

const PORTFOLIO_LINKS = site.nav.portfolioDropdown;
const LINKS = site.nav.links.filter(
  (l) => l.label !== "Home" && l.label !== "Contact"
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[backdrop-filter,background-color,border-color,padding,box-shadow] duration-500",
          scrolled
            ? "border-b border-line bg-bg/85 py-3 backdrop-blur-xl shadow-[0_4px_30px_-12px_rgba(28,20,14,0.08)]"
            : "border-b border-transparent bg-transparent py-6"
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <a href="#top" className="group flex items-center gap-2">
            <svg
              viewBox="0 0 32 32"
              className={cn(
                "h-7 w-7 transition-[transform,color] duration-700 group-hover:rotate-180",
                scrolled ? "text-plum" : "text-blush"
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="16" cy="16" r="14" />
              <circle cx="16" cy="16" r="8" />
              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
              <path d="M16 2v6M16 24v6M2 16h6M24 16h6" />
            </svg>
            <span
              className={cn(
                "font-display text-xl tracking-[0.18em] uppercase transition-colors duration-500",
                scrolled
                  ? "text-ink"
                  : "text-bg [text-shadow:0_2px_15px_rgba(0,0,0,0.4)]"
              )}
            >
              {site.studio.name}
            </span>
          </a>

          <ul
            className={cn(
              "hidden items-center gap-7 text-[0.74rem] uppercase tracking-[0.22em] transition-colors duration-500 lg:flex",
              scrolled
                ? "text-ink/85"
                : "text-bg/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]"
            )}
          >
            {LINKS.slice(0, 2).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={cn(
                    "group relative transition-colors",
                    scrolled ? "hover:text-plum" : "hover:text-blush"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full",
                      scrolled ? "bg-plum" : "bg-blush"
                    )}
                  />
                </a>
              </li>
            ))}

            <li
              className="relative"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <button
                className={cn(
                  "group inline-flex items-center gap-1 transition-colors",
                  scrolled ? "hover:text-plum" : "hover:text-blush"
                )}
              >
                Portfolio
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-500",
                    dropdown && "rotate-180"
                  )}
                  strokeWidth={1.6}
                />
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full",
                    scrolled ? "bg-plum" : "bg-blush"
                  )}
                />
              </button>
              <AnimatePresence>
                {dropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 overflow-hidden rounded-sm border border-line bg-paper py-2 shadow-[0_20px_60px_-20px_rgba(28,20,14,0.25)]"
                  >
                    {PORTFOLIO_LINKS.map((p) => (
                      <li key={p.label}>
                        <a
                          href={p.href}
                          className="block px-5 py-2.5 text-xs tracking-[0.16em] text-ink/80 transition-colors hover:bg-bg-soft hover:text-plum"
                        >
                          {p.label}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {LINKS.slice(2).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={cn(
                    "group relative transition-colors",
                    scrolled ? "hover:text-plum" : "hover:text-blush"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full",
                      scrolled ? "bg-plum" : "bg-blush"
                    )}
                  />
                </a>
              </li>
            ))}

            <li>
              <a
                href="#contact"
                className={cn(
                  "group relative transition-colors",
                  scrolled ? "hover:text-plum" : "hover:text-blush"
                )}
              >
                Contact
                <span
                  className={cn(
                    "absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full",
                    scrolled ? "bg-plum" : "bg-blush"
                  )}
                />
              </a>
            </li>
          </ul>

          <a
            href={`tel:${site.contact.phoneTel}`}
            className={cn(
              "hidden lg:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.22em] transition-all duration-500",
              scrolled
                ? "bg-plum text-bg hover:bg-plum-deep shadow-[0_8px_20px_-8px_rgba(107,36,84,0.5)]"
                : "border border-blush/60 bg-ruby text-bg shadow-[0_10px_30px_-10px_rgba(212,54,94,0.6)] hover:bg-ruby-deep hover:border-blush"
            )}
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.6} fill="currentColor" />
            Call Now
          </a>

          <button
            onClick={() => setOpen(true)}
            className={cn(
              "lg:hidden transition-colors duration-500",
              scrolled ? "text-ink" : "text-bg [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.5))]"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" strokeWidth={1.4} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-xl tracking-[0.18em] uppercase">
                {site.studio.name}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-ink"
              >
                <X className="h-6 w-6" strokeWidth={1.4} />
              </button>
            </div>
            <ul className="mt-10 flex flex-col items-center gap-7 text-sm uppercase tracking-[0.28em]">
              {[...LINKS, { href: "#portfolio", label: "Portfolio" }, { href: "#contact", label: "Contact" }].map(
                (l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-ink/80 hover:text-gold-deep"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                )
              )}
              <motion.li
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4"
              >
                <a
                  href={`tel:${site.contact.phoneTel}`}
                  className="inline-flex items-center gap-2 rounded-full bg-maroon px-6 py-3 text-xs uppercase tracking-[0.22em] text-bg"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
                  Call Now
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
