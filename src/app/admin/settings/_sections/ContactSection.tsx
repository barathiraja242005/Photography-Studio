"use client";

import { FieldGroup, Grid2, TextField } from "../../_components/Field";
import { StringListEditor } from "../../_components/ListEditor";

type Address = { line1?: string; city?: string; pincode?: string };
type Contact = {
  phoneDisplay?: string;
  phoneTel?: string;
  email?: string;
  whatsappDisplay?: string;
  whatsappLink?: string;
  address?: Address;
  hours?: string;
  hoursNote?: string;
  responseTime?: string;
  locations?: string[];
  coverage?: string;
};

export function ContactSection({
  data,
  onChange,
}: {
  data: Contact;
  onChange: (next: Contact) => void;
}) {
  const set = <K extends keyof Contact>(k: K, v: Contact[K]) =>
    onChange({ ...data, [k]: v });
  const setAddr = <K extends keyof Address>(k: K, v: Address[K]) =>
    onChange({ ...data, address: { ...(data.address ?? {}), [k]: v } });
  return (
    <FieldGroup title="Contact details" description="Phone, email, studio address, hours.">
      <Grid2>
        <TextField label="Phone (display)" value={data.phoneDisplay ?? ""} onChange={(v) => set("phoneDisplay", v)} hint="With spaces, e.g. +91 98765 43210" />
        <TextField label="Phone (tel: link)" value={data.phoneTel ?? ""} onChange={(v) => set("phoneTel", v)} hint="No spaces, e.g. +919876543210" />
        <TextField label="Email" value={data.email ?? ""} onChange={(v) => set("email", v)} />
        <TextField label="WhatsApp (display)" value={data.whatsappDisplay ?? ""} onChange={(v) => set("whatsappDisplay", v)} />
        <TextField label="WhatsApp (link)" value={data.whatsappLink ?? ""} onChange={(v) => set("whatsappLink", v)} hint="https://wa.me/..." />
        <TextField label="Response time" value={data.responseTime ?? ""} onChange={(v) => set("responseTime", v)} hint='e.g. "Replies in 48h"' />
      </Grid2>
      <Grid2>
        <TextField label="Address line 1" value={data.address?.line1 ?? ""} onChange={(v) => setAddr("line1", v)} />
        <TextField label="City" value={data.address?.city ?? ""} onChange={(v) => setAddr("city", v)} />
        <TextField label="Pincode" value={data.address?.pincode ?? ""} onChange={(v) => setAddr("pincode", v)} />
        <TextField label="Hours" value={data.hours ?? ""} onChange={(v) => set("hours", v)} />
        <TextField label="Hours note" value={data.hoursNote ?? ""} onChange={(v) => set("hoursNote", v)} />
        <TextField label="Coverage line" value={data.coverage ?? ""} onChange={(v) => set("coverage", v)} />
      </Grid2>
      <StringListEditor
        label="Cities covered"
        items={data.locations ?? []}
        onChange={(v) => set("locations", v)}
        placeholder="e.g. Mumbai"
      />
    </FieldGroup>
  );
}
