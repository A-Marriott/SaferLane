"use client";

import { useState } from "react";
import type { HeroStats } from "@/types/dota";

interface Props {
  heroes: HeroStats[];
  selected: [number | null, number | null];
  onChange: (selected: [number | null, number | null]) => void;
  label: string;
}

export const HeroPicker = ({ heroes, selected, onChange, label }: Props) => {
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<0 | 1>(0);

  const filtered = query.trim()
    ? heroes.filter((h) =>
        h.localized_name.toLowerCase().includes(query.toLowerCase()),
      )
    : heroes;

  const pick = (id: number) => {
    const next: [number | null, number | null] = [...selected] as [
      number | null,
      number | null,
    ];
    next[slot] = id;
    onChange(next);
    setQuery("");
    if (slot === 0 && next[1] === null) setSlot(1);
  };

  const clear = (s: 0 | 1) => {
    const next: [number | null, number | null] = [...selected] as [
      number | null,
      number | null,
    ];
    next[s] = null;
    onChange(next);
    setSlot(s);
  };

  const heroName = (id: number | null) =>
    id !== null
      ? (heroes.find((h) => h.id === id)?.localized_name ?? "?")
      : null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </h2>

      <div className="flex gap-2">
        {([0, 1] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlot(s)}
            className={`flex-1 rounded border px-3 py-2 text-sm text-left transition-colors ${
              slot === s
                ? "border-blue-500 bg-blue-500/10 text-blue-300"
                : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400"
            }`}
          >
            {heroName(selected[s]) ?? (
              <span className="text-gray-500">
                Pick {s === 0 ? "carry" : "support"}
              </span>
            )}
            {selected[s] !== null && (
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  clear(s);
                }}
              >
                ×
              </button>
            )}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search heroes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500"
      />

      <div className="max-h-48 overflow-y-auto rounded border border-gray-700 bg-gray-900">
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No heroes found</p>
        ) : (
          filtered.map((h) => {
            const isSelected = selected.includes(h.id);
            return (
              <button
                key={h.id}
                type="button"
                disabled={isSelected}
                onClick={() => pick(h.id)}
                className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "cursor-default text-gray-600"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {h.localized_name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
