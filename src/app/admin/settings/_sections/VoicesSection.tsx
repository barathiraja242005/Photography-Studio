"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";
import { ListEditor } from "../../_components/ListEditor";

type PressQuote = {
  quote?: string;
  highlight?: string;
  attribution?: string;
  attributionSub?: string;
  date?: string;
};
type Wordmark = {
  name?: string;
  sub?: string;
  accolade?: string;
  fontClass?: string;
};
type Voices = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  aggregate?: { rating?: string; count?: string; years?: string };
  pressQuote?: PressQuote;
  pressWordmarks?: Wordmark[];
};

export function VoicesSection({
  data,
  onChange,
}: {
  data: Voices;
  onChange: (next: Voices) => void;
}) {
  const set = <K extends keyof Voices>(k: K, v: Voices[K]) =>
    onChange({ ...data, [k]: v });
  const setAgg = (patch: Partial<NonNullable<Voices["aggregate"]>>) =>
    onChange({ ...data, aggregate: { ...(data.aggregate ?? {}), ...patch } });
  const setPq = (patch: Partial<PressQuote>) =>
    onChange({ ...data, pressQuote: { ...(data.pressQuote ?? {}), ...patch } });

  return (
    <FieldGroup title="Voices — section copy & press" description="Section header, aggregate rating, big press quote, and press wordmarks. Individual reviews live under the Testimonials tab.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Aggregate rating chip</h3>
        <Grid2>
          <TextField label="Rating" value={data.aggregate?.rating ?? ""} onChange={(v) => setAgg({ rating: v })} hint='e.g. "5.0"' />
          <TextField label="Count" value={data.aggregate?.count ?? ""} onChange={(v) => setAgg({ count: v })} hint='e.g. "340+"' />
          <TextField label="Years line" value={data.aggregate?.years ?? ""} onChange={(v) => setAgg({ years: v })} hint='e.g. "12 years"' />
        </Grid2>
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Press quote (big editorial card)</h3>
        <div className="space-y-3">
          <TextArea label="Quote" value={data.pressQuote?.quote ?? ""} onChange={(v) => setPq({ quote: v })} rows={3} />
          <TextField label="Highlight phrase" value={data.pressQuote?.highlight ?? ""} onChange={(v) => setPq({ highlight: v })} hint="A substring of the quote that gets highlighted" />
          <Grid2>
            <TextField label="Attribution" value={data.pressQuote?.attribution ?? ""} onChange={(v) => setPq({ attribution: v })} hint='e.g. "VOGUE"' />
            <TextField label="Attribution sub" value={data.pressQuote?.attributionSub ?? ""} onChange={(v) => setPq({ attributionSub: v })} hint='e.g. "INDIA"' />
          </Grid2>
          <TextField label="Date" value={data.pressQuote?.date ?? ""} onChange={(v) => setPq({ date: v })} hint='e.g. "January 2024"' />
        </div>
      </div>

      <ListEditor<Wordmark>
        label="Press wordmarks (row of logos)"
        items={data.pressWordmarks ?? []}
        onChange={(v) => set("pressWordmarks", v)}
        blank={() => ({ name: "", sub: "", accolade: "", fontClass: "font-display font-bold tracking-[0.32em]" })}
        rowTitle={(w) => w.name || "(unnamed)"}
        renderRow={(w, s) => (
          <div className="space-y-2">
            <Grid2>
              <TextField label="Name" value={w.name ?? ""} onChange={(v) => s({ name: v })} />
              <TextField label="Sub" value={w.sub ?? ""} onChange={(v) => s({ sub: v })} hint="Optional, e.g. 'INDIA'" />
            </Grid2>
            <TextField label="Accolade" value={w.accolade ?? ""} onChange={(v) => s({ accolade: v })} hint={`e.g. "Editor's Pick"`} />
            <TextField label="Font class (Tailwind)" value={w.fontClass ?? ""} onChange={(v) => s({ fontClass: v })} hint="Advanced — Tailwind classes controlling typography" />
          </div>
        )}
      />
    </FieldGroup>
  );
}
