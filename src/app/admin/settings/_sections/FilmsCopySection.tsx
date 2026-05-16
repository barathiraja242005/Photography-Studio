"use client";

import { FieldGroup, Grid2, TextArea, TextField } from "../../_components/Field";

type FeaturedFilm = { title?: string; duration?: string; videoSrc?: string };
type Films = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  description?: string;
  featuredFilm?: FeaturedFilm;
};

export function FilmsCopySection({
  data,
  onChange,
}: {
  data: Films;
  onChange: (next: Films) => void;
}) {
  const set = <K extends keyof Films>(k: K, v: Films[K]) =>
    onChange({ ...data, [k]: v });
  const setFeat = (patch: Partial<FeaturedFilm>) =>
    onChange({ ...data, featuredFilm: { ...(data.featuredFilm ?? {}), ...patch } });
  return (
    <FieldGroup title="Films — section copy" description="Section header for Films. Individual films/reels are managed under the Films tab.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Featured film (big player)</h3>
        <div className="space-y-3">
          <TextField label="Title" value={data.featuredFilm?.title ?? ""} onChange={(v) => setFeat({ title: v })} />
          <TextField label="Duration line" value={data.featuredFilm?.duration ?? ""} onChange={(v) => setFeat({ duration: v })} hint='e.g. "3:42 — feature film"' />
        </div>
      </div>
      <p className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
        The featured film video and poster image are edited under the <strong>Media</strong> tab.
      </p>
    </FieldGroup>
  );
}
