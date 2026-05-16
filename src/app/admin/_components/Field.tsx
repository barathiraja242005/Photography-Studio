"use client";

import { useId } from "react";

type Common = {
  label: string;
  hint?: string;
  required?: boolean;
};

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  required,
}: Common & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: Common & {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <textarea
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

export function NumberField({
  label,
  hint,
  value,
  onChange,
}: Common & {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        id={id}
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
}: Common & {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <select
        id={id}
        value={value ?? options[0]?.value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

export function FieldGroup({
  title,
  children,
  description,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <header>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
