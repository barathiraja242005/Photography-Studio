"use client";

import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

export function ListEditor<T>({
  label,
  hint,
  items,
  onChange,
  blank,
  renderRow,
  rowTitle,
}: {
  label: string;
  hint?: string;
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  renderRow: (item: T, set: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  rowTitle?: (item: T, index: number) => string;
}) {
  const list = Array.isArray(items) ? items : [];

  function update(i: number, patch: Partial<T>) {
    const next = [...list];
    next[i] = { ...(next[i] as object), ...(patch as object) } as T;
    onChange(next);
  }
  function remove(i: number) {
    const next = list.filter((_, idx) => idx !== i);
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    onChange([...list, blank()]);
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <span className="block text-xs uppercase tracking-wider text-neutral-500">
            {label}
          </span>
          {hint && <span className="text-xs text-neutral-400">{hint}</span>}
        </div>
        <span className="text-xs text-neutral-400">{list.length} item{list.length === 1 ? "" : "s"}</span>
      </div>

      <div className="space-y-3">
        {list.map((item, i) => (
          <div
            key={i}
            className="rounded border border-neutral-200 bg-neutral-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600">
                {rowTitle ? rowTitle(item, i) : `#${i + 1}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === list.length - 1}
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this item?")) remove(i);
                  }}
                  className="rounded p-1 text-red-500 hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {renderRow(item, (patch) => update(i, patch), i)}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded border border-dashed border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
      >
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}

export function StringListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const list = Array.isArray(items) ? items : [];

  function update(i: number, value: string) {
    const next = [...list];
    next[i] = value;
    onChange(next);
  }
  function remove(i: number) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    onChange([...list, ""]);
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <span className="block text-xs uppercase tracking-wider text-neutral-500">
            {label}
          </span>
          {hint && <span className="text-xs text-neutral-400">{hint}</span>}
        </div>
        <span className="text-xs text-neutral-400">{list.length}</span>
      </div>
      <div className="space-y-1.5">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
              title="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === list.length - 1}
              className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
              title="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded p-1 text-red-500 hover:bg-red-100"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded border border-dashed border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}
