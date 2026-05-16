"use client";

import { FieldGroup, TextArea, TextField } from "../../_components/Field";

type Seo = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function SeoSection({
  data,
  onChange,
}: {
  data: Seo;
  onChange: (next: Seo) => void;
}) {
  const set = <K extends keyof Seo>(k: K, v: Seo[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <FieldGroup title="SEO & metadata" description="Shown in browser tabs, search results, and social previews.">
      <TextField label="Page title" value={data.title ?? ""} onChange={(v) => set("title", v)} hint="Browser tab + Google result title" />
      <TextArea label="Meta description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={2} hint="~150–160 characters" />
      <TextField label="Open Graph title" value={data.ogTitle ?? ""} onChange={(v) => set("ogTitle", v)} hint="Title shown in WhatsApp / Twitter shares" />
      <TextArea label="Open Graph description" value={data.ogDescription ?? ""} onChange={(v) => set("ogDescription", v)} rows={2} />
    </FieldGroup>
  );
}
