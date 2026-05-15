"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  quote: string;
  couple: string;
  place: string;
  date: string;
  accent: "plum" | "terracotta" | "jade" | "ruby";
  sortOrder: number;
};

const empty: Item = {
  id: 0,
  quote: "",
  couple: "",
  place: "",
  date: "",
  accent: "plum",
  sortOrder: 100,
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function save(t: Partial<Item> & { id?: number }) {
    if (t.id) {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(t),
      });
    } else {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(t),
      });
    }
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Testimonials</h1>
          <p className="text-sm text-neutral-500">{items.length} review{items.length === 1 ? "" : "s"}</p>
        </div>
        <button
          onClick={() =>
            setEditing({ ...empty, sortOrder: (items.at(-1)?.sortOrder ?? 100) + 10 })
          }
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
        >
          + Add review
        </button>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <p className="text-sm text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-neutral-500">
                <strong className="text-neutral-700">{t.couple}</strong> · {t.place}
                {t.date && ` · ${t.date}`} · accent: <span className="font-mono">{t.accent}</span>
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditing(t)}
                  className="rounded border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => del(t.id)}
                  className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Modal item={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function Modal({
  item,
  onCancel,
  onSave,
}: {
  item: Item;
  onCancel: () => void;
  onSave: (t: Partial<Item> & { id?: number }) => void;
}) {
  const [t, setT] = useState(item);
  const isNew = !t.id;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/40 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{isNew ? "Add" : "Edit"} review</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
              Quote
            </span>
            <textarea
              value={t.quote}
              onChange={(e) => setT({ ...t, quote: e.target.value })}
              rows={5}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Couple" value={t.couple} onChange={(v) => setT({ ...t, couple: v })} />
            <Field label="Place" value={t.place} onChange={(v) => setT({ ...t, place: v })} />
            <Field label="Date label" value={t.date} onChange={(v) => setT({ ...t, date: v })} />
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Accent
              </span>
              <select
                value={t.accent}
                onChange={(e) =>
                  setT({ ...t, accent: e.target.value as Item["accent"] })
                }
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              >
                <option value="plum">Plum</option>
                <option value="terracotta">Terracotta</option>
                <option value="jade">Jade</option>
                <option value="ruby">Ruby</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(isNew ? { ...t, id: undefined } : t)}
            disabled={!t.quote || !t.couple}
            className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
      />
    </label>
  );
}
