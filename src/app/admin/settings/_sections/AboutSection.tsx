"use client";

import { FieldGroup, Grid2, NumberField, SelectField, TextArea, TextField } from "../../_components/Field";
import { ListEditor, StringListEditor } from "../../_components/ListEditor";

type Chapter = { numeral?: string; label?: string; body?: string };
type Stat = { n?: number; suffix?: string; word?: string; label?: string; sub?: string; color?: string };
type Founder = { name?: string; role?: string; bio?: string };
type Milestone = { year?: string; label?: string };

type About = {
  eyebrow?: string;
  statusStrip?: string[];
  headlineMain?: string;
  headlineScript?: string;
  qualities?: string[];
  bylineParts?: string[];
  chapters?: Chapter[];
  pullQuoteLines?: string[];
  polaroidCaptions?: string[];
  backgroundWordmark?: string;
  stats?: Stat[];
  founders?: Founder[];
  timeline?: Milestone[];
};

const COLORS = [
  { value: "plum", label: "Plum" },
  { value: "jade", label: "Jade" },
  { value: "terracotta", label: "Terracotta" },
  { value: "ruby", label: "Ruby" },
] as const;

export function AboutSection({
  data,
  onChange,
}: {
  data: About;
  onChange: (next: About) => void;
}) {
  const set = <K extends keyof About>(k: K, v: About[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <FieldGroup title="About / Our story" description="Studio backstory, founders, stats, and timeline.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} hint='e.g. "01 — Our Story"' />
      <Grid2>
        <TextField label="Headline (main)" value={data.headlineMain ?? ""} onChange={(v) => set("headlineMain", v)} />
        <TextField label="Headline (script)" value={data.headlineScript ?? ""} onChange={(v) => set("headlineScript", v)} hint="The italic flourish line" />
      </Grid2>
      <StringListEditor label="Status strip (top tags)" items={data.statusStrip ?? []} onChange={(v) => set("statusStrip", v)} placeholder='e.g. "Est. 2012"' />
      <StringListEditor label="Qualities (under headline)" items={data.qualities ?? []} onChange={(v) => set("qualities", v)} placeholder='e.g. "Film"' />
      <StringListEditor label="Byline parts" items={data.bylineParts ?? []} onChange={(v) => set("bylineParts", v)} hint="Each separated by · in the rendered byline" />
      <p className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        The About background image is edited under the <strong>Media</strong> tab.
      </p>

      <ListEditor<Chapter>
        label="Chapters (editorial body)"
        items={data.chapters ?? []}
        onChange={(v) => set("chapters", v)}
        blank={() => ({ numeral: "", label: "", body: "" })}
        rowTitle={(c) => `${c.numeral || "?"} — ${c.label || "(untitled)"}`}
        renderRow={(c, s) => (
          <div className="space-y-2">
            <Grid2>
              <TextField label="Numeral" value={c.numeral ?? ""} onChange={(v) => s({ numeral: v })} hint="Roman: I, II, III" />
              <TextField label="Label" value={c.label ?? ""} onChange={(v) => s({ label: v })} hint='e.g. "Origin"' />
            </Grid2>
            <TextArea label="Body" value={c.body ?? ""} onChange={(v) => s({ body: v })} rows={3} />
          </div>
        )}
      />

      <StringListEditor label="Pull-quote lines" items={data.pullQuoteLines ?? []} onChange={(v) => set("pullQuoteLines", v)} hint="Each line of the big editorial pull-quote" />
      <StringListEditor label="Polaroid captions" items={data.polaroidCaptions ?? []} onChange={(v) => set("polaroidCaptions", v)} />
      <TextField label="Background wordmark" value={data.backgroundWordmark ?? ""} onChange={(v) => set("backgroundWordmark", v)} hint="The faint repeating text behind the section" />

      <ListEditor<Stat>
        label="Stats (big numbers panel)"
        items={data.stats ?? []}
        onChange={(v) => set("stats", v)}
        blank={() => ({ n: 0, suffix: "+", word: "", label: "", sub: "", color: "plum" })}
        rowTitle={(s) => `${s.n ?? 0}${s.suffix ?? ""} — ${s.label || ""}`}
        renderRow={(s, set) => (
          <div className="space-y-2">
            <Grid2>
              <NumberField label="Number" value={s.n} onChange={(v) => set({ n: v })} />
              <TextField label="Suffix" value={s.suffix ?? ""} onChange={(v) => set({ suffix: v })} hint='e.g. "+"' />
            </Grid2>
            <Grid2>
              <TextField label="Word form" value={s.word ?? ""} onChange={(v) => set({ word: v })} hint='e.g. "Twelve"' />
              <SelectField label="Accent colour" value={(s.color ?? "plum") as "plum" | "jade" | "terracotta" | "ruby"} onChange={(v) => set({ color: v })} options={COLORS} />
            </Grid2>
            <TextField label="Label" value={s.label ?? ""} onChange={(v) => set({ label: v })} hint='e.g. "Years Working"' />
            <TextField label="Sub-text" value={s.sub ?? ""} onChange={(v) => set({ sub: v })} />
          </div>
        )}
      />

      <ListEditor<Founder>
        label="Founders / portraits"
        items={data.founders ?? []}
        onChange={(v) => set("founders", v)}
        blank={() => ({ name: "", role: "", bio: "" })}
        rowTitle={(f) => f.name || "(unnamed)"}
        renderRow={(f, s) => (
          <div className="space-y-2">
            <Grid2>
              <TextField label="Name" value={f.name ?? ""} onChange={(v) => s({ name: v })} />
              <TextField label="Role" value={f.role ?? ""} onChange={(v) => s({ role: v })} />
            </Grid2>
            <TextArea label="Bio" value={f.bio ?? ""} onChange={(v) => s({ bio: v })} rows={2} />
          </div>
        )}
      />

      <ListEditor<Milestone>
        label="Timeline / milestones"
        items={data.timeline ?? []}
        onChange={(v) => set("timeline", v)}
        blank={() => ({ year: "", label: "" })}
        rowTitle={(m) => `${m.year || "????"} — ${m.label || ""}`}
        renderRow={(m, s) => (
          <Grid2>
            <TextField label="Year" value={m.year ?? ""} onChange={(v) => s({ year: v })} />
            <TextField label="Label" value={m.label ?? ""} onChange={(v) => s({ label: v })} />
          </Grid2>
        )}
      />
    </FieldGroup>
  );
}
