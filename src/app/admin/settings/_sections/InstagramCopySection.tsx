"use client";

import { FieldGroup, Grid2, NumberField, TextArea, TextField } from "../../_components/Field";

type Stats = {
  posts?: number;
  followers?: number;
  following?: number;
  growthThisWeek?: number;
};
type Notifications = { bell?: number; inbox?: number };
type Insta = {
  displayName?: string;
  bio?: string;
  bookingText?: string;
  locationLine?: string;
  stats?: Stats;
  notifications?: Notifications;
};

export function InstagramCopySection({
  data,
  onChange,
}: {
  data: Insta;
  onChange: (next: Insta) => void;
}) {
  const set = <K extends keyof Insta>(k: K, v: Insta[K]) =>
    onChange({ ...data, [k]: v });
  const setStats = (patch: Partial<Stats>) =>
    onChange({ ...data, stats: { ...(data.stats ?? {}), ...patch } });
  const setNot = (patch: Partial<Notifications>) =>
    onChange({ ...data, notifications: { ...(data.notifications ?? {}), ...patch } });

  return (
    <FieldGroup title="Instagram section copy" description="The mock Instagram profile shown on the site. Posts/reels are managed under the Instagram tab.">
      <Grid2>
        <TextField label="Display name" value={data.displayName ?? ""} onChange={(v) => set("displayName", v)} hint='e.g. "Studio · Wedding Photography"' />
        <TextField label="Booking text" value={data.bookingText ?? ""} onChange={(v) => set("bookingText", v)} hint='e.g. "✨ Booking 2026 — DM to enquire"' />
      </Grid2>
      <TextArea label="Bio" value={data.bio ?? ""} onChange={(v) => set("bio", v)} rows={2} />
      <TextField label="Location line" value={data.locationLine ?? ""} onChange={(v) => set("locationLine", v)} />

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Stats</h3>
        <Grid2>
          <NumberField label="Posts" value={data.stats?.posts} onChange={(v) => setStats({ posts: v })} />
          <NumberField label="Followers" value={data.stats?.followers} onChange={(v) => setStats({ followers: v })} />
          <NumberField label="Following" value={data.stats?.following} onChange={(v) => setStats({ following: v })} />
          <NumberField label="Growth this week" value={data.stats?.growthThisWeek} onChange={(v) => setStats({ growthThisWeek: v })} />
        </Grid2>
      </div>

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Header badges</h3>
        <Grid2>
          <NumberField label="Bell notifications" value={data.notifications?.bell} onChange={(v) => setNot({ bell: v })} />
          <NumberField label="Inbox notifications" value={data.notifications?.inbox} onChange={(v) => setNot({ inbox: v })} />
        </Grid2>
      </div>
    </FieldGroup>
  );
}
