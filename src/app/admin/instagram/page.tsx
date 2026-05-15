"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "../_components/ImagePicker";

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  plays: number | null;
  kind: "post" | "reel";
  sortOrder: number;
};

const empty: Post = {
  id: 0,
  imageUrl: "",
  caption: "",
  likes: 0,
  comments: 0,
  plays: null,
  kind: "post",
  sortOrder: 100,
};

export default function InstagramAdmin() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/instagram", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text.slice(0, 240)}`);
      }
      const json = await res.json();
      setItems(json.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function save(p: Partial<Post> & { id?: number }) {
    if (p.id) {
      await fetch(`/api/admin/instagram/${p.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(p),
      });
    } else {
      await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(p),
      });
    }
    setEditing(null);
    load();
  }

  async function del(id: number) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/instagram/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Instagram posts</h1>
          <p className="text-sm text-neutral-500">{items.length} item{items.length === 1 ? "" : "s"}</p>
        </div>
        <button
          onClick={() =>
            setEditing({ ...empty, sortOrder: (items.at(-1)?.sortOrder ?? 100) + 10 })
          }
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
        >
          + Add post
        </button>
      </header>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Failed to load Instagram posts</p>
          <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">{error}</pre>
          <button onClick={load} className="mt-3 rounded border border-red-300 bg-white px-3 py-1 text-xs">Retry</button>
        </div>
      )}
      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="" className="h-40 w-full object-cover" />
              <div className="p-3 text-xs">
                <p className="line-clamp-2 text-neutral-900">{p.caption}</p>
                <p className="mt-1 text-neutral-500">
                  {p.kind} · ♡{p.likes} · 💬{p.comments}
                  {p.plays ? ` · ▶${p.plays}` : ""}
                </p>
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
        <PostModal post={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function PostModal({
  post,
  onCancel,
  onSave,
}: {
  post: Post;
  onCancel: () => void;
  onSave: (p: Partial<Post> & { id?: number }) => void;
}) {
  const [p, setP] = useState(post);
  const isNew = !p.id;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/40 p-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{isNew ? "Add" : "Edit"} post</h2>
        <div className="space-y-4">
          <ImagePicker value={p.imageUrl} onChange={(url) => setP({ ...p, imageUrl: url })} />
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
              Caption
            </span>
            <textarea
              value={p.caption}
              onChange={(e) => setP({ ...p, caption: e.target.value })}
              rows={3}
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-4 gap-3">
            <NumField label="Likes" value={p.likes} onChange={(v) => setP({ ...p, likes: v })} />
            <NumField label="Comments" value={p.comments} onChange={(v) => setP({ ...p, comments: v })} />
            <NumField
              label="Plays (reels)"
              value={p.plays ?? 0}
              onChange={(v) => setP({ ...p, plays: v || null })}
            />
            <label>
              <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Kind
              </span>
              <select
                value={p.kind}
                onChange={(e) => setP({ ...p, kind: e.target.value as "post" | "reel" })}
                className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
              >
                <option value="post">Post</option>
                <option value="reel">Reel</option>
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
            onClick={() => onSave(isNew ? { ...p, id: undefined } : p)}
            disabled={!p.imageUrl || !p.caption}
            className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded border border-neutral-300 px-2 py-2 text-sm"
      />
    </label>
  );
}
