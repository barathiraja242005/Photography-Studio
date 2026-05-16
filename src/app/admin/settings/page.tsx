"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { StudioSection } from "./_sections/StudioSection";
import { ContactSection } from "./_sections/ContactSection";
import { SocialSection } from "./_sections/SocialSection";
import { SeoSection } from "./_sections/SeoSection";
import { NavSection } from "./_sections/NavSection";
import { HeroSection } from "./_sections/HeroSection";
import { AboutSection } from "./_sections/AboutSection";
import { ServicesSection } from "./_sections/ServicesSection";
import { PortfolioSection } from "./_sections/PortfolioSection";
import { FilmsCopySection } from "./_sections/FilmsCopySection";
import { PublicationsSection } from "./_sections/PublicationsSection";
import { VoicesSection } from "./_sections/VoicesSection";
import { CtaBannerSection } from "./_sections/CtaBannerSection";
import { InstagramCopySection } from "./_sections/InstagramCopySection";
import { ContactFormSection } from "./_sections/ContactFormSection";
import { FooterSection } from "./_sections/FooterSection";
import { MediaSection } from "./_sections/MediaSection";

type SiteData = Record<string, unknown>;

type SectionId =
  | "studio"
  | "contact"
  | "social"
  | "seo"
  | "nav"
  | "hero"
  | "about"
  | "services"
  | "portfolio"
  | "films-copy"
  | "publications"
  | "voices"
  | "cta-banner"
  | "instagram-copy"
  | "contact-section"
  | "footer"
  | "media"
  | "raw";

const NAV: { id: SectionId; label: string; group: string }[] = [
  { id: "studio", label: "Studio", group: "Identity" },
  { id: "contact", label: "Contact", group: "Identity" },
  { id: "social", label: "Social", group: "Identity" },
  { id: "seo", label: "SEO", group: "Identity" },
  { id: "nav", label: "Navigation", group: "Identity" },
  { id: "hero", label: "Hero", group: "Sections" },
  { id: "about", label: "About", group: "Sections" },
  { id: "services", label: "Services", group: "Sections" },
  { id: "portfolio", label: "Portfolio copy", group: "Sections" },
  { id: "films-copy", label: "Films copy", group: "Sections" },
  { id: "publications", label: "Publications", group: "Sections" },
  { id: "voices", label: "Voices / press", group: "Sections" },
  { id: "cta-banner", label: "CTA banner", group: "Sections" },
  { id: "instagram-copy", label: "Instagram copy", group: "Sections" },
  { id: "contact-section", label: "Contact form copy", group: "Sections" },
  { id: "footer", label: "Footer", group: "Sections" },
  { id: "media", label: "Featured media", group: "Media" },
  { id: "raw", label: "Raw JSON (danger)", group: "Advanced" },
];

export default function SettingsAdmin() {
  const [data, setData] = useState<SiteData>({});
  const [initial, setInitial] = useState<SiteData>({});
  const [raw, setRaw] = useState<string>("");
  const [version, setVersion] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [active, setActive] = useState<SectionId>("studio");
  const editingRaw = useRef(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text.slice(0, 240)}`);
      }
      const json = await res.json();
      const d = (json.data ?? {}) as SiteData;
      setData(d);
      setInitial(d);
      setRaw(JSON.stringify(d, null, 2));
      setVersion(typeof json.version === "number" ? json.version : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // Keep raw JSON view in sync with structured edits (but not while the user is editing the raw pane).
  useEffect(() => {
    if (!editingRaw.current) {
      setRaw(JSON.stringify(data, null, 2));
    }
  }, [data]);

  const dirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initial),
    [data, initial],
  );

  function setSection<K extends string>(key: K, next: unknown) {
    setData((d) => ({ ...d, [key]: next }));
  }

  function getSection<T>(key: string): T {
    return (data[key] ?? {}) as T;
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSavedMsg(null);
    let body: unknown = data;
    if (active === "raw") {
      try {
        body = JSON.parse(raw);
      } catch (e) {
        setError("JSON is invalid: " + (e instanceof Error ? e.message : "parse error"));
        setBusy(false);
        return;
      }
    }
    try {
      // Wrap the body so the server can read `expectedVersion` without it
      // colliding with anything in the settings shape. Stripped server-side
      // before the zod validation runs.
      const payload = { ...(body as Record<string, unknown>), expectedVersion: version };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json", "if-match": String(version) },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError(
            (json.error as string | undefined) ||
              "Settings were modified elsewhere. Reload to see the latest version.",
          );
        } else {
          setError(json.error || "Save failed.");
        }
      } else {
        setSavedMsg("Saved. Live site updates within ~60 seconds.");
        setTimeout(() => setSavedMsg(null), 4000);
        setData(body as SiteData);
        setInitial(body as SiteData);
        if (typeof json.version === "number") setVersion(json.version);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  function revert() {
    if (!confirm("Discard all unsaved changes?")) return;
    setData(initial);
    setRaw(JSON.stringify(initial, null, 2));
  }

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading…</p>;
  }

  if (error && Object.keys(data).length === 0) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-medium">Failed to load settings</p>
        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">{error}</pre>
        <button onClick={load} className="mt-3 rounded border border-red-300 bg-white px-3 py-1 text-xs">Retry</button>
      </div>
    );
  }

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  return (
    <div className="flex min-h-[calc(100vh-8rem)] gap-6">
      <aside className="sticky top-4 h-max w-56 shrink-0 space-y-4 self-start">
        <header>
          <h1 className="text-lg font-semibold">Site settings</h1>
          <p className="mt-0.5 text-xs text-neutral-500">All editable content from the homepage.</p>
        </header>
        <nav className="space-y-4">
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                {g}
              </p>
              <ul className="space-y-0.5">
                {NAV.filter((n) => n.group === g).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setActive(n.id)}
                      className={
                        "w-full rounded px-2 py-1 text-left text-sm " +
                        (active === n.id
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100")
                      }
                    >
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        {active === "studio" && (
          <StudioSection
            data={getSection("studio")}
            onChange={(v) => setSection("studio", v)}
          />
        )}
        {active === "contact" && (
          <ContactSection
            data={getSection("contact")}
            onChange={(v) => setSection("contact", v)}
          />
        )}
        {active === "social" && (
          <SocialSection
            data={getSection("social")}
            onChange={(v) => setSection("social", v)}
          />
        )}
        {active === "seo" && (
          <SeoSection
            data={getSection("seo")}
            onChange={(v) => setSection("seo", v)}
          />
        )}
        {active === "nav" && (
          <NavSection
            data={getSection("nav")}
            onChange={(v) => setSection("nav", v)}
          />
        )}
        {active === "hero" && (
          <HeroSection
            data={getSection("hero")}
            onChange={(v) => setSection("hero", v)}
          />
        )}
        {active === "about" && (
          <AboutSection
            data={getSection("about")}
            onChange={(v) => setSection("about", v)}
          />
        )}
        {active === "services" && (
          <ServicesSection
            data={getSection("services")}
            onChange={(v) => setSection("services", v)}
          />
        )}
        {active === "portfolio" && (
          <PortfolioSection
            data={getSection("portfolio")}
            onChange={(v) => setSection("portfolio", v)}
          />
        )}
        {active === "films-copy" && (
          <FilmsCopySection
            data={getSection("films")}
            onChange={(v) => setSection("films", v)}
          />
        )}
        {active === "publications" && (
          <PublicationsSection
            data={(data.publications as string[]) ?? []}
            onChange={(v) => setSection("publications", v)}
          />
        )}
        {active === "voices" && (
          <VoicesSection
            data={getSection("voices")}
            onChange={(v) => setSection("voices", v)}
          />
        )}
        {active === "cta-banner" && (
          <CtaBannerSection
            data={getSection("ctaBanner")}
            onChange={(v) => setSection("ctaBanner", v)}
          />
        )}
        {active === "instagram-copy" && (
          <InstagramCopySection
            data={getSection("instagram")}
            onChange={(v) => setSection("instagram", v)}
          />
        )}
        {active === "contact-section" && (
          <ContactFormSection
            data={getSection("contactSection")}
            onChange={(v) => setSection("contactSection", v)}
          />
        )}
        {active === "footer" && (
          <FooterSection
            data={getSection("footer")}
            onChange={(v) => setSection("footer", v)}
          />
        )}
        {active === "media" && (
          <MediaSection
            data={{
              aboutImage: data.aboutImage as string | undefined,
              ctaImage: data.ctaImage as string | undefined,
              heroVideoSrc: data.heroVideoSrc as string | undefined,
              heroImages: data.heroImages as string[] | undefined,
              filmPoster: data.filmPoster as string | undefined,
              filmVideoSrc: data.filmVideoSrc as string | undefined,
            }}
            onChange={(v) => setData((d) => ({ ...d, ...v }))}
          />
        )}
        {active === "raw" && (
          <section className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <header>
              <h2 className="text-base font-semibold text-amber-900">Raw JSON</h2>
              <p className="mt-0.5 text-xs text-amber-800">
                Edit the entire settings document directly. Use only if a field is missing from the structured forms. Invalid JSON will fail to save.
              </p>
            </header>
            <textarea
              value={raw}
              onFocus={() => (editingRaw.current = true)}
              onBlur={() => (editingRaw.current = false)}
              onChange={(e) => setRaw(e.target.value)}
              rows={30}
              spellCheck={false}
              className="w-full rounded border border-amber-300 bg-white p-3 font-mono text-xs"
            />
            <p className="text-xs text-amber-800">
              Press Save below — this view&apos;s contents will replace the entire settings document on save.
            </p>
          </section>
        )}

        <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
          {savedMsg && <p className="mr-auto text-sm text-emerald-700">{savedMsg}</p>}
          {!error && !savedMsg && (
            <p className="mr-auto text-xs text-neutral-500">
              {dirty ? "Unsaved changes" : "No changes"}
            </p>
          )}
          <button
            type="button"
            onClick={revert}
            disabled={busy || !dirty}
            className="rounded border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Revert
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy || (!dirty && active !== "raw")}
            className="rounded bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
