"use client";

import { FieldGroup, Grid2, NumberField, TextArea, TextField } from "../../_components/Field";

type Studio = {
  name?: string;
  nameShort?: string;
  monogram?: string;
  tagline?: string;
  established?: number;
  establishedRoman?: string;
  bio?: string;
  closingScript?: string;
};

export function StudioSection({
  data,
  onChange,
}: {
  data: Studio;
  onChange: (next: Studio) => void;
}) {
  const set = <K extends keyof Studio>(k: K, v: Studio[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <FieldGroup title="Studio identity" description="Brand name, tagline, founding year, footer bio.">
      <Grid2>
        <TextField label="Studio name" value={data.name ?? ""} onChange={(v) => set("name", v)} />
        <TextField label="Short name" value={data.nameShort ?? ""} onChange={(v) => set("nameShort", v)} hint="Compact version used in tight spaces" />
        <TextField label="Monogram" value={data.monogram ?? ""} onChange={(v) => set("monogram", v)} hint="e.g. A·S" />
        <TextField label="Tagline" value={data.tagline ?? ""} onChange={(v) => set("tagline", v)} />
        <NumberField label="Established (year)" value={data.established} onChange={(v) => set("established", v)} />
        <TextField label="Established (Roman)" value={data.establishedRoman ?? ""} onChange={(v) => set("establishedRoman", v)} hint="e.g. MMXII" />
      </Grid2>
      <TextArea label="Bio (footer + meta)" value={data.bio ?? ""} onChange={(v) => set("bio", v)} rows={3} />
      <TextField label="Closing script line" value={data.closingScript ?? ""} onChange={(v) => set("closingScript", v)} hint="Italic line at the bottom of the footer" />
    </FieldGroup>
  );
}
