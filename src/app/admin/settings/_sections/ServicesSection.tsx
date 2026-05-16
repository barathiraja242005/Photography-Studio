"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";
import { ListEditor } from "../../_components/ListEditor";

type Item = { no?: string; name?: string; blurb?: string; time?: string };
type Inclusion = { label?: string; sub?: string };
type CTA = { label?: string; href?: string };
type Services = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  description?: string;
  items?: Item[];
  inclusions?: Inclusion[];
  pricingNote?: string;
  primaryCTA?: CTA;
};

export function ServicesSection({
  data,
  onChange,
}: {
  data: Services;
  onChange: (next: Services) => void;
}) {
  const set = <K extends keyof Services>(k: K, v: Services[K]) =>
    onChange({ ...data, [k]: v });
  const setCta = (patch: Partial<CTA>) =>
    onChange({ ...data, primaryCTA: { ...(data.primaryCTA ?? {}), ...patch } });
  return (
    <FieldGroup title="Services" description="The 6 coverage tiles, inclusions, and CTA.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <ListEditor<Item>
        label="Service tiles"
        items={data.items ?? []}
        onChange={(v) => set("items", v)}
        blank={() => ({ no: "", name: "", blurb: "", time: "" })}
        rowTitle={(i) => `${i.no || "??"} — ${i.name || "(no name)"}`}
        hint="First tile is rendered as the featured big tile."
        renderRow={(i, s) => (
          <div className="space-y-2">
            <Grid2>
              <TextField label="Number" value={i.no ?? ""} onChange={(v) => s({ no: v })} hint='e.g. "01"' />
              <TextField label="Name" value={i.name ?? ""} onChange={(v) => s({ name: v })} hint='e.g. "Wedding"' />
            </Grid2>
            <TextField label="Time" value={i.time ?? ""} onChange={(v) => s({ time: v })} hint='e.g. "All Day · 12 hrs"' />
            <TextArea label="Blurb" value={i.blurb ?? ""} onChange={(v) => s({ blurb: v })} rows={3} />
          </div>
        )}
      />
      <ListEditor<Inclusion>
        label="Inclusions (bullets under tiles)"
        items={data.inclusions ?? []}
        onChange={(v) => set("inclusions", v)}
        blank={() => ({ label: "", sub: "" })}
        rowTitle={(inc) => inc.label || "(empty)"}
        renderRow={(inc, s) => (
          <Grid2>
            <TextField label="Label" value={inc.label ?? ""} onChange={(v) => s({ label: v })} />
            <TextField label="Sub-text" value={inc.sub ?? ""} onChange={(v) => s({ sub: v })} />
          </Grid2>
        )}
      />
      <TextField label="Pricing note" value={data.pricingNote ?? ""} onChange={(v) => set("pricingNote", v)} />
      <Grid2>
        <TextField label="CTA label" value={data.primaryCTA?.label ?? ""} onChange={(v) => setCta({ label: v })} />
        <TextField label="CTA link" value={data.primaryCTA?.href ?? ""} onChange={(v) => setCta({ href: v })} />
      </Grid2>
    </FieldGroup>
  );
}
