"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "../_components/ImagePicker";

type Photo = {
  id: number;
  imageUrl: string;
  alt: string;
  tag: string;
  height: number;
  sortOrder: number;
};

const TAGS = [
  "Wedding",
  "Pre-Wedding",
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Baraat",
  "Maternity",
];

export default function GalleryAdmin() {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Photo | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery", { cache: "no-store" });
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // Initial data fetch — load() sets state via setItems/setLoading.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function save(p: Partial<Photo> & { id?: number }) {
    if (p.id) {
      await fetch(`/api/admin/gallery/${p.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(p),
      });
    } else {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(p),
      });
    }
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this photo? This also removes the file from storage.")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gallery</h1>
          <p className="text-sm text-neutral-500">
            {items.length} photo{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              id: 0,
              imageUrl: "",
              alt: "",
              tag: "Wedding",
              height: 6,
              sortOrder: (items.at(-1)?.sortOrder ?? 100) + 10,
            })
          }
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
        >
          + Add photo
        </button>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          No photos yet. Click &quot;Add photo&quot; to upload one.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.alt}
                className="h-40 w-full object-cover"
              />
              <div className="p-3 text-xs">
                <p className="line-clamp-1 font-medium text-neutral-900">{p.alt}</p>
                <p className="text-neutral-500">{p.tag} · h{p.height}</p>
              </div>
              <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded bg-white/95 px-2 py-1 text-xs shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => del(p.id)}
                  className="rounded bg-red-600/95 px-2 py-1 text-xs text-white shadow"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <PhotoModal
          photo={editing}
          tags={TAGS}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function PhotoModal({
  photo,
  tags,
  onCancel,
  onSave,
}: {
  photo: Photo;
  tags: string[];
  onCancel: () => void;
  onSave: (p: Partial<Photo> & { id?: number }) => void;
}) {
  const [p, setP] = useState(photo);
  const isNew = !p.id;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isNew ? "Add" : "Edit"} photo
        </h2>
        <div className="space-y-4">
          <ImagePicker
            value={p.imageUrl}
            onChange={(url) => setP({ ...p, imageUrl: url })}
          />
          <Field
            label="Alt text"
            value={p.alt}
            onChange={(v) => setP({ ...p, alt: v })}
          />
          <div className="grid grid-cols-3 gap-3">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Tag
              </span>
              <select
                value={p.tag}
                onChange={(e) => setP({ ...p, tag: e.target.value })}
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Height (4–10)
              </span>
              <input
                type="number"
                min={4}
                max={10}
                value={p.height}
                onChange={(e) =>
                  setP({ ...p, height: Number(e.target.value) || 6 })
                }
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Order
              </span>
              <input
                type="number"
                value={p.sortOrder}
                onChange={(e) =>
                  setP({ ...p, sortOrder: Number(e.target.value) || 100 })
                }
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              />
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
            onClick={() => onSave(isNew ? { ...p, id: undefined } : p)}
            disabled={!p.imageUrl || !p.alt}
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
    <label className="block">
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
