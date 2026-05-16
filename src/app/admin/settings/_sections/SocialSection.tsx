"use client";

import { FieldGroup, Grid2, TextField } from "../../_components/Field";

type Handle = { name?: string; handle?: string; username?: string; url?: string };
type Social = {
  instagram?: Handle;
  pinterest?: Handle;
  youtube?: Handle;
  whatsapp?: Handle;
};

const PLATFORMS: { key: keyof Social; label: string; showUsername?: boolean }[] = [
  { key: "instagram", label: "Instagram", showUsername: true },
  { key: "pinterest", label: "Pinterest" },
  { key: "youtube", label: "YouTube" },
  { key: "whatsapp", label: "WhatsApp" },
];

export function SocialSection({
  data,
  onChange,
}: {
  data: Social;
  onChange: (next: Social) => void;
}) {
  function setPlatform(p: keyof Social, patch: Partial<Handle>) {
    onChange({ ...data, [p]: { ...(data[p] ?? {}), ...patch } });
  }
  return (
    <FieldGroup title="Social handles" description="Used in the Instagram section, footer, and contact links.">
      {PLATFORMS.map(({ key, label, showUsername }) => {
        const h = data[key] ?? {};
        return (
          <div key={key} className="rounded border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="mb-3 text-sm font-medium text-neutral-700">{label}</h3>
            <Grid2>
              <TextField label="Display name" value={h.name ?? ""} onChange={(v) => setPlatform(key, { name: v })} />
              <TextField label="Handle" value={h.handle ?? ""} onChange={(v) => setPlatform(key, { handle: v })} hint='e.g. "@studio" or "/studio"' />
              {showUsername && (
                <TextField label="Username (no @)" value={h.username ?? ""} onChange={(v) => setPlatform(key, { username: v })} />
              )}
              <TextField label="URL" value={h.url ?? ""} onChange={(v) => setPlatform(key, { url: v })} />
            </Grid2>
          </div>
        );
      })}
    </FieldGroup>
  );
}
