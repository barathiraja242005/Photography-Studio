"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";

type Portfolio = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  description?: string;
  credentialsLine?: string;
};

export function PortfolioSection({
  data,
  onChange,
}: {
  data: Portfolio;
  onChange: (next: Portfolio) => void;
}) {
  const set = <K extends keyof Portfolio>(k: K, v: Portfolio[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <FieldGroup title="Portfolio / gallery copy" description="Section header for the bento gallery. Photos themselves are managed under Gallery.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />
      <TextField label="Credentials line" value={data.credentialsLine ?? ""} onChange={(v) => set("credentialsLine", v)} hint='e.g. "340+ weddings · 27 cities · 12 years"' />
    </FieldGroup>
  );
}
