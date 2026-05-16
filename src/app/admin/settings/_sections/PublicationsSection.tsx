"use client";

import { FieldGroup } from "../../_components/Field";
import { StringListEditor } from "../../_components/ListEditor";

export function PublicationsSection({
  data,
  onChange,
}: {
  data: string[] | undefined;
  onChange: (next: string[]) => void;
}) {
  return (
    <FieldGroup title="Publications / press marquee" description="Names that scroll across the 'As featured in' strip.">
      <StringListEditor
        label="Publication names"
        items={data ?? []}
        onChange={onChange}
        placeholder="e.g. Vogue India"
      />
    </FieldGroup>
  );
}
