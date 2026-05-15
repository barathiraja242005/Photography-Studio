"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "../_components/ImagePicker";

type Film = {
  id: number;
  title: string;
  location: string;
  duration: string;
  posterUrl: string;
  videoUrl: string;
  kind: "feature" | "reel";
  sortOrder: number;
};

const emptyFilm: Film = {
  id: 0,
  title: "",
  location: "",
  duration: "",
  posterUrl: "",
  videoUrl: "",
  kind: "feature",
  sortOrder: 100,
};

export default function FilmsAdmin() {
  const [items, setItems] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Film | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/films", { cache: "no-store" });
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function save(f: Partial<Film> & { id?: number }) {
    if (f.id) {
      await fetch(`/api/admin/films/${f.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(f),
      });
    } else {
      await fetch("/api/admin/films", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(f),
      });
    }
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this film? Poster and video file will also be removed.")) return;
    await fetch(`/api/admin/films/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Films & Reels</h1>
          <p className="text-sm text-neutral-500">
            {items.filter((f) => f.kind === "feature").length} feature ·{" "}
            {items.filter((f) => f.kind === "reel").length} reels
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({ ...emptyFilm, sortOrder: (items.at(-1)?.sortOrder ?? 100) + 10 })
          }
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
        >
          + Add film
        </button>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          No films yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.posterUrl}
                alt={f.title}
                className="h-16 w-28 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900">{f.title}</p>
                <p className="text-xs text-neutral-500">
                  {f.kind} · {f.location} · {f.duration}
                </p>
              </div>
              <button
                onClick={() => setEditing(f)}
                className="rounded border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-100"
              >
                Edit
              </button>
              <button
                onClick={() => del(f.id)}
                className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <FilmModal film={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function FilmModal({
  film,
  onCancel,
  onSave,
}: {
  film: Film;
  onCancel: () => void;
  onSave: (f: Partial<Film> & { id?: number }) => void;
}) {
  const [f, setF] = useState(film);
  const isNew = !f.id;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/40 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isNew ? "Add" : "Edit"} film
        </h2>
        <div className="space-y-4">
          <ImagePicker
            label="Poster image"
            value={f.posterUrl}
            onChange={(url) => setF({ ...f, posterUrl: url })}
          />
          <ImagePicker
            label="Video file"
            kind="video"
            value={f.videoUrl}
            onChange={(url) => setF({ ...f, videoUrl: url })}
          />
          <Field
            label="Title"
            value={f.title}
            onChange={(v) => setF({ ...f, title: v })}
          />
          <Field
            label="Location (e.g. 'Udaipur · Mar 2024')"
            value={f.location}
            onChange={(v) => setF({ ...f, location: v })}
          />
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Duration"
              value={f.duration}
              onChange={(v) => setF({ ...f, duration: v })}
            />
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Kind
              </span>
              <select
                value={f.kind}
                onChange={(e) =>
                  setF({ ...f, kind: e.target.value as "feature" | "reel" })
                }
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              >
                <option value="feature">Feature</option>
                <option value="reel">Reel</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Order
              </span>
              <input
                type="number"
                value={f.sortOrder}
                onChange={(e) =>
                  setF({ ...f, sortOrder: Number(e.target.value) || 100 })
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
            onClick={() => onSave(isNew ? { ...f, id: undefined } : f)}
            disabled={!f.title || !f.posterUrl || !f.videoUrl}
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
