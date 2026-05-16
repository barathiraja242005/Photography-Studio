"use client";

import { FieldGroup, Grid2, NumberField, SelectField, TextArea, TextField } from "../../_components/Field";
import { ListEditor } from "../../_components/ListEditor";

type Availability = {
  day?: string;
  date?: string;
  status?: "open" | "booked" | "limited";
};
type BookingStatus = { year?: string; remaining?: number; next?: string };
type Section = {
  eyebrow?: string;
  titleMain?: string;
  titleScript?: string;
  description?: string;
  availability?: Availability[];
  bookingStatus?: BookingStatus;
};

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "booked", label: "Booked" },
  { value: "limited", label: "Limited" },
] as const;

export function ContactFormSection({
  data,
  onChange,
}: {
  data: Section;
  onChange: (next: Section) => void;
}) {
  const set = <K extends keyof Section>(k: K, v: Section[K]) =>
    onChange({ ...data, [k]: v });
  const setBs = (patch: Partial<BookingStatus>) =>
    onChange({ ...data, bookingStatus: { ...(data.bookingStatus ?? {}), ...patch } });

  return (
    <FieldGroup title="Contact form section copy" description="The headline + availability sidebar above the form.">
      <TextField label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => set("eyebrow", v)} />
      <Grid2>
        <TextField label="Title (main)" value={data.titleMain ?? ""} onChange={(v) => set("titleMain", v)} />
        <TextField label="Title (script)" value={data.titleScript ?? ""} onChange={(v) => set("titleScript", v)} />
      </Grid2>
      <TextArea label="Description" value={data.description ?? ""} onChange={(v) => set("description", v)} rows={3} />

      <ListEditor<Availability>
        label="Availability (upcoming Saturdays)"
        items={data.availability ?? []}
        onChange={(v) => set("availability", v)}
        blank={() => ({ day: "Sat", date: "", status: "open" })}
        rowTitle={(a) => `${a.day || ""} ${a.date || ""} — ${a.status || ""}`}
        renderRow={(a, s) => (
          <Grid2>
            <TextField label="Day" value={a.day ?? ""} onChange={(v) => s({ day: v })} hint='e.g. "Sat"' />
            <TextField label="Date" value={a.date ?? ""} onChange={(v) => s({ date: v })} hint='e.g. "Mar 14"' />
            <SelectField
              label="Status"
              value={(a.status ?? "open") as "open" | "booked" | "limited"}
              onChange={(v) => s({ status: v })}
              options={STATUS_OPTIONS}
            />
          </Grid2>
        )}
      />

      <div className="rounded border border-neutral-200 bg-neutral-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-neutral-700">Booking status banner</h3>
        <Grid2>
          <TextField label="Year" value={data.bookingStatus?.year ?? ""} onChange={(v) => setBs({ year: v })} />
          <NumberField label="Dates remaining" value={data.bookingStatus?.remaining} onChange={(v) => setBs({ remaining: v })} />
        </Grid2>
        <TextField label="Next-year line" value={data.bookingStatus?.next ?? ""} onChange={(v) => setBs({ next: v })} hint='e.g. "2027 calendar opens in March."' />
      </div>
    </FieldGroup>
  );
}
