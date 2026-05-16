"use client";

import { FieldGroup } from "../../_components/Field";
import { ListEditor } from "../../_components/ListEditor";

type Link = { href?: string; label?: string };
type Nav = {
  links?: Link[];
  portfolioDropdown?: Link[];
};

function LinkRow({ item, set }: { item: Link; set: (patch: Partial<Link>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        value={item.label ?? ""}
        onChange={(e) => set({ label: e.target.value })}
        placeholder="Label"
        className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
      />
      <input
        value={item.href ?? ""}
        onChange={(e) => set({ href: e.target.value })}
        placeholder="#anchor or URL"
        className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
      />
    </div>
  );
}

export function NavSection({
  data,
  onChange,
}: {
  data: Nav;
  onChange: (next: Nav) => void;
}) {
  const set = <K extends keyof Nav>(k: K, v: Nav[K]) =>
    onChange({ ...data, [k]: v });
  return (
    <FieldGroup title="Navigation" description="Top nav links and the Portfolio dropdown menu.">
      <ListEditor<Link>
        label="Main nav links"
        items={data.links ?? []}
        onChange={(v) => set("links", v)}
        blank={() => ({ label: "", href: "#" })}
        rowTitle={(item) => item.label || "(no label)"}
        renderRow={(item, s) => <LinkRow item={item} set={s} />}
      />
      <ListEditor<Link>
        label="Portfolio dropdown"
        items={data.portfolioDropdown ?? []}
        onChange={(v) => set("portfolioDropdown", v)}
        blank={() => ({ label: "", href: "#portfolio" })}
        rowTitle={(item) => item.label || "(no label)"}
        renderRow={(item, s) => <LinkRow item={item} set={s} />}
      />
    </FieldGroup>
  );
}
