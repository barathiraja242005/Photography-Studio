"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";

type CTA = { label?: string; href?: string };
type Cta = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  description?: string;
  primaryCTA?: CTA;
};

export function CtaBannerSection({
  data,
  onChange,
}: {
  data: Cta;
  onChange: (next: Cta) => void;
}) {
  const set = <K extends keyof Cta>(k: K, v: Cta[K]) =>
    onChange({ ...data, [k]: v });
  const setCta = (patch: Partial<CTA>) =>
    onChange({ ...data, primaryCTA: { ...(data.primaryCTA ?? {}), ...patch } });
  return (
    <FieldGroup title="CTA banner (between Voices & Instagram)" description="The big call-to-action strip with image and headline.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <Grid2>
        <TextField label="CTA label" value={data.primaryCTA?.label ?? ""} onChange={(v) => setCta({ label: v })} />
        <TextField label="CTA link" value={data.primaryCTA?.href ?? ""} onChange={(v) => setCta({ href: v })} />
      </Grid2>
      <p className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        The banner image is edited under the <strong>Media</strong> tab.
      </p>
    </FieldGroup>
  );
}
