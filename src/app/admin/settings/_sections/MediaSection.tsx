"use client";

import { FieldGroup } from "../../_components/Field";
import { ImagePicker } from "../../_components/ImagePicker";
import { StringListEditor } from "../../_components/ListEditor";

type Media = {
  aboutImage?: string;
  ctaImage?: string;
  heroVideoSrc?: string;
  heroImages?: string[];
  filmPoster?: string;
  filmVideoSrc?: string;
};

export function MediaSection({
  data,
  onChange,
}: {
  data: Media;
  onChange: (next: Media) => void;
}) {
  const set = <K extends keyof Media>(k: K, v: Media[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <FieldGroup
      title="Featured media"
      description="Hero video, About background, CTA banner, Films poster + video. Photos in the gallery and films/IG posts/testimonials are managed under their own tabs."
    >
      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Hero</h3>
        <div className="space-y-3">
          <ImagePicker
            kind="video"
            label="Hero background video"
            value={data.heroVideoSrc ?? ""}
            onChange={(url) => set("heroVideoSrc", url)}
          />
          <StringListEditor
            label="Hero fallback images (slideshow)"
            items={data.heroImages ?? []}
            onChange={(v) => set("heroImages", v)}
            hint="Shown if the video can't play. Paste R2 URLs."
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">About</h3>
        <ImagePicker
          label="About section background image"
          value={data.aboutImage ?? ""}
          onChange={(url) => set("aboutImage", url)}
        />
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">CTA banner</h3>
        <ImagePicker
          label="CTA banner image"
          value={data.ctaImage ?? ""}
          onChange={(url) => set("ctaImage", url)}
        />
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Films — featured film</h3>
        <div className="space-y-3">
          <ImagePicker
            label="Featured film poster"
            value={data.filmPoster ?? ""}
            onChange={(url) => set("filmPoster", url)}
          />
          <ImagePicker
            kind="video"
            label="Featured film video"
            value={data.filmVideoSrc ?? ""}
            onChange={(url) => set("filmVideoSrc", url)}
          />
        </div>
      </div>
    </FieldGroup>
  );
}
