"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "../_components/ImagePicker";

// Lightweight settings editor: a few highlighted fields up top (most-edited),
// plus a raw JSON pane below for full control over every nested section.
export default function SettingsAdmin() {
  const [raw, setRaw] = useState<string>("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      setData(json.data || {});
      setRaw(JSON.stringify(json.data || {}, null, 2));
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

  function setPath(path: string[], value: unknown) {
    setData((d) => {
      const copy = structuredClone(d ?? {}) as Record<string, unknown>;
      let cursor = copy as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        if (typeof cursor[path[i]] !== "object" || cursor[path[i]] === null) {
          cursor[path[i]] = {};
        }
        cursor = cursor[path[i]] as Record<string, unknown>;
      }
      cursor[path[path.length - 1]] = value;
      setRaw(JSON.stringify(copy, null, 2));
      return copy;
    });
  }

  function get(path: string[]): unknown {
    let cursor: unknown = data;
    for (const p of path) {
      if (typeof cursor !== "object" || cursor === null) return undefined;
      cursor = (cursor as Record<string, unknown>)[p];
    }
    return cursor;
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSavedMsg(null);
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch (e) {
      setError("JSON is invalid: " + (e instanceof Error ? e.message : "parse error"));
      setBusy(false);
      return;
    }
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Save failed.");
    } else {
      setSavedMsg("Saved. Live site will update within ~60 seconds.");
      setTimeout(() => setSavedMsg(null), 4000);
      // refresh local view
      setData(body as Record<string, unknown>);
    }
    setBusy(false);
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  if (error && !data) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-medium">Failed to load settings</p>
        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">{error}</pre>
        <button onClick={load} className="mt-3 rounded border border-red-300 bg-white px-3 py-1 text-xs">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Edit the most-changed fields below, or scroll down to edit the full JSON.
        </p>
      </header>

      <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">
          Studio identity
        </h2>
        <Row label="Studio name" path={["studio", "name"]} get={get} set={setPath} />
        <Row label="Tagline" path={["studio", "tagline"]} get={get} set={setPath} />
        <Row label="Bio (footer)" path={["studio", "bio"]} get={get} set={setPath} textarea />

        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Contact
        </h2>
        <Row label="Phone (display)" path={["contact", "phoneDisplay"]} get={get} set={setPath} />
        <Row label="Phone (tel: link)" path={["contact", "phoneTel"]} get={get} set={setPath} />
        <Row label="Email" path={["contact", "email"]} get={get} set={setPath} />
        <Row label="WhatsApp link" path={["contact", "whatsappLink"]} get={get} set={setPath} />

        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
          Hero
        </h2>
        <Row label="Eyebrow" path={["hero", "eyebrow"]} get={get} set={setPath} />
        <Row label="Description" path={["hero", "description"]} get={get} set={setPath} textarea />
        <Row label="Booking pill" path={["hero", "bookingPill"]} get={get} set={setPath} />

        <h2 className="pt-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
          SEO
        </h2>
        <Row label="Page title" path={["seo", "title"]} get={get} set={setPath} />
        <Row label="Meta description" path={["seo", "description"]} get={get} set={setPath} textarea />
      </section>

      <section className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">
          Featured images & videos
        </h2>
        <ImagePicker
          label="About background image"
          value={(get(["about", "aboutImage"]) as string) || ""}
          onChange={(url) => setPath(["about", "aboutImage"], url)}
        />
        <ImagePicker
          label="CTA banner image"
          value={(get(["ctaBanner", "ctaImage"]) as string) || ""}
          onChange={(url) => setPath(["ctaBanner", "ctaImage"], url)}
        />
        <ImagePicker
          label="Hero background video"
          kind="video"
          value={(get(["hero", "heroVideoSrc"]) as string) || ""}
          onChange={(url) => setPath(["hero", "heroVideoSrc"], url)}
        />
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <details>
          <summary className="cursor-pointer text-sm font-medium uppercase tracking-wider text-neutral-500">
            Full JSON (every field)
          </summary>
          <p className="mt-3 text-xs text-neutral-500">
            All fields from the original site.ts file are editable here. Be careful with brackets/commas — invalid JSON will fail to save.
          </p>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={30}
            className="mt-3 w-full rounded border border-neutral-300 p-3 font-mono text-xs"
            spellCheck={false}
          />
        </details>
      </section>

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
        {savedMsg && <p className="mr-auto text-sm text-emerald-700">{savedMsg}</p>}
        <button
          onClick={save}
          disabled={busy}
          className="rounded bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  path,
  get,
  set,
  textarea,
}: {
  label: string;
  path: string[];
  get: (p: string[]) => unknown;
  set: (p: string[], v: unknown) => void;
  textarea?: boolean;
}) {
  const value = (get(path) as string) ?? "";
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => set(path, e.target.value)}
          rows={3}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => set(path, e.target.value)}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}
