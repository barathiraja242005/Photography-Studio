"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";
import { StringListEditor } from "../../_components/ListEditor";

type CTA = { label?: string; href?: string };
type Hero = {
  eyebrow?: string;
  headlineLines?: string[];
  headlineScript?: string;
  description?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  bookingPill?: string;
};

export function HeroSection({
  data,
  onChange,
}: {
  data: Hero;
  onChange: (next: Hero) => void;
}) {
  const set = <K extends keyof Hero>(k: K, v: Hero[K]) =>
    onChange({ ...data, [k]: v });
  const setCta = (which: "primaryCTA" | "secondaryCTA", patch: Partial<CTA>) =>
    onChange({ ...data, [which]: { ...(data[which] ?? {}), ...patch } });

  return (
    <FieldGroup title="Hero" description="The opening landscape — eyebrow, big headline, CTAs, background media.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} hint='Small line above the headline (e.g. "Candid Wedding Photography")' />
      <StringListEditor
        label="Headline lines"
        items={data.headlineLines ?? []}
        onChange={(v) => set("headlineLines", v)}
        hint="Each entry becomes a line of the big serif headline."
        placeholder="Wedding"
      />
      <TextField label="Headline script ending" value={data.headlineScript ?? ""} onChange={(v) => set("headlineScript", v)} hint="Italic flourish line, e.g. 'in India.'" />
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <TextField label="Booking pill" value={data.bookingPill ?? ""} onChange={(v) => set("bookingPill", v)} hint='e.g. "Booking 2026–2027 dates"' />
      <Grid2>
        <div className="rounded border border-neutral-200 bg-neutral-50 p-3">
          <h4 className="mb-2 text-xs font-medium text-neutral-600">Primary CTA</h4>
          <div className="grid gap-2">
            <TextField label="Label" value={data.primaryCTA?.label ?? ""} onChange={(v) => setCta("primaryCTA", { label: v })} />
            <TextField label="Link" value={data.primaryCTA?.href ?? ""} onChange={(v) => setCta("primaryCTA", { href: v })} />
          </div>
        </div>
        <div className="rounded border border-neutral-200 bg-neutral-50 p-3">
          <h4 className="mb-2 text-xs font-medium text-neutral-600">Secondary CTA</h4>
          <div className="grid gap-2">
            <TextField label="Label" value={data.secondaryCTA?.label ?? ""} onChange={(v) => setCta("secondaryCTA", { label: v })} />
            <TextField label="Link" value={data.secondaryCTA?.href ?? ""} onChange={(v) => setCta("secondaryCTA", { href: v })} />
          </div>
        </div>
      </Grid2>
      <p className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        Background video and fallback images are edited under the <strong>Media</strong> tab.
      </p>
    </FieldGroup>
  );
}
