"use client";

import { FieldGroup, Grid2, SelectField, TextArea, TextField } from "../../_components/Field";
import { ListEditor } from "../../_components/ListEditor";

type Newsletter = { title?: string; blurb?: string; disclaimer?: string };
type Badge = { label?: string; icon?: "newspaper" | null };
type Link = { label?: string; href?: string };
type Footer = {
  bookingPill?: string;
  trustBadges?: Badge[];
  newsletter?: Newsletter;
  legalLinks?: Link[];
  madeInLine?: string;
  forLoveLine?: string;
};

const ICON_OPTIONS = [
  { value: "newspaper", label: "Newspaper" },
  { value: "", label: "None" },
] as const;

export function FooterSection({
  data,
  onChange,
}: {
  data: Footer;
  onChange: (next: Footer) => void;
}) {
  const set = <K extends keyof Footer>(k: K, v: Footer[K]) =>
    onChange({ ...data, [k]: v });
  const setNl = (patch: Partial<Newsletter>) =>
    onChange({ ...data, newsletter: { ...(data.newsletter ?? {}), ...patch } });

  return (
    <FieldGroup title="Footer" description="Bottom-of-page strip: booking pill, newsletter, legal links, sign-off lines.">
      <TextField label="Booking pill" value={data.bookingPill ?? ""} onChange={(v) => set("bookingPill", v)} hint='e.g. "Currently booking 2026 — 4 dates left"' />

      <ListEditor<Badge>
        label="Trust badges (above newsletter)"
        items={data.trustBadges ?? []}
        onChange={(v) => set("trustBadges", v)}
        blank={() => ({ label: "", icon: null })}
        rowTitle={(b) => b.label || "(empty)"}
        renderRow={(b, s) => (
          <Grid2>
            <TextField label="Label" value={b.label ?? ""} onChange={(v) => s({ label: v })} />
            <SelectField
              label="Icon"
              value={(b.icon ?? "") as "newspaper" | ""}
              onChange={(v) => s({ icon: v === "" ? null : v })}
              options={ICON_OPTIONS}
            />
          </Grid2>
        )}
      />

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Newsletter</h3>
        <div className="space-y-3">
          <TextField label="Title" value={data.newsletter?.title ?? ""} onChange={(v) => setNl({ title: v })} />
          <TextArea label="Blurb" value={data.newsletter?.blurb ?? ""} onChange={(v) => setNl({ blurb: v })} rows={2} />
          <TextField label="Disclaimer" value={data.newsletter?.disclaimer ?? ""} onChange={(v) => setNl({ disclaimer: v })} />
        </div>
      </div>

      <ListEditor<Link>
        label="Legal / footer links"
        items={data.legalLinks ?? []}
        onChange={(v) => set("legalLinks", v)}
        blank={() => ({ label: "", href: "#" })}
        rowTitle={(l) => l.label || "(empty)"}
        renderRow={(l, s) => (
          <Grid2>
            <TextField label="Label" value={l.label ?? ""} onChange={(v) => s({ label: v })} />
            <TextField label="Link" value={l.href ?? ""} onChange={(v) => s({ href: v })} />
          </Grid2>
        )}
      />

      <Grid2>
        <TextField label="Made-in line" value={data.madeInLine ?? ""} onChange={(v) => set("madeInLine", v)} hint='e.g. "Made in India"' />
        <TextField label="For-love line" value={data.forLoveLine ?? ""} onChange={(v) => set("forLoveLine", v)} hint='e.g. "for couples everywhere"' />
      </Grid2>
    </FieldGroup>
  );
}
